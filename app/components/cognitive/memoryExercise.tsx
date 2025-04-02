import { useState, useEffect } from 'react';
import { ExerciseProps } from '@/types/props';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { fruitsWithColors } from '@/app/helpers/memoryShapes';
import '@/app/styles/memoryExercise.scss';
import { useTranslations } from 'next-intl';

const MemoryExercise: React.FC<ExerciseProps> = ({ onComplete, isTest, difficultyLevel }) => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [showingSequence, setShowingSequence] = useState(true);
  const [round, setRound] = useState(1);
  const [attempts, setAttempts] = useState(0);
  const [isDisplaying, setIsDisplaying] = useState(false);
  const [currentDisplayIndex, setCurrentDisplayIndex] = useState<number>(-1);
  const [showTryAgain, setShowTryAgain] = useState(false);
  const t = useTranslations();

  const getRandomUniqueIndex = (lastIndex: number) => {
    const maxLength = difficultyLevel === 1 ? 4 : difficultyLevel === 2 ? 9 : 16;
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * maxLength);
    } while (newIndex === lastIndex);
    return newIndex;
  };

  useEffect(() => {
    const sequenceLength = round === 1 ? 3 : round === 2 ? 4 : 5;
    let newSequence: number[] = [];

    for (let i = 0; i < sequenceLength; i++) {
      const lastIndex = i > 0 ? newSequence[i - 1] : -1;
      newSequence.push(getRandomUniqueIndex(lastIndex));
    }

    setSequence(newSequence);
    setUserSequence([]);

    const startDelay = setTimeout(() => {
      setIsDisplaying(true);

      newSequence.forEach((_, index) => {
        setTimeout(() => {
          setCurrentDisplayIndex(index);
        }, index * 1500);
      });

      const endDelay = sequenceLength * 1500 + 1000;
      const timer = setTimeout(() => {
        setIsDisplaying(false);
        setShowingSequence(false);
        setCurrentDisplayIndex(-1);
      }, endDelay);

      return () => {
        clearTimeout(timer);
      };
    }, 1000);

    return () => {
      clearTimeout(startDelay);
      setIsDisplaying(false);
      setShowingSequence(true);
      setCurrentDisplayIndex(-1);
    };
  }, [round, difficultyLevel]);

  const calculateNormalizedScore = (totalAttempts: number, successfulRounds: number) => {
    const accuracyWeight = 0.6;
    const expectedAttempts = 3;
    const accuracyScore = Math.max(0, expectedAttempts / totalAttempts) * 1000 * accuracyWeight;

    const performanceWeight = 0.4;
    const performanceScore = (successfulRounds / 3) * 1000 * performanceWeight;

    return Math.round(Math.min(1000, accuracyScore + performanceScore));
  };

  const handleShapeClick = (index: number) => {
    if (showingSequence || isDisplaying) return;

    const newUserSequence = [...userSequence, index];
    setUserSequence(newUserSequence);

    if (newUserSequence.length === sequence.length) {
      const correct = newUserSequence.every((num, i) => num === sequence[i]);
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (correct) {
        if (round < 3) {
          setTimeout(() => {
            setRound(round + 1);
          }, 500);
        } else {
          const normalizedScore = calculateNormalizedScore(newAttempts, round);
          onComplete?.({
            score: normalizedScore,
            metrics: {
              accuracy: Math.round((3 / newAttempts) * 100),
              attempts: newAttempts,
              timeInSeconds: 30,
            },
          });
        }
      } else {
        setShowTryAgain(true);

        setTimeout(() => {
          setUserSequence([]);
          setShowingSequence(true);
          setIsDisplaying(true);
          setShowTryAgain(false);

          sequence.forEach((_, index) => {
            setTimeout(() => {
              setCurrentDisplayIndex(index);
            }, index * 1500);
          });

          setTimeout(() => {
            setIsDisplaying(false);
            setShowingSequence(false);
            setCurrentDisplayIndex(-1);
          }, sequence.length * 1500 + 1000);
        }, 800);
      }
    }
  };

  return (
    <div className="memoryEx">
      <div className="container">
        <div className="header">
          <h3>{t('memoryExercise.title')}</h3>
          <p className={showTryAgain ? 'error' : ''}>
            {showTryAgain
              ? t('memoryExercise.tryAgain')
              : showingSequence
              ? isDisplaying
                ? t('memoryExercise.watchCarefully')
                : t('memoryExercise.getReady')
              : t('memoryExercise.repeatSequence')}
          </p>
        </div>

        <div className={`grid grid-${difficultyLevel === 1 ? '2' : difficultyLevel === 2 ? '3' : '4'}`}>
          {fruitsWithColors.slice(0, difficultyLevel === 1 ? 4 : difficultyLevel === 2 ? 9 : 16).map((item, index) => {
            const isCurrentShape = sequence[currentDisplayIndex] === index;
            const isHighlighted = isDisplaying && isCurrentShape && showingSequence;

            const style = {
              opacity: isHighlighted ? 1 : userSequence.includes(index) ? 1 : 0.5,
              border: isHighlighted ? '3px solid #410061' : userSequence.includes(index) ? '3px solid #2d9cdb' : 'none',
              transition: 'all 0.3s ease-in-out',
            };

            return (
              <motion.button
                key={index}
                animate={{ 
                  scale: isHighlighted ? 1.2 : userSequence.includes(index) ? 1.1 : 1 
                }}
                whileTap={!showingSequence && !isDisplaying ? { scale: 0.95 } : {}}
                whileHover={!showingSequence && !isDisplaying ? { scale: 1.05 } : {}}
                className={`gridItem ${item.color} ${showingSequence ? 'pointer-events-none' : ''}`}
                onClick={() => handleShapeClick(index)}
                disabled={showingSequence || isDisplaying}
                style={style}
              >
                <Image src={item.shape} alt="Memory shape" className={item.textColor} width={48} height={48} />
              </motion.button>
            );
          })}
        </div>

        <div className="footer">
          <div className="round">{t('memoryExercise.round')} {round}/3</div>
          <div className="stats">
            {t('memoryExercise.shapesToRemember')}: {sequence.length}
            {!showingSequence && attempts > 0 && <span className="attempts">{t('memoryExercise.attempts')}: {attempts}</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryExercise;
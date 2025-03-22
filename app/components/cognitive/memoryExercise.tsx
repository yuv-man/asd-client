import { useState, useEffect } from 'react';
import { ExerciseProps } from '@/types/props';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { fruitsWithColors } from '@/app/helpers/memoryShapes';

const MemoryExercise: React.FC<ExerciseProps> = ({ onComplete, isTest, difficultyLevel }) => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [showingSequence, setShowingSequence] = useState(true);
  const [round, setRound] = useState(1);
  const [attempts, setAttempts] = useState(0);
  const [isDisplaying, setIsDisplaying] = useState(false);
  const [currentDisplayIndex, setCurrentDisplayIndex] = useState<number>(-1);
  const [showTryAgain, setShowTryAgain] = useState(false);
  
  // Function to generate a new random index that's not the same as the last one
  const getRandomUniqueIndex = (lastIndex: number) => {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * fruitsWithColors.length);
    } while (newIndex === lastIndex);
    return newIndex;
  };

  useEffect(() => {
    const sequenceLength = round === 1 ? 3 : round === 2 ? 4 : 5;
    let newSequence: number[] = [];
    
    // Generate sequence with no consecutive repeats
    for (let i = 0; i < sequenceLength; i++) {
      const lastIndex = i > 0 ? newSequence[i - 1] : -1;
      newSequence.push(getRandomUniqueIndex(lastIndex));
    }
    
    setSequence(newSequence);
    setUserSequence([]);
    
    // Start displaying sequence after initial delay
    const startDelay = setTimeout(() => {
      setIsDisplaying(true);
      
      newSequence.forEach((_, index) => {
        setTimeout(() => {
          setCurrentDisplayIndex(index);
        }, index * 1500);
      });

      const endDelay = (sequenceLength * 1500) + 1000;
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
  }, [round]);

  const calculateNormalizedScore = (totalAttempts: number, successfulRounds: number) => {
    // Accuracy weight (60% of total score)
    const accuracyWeight = 0.6;
    const expectedAttempts = 3; // One attempt per round ideally
    const accuracyScore = Math.max(0, (expectedAttempts / totalAttempts)) * 1000 * accuracyWeight;

    // Memory performance weight (40% of total score)
    const performanceWeight = 0.4;
    const performanceScore = (successfulRounds / 3) * 1000 * performanceWeight;

    return Math.round(Math.min(1000, accuracyScore + performanceScore));
  };

  // Handle when a user clicks a shape
  const handleShapeClick = (index: number) => {
    if (showingSequence || isDisplaying) return;

    const newUserSequence = [...userSequence, index];
    setUserSequence(newUserSequence);

    // Check if the user has completed the sequence
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
          // Calculate final score when all rounds are complete
          const normalizedScore = calculateNormalizedScore(newAttempts, round);
          onComplete?.({ 
            score: normalizedScore,
            metrics: {
              accuracy: Math.round((3 / newAttempts) * 100),
              attempts: newAttempts,
              timeInSeconds: 30,
            }
          });
        }
      } else {
        // Handle incorrect attempt
        setShowTryAgain(true);
        
        // Show sequence again after a brief delay
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
    <div className="max-w-md mx-auto bg-pastelLightYellow p-10 rounded-lg mt-10">
      <div className="mb-6 text-center">
        <h3 className="text-2xl font-semibold mb-2 text-pastelOrange">Memory Sequence</h3>
        <p className={`text-gray-600 text-lg ${showTryAgain ? 'text-red-500' : 'text-secondary'}`}>
          {showTryAgain 
            ? "Try again!"
            : showingSequence 
              ? isDisplaying 
                ? "Watch carefully..." 
                : "Get ready..."
              : "Repeat the sequence"}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {fruitsWithColors.map((item, index) => {
          const isCurrentShape = sequence[currentDisplayIndex] === index;
          const isHighlighted = isDisplaying && isCurrentShape && showingSequence;
          
          return (
            <motion.button
              key={index}
              whileHover={!showingSequence && !isDisplaying ? { scale: 1.05 } : {}}
              whileTap={!showingSequence && !isDisplaying ? { scale: 0.95 } : {}}
              className={`
                h-20 rounded-lg p-4 flex items-center justify-center relative
                ${isHighlighted 
                  ? `${item.color} brightness-110 scale-110 shadow-lg`
                  : showingSequence
                    ? `${item.color} opacity-40 cursor-not-allowed`
                    : `${item.color} hover:brightness-105 hover:scale-105`}
              `}
              onClick={() => handleShapeClick(index)}
              disabled={showingSequence || isDisplaying}
            >
              <Image
                src={item.shape}
                alt="Memory shape"
                className={`w-12 h-12 ${item.textColor}`}
                width={48}
                height={48}
              />
            </motion.button>
          );
        })}
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div className="text-gray-600">Round {round}/3</div>
        <div className="text-gray-600">
          Shapes to remember: {sequence.length}
          {!showingSequence && attempts > 0 && (
            <span className="ml-4 text-red-500">
              Attempt: {attempts}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemoryExercise;
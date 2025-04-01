'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useUserStore, useInitialAssessmentStore } from '@/store/userStore';
import { Exercise, ExerciseType } from '@/types/types';
import toucan from '@/assets/animals/toucan.svg';
import { getExerciseComponent } from '../../helpers/exerciseComponents';
import { exercisesAPI } from '@/services/api'
import ResultsModal from '@/app/components/common/ResultsModal';
import '@/app/styles/SpeechQuiz.scss';
import { useTranslations } from 'next-intl';

const SpeechQuiz = ({isInitialAssessment}: {isInitialAssessment?: boolean}) => {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const [currentExercise, setCurrentExercise] = useState(2);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [showIntro, setShowIntro] = useState(true);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const t = useTranslations();
  const { initialAssessment, setInitialAssessment } = useInitialAssessmentStore();

  useEffect(() => {
    const fetchedExercises = async() => {
      try {
        setIsLoading(true);
        const fetchedExercises = await exercisesAPI.getByArea('speech');
        const exercisesWithComponents = fetchedExercises.data.map((exercise:Exercise) => ({
          ...exercise,
          component: getExerciseComponent(exercise.type as ExerciseType)
        }));
        setExercises(exercisesWithComponents);
      } catch (error) {
        console.error('Error fetching exercises:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchedExercises();
  }, []);

  const handleExerciseComplete = (result: { score: number; metrics?: { accuracy: number; timeInSeconds: number; attempts: number; } | undefined }) => {
    const newScores = { ...scores, [exercises[currentExercise].type]: result.score };
    setScores(newScores);
    
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
    } else {
      // Calculate final score and show results modal
      const averageScore = Object.values(newScores).reduce((a, b) => a + b, 0) / exercises.length;
      setFinalScore(averageScore);
      setShowResults(true);
    }
  };

  const handleContinue = () => {
    setShowResults(false)
    if (!isInitialAssessment) {
      router.push('/training');
    } else {
      setInitialAssessment({
        userId: user?._id || '',
        areas: {
          ...initialAssessment?.areas,
          speech: { ...initialAssessment?.areas?.speech, isCompleted: true, score: finalScore }
        }
      })
      if (initialAssessment?.areas.ot.isCompleted && 
          initialAssessment?.areas.speech.isCompleted && 
          initialAssessment?.areas.cognitive.isCompleted) {
        router.push('/training');
      } else {
        router.push('/initial-assessment');
      }
    }
  };

  const CurrentExerciseComponent = exercises[currentExercise]?.component;

  return (
    <div className={`speech-quiz speech`}>
      <AnimatePresence mode="wait">
        {showIntro ? (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="intro"
          >
            <Image src={toucan} alt="toucan" width={100} height={100} className='toucan' />
            <h2>{t('speechQuiz.welcome')}</h2>
            <p>
              {t('speechQuiz.instructions', { name: user?.name || '' })}
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowIntro(false)}
              className="start-button"
            >
              {t('speechQuiz.start')}
              <ArrowRight className="icon" />
            </motion.button>
          </motion.div>
        ) : isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="loading"
          >
            <span className="loader"></span>
          </motion.div>
        ) : CurrentExerciseComponent ? (
          <motion.div
            key="exercise"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="exercise"
          >
            <CurrentExerciseComponent onComplete={handleExerciseComplete} isTest={true} difficultyLevel={user?.areasProgress?.speech?.difficultyLevel} />
          </motion.div>
        ) : null}
      </AnimatePresence>
      
      {showResults && (
        <ResultsModal
          isOpen={showResults}
          onClose={handleContinue}
          score={finalScore}
          area="speech"
          exerciseResults={scores}
        />
      )}
    </div>
  );
};

export default SpeechQuiz;
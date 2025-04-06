'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useUserStore } from '@/store/userStore';
import { Exercise, ExerciseType, Score } from '@/types/types';
import owl from '@/assets/stars/owl.svg';
import { getExerciseComponent } from '@/app/helpers/exerciseComponents';
import { exercisesAPI } from '@/services/api'
import ResultsModal from '@/app/components/common/ResultsModal';
import { useInitialAssessmentStore } from '@/store/userStore';
import { useTranslations } from 'next-intl';
import '@/app/styles/SpeechQuiz.scss';

const CognitiveQuiz = ({isInitialAssessment}: {isInitialAssessment?: boolean}) => {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [startTime, setStartTime] = useState(new Date());
  const [scores, setScores] = useState<Record<string, number>>({});
  const [showIntro, setShowIntro] = useState(true);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const t = useTranslations();
  const { initialAssessment, setInitialAssessment } = useInitialAssessmentStore();

  useEffect(() => {
    fetchedExercises();
  }, []);

  const fetchedExercises = async() => {
    try {
      setIsLoading(true);
      const fetchedExercises = await exercisesAPI.getByArea('cognitive');
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

  const fetchAttempt = async (result: Score) => {
    const now = new Date()
    const attemp = {
      userId: user?._id,
      exerciseId: exercises[currentExercise]._id,
      difficultyLevel: user?.areasProgress[exercises[currentExercise].area].difficultyLevel,
      score: result.score,
      area: exercises[currentExercise].area,
    }
    exercisesAPI.createExerciseAttempt(attemp)
  }

  const handleExerciseComplete = useCallback((score: Score) => {
    const newScores = { ...scores, [exercises[currentExercise].type]: score.score };
    setScores(newScores);
    fetchAttempt(score);

    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setStartTime(new Date());
    } else {
      // Calculate final score and show results modal
      const averageScore = Object.values(newScores).reduce((a, b) => a + b, 0) / exercises.length;
      setFinalScore(averageScore);
      setShowResults(true);
    }
  }, [currentExercise, exercises, scores]);

  const startQuiz = () => {
    setStartTime(new Date());
    setShowIntro(false);
  }

  const handleContinue = () => {
    setShowResults(false)
    if (isInitialAssessment) {
      setInitialAssessment({
        userId: user?._id || '',
        areas: {
          ...initialAssessment?.areas,
          cognitive: { ...initialAssessment?.areas?.cognitive, isCompleted: true, score: finalScore }
        }
      })
      if (initialAssessment?.areas.ot.isCompleted && 
        initialAssessment?.areas.speech.isCompleted && 
        initialAssessment?.areas.cognitive.isCompleted) {
        router.push('/training');
      } else {
        router.push('/initial-assessment');
      }
    } else {
      router.push('/training');
    }
  };

  const CurrentExerciseComponent = exercises[currentExercise]?.component;

  return (
    <div className="speech-quiz cognitive">
      <AnimatePresence mode="wait">
        {showIntro ? (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="intro-container"
          >
            <Image src={owl} alt="owl" width={100} height={100} />
            <h2>{t('cognitiveQuiz.welcome')}</h2>
            <p>{t('cognitiveQuiz.instructions', { name: user?.name || '' })}</p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={startQuiz}
            >
              {t('cognitiveQuiz.start')}
              <ArrowRight />
            </motion.button>
          </motion.div>
        ) : isLoading ? (
          <div className="loading-container">
            <span className="loader">hello world</span>
          </div>
        ) : CurrentExerciseComponent ? (
          <motion.div
            key="exercise"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
          >
            <CurrentExerciseComponent 
              onComplete={handleExerciseComplete} 
              isTest={true} 
              difficultyLevel={user?.areasProgress?.cognitive?.difficultyLevel} 
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
      
      {showResults && (
        <ResultsModal
          isOpen={showResults}
          onClose={handleContinue}
          score={finalScore}
          area="cognitive"
          exerciseResults={scores}
        />
      )}
    </div>
  );
};

export default CognitiveQuiz;
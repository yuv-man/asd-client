'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useUserStore, useInitialAssessmentStore } from '@/store/userStore';
import { Exercise, Score, ExerciseType } from '@/types/types';
import monkey from '@/assets/stars/monkey.svg';
import { getExerciseComponent } from '../../helpers/exerciseComponents';
import { exercisesAPI } from '@/lib/api'
import ResultsModal from '@/app/components/common/ResultsModal';
import '@/app/styles/SpeechQuiz.scss';
import { useTranslations } from 'next-intl';

const OTQuiz = ({isInitialAssessment}: {isInitialAssessment?: boolean}) => {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const [startTime, setStartTime] = useState(new Date());
  const [currentExercise, setCurrentExercise] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [showIntro, setShowIntro] = useState(true);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { initialAssessment, setInitialAssessment } = useInitialAssessmentStore();
  const t = useTranslations();

  useEffect(() => {
    const fetchedExercises = async() => {
      try {
        setIsLoading(true);
        const fetchedExercises = await exercisesAPI.getByArea('ot');
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
    fetchAttempt(result);

    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setStartTime(new Date());
    } else {
      // Calculate final score and show results modal
      const averageScore = Object.values(newScores).reduce((a, b) => a + b, 0) / exercises.length;
      setFinalScore(averageScore);
      setShowResults(true);
    }
  };

  const fetchAttempt = async (result: Score) => {
    const now = new Date()
      const attemp = {
        userId: user?._id,
        exerciseId: exercises[currentExercise]._id,
        difficultyLevel: user?.areasProgress[exercises[currentExercise].area].difficultyLevel,
        score: result.score,
        area: exercises[currentExercise].area,
        isTest: false,
        startTime: startTime,
        endTime: now,
      }
      exercisesAPI.createExerciseAttempt(attemp)
  }

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
          ot: { ...initialAssessment?.areas?.ot, isCompleted: true, score: finalScore }
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
    <div className="speech-quiz ot">
      <AnimatePresence mode="wait">
        {showIntro ? (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="intro"
          >
            <Image src={monkey} alt="monkey" width={100} height={100} />
            <h2 className="title">
              {t('otQuiz.welcome')}
            </h2>
            <p className="description">
              {t('otQuiz.instructions', { name: user?.name || '' })}
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={startQuiz}
              className="start-button"
            >
              {t('otQuiz.start')}
              <ArrowRight className="arrow-icon" />
            </motion.button>
          </motion.div>
        ) : isLoading ? (
          <div className='loader-container'>
            <span className='loader'></span>
          </div>
        ) : CurrentExerciseComponent ? (
          <motion.div
            key="exercise"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
          >
            <CurrentExerciseComponent onComplete={handleExerciseComplete} isTest={true} difficultyLevel={user?.areasProgress?.ot?.difficultyLevel} />
          </motion.div>
        ) : null}
      </AnimatePresence>
      
      {showResults && (
        <ResultsModal
          isOpen={showResults}
          onClose={handleContinue}
          score={finalScore}
          area="ot"
          exerciseResults={scores}
        />
      )}
    </div>
  );
};

export default OTQuiz;
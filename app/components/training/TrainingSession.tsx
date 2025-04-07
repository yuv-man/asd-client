'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Session, ExerciseType } from '@/types/types';
import { getExerciseComponent } from '../../helpers/exerciseComponents';
import { useUserStore, useSessions } from '@/store/userStore'
import { useRouter } from 'next/navigation';
import { exercisesAPI } from '@/lib/api';
import ProfileDetails from '../common/ProfileBubble';
import '@/app/styles/TrainingSession.scss';
import { useTranslations, useLocale } from 'next-intl';

interface TrainingSessionProps {
  session: Session;
  onComplete?: (session: Session) => void;
}

const TrainingSession = ({ session, onComplete }: TrainingSessionProps) => {
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [currentExercise, setCurrentExercise] = useState(session.completedExercises || 0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [showIntro, setShowIntro] = useState(true);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [exercises, setExercises] = useState(session.exercises || []);
  const { user, setUser } = useUserStore();
  const [isHydrated, setIsHydrated] = useState(false);
  const { updateSession } = useSessions()
  const router = useRouter();
  const t = useTranslations();

  useEffect(() => {
    if (session?.exercises) {
      setExercises(session.exercises);
    }
  }, [session.exercises]);

  useEffect(() => {
    if (user !== undefined) {
      setIsHydrated(true);
    }
  }, [user]);
  
  const handleExerciseComplete = (result: { score: number; metrics?: { accuracy: number; timeInSeconds: number; attempts: number; } | undefined }) => {
    const newScores = { ...scores, [exercises[currentExercise].type]: result.score };
    setScores(newScores);
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
    // Update the current exercise's score in the session
    const updatedExercises = [...exercises];
    updatedExercises[currentExercise] = {
      ...updatedExercises[currentExercise],
      isCompleted: true
    };
    setExercises(updatedExercises);

    const nextExerciseIndex = currentExercise + 1;
    const updatedSession = {
      ...session, 
      exercises: updatedExercises, 
      completedExercises: (session.completedExercises || 0) + 1, 
    };
    updateSession(updatedSession);
    
    if (nextExerciseIndex < exercises.length) {
      setCurrentExercise(nextExerciseIndex);
      setShowIntro(true);
    } else {
      setShowCompletionModal(true);
      if (onComplete) {
        onComplete(updatedSession);
      }
    }
  };

  const startExercise = () => {
    setStartTime(new Date());
    setShowIntro(false)
  };

  const handleContinue = async () => {
    setShowCompletionModal(false);
    await new Promise(resolve => setTimeout(resolve, 0));
    router.refresh();
    router.push('/training');
  };

  const CurrentExerciseComponent = exercises[currentExercise] ? 
    getExerciseComponent(exercises[currentExercise].type as ExerciseType) : 
    null;

  if (!isHydrated) return <p>Loading...</p>;
  return (
    <div className="training-session">
      <AnimatePresence mode="wait">
        {showIntro ? (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="intro-container"
          >
            {user && <ProfileDetails user={user} />}
            <h2>
              {t(exercises[currentExercise]?.title)}
            </h2>
            <p>
              {t(exercises[currentExercise]?.description)}
            </p>
            <div className="button-container">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={startExercise}
                className="primary"
              >
                {t('Let\'s Start!')}
                <ArrowRight className="icon" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/training')}
                className="secondary"
              >
                {t('Back to Training')}
              </motion.button>
            </div>
          </motion.div>
        ) : CurrentExerciseComponent ? (
          <motion.div
            key="exercise"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
          >
            <CurrentExerciseComponent 
              onComplete={handleExerciseComplete} 
              isTest={false} 
              difficultyLevel={user?.areasProgress?.cognitive?.difficultyLevel} 
            />
          </motion.div>
        ) : null}

        {showCompletionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="completion-modal"
          >
            <div className="modal-content">
              <h3>{t('Exercise Completed!')}</h3>
              <p>
                {t('Great job! You\'ve completed this exercise. Ready to continue your journey?')}
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleContinue}
              >
                {t('Continue to Trail Map')}
                <ArrowRight className="icon" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TrainingSession; 
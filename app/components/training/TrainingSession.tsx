'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Session, ExerciseType } from '@/types/types';
import { getExerciseComponent } from '../../helpers/exerciseComponents';
import { useUserStore, useSessions } from '@/store/userStore'
import { useRouter } from 'next/navigation';

interface TrainingSessionProps {
  session: Session;
  onComplete?: (scores: Record<string, number>) => void;
}

const TrainingSession = ({ session, onComplete }: TrainingSessionProps) => {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [showIntro, setShowIntro] = useState(true);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [exercises, setExercises] = useState(session.exercises || []);
  const user = useUserStore((state) => state.user);
  const { sessions, setSessions } = useSessions()
  const router = useRouter();

  useEffect(() => {
    if (session?.exercises) {
      setExercises(session.exercises);
    }
  }, [session.exercises]);
  
  const handleExerciseComplete = (score: number) => {
    const newScores = { ...scores, [exercises[currentExercise].type]: score };
    setScores(newScores);
    
    // Update the current exercise's score in the session
    const updatedExercises = [...exercises];
    updatedExercises[currentExercise] = {
      ...updatedExercises[currentExercise],
      isCompleted: true
    };
    setExercises(updatedExercises);
    setSessions(sessions.map(s => 
      s.id === session.id 
        ? {...s, exercises: updatedExercises, completedExercises: (s.completedExercises || 0) + 1}
        : s
    ));
    
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setShowIntro(true);
    } else {
      const averageScore = Object.values(newScores).reduce((a, b) => a + b, 0) / exercises.length;
      setShowCompletionModal(true);
      if (onComplete) {
        onComplete(newScores);
      }
    }
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

  return (
    <div className="max-w-4xl mx-auto px-4">
      <AnimatePresence mode="wait">
        {showIntro ? (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center flex flex-col items-center justify-center"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4 text-darkPurple">
              {exercises[currentExercise]?.title || 'Training Session'}
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto text-darkPurple">
              Hi {user?.name}! {exercises[currentExercise]?.description}
            </p>
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/training')}
                className="bg-gray-200 text-darkPurple px-8 py-3 rounded-full hover:bg-gray-300 flex items-center"
              >
                Back to Training
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowIntro(false)}
                className="bg-purple-600 text-white px-8 py-3 rounded-full hover:bg-purple-700 flex items-center"
              >
                Start Exercise
                <ArrowRight className="ml-2 w-4 h-4" />
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
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <div className="bg-white p-8 rounded-lg max-w-md w-full">
              <h3 className="text-2xl font-bold text-darkPurple mb-4">Exercise Completed!</h3>
              <p className="text-gray-600 mb-6">
                Great job! You've completed this exercise. Ready to continue your journey?
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleContinue}
                className="bg-purple-600 text-white px-8 py-3 rounded-full hover:bg-purple-700 flex items-center mx-auto"
              >
                Continue to Trail Map
                <ArrowRight className="ml-2 w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TrainingSession; 
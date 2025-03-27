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

const SpeechQuiz = ({isInitialAssessment}: {isInitialAssessment?: boolean}) => {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const [currentExercise, setCurrentExercise] = useState(1);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [showIntro, setShowIntro] = useState(true);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
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
  };

  const CurrentExerciseComponent = exercises[currentExercise]?.component;

  return (
    <div className="max-w-4xl mx-auto px-4 speech h-150">
      <AnimatePresence mode="wait">
        {showIntro ? (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center flex flex-col items-center justify-center pt-20"
          >
            <Image src={toucan} alt="toucan" width={100} height={100} />
            <h2 className="text-3xl font-bold text-gray-900 mb-4 text-darkPurple">
              Welcome to the Speech Assessment
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto text-darkPurple">
              Hi {user?.name}! You'll complete three fun exercises to test your fine motor skills, 
              coordination and reaction time. Each exercise is designed to be
              engaging and age-appropriate.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowIntro(false)}
              className="bg-purple-600 text-white px-8 py-3 rounded-full hover:bg-purple-700 flex items-center mx-auto"
            >
              Start Exercises
              <ArrowRight className="ml-2 w-4 h-4" />
            </motion.button>
          </motion.div>
        ) : isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-8"
          >
            <span className="loader"></span>
          </motion.div>
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
          area="speech"
          exerciseResults={scores}
        />
      )}
    </div>
  );
};

export default SpeechQuiz;
'use client';

import { useState, useEffect, useCallback } from 'react';
import { TrailMap } from '@/app/components/trailMap/TrailMap';
import { useRouter } from 'next/navigation';
import Modal from '@/app/components/common/Modal';
import { Session, Quiz } from '@/types/types'
import { useSessions } from '@/store/userStore'
import { exercisesAPI } from '@/services/api';
import { areaTypesEnum } from '@/enums/enumArea';

export default function TrainingPageClient() {
    const router = useRouter();
    const [currentPosition, setCurrentPosition] = useState(0);
    const [selectedSession, setSelectedSession] = useState<Session | null>(null);
    const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { sessions, setCurrentSession } = useSessions();
  
    useEffect(() => {
      const idx = sessions.findIndex(s => s.isCompleted === false)
      if(idx !== -1) {
        setSelectedSession(sessions[idx])
        setCurrentPosition(idx)
      }
    }, [sessions])
  
    const handleSessionSelect = useCallback((sessionId: string) => {
      setSelectedQuiz(null)
      const session = sessions.find(s => s.id === sessionId);
      if (session && session.isAvailable) {
        setSelectedSession(session);
        setCurrentSession(session)
        setIsModalOpen(true);
      }
    }, [sessions, setCurrentSession]);
  
    const handleStartSession = useCallback(() => {
      if (selectedSession) {
        setIsModalOpen(false);
        router.push(`/training/session`);
      }
    }, [selectedSession, router]);
  
    const handleSettingClicked = useCallback(() => {
      router.push('/setting');
    }, [router]);

    const handleQuizSelect = useCallback(async (quizId: string) => {
      setSelectedSession(null)
      const response = await exercisesAPI.getByArea(quizId);
      const exercises = response.data;
      if(exercises.length > 0) {
        const quiz: Quiz | null = {
          id: quizId,
          title: areaTypesEnum[exercises[0].area as keyof typeof areaTypesEnum],
          exercises: exercises,
          area: quizId as "ot" | "speech" | "cognitive"
        }
        if (quiz) {
          setSelectedQuiz(quiz);
          setIsModalOpen(true);
        }
      }
    }, [sessions]);
  
    return (
      <div className="container mx-auto">
        <TrailMap
          sessions={sessions}
          onSessionSelect={handleSessionSelect}
          onSettingsClick={handleSettingClicked}
          currentPosition={currentPosition}
          onQuizSelect={handleQuizSelect}
        />
        
        {(selectedSession || selectedQuiz) && (
          <Modal 
            title={selectedQuiz ? "Quiz" : "Today Session"} 
            isOpen={isModalOpen} 
            onClose={() => {
              setIsModalOpen(false);
              setSelectedQuiz(null);
            }}
          >
            {selectedSession && (
              <div className="mb-4">
                {selectedSession.exercises.map(exercise => (
                  <div key={`exercise-${exercise._id}`} className="flex items-center gap-2">
                    <span>{exercise.isCompleted ? "✅" : "⭕"}</span>
                    <span>{exercise.title}</span>
                  </div>
                ))}
                <p className='mt-4'>Completed exercises: {selectedSession.completedExercises}/{selectedSession.exercises.length}</p>
                {selectedSession.completedExercises < 3 && (
                  <button
                    onClick={handleStartSession}
                    className="bg-pastelOrange text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    {selectedSession.completedExercises === 0 ? 'Start Session' : 'Continue Session'}
                  </button>
                )}
              </div>
            )}
            
            {selectedQuiz && (
              <div className="mb-4 flex flex-col items-center">
                <p className='text-xl font-bold text-center'>{selectedQuiz.title}</p>
                <p>Are you ready to test your knowledge?</p>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    router.push(`/training/quiz/${selectedQuiz.id}`);
                  }}
                  className="mt-4 bg-pastelOrange text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Start Quiz
                </button>
              </div>
            )}
          </Modal>
        )}
      </div>
    );
} 
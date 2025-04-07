'use client';

import { useState, useEffect, useCallback } from 'react';
import { TrailMap } from '@/app/components/trailMap/TrailMap';
import { useRouter } from 'next/navigation';
import Modal from '@/app/components/common/Modal';
import { Session, Quiz } from '@/types/types'
import { useSessions, useUserStore } from '@/store/userStore'
import { exercisesAPI } from '@/lib/api';
import { areaTypesEnum } from '@/enums/enumArea';
import '@/app/styles/TrainingPage.scss';
import { useTranslations } from 'next-intl';

export default function TrainingPageClient() {
    const router = useRouter();
    const [currentPosition, setCurrentPosition] = useState(0);
    const [selectedSession, setSelectedSession] = useState<Session | null>(null);
    const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isHydrated, setIsHydrated] = useState(false);
    const user = useUserStore((state) => state.user);
    const { sessions, setCurrentSession, initializeSessions } = useSessions();
    const t = useTranslations('TrainingPage');

    useEffect(() => {
      if (user !== undefined) {
        setIsHydrated(true);
      }
    }, [user]);

    useEffect(() => {
      if(!isHydrated) return;
      if(!sessions || sessions.length === 0) {
        initializeSessions();
      }
    }, [sessions, initializeSessions, isHydrated, user]);

  
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
      <div className="container">
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
              <div className="session-info">
                {selectedSession.exercises.map(exercise => (
                  <div key={`exercise-${exercise._id}`} className="exercise-item">
                    <span>{exercise.isCompleted ? "✅" : "⭕"}</span>
                    <span>{t(`${exercise.title}`)}</span>
                  </div>
                ))}
                <p className='completed-count'>{t('completedExercises')}: {selectedSession.completedExercises}/{selectedSession.exercises.length}</p>
                {selectedSession.completedExercises < 3 && (
                  <button
                    onClick={handleStartSession}
                    className="button"
                  >
                    {selectedSession.completedExercises === 0 ? t('startSession') : t('continueSession')}
                  </button>
                )}
              </div>
            )}
            
            {selectedQuiz && (
              <div className="quiz-content">
                <p className='quiz-title'>{t(`${selectedQuiz.title}`)}</p>
                <p>{t('quizReady')}</p>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    router.push(`/training/quiz/${selectedQuiz.id}`);
                  }}
                  className="quiz-button"
                >
                  {t('startQuiz')}
                </button>
              </div>
            )}
          </Modal>
        )}
      </div>
    );
} 
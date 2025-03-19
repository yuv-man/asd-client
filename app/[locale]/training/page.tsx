'use client';

import { useState, useEffect, useCallback } from 'react';
import { TrailMap } from '@/app/components/trailMap/TrailMap';
import { useRouter } from 'next/navigation';
import Modal from '@/app/components/common/Modal';
import { Session } from '@/types/types'
import { useSessions } from '@/store/userStore'

// Move this type definition to a separate types file if needed

export default function TrainingPage() {
  const router = useRouter();
  const [currentPosition, setCurrentPosition] = useState(0);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
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

  return (
    <div className="container mx-auto">
      <TrailMap
        sessions={sessions}
        onSessionSelect={handleSessionSelect}
        onSettingsClick={handleSettingClicked}
        currentPosition={currentPosition}
      />
      
      {selectedSession && (
        <Modal title="Today Session" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="mb-4">
            {selectedSession.exercises.map(exercise => (
              <div key={`exercise-${exercise._id}`} className="flex items-center gap-2">
                <span>{exercise.isCompleted ? "✅" : "⭕"}</span>
                <span>{exercise.title}</span>
              </div>
            ))}
            <p className='mt-4'>Completed exercises: {selectedSession.completedExercises}/{selectedSession.exercises.length}</p>
          </div>
          {selectedSession.completedExercises < 3 && <button
            onClick={handleStartSession}
            className="bg-pastelOrange text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {selectedSession.completedExercises === 0 ? 'Start Session' : 'Continue Session'}
          </button>}
        </Modal>
      )}
    </div>
  );
} 
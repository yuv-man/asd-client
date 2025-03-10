'use client';

import { useState } from 'react';
import { TrailMap } from '@/app/components/trailMap/TrailMap';
import { useRouter } from 'next/navigation';
import Modal from '@/app/components/common/Modal';
import { Session } from '../../types/types'
import { useSessions } from '@/store/userStore'

// Move this type definition to a separate types file if needed

export default function TrainingPage() {
  const router = useRouter();
  const [currentPosition, setCurrentPosition] = useState(0);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { sessions } = useSessions();
    

  // const handleExerciseComplete = async (sessionId: string, exerciseId: string) => {
  //   setSessions((prevSessions: Session[] )=> {
  //     const newSessions = [...prevSessions];
  //     const sessionIndex = newSessions.findIndex(s => s.id === sessionId);
  //     const session = newSessions[sessionIndex];
      
  //     // Mark exercise as completed
  //     const exerciseIndex = session.exercises.findIndex(ex => ex._id === exerciseId);
  //     session.exercises[exerciseIndex].isCompleted = true;
  //     session.completedExercises += 1;

  //     // Check if session is completed
  //     if (session.completedExercises === session.exercises.length) {
  //       session.isCompleted = true;
        
  //       // Make next session available and populate its exercises
  //       if (sessionIndex + 1 < newSessions.length) {
  //         newSessions[sessionIndex + 1].isAvailable = true;
  //         // Fetch new exercises for the next session
  //         exercisesAPI.getSession('').then(exercises => {
  //           newSessions[sessionIndex + 1].exercises = exercises.data.map((ex: Exercise) => ({
  //             ...ex,
  //             isCompleted: false
  //           }));
  //         });
  //         setCurrentSession(newSessions[sessionIndex + 1])
  //       }

  //       // Add new session to maintain 5 visible sessions
  //       if (sessionIndex === newSessions.length - 2) {
  //         const newSessionId = `session${newSessions.length + 1}`;
  //         newSessions.push({
  //           id: newSessionId,
  //           exercises: [],
  //           isCompleted: false,
  //           isAvailable: false,
  //           position: calculatePosition(newSessions.length),
  //           completedExercises: 0
  //         });
  //       }
        
  //       setCurrentPosition(prev => Math.min(prev + 1, newSessions.length - 1));
  //     }

  //     return newSessions;
  //   });
  // };

  const handleSessionSelect = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session && session.isAvailable) {
      setSelectedSession(session);
      setIsModalOpen(true);
    }
  };

  const handleStartSession = () => {
    if (selectedSession) {
      setIsModalOpen(false);
      router.push(`/training/session`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <TrailMap
        sessions={sessions}
        onSessionSelect={handleSessionSelect}
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
          <button
            onClick={handleStartSession}
            className="bg-pastelOrange text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {selectedSession.completedExercises === 0 ? 'Start Session' : 'Continue Session'}
          </button>
        </Modal>
      )}
    </div>
  );
} 
'use client'

import { Session } from '@/types/types';
import TrainingSession from '@/app/components/training/TrainingSession'
import { useSessions } from '@/store/userStore'
import { useCallback } from 'react'

function TrainingSessionPage() {
    const { currentSession, updateSession, moveToNextSession } = useSessions();
  
    if (!currentSession) {
        return <div>Loading...</div>;
    }
    
    const handleSessionCompletion = useCallback(async (session: Session) => {
        const updatedSession = {...session, isCompleted: true};
        updateSession(updatedSession);
        await moveToNextSession(session.id);
    }, [updateSession, moveToNextSession]);

    return (
        <main className="flex min-h-screen flex-col items-center p-24">
            <h1 className="text-4xl font-bold mb-8">Training Session</h1>
            <TrainingSession session={currentSession} onComplete={handleSessionCompletion}/>
        </main>
    )
}

export default TrainingSessionPage;

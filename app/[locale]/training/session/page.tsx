'use client'

import { Session } from '@/types/types';
import TrainingSession from '@/app/components/training/TrainingSession'
import { useSessions } from '@/store/userStore'
import { useCallback, useState } from 'react'

function TrainingSessionPage() {
    const { currentSession, updateSession, moveToNextSession } = useSessions();
    const [isProcessingCompletion, setIsProcessingCompletion] = useState(false);
  
    if (!currentSession) {
        return <span className="loader"></span>;
    }
    
    const handleSessionCompletion = useCallback(async (session: Session) => {
        // Prevent duplicate completion using the processing flag
        if (isProcessingCompletion) {
            return;
        }
        
        setIsProcessingCompletion(true);
        
        try {
            const updatedSession = {...session, isCompleted: true};
            updateSession(updatedSession);
            await moveToNextSession(session.id);
        } finally {
            setIsProcessingCompletion(false);
        }
    }, [updateSession, moveToNextSession, isProcessingCompletion]);

    return (
        <main className="flex min-h-screen flex-col items-center p-24">
            <h1 className="text-4xl font-bold mb-8">Training Session</h1>
            <TrainingSession session={currentSession} onComplete={handleSessionCompletion}/>
        </main>
    )
}

export default TrainingSessionPage;

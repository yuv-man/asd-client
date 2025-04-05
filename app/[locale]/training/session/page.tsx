'use client'

import dynamic from 'next/dynamic';

const TrainingSession = dynamic(() => import('@/app/components/training/TrainingSession'), {
  ssr: false
});

import { Session } from '@/types/types';
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
        <main className="training-session-page">
            <h1>Training Session</h1>
            <TrainingSession session={currentSession} onComplete={handleSessionCompletion}/>
        </main>
    )
}

export default TrainingSessionPage;

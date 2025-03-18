'use client'

import { Session } from '@/types/types';
import TrainingSession from '../../components/training/TrainingSession'
import { useSessions } from '@/store/userStore'

export default function TrainingSessionPage() {
    const { currentSession, updateSession, moveToNextSession } = useSessions();
  
    if (!currentSession) {
        return <div>Loading...</div>;
    }

    const handleSessionCompletion = async (session: Session) => {
        const updatedSession = {...session, isCompleted: true};
        updateSession(updatedSession);
        await moveToNextSession(session.id);
    }

    return (
        <main className="flex min-h-screen flex-col items-center p-24">
            <h1 className="text-4xl font-bold mb-8">Training Session</h1>
            <TrainingSession session={currentSession} onComplete={handleSessionCompletion}/>
        </main>
    )
}

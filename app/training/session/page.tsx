'use client'

import TrainingSession from '../../components/training/TrainingSession'
import { useSessions } from '@/store/userStore'

export default function TrainingSessionPage() {
    const currentSession = useSessions((state) => state.currentSession);
  
    if (!currentSession) {
        return <div>Loading...</div>;
    }

    return (
        <main className="flex min-h-screen flex-col items-center p-24">
            <h1 className="text-4xl font-bold mb-8">Training Session</h1>
            <TrainingSession session={currentSession}/>
        </main>
    )
}

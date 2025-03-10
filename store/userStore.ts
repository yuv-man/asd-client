import { create } from 'zustand';
import { User, Session } from '../types/types';
import { exercisesAPI } from '../app/services/api';
import { calculatePosition } from '../utils/calculatePosition';
import { Exercise } from '../types/types';

export const useUserStore = create<{
  user: User | null;

  setUser: (user: User) => void;
}>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

export const resultsStore = create<{
  otResults: any;
  speechResults: any;
  cognitiveResults: any;

  setOtResults: (otResults: any) => void;
  setSpeechResults: (speechResults: any) => void;
  setCognitiveResults: (cognitiveResults: any) => void;
}>((set) => ({
  otResults: null,
  speechResults: null,
  cognitiveResults: null,

  setOtResults: (otResults) => set({ otResults }),
  setSpeechResults: (speechResults) => set({ speechResults }),
  setCognitiveResults: (cognitiveResults) => set({ cognitiveResults }),
}));

// Add this interface before the useSessions definition
interface SessionStore {
  sessions: Session[];
  currentSession: Session | null;
  setSessions: (sessions: Session[]) => void;
  setCurrentSession: (session: Session) => void;
  initializeSessions: () => Promise<void>;
}

export const useSessions = create<SessionStore>((set) => ({
  sessions: [],
  currentSession: null,
  setSessions: (sessions: Session[]) => set({ sessions }),
  setCurrentSession: (session: Session) => set({ currentSession: session }),
  initializeSessions: async () => {
    const areas = '';
    const fetchedExercises = await exercisesAPI.getSession(areas);
    
    // Create initial 5 sessions
    const initialSessions: Session[] = Array.from({ length: 5 }, (_, index) => ({
      id: `session${index + 1}`,
      exercises: index === 0 ? fetchedExercises.data.map((ex: Exercise) => ({
        ...ex,
        isCompleted: false
      })) : [],
      isCompleted: false,
      isAvailable: index === 0,
      position: calculatePosition(index),
      completedExercises: 0
    }));

    set({ 
      sessions: initialSessions,
      currentSession: initialSessions[0]
    });
  }
}));

// Add this line to export the store instance
export const sessionStore = useSessions.getState();



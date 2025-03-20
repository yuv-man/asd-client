import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, Session } from '../types/types';
import { exercisesAPI } from '../services/api';
import { calculatePosition } from '../services/calculatePosition';
import { Exercise, InitialAssessment } from '../types/types';

export const useUserStore = create<{
  user: User | null;
  setUser: (user: User) => void;
}>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user: User) => set((state) => ({ user })),
    }),
    {
      name: 'wonderkid-user',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }),
    }
  )
);


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
  updateSession: (updatedSession: Session) => void;
  moveToNextSession: (completedSessionId: string) => Promise<void>;
}

export const useSessions = create<SessionStore>()(
  persist(
    (set) => ({
      sessions: [],
      currentSession: null,
      setSessions: (sessions: Session[]) => set({ sessions }),
      setCurrentSession: (session: Session) => set({ currentSession: session }),
      updateSession: (updatedSession: Session) => 
        set((state) => ({
          sessions: state.sessions.map(session => 
            session.id === updatedSession.id ? updatedSession : session
          ),
          currentSession: state.currentSession?.id === updatedSession.id 
            ? updatedSession 
            : state.currentSession
        })),
      moveToNextSession: async (completedSessionId: string) => {
        set((state) => {
          const completedIndex = state.sessions.findIndex(s => s.id === completedSessionId);
          
          if (completedIndex >= state.sessions.length - 1) {
            return state;
          }

          const nextSession = state.sessions[completedIndex + 1];
          return {
            ...state,
            currentSession: nextSession
          };
        });

        // Fetch exercises outside of the state update
        const areas = '';
        const fetchedExercises = await exercisesAPI.getSession(areas);
        
        // Update state with fetched exercises
        set((state) => ({
          sessions: state.sessions.map(session => 
            session.id === state.sessions[state.sessions.findIndex(s => s.id === completedSessionId) + 1].id
              ? {
                  ...session,
                  isAvailable: true,
                  exercises: fetchedExercises.data.map((ex: Exercise) => ({
                    ...ex,
                    isCompleted: false
                  }))
                }
              : session
          )
        }));
      },
      initializeSessions: async () => {
        const areas = '';
        const fetchedExercises = await exercisesAPI.getSession(areas);
        
        // Create initial 5 sessions only if there are no existing sessions
        set((state) => {
          if (state.sessions.length === 0) {
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

            return {
              sessions: initialSessions,
              currentSession: initialSessions[0]
            };
          }
          return state;
        });
      }
    }),
    {
      name: 'sessions-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const sessionStore = useSessions.getState();

export const useInitialAssessmentStore = create<{
  initialAssessment: InitialAssessment;
  setInitialAssessment: (initialAssessment: InitialAssessment) => void;
}>()(
  persist(
    (set) => ({
      initialAssessment: {
        userId: '',
        areas: {
          ot: { score: 0, isCompleted: false },
          speech: { score: 0, isCompleted: false },
          cognitive: { score: 0, isCompleted: false }
        }
      },
      setInitialAssessment: (initialAssessment: InitialAssessment) => set({ initialAssessment }),
    }),
    {
      name: 'initial-assessment-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const initialAssessmentStore = useInitialAssessmentStore.getState();

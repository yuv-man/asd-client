import { Session, User, AreaData } from './types';

export interface TherapyAreaProps {
    title: string;
    enabled: boolean;
    level: number;
    isEditing: boolean;
    onEnableChange: (enabled: boolean) => void;
    onLevelChange: (level: number) => void;
  }

  export interface ExerciseProps {
    onComplete?: (result: { 
      score: number;
      metrics?: {
        accuracy: number;
        timeInSeconds: number;
        attempts: number;
      }
    }) => void;
    isTest?: boolean;
    difficultyLevel?: number;
  }

  export interface DashboardProps {
    user: User | null;
    area: string;
    value: {
      averageScore: number;
      timeSpentMinutes: number;
      exercisesCompleted: number;
    };
    recentData: {
      dates: string[];
      scores: number[];
      times: number[];
      exercisesCompleted: number[];
    };
  }

  export interface ProfileProps {
    user: User | null;
    onSave?: (data: { 
      _id: string;
      name: string; 
      email: string; 
      parentPhone: string; 
      numOfExercises: number;
      age: number;
      avatarUrl: string;
      levelCognitive: number;
      levelOt: number;
      levelSpeech: number;
      enabledCognitive: boolean;
      enabledOt: boolean;
      enabledSpeech: boolean;
    }) => void;
  }

  export interface CardProps {
    className?: string;
    children: React.ReactNode;
  }
  
  export interface CardContentProps {
    className?: string;
    children: React.ReactNode;
  }

  export interface BalloonProps {
    id: number;
    color: string;
    size: number;
    position: { x: number; y: number };
    popped: boolean;
    onClick: (id: number, color: string) => void;
  }

  export interface TrailMapProps {
    sessions: Session[];
    onSessionSelect: (sessionId: string) => void;
    currentPosition: number;
    onSettingsClick?: () => void;
    onQuizSelect: (quizId: string) => void;
  }

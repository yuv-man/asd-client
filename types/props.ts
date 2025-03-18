import { User } from './types';

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
  }

  export interface ProfileProps {
    user: User | null;
    onSave?: (data: { 
      name: string; 
      parentEmail: string; 
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

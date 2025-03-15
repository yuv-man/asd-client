import { ExerciseProps } from './props';

export interface User {
    _id?: string;
    name: string;
    age: number;
    avatarUrl: string;
    parentEmail?: string;
    parentPhone?: string;
    password?: string;
    createdAt?: string;
    updatedAt?: string;
    isActive?: boolean;
    role?: string;
    lastLogin?: Date;
    dailyUsage: {
      date: Date;
      totalTimeSpentMinutes: number;
      sessionsCount: number;
    }[];
    areasProgress: {
      occupationalTherapy: {
        difficultyLevel: number;
        overallScore?: number;
        exercisesCompleted: number;
        averageScore: number;
        lastActivity?: Date;
        enabled: boolean;
      };
      speechTherapy: {
        difficultyLevel: number;
        overallScore?: number;
        exercisesCompleted: number;
        averageScore: number;
        lastActivity?: Date;
        enabled: boolean;
      };
      cognitive: {
        difficultyLevel: number;
        overallScore?: number;
        exercisesCompleted: number;
        averageScore: number;
        lastActivity?: Date;
        enabled: boolean;
      };
    };
}
  
export interface Assessment {
  id: string;
  userId: string;
  type: 'OT' | 'SPEECH' | 'COGNITIVE';
  score: number;
  date: string;
}

export interface TestResult {
  category: string;
  score: number;
  ageAverage: number;
  recommendations: string[];
}

export interface Exercise {
  _id: string;
  title: string;
  description: string;
  area: "occupationalTherapy" | "speechTherapy" | "cognitive";
  type: 'memory' | 'attention' | 'problem-solving';
  isCompleted?: boolean;
  component?: React.FC<ExerciseProps>;
}

export interface Session {
  id: string;
  exercises: Exercise[];
  isAvailable: boolean;
  isCompleted: boolean;
  position: { x: number; y: number };
  completedExercises: number;
}
export interface PuzzlePiece {
  id: number;
  row: number;
  col: number;
  originalIndex: number;
  imageUrl: string;
}

export interface AreaType {
  id: string;
  title: string;
  icon: string;
  description: string;
  color: string;
  backgroundColor: string;
  class: string;
}

export interface Avatar {
  id: string;
  src: any;
}

export type ExerciseType = 'attention' | 'memory' | 'problem-solving';
  

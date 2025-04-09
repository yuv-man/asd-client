import { ExerciseProps } from './props';

export interface SpeechRecognitionInstance extends EventTarget {
  start: () => void;
  stop: () => void;
  onresult: (event: any) => void;
  onerror: (event: any) => void;
  onend: (event: any) => void;
  continuous: boolean;
  interimResults: boolean;
  lang: string;
}

export interface User {
    _id?: string;
    name: string;
    age: number;
    language: string;
    avatarUrl: string;
    email?: string | undefined;
    parentPhone?: string;
    password?: string;
    createdAt?: string;
    updatedAt?: string;
    isActive?: boolean;
    role?: string;
    googleAuth?: boolean;
    authProviderId?: string;
    lastLogin?: Date;
    dailyUsage: {
      date: Date;
      totalTimeSpentMinutes: number;
      sessionsCount: number;
    }[];
    areasProgress: {
      ot: {
        difficultyLevel: number;
        overallScore?: number;
        exercisesCompleted: number;
        averageScore: number;
        lastActivity?: Date;
        enabled: boolean;
      };
      speech: {
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
  type: 'ot' | 'speech' | 'cognitive';
  score: number;
  date: string;
}

export interface TestResult {
  category: string;
  score: number;
  ageAverage: number;
  recommendations: string[];
}

export interface Quiz {
  id: string;
  title: string;
  exercises: Exercise[];
  area: "ot" | "speech" | "cognitive";
}

export interface Exercise {
  _id: string;
  title: string;
  description: string;
  area: "ot" | "speech" | "cognitive";
  type: ExerciseType;
  isCompleted?: boolean;
  component?: React.FC<ExerciseProps>;
}

export interface WeeklySummary {
  userId: string;
  date: Date;
  totalTimeSpentMinutes: number;
  exercisesCompleted: number;
  exerciseAttempts: number;
  areaBreakdown: {
    ot: {
      timeSpentMinutes: number;
      exercisesCompleted: number;
      averageScore: number;
    },
    speech: {
      timeSpentMinutes: number;
      exercisesCompleted: number;
      averageScore: number;
    },
    cognitive: {
      timeSpentMinutes: number;
      exercisesCompleted: number;
      averageScore: number;
    }
  },
  recentExercises: [{
    exerciseId: string,
    title: string,
    area: string,
    difficultyLevel: number,
    score: number,
    timestamp: Date
  }]
}

export interface Score {
  score: number;
  metrics?: {
    accuracy?: number;
    timeInSeconds?: number;
    attempts?: number;
  };
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
  chartColor: string;
}

export interface Avatar {
  id: string;
  src: any;
}

export interface FallingObject {
  id: number;
  type: string;
  position: number;
  top: number;
  caught: boolean;
  missed: boolean;
}

export interface BalloonType {
  id: number;
  color: string;
  size: number;
  position: { x: number; y: number };
  popped: boolean;
}

export type ExerciseType = 'attention' | 'memory' | 'problem-solving' | 'catch-objects' | 'shape-tracing' | 'balloon-game' | 'follow-word';
  
export interface InitialAssessment {
  userId: string;
  areas: {
    ot: {
      score: number;
      isCompleted: boolean;
    },
    speech: {
      score: number;
      isCompleted: boolean;
    },
    cognitive: {
      score: number;
      isCompleted: boolean;
    }
  }
} 

export type AreaData = {
  dates: string[];
  scores: number[];
  times: number[];
  exercisesCompleted: number[];
};
export interface User {
    id?: string;
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
      };
      speechTherapy: {
        difficultyLevel: number;
        overallScore?: number;
        exercisesCompleted: number;
        averageScore: number;
        lastActivity?: Date;
      };
      cognitive: {
        difficultyLevel: number;
        overallScore?: number;
        exercisesCompleted: number;
        averageScore: number;
        lastActivity?: Date;
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

export interface ExerciseProps {
  onComplete: (score: number) => void;
  isTest?: boolean;
  difficultyLevel?: number;
}

export interface PuzzlePiece {
  id: number;
  row: number;
  col: number;
  originalIndex: number;
  imageUrl: string;
}

export type ExerciseType = 'attention' | 'memory' | 'problem-solving';

// const exercises: Exercise[] = [
//   {
//     id: 'memory',
//     title: 'Memory Test',
//     description: 'Remember and repeat sequences of numbers',
//     area: 'cognitive',
//     type: 'memory',
//     component: MemoryExercise
//   },
//   {
//     id: 'attention',
//     title: 'Attention Test',
//     description: 'Find and match shapes quickly',
//     area: 'cognitive',
//     type: 'attention',
//     component: AttentionExercise
//   // },
//   {
//     id: 'problem-solving',
//     title: 'Problem Solving',
//     description: 'Solve age-appropriate puzzles and patterns',
//     area: 'cognitive',
//     type: 'problem-solving',
//     component: ProblemSolvingExercise
//   }
// ];
  

export interface TherapyAreaProps {
    title: string;
    enabled: boolean;
    level: number;
    isEditing: boolean;
    onEnableChange: (enabled: boolean) => void;
    onLevelChange: (level: number) => void;
  }

  export interface ExerciseProps {
    onComplete: (score: number) => void;
    isTest?: boolean;
    difficultyLevel?: number;
  }
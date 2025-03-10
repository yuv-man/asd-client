import AttentionExercise from '../components/cognitive/attentionExercise';
import ProblemSolvingExercise from '../components/cognitive/problemSolvingExercise';
import MemoryExercise from '../components/cognitive/memoryExercise';

export type ExerciseType = 'memory' | 'attention' | 'problem-solving';

export const exerciseComponents = {
  'memory': MemoryExercise,
  'attention': AttentionExercise,
  'problem-solving': ProblemSolvingExercise
} as const;

export const getExerciseComponent = (type: ExerciseType) => {
  return exerciseComponents[type];
}; 
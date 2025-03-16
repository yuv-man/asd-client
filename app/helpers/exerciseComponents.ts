import AttentionExercise from '../components/cognitive/attentionExercise';
import ProblemSolvingExercise from '../components/cognitive/problemSolvingExercise';
import MemoryExercise from '../components/cognitive/memoryExercise';
import CatchObjects from '../components/ot/catchObjects';
import ShapeTracing from '../components/ot/shapeTracing';
import { ExerciseType } from '@/types/types';
import BalloonGame from '../components/ot/balloonGame';

export const exerciseComponents = {
  'memory': MemoryExercise,
  'attention': AttentionExercise,
  'problem-solving': ProblemSolvingExercise,
  'catch-objects': CatchObjects,
  'shape-tracing': ShapeTracing,
  'balloon-game': BalloonGame,
} as const;

export const getExerciseComponent = (type: ExerciseType) => {
  return exerciseComponents[type];
}; 
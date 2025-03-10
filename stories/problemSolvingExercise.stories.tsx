import type { Meta, StoryObj } from '@storybook/react';
import ProblemSolvingExercise from '../app/components/cognitive/problemSolvingExercise';
import { useState } from 'react';

// Define the Meta for the ProblemSolvingExercise component
const meta = {
  title: 'Cognitive/ProblemSolvingExercise',
  component: ProblemSolvingExercise,
  parameters: {
    layout: 'centered',
  },
  // Use argTypes to define controls for stories
  argTypes: {
    onComplete: { action: 'onComplete' }
  }
} satisfies Meta<typeof ProblemSolvingExercise>;

export default meta;

// Define the Story type for the component
type Story = StoryObj<typeof meta>;

// Basic story with default behavior
export const Default: Story = {
  args: {
    onComplete: (score) => console.log(`Exercise completed with score: ${score}%`)
  },
};

// Create a wrapper component to display score upon completion
const ExerciseWithScoreDisplay = () => {
  const [score, setScore] = useState<number | null>(null);
  
  const handleComplete = (completionScore: number) => {
    setScore(completionScore);
  };
  
  return (
    <div className="space-y-6">
      {score !== null ? (
        <div className="p-4 bg-green-100 rounded-lg text-center">
          <h3 className="text-xl font-bold text-green-800">Exercise Completed!</h3>
          <p className="text-lg text-green-700">Your score: {score}%</p>
          <button 
            onClick={() => setScore(null)}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Try Again
          </button>
        </div>
      ) : (
        <ProblemSolvingExercise onComplete={handleComplete} />
      )}
    </div>
  );
};

// Story with score display after completion
export const WithScoreDisplay: Story = {
  args: {
    onComplete: (score) => console.log(`Score: ${score}%`)
  },
  render: () => <ExerciseWithScoreDisplay />
};

// Story showing correct answer submission
export const WithCorrectAnswer: Story = {
  play: async ({ canvasElement }) => {
    // This defines an automated interaction for testing
    // You'll need to install @storybook/test to make this work
    const canvas = canvasElement.querySelector('input');
    if (canvas) {
      canvas.value = '3'; // Set the correct answer for the first puzzle
      canvas.dispatchEvent(new Event('input', { bubbles: true }));
      
      const submitButton = canvasElement.querySelector('button');
      submitButton?.click();
    }
  },
  args: {
    onComplete: (score) => console.log(`Exercise completed with score: ${score}%`)
  }
};

// Story showing incorrect answer submission
export const WithIncorrectAnswer: Story = {
  play: async ({ canvasElement }) => {
    const canvas = canvasElement.querySelector('input');
    if (canvas) {
      canvas.value = '2'; // Set an incorrect answer for the first puzzle
      canvas.dispatchEvent(new Event('input', { bubbles: true }));
      
      const submitButton = canvasElement.querySelector('button');
      submitButton?.click();
    }
  },
  args: {
    onComplete: (score) => console.log(`Exercise completed with score: ${score}%`)
  }
};
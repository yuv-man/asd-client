import type { Meta, StoryObj } from '@storybook/react';
import MemoryExercise from '../app/components/cognitive/memoryExercise';

const meta: Meta<typeof MemoryExercise> = {
  title: 'Cognitive/MemoryExercise',
  component: MemoryExercise,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MemoryExercise>;

export const Easy: Story = {
  args: {
    difficultyLevel: 1,
    isTest: false,
    onComplete: (result) => {
      console.log('Exercise completed:', result);
    },
  },
};

export const Medium: Story = {
  args: {
    difficultyLevel: 2,
    isTest: false,
    onComplete: (result) => {
      console.log('Exercise completed:', result);
    },
  },
};

export const Hard: Story = {
  args: {
    difficultyLevel: 3,
    isTest: false,
    onComplete: (result) => {
      console.log('Exercise completed:', result);
    },
  },
};

export const TestMode: Story = {
  args: {
    difficultyLevel: 2,
    isTest: true,
    onComplete: (result) => {
      console.log('Test completed:', result);
    },
  },
}; 
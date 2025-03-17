import type { Meta, StoryObj } from '@storybook/react';
import BalloonGame from '@/app/components/ot/balloonGame';

const meta: Meta<typeof BalloonGame> = {
  title: 'OT/BalloonGame',
  component: BalloonGame,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof BalloonGame>;

export const Default: Story = {
  args: {
    onComplete: (score: number) => {
      console.log(`Game completed with score: ${score}`);
    },
    isTest: false,
    difficultyLevel: 1,
  },
};

export const TestMode: Story = {
  args: {
    onComplete: (score: number) => {
      console.log(`Test completed with score: ${score}`);
    },
    isTest: true,
    difficultyLevel: 1,
  },
};

export const MediumDifficulty: Story = {
  args: {
    onComplete: (score: number) => {
      console.log(`Game completed with score: ${score}`);
    },
    isTest: false,
    difficultyLevel: 2,
  },
};

export const HardDifficulty: Story = {
  args: {
    onComplete: (score: number) => {
      console.log(`Game completed with score: ${score}`);
    },
    isTest: false,
    difficultyLevel: 3,
  },
}; 
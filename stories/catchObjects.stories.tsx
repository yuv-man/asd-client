import type { Meta, StoryObj } from '@storybook/react';
import CatchObjects from '../app/components/ot/catchObjects';

const meta: Meta<typeof CatchObjects> = {
  title: 'OT/CatchObjects',
  component: CatchObjects,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CatchObjects>;

export const Default: Story = {
  args: {
    onComplete: () => console.log('Exercise completed'),
    isTest: false,
    difficultyLevel: 1,
  },
};

export const TestMode: Story = {
  args: {
    onComplete: () => console.log('Test completed'),
    isTest: true,
    difficultyLevel: 1,
  },
};

export const EasyDifficulty: Story = {
  args: {
    onComplete: () => console.log('Exercise completed'),
    isTest: false,
    difficultyLevel: 1,
  },
};

export const HardDifficulty: Story = {
  args: {
    onComplete: () => console.log('Exercise completed'),
    isTest: false,
    difficultyLevel: 3,
  },
}; 
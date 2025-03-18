import type { Meta, StoryObj } from '@storybook/react';
import ShapeTracing from '../app/components/ot/shapeTracing';

const meta: Meta<typeof ShapeTracing> = {
  title: 'OT/ShapeTracing',
  component: ShapeTracing,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ShapeTracing>;

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
import type { Meta, StoryObj } from '@storybook/react';
import AttentionExercise from '../app/components/cognitive/attentionExercise';

const meta: Meta<typeof AttentionExercise> = {
  title: 'Cognitive/AttentionExercise',
  component: AttentionExercise,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AttentionExercise>;

export const Default: Story = {
  args: {
    // Add any props your component needs
  },
};

export const InProgress: Story = {
  args: {
    // Add props for in-progress state
  },
}; 
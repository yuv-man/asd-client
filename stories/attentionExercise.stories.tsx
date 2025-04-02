import type { Meta, StoryObj } from '@storybook/react';
import AttentionExercise from '../app/components/cognitive/attentionExercise';
import { NextIntlClientProvider } from 'next-intl';

// Add messages for translations
const messages = {
  // Add your translation keys and values here
  attention: {
    // Example translation keys
    title: 'Attention Exercise',
    instructions: 'Follow the instructions...',
  }
};

const meta: Meta<typeof AttentionExercise> = {
  title: 'Cognitive/AttentionExercise',
  component: AttentionExercise,
  decorators: [
    (Story) => (
      <NextIntlClientProvider messages={messages} locale="en">
        <Story />
      </NextIntlClientProvider>
    ),
  ],
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
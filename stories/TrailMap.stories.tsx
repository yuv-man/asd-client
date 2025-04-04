import type { Meta, StoryObj } from '@storybook/react';
import { TrailMap } from '../app/components/trailMap/TrailMap';

const meta: Meta<typeof TrailMap> = {
  title: 'Components/TrailMap',
  component: TrailMap,
  parameters: {
    layout: 'fullscreen',
  },
  // Mock the viewport to ensure consistent rendering
  decorators: [
    (Story) => (
      <div style={{ height: '100vh', width: '100vw' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TrailMap>;

// Mock data for sessions
const mockSessions = [
  {
    id: 'session-1',
    exercises: [
      { _id: 'ex-1', id: 'ex-1', title: 'Exercise 1', description: 'Test exercise', area: 'cognitive' as const, type: 'memory' as const, isCompleted: true },
      { _id: 'ex-2', id: 'ex-2', title: 'Exercise 2', description: 'Test exercise', area: 'cognitive' as const, type: 'memory' as const, isCompleted: true },
      { _id: 'ex-3', id: 'ex-3', title: 'Exercise 3', description: 'Test exercise', area: 'cognitive' as const, type: 'memory' as const, isCompleted: true },
    ],
    isAvailable: true,
    isCompleted: true,
    position: { x: 0, y: 0 },
    completedExercises: 3,
  },
  {
    id: 'session-2',
    exercises: [
      { _id: 'ex-1', id: 'ex-1', title: 'Exercise 1', description: 'Test exercise', area: 'cognitive' as const, type: 'memory' as const, isCompleted: true },
      { _id: 'ex-2', id: 'ex-2', title: 'Exercise 2', description: 'Test exercise', area: 'cognitive' as const, type: 'memory' as const, isCompleted: true },
      { _id: 'ex-3', id: 'ex-3', title: 'Exercise 3', description: 'Test exercise', area: 'cognitive' as const, type: 'memory' as const, isCompleted: true },
    ],
    isAvailable: true,
    isCompleted: false,
    position: { x: 0, y: 0 },
    completedExercises: 1,
  },
  {
    id: 'session-3',
    exercises: [
      { _id: 'ex-1', id: 'ex-1', title: 'Exercise 1', description: 'Test exercise', area: 'cognitive' as const, type: 'memory' as const, isCompleted: true },
      { _id: 'ex-2', id: 'ex-2', title: 'Exercise 2', description: 'Test exercise', area: 'cognitive' as const, type: 'memory' as const, isCompleted: true },
      { _id: 'ex-3', id: 'ex-3', title: 'Exercise 3', description: 'Test exercise', area: 'cognitive' as const, type: 'memory' as const, isCompleted: true },
    ],
    isAvailable: false,
    isCompleted: false,
    position: { x: 0, y: 0 },
    completedExercises: 0,
  },
];

// Base story with default props
export const Default: Story = {
  args: {
    sessions: mockSessions,
    currentPosition: 1,
    onSessionSelect: (sessionId) => console.log('Session selected:', sessionId),
    onSettingsClick: () => console.log('Settings clicked'),
    onQuizSelect: (areaId) => console.log('Quiz selected:', areaId),
  },
};

// Story showing the beginning of the trail
export const StartOfTrail: Story = {
  args: {
    ...Default.args,
    currentPosition: 0,
  },
};

// Story showing locked sessions
export const WithLockedSessions: Story = {
  args: {
    ...Default.args,
    sessions: mockSessions.map((session, index) => ({
      ...session,
      isAvailable: index === 0,
    })),
    currentPosition: 0,
  },
};

// Story showing completed trail
export const CompletedTrail: Story = {
  args: {
    ...Default.args,
    sessions: mockSessions.map(session => ({
      ...session,
      isAvailable: true,
      isCompleted: true,
      exercises: session.exercises.map(ex => ({ ...ex, isCompleted: true })),
      completedExercises: 3,
    })),
    currentPosition: 2,
  },
};

// Story showing mobile viewport
export const MobileView: Story = {
  args: {
    ...Default.args,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

// Story showing tablet viewport
export const TabletView: Story = {
  args: {
    ...Default.args,
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
}; 
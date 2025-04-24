import { AreaType } from '@/types/types';

export const areaTypes: { [key: string]: AreaType } = {
  cognitive: {
    id: 'cognitive',
    class: 'cognitive',
    title: 'Cognitive Assessment',
    icon: '/stars/owl.svg',
    description: 'Evaluate memory, attention, and problem-solving skills',
    color: 'pastelYellow',
    backgroundColor: 'pastelLightYellow',
    chartColor: '#FFD700',
  },
  speech: {
    id: 'speech',
    class: 'speech',
    title: 'Speech Therapy',
    icon: '/stars/parrot.svg',
    description: 'Assess communication and language abilities',
    color: 'pastelRed',
    backgroundColor: 'pastelLightRed',
    chartColor: '#FF6B6B',
  },
  ot: {
    id: 'ot',
    class: 'ot',
    title: 'Occupational Therapy',
    icon: '/stars/monkey.svg',
    description: 'Evaluate motor skills and sensory processing',
    color: 'pastelBlue',
    backgroundColor: 'pastelLightBlue',
    chartColor: '#007BFF',
  },
};
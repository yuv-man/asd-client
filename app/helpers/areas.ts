import parrotIcon from '@/assets/animals/toucan.svg';
import owlIcon from '@/assets/animals/owl.svg'
import monkeyIcon from '@/assets/animals/monkey.svg';
import { AreaType } from '@/types/types';

export const areaTypes: { [key: string]: AreaType } = {
  cognitive: {
    id: 'cognitive',
    class: 'cognitive',
    title: 'Cognitive Assessment',
    icon: owlIcon,
    description: 'Evaluate memory, attention, and problem-solving skills',
    color: 'pastelYellow',
    backgroundColor: 'pastelLightYellow',
    chartColor: '#FFD700',
  },
  speech: {
    id: 'speech',
    class: 'speech',
    title: 'Speech Therapy',
    icon: parrotIcon,
    description: 'Assess communication and language abilities',
    color: 'pastelRed',
    backgroundColor: 'pastelLightRed',
    chartColor: '#FF6B6B',
  },
  ot: {
    id: 'ot',
    class: 'ot',
    title: 'Occupational Therapy',
    icon: monkeyIcon,
    description: 'Evaluate motor skills and sensory processing',
    color: 'pastelBlue',
    backgroundColor: 'pastelLightBlue',
    chartColor: '#007BFF',
  },
};
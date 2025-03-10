import drawing from './assets/drawing.svg'
import speech from './assets/speech.svg'
import puzzle from './assets/puzzle.svg'

interface AssessmentType {
  id: string;
  title: string;
  icon: string;
  description: string;
  color: string;
}

export const assessmentTypes: AssessmentType[] = [
  {
    id: 'cognitive',
    title: 'Cognitive Assessment',
    icon: puzzle,
    description: 'Evaluate memory, attention, and problem-solving skills',
    color: 'from-blue-200 to-purple-300',
  },
  {
    id: 'speech',
    title: 'Speech Therapy',
    icon: speech,
    description: 'Assess communication and language abilities',
    color: 'from-orange-300 to-red-300',
  },
  {
    id: 'ot',
    title: 'Occupational Therapy',
    icon: drawing,
    description: 'Evaluate motor skills and sensory processing',
    color: 'from-green-200 to-yellow-200',
  },
];
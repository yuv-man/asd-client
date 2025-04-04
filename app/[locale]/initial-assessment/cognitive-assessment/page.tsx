'use client';
import dynamic from 'next/dynamic';

const CognitiveQuiz = dynamic(() => import('@/app/components/quizes/CognitiveQuiz'), {
  ssr: false
});

export default function CognitiveAssessment() {
  return <CognitiveQuiz isInitialAssessment={true} />;
}

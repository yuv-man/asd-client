'use client';
import dynamic from 'next/dynamic';

const SpeechQuiz = dynamic(() => import('@/app/components/quizes/SpeechQuiz'), {
  ssr: false
});

export default function SpeechAssessment() {
  return <SpeechQuiz isInitialAssessment={true} />;
}
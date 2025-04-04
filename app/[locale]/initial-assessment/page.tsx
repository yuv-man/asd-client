'use client';
import dynamic from 'next/dynamic';

const InitialAssessment = dynamic(() => import('@/app/components/assessment/assessment'), {
  ssr: false
});

export default function InitialAssessmentPage() {
  return <InitialAssessment />;
}
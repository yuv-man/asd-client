'use client';

import dynamic from 'next/dynamic';

const OTQuiz = dynamic(() => import('@/app/components/quizes/OtQuiz'), {
  ssr: false
});

export default function OTAssessment() {
  return <OTQuiz isInitialAssessment={true} />;
}

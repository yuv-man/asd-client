'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Signup from '@/app/components/login/Signup';

function SignupContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  
  return <Signup email={email} />;
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignupContent />
    </Suspense>
  );
}
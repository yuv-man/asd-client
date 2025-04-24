'use client';

import { useSearchParams } from 'next/navigation';
import Signup from '@/app/components/login/Signup';

export default function SignupPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  
  return <Signup email={email} />;
}
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { sessionStore } from '../store/userStore';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem('wonderkid-user');
    if (savedUser) {
      sessionStore.initializeSessions()
      router.push('/training');
    } else {
      router.push('/login');
    }
  }, []);

  // Return empty div or loading state while redirecting
  return <div className="min-h-screen bg-pastelLightYellow" />;
}
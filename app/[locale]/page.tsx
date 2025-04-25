'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { sessionStore, useUserStore } from '@/store/userStore';
import { useTranslations } from 'next-intl';  
import '@/app/styles/mainPage.scss';

export default function Home() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const [isHydrated, setIsHydrated] = useState(false);
  const t = useTranslations();

  useEffect(() => {
    if (user !== undefined) {
      setIsHydrated(true);
    }
  }, [user]);

  useEffect(() => {
    if (!isHydrated) return;

    if (user) {
      sessionStore.initializeSessions();
      router.push('/training');
    } else {
      router.push('/signup');
    }
  }, [isHydrated, user, router, sessionStore]);

  return <div className="home-container" />;
}
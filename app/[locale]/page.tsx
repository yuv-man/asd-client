'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { sessionStore, useUserStore } from '@/store/userStore'; 
import { getSession } from 'next-auth/react';
import { userAPI } from '@/lib/api';
import '@/app/styles/mainPage.scss';

export default function Home() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const [isHydrated, setIsHydrated] = useState(false);

  const checkUser = async () => {
    if (user) {
      sessionStore.initializeSessions();
      router.push('/training');
    } else {
      const session = await getSession();
      const userResponse = await userAPI.getByEmail(session?.user?.email || '');
      if (userResponse) {
        sessionStore.initializeSessions();
        router.push('/training');
      } else {
        router.push('/signup');
      }
    }
  }

  useEffect(() => {
    if (user !== undefined) {
      setIsHydrated(true);
    }
  }, [user]);

  useEffect(() => {
    if (!isHydrated) return;
    checkUser();
  }, [isHydrated, user, router, sessionStore]);

  return <div className="home-container" />;
}
'use client';

import { SessionProvider, useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import React from 'react';

interface AuthProviderProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const AuthGuard = ({ children, requireAuth = true }: AuthProviderProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (requireAuth && pathname !== '/login' && status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, requireAuth, pathname, router]);

  if (requireAuth && pathname !== '/login') {
    if (status === 'loading') {
      return <div className="loader-container">
        <span className="loader"></span>
      </div>; // You can replace this with a loading spinner
    }
  }

  return <>{children}</>;
};

const AuthProvider: React.FC<AuthProviderProps> = ({ children, requireAuth }) => {
  return (
    <SessionProvider>
      <AuthGuard requireAuth={requireAuth}>{children}</AuthGuard>
    </SessionProvider>
  );
};

export default AuthProvider;
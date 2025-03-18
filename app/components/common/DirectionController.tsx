'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function DirectionController({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const locale = params?.locale as string;

  useEffect(() => {
    if (locale === 'he') {
      document.body.classList.add('rtl');
      document.body.classList.remove('ltr');
      document.dir = 'rtl';
    } else {
      document.body.classList.add('ltr');
      document.body.classList.remove('rtl');
      document.dir = 'ltr';
    }
  }, [locale]);

  return <>{children}</>;
}
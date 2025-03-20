'use client';

import { useEffect } from 'react';
import useLanguageStore from '@/store/languageStore';

interface LocaleInitializerProps {
  children: React.ReactNode;
  locale: string;
}

function LocaleInitializer({ children, locale }: LocaleInitializerProps) {
  const initializeLocale = useLanguageStore((state) => state.initializeLocale);
  
  useEffect(() => {
    // Initialize the store with the current locale
    initializeLocale(locale);
  }, [locale, initializeLocale]);

  return <>{children}</>;
}

export default LocaleInitializer;
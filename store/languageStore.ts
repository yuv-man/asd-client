'use client';

import { create } from 'zustand';
import { setCookie } from 'cookies-next';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { userAPI } from '@/services/api';

interface LanguageState {
  locale: string;
  isLoading: boolean;
  initializeLocale: (locale: string) => void;
  changeLanguage: (newLocale: string, userId: string, router: AppRouterInstance, pathname: string) => Promise<boolean>;
}

const useLanguageStore = create<LanguageState>((set) => ({
  locale: (() => {
    // Check localStorage for user data if running in browser
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('wonderkid-user');
      if (userData) {
        const user = JSON.parse(userData);
        return user.language || 'en';
      }
    }
    return 'en';
  })(),
  isLoading: false,
  
  // Initialize the store with the locale
  initializeLocale: (locale: string) => {
    // Check localStorage for user data
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('wonderkid-user');
      if (userData) {
        const user = JSON.parse(userData);
        set({ locale: user.language || locale });
        return;
      }
    }
    set({ locale });
  },
  
  // Change language function
  changeLanguage: async (newLocale: string, userId: string, router: AppRouterInstance, pathname: string) => {
    try {
      set({ isLoading: true });
      
      // Update user preference in the backend
      const response = await userAPI.update({
        _id: userId,
        language: newLocale
      });

      if (response.status !== 200) throw new Error('Failed to update language preference');
      
      // Set cookie for immediate effect
      setCookie('userLocale', newLocale, { maxAge: 60 * 60 * 24 * 365 }); // 1 year
      
      // Update state
      set({ locale: newLocale, isLoading: false });
      
      // Redirect to the same page but with new locale
      const currentPath = pathname;
      const segments = currentPath.split('/');
      segments[1] = newLocale; // Replace the locale segment
      const newPath = segments.join('/');
      
      router.push(newPath);
      
      return true;
    } catch (error) {
      console.error('Error changing language:', error);
      set({ isLoading: false });
      return false;
    }
  }
}));

export default useLanguageStore;
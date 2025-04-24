'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { lilitaOne } from '@/assets/fonts';
import bgLogin from '@/public/images/background-login.png';
import '@/app/styles/Login.scss';
import { userAPI } from '@/lib/api';
type AuthMode = 'initial' | 'signin' | 'signup';

const Login = () => {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const [authMode, setAuthMode] = useState<AuthMode>('initial');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { data: session } = useSession();

  const handleOAuthSignIn = async (provider: 'google') => {
    if (authMode === 'signup') {
      signIn(provider, { callbackUrl: `/${locale}/signup` });
    } else {
      // Sign in first, then check if user exists
      const result = await signIn(provider, {
        redirect: false,
      });
      
      if (result?.ok) {
        const user = await userAPI.getByEmail(session?.user?.email || '');
        if (user) {
          router.push(`/${locale}/training`);
        } else {
          router.push(`/${locale}/signup`);
        }
      }
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (authMode === 'signin') {
      // Attempt sign-in with credentials
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        console.error('Sign in error:', result.error);
        // Add error handling UI here
      } else {
        const user = await userAPI.getByEmail(email);
        if (user) {
          router.push(`/${locale}/training`);
        } else {
          router.push(`/${locale}/signup?email=${email}`);
        }
      }
    } else if (authMode === 'signup') {
      // Only pass email to signup page via URL params - NEVER pass password in URL
      const params = new URLSearchParams();
      params.append('email', email);
      
      // Store password temporarily in sessionStorage (will be cleared after use)
      if (password) {
        sessionStorage.setItem('tempSignupPassword', password);
      }
      
      router.push(`/${locale}/signup?${params.toString()}`);
    }
  };

  const handleBackButton = () => {
    setEmail('');
    setPassword('');
    setAuthMode('initial');
  };

  const renderInitialButtons = () => (
    <div className="initial-buttons">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="auth-choice-button"
        onClick={() => setAuthMode('signin')}
      >
        Sign In
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="auth-choice-button"
        onClick={() => setAuthMode('signup')}
      >
        Sign Up
      </motion.button>
    </div>
  );

  const renderAuthForm = () => (
    <div className="auth-container">
      <div className="oauth-section">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="oauth-button google"
          onClick={() => handleOAuthSignIn('google')}
        >
          <Image src="/icons/google-icon.svg" alt="Google" width={20} height={20} />
          <span>Continue with Google</span>
        </motion.button>
      </div>

      <div className="divider">
        <span className="divider-line"></span>
        <span className="divider-text">or</span>
        <span className="divider-line"></span>
      </div>

      <form onSubmit={handleEmailSubmit} className="credentials-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="submit-button"
        >
          {authMode === 'signin' ? 'Sign In' : 'Continue'}
        </motion.button>
      </form>

      <button 
        className="back-button"
        onClick={handleBackButton}
      >
        Back
      </button>
    </div>
  );

  return (
    <div className="login-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="login-card"
      >
        <div className="header">
          <Image src={bgLogin} alt="WonderKid Logo" width={600} priority loading="eager" />
          <h2 className={lilitaOne.className}>You are a Wonder Kid!</h2>
          <p className={lilitaOne.className}>
            {authMode === 'initial' 
              ? 'Welcome back!' 
              : authMode === 'signin' 
                ? 'Sign in to your account' 
                : 'Create your account'}
          </p>
        </div>

        {authMode === 'initial' ? renderInitialButtons() : renderAuthForm()}
      </motion.div>
    </div>
  );
};

export default Login;
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUserStore } from '@/store/userStore';
import bgLogin from '@/assets/background-login.png';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { lilitaOne } from '@/assets/fonts';
import AgeSelector from '../../ageSelector';
import { avatars } from '../../helpers/avatars';
import { User } from '@/types/types';
import { userAPI } from '@/lib/api';
import '@/app/styles/Login.scss';
import { signIn, useSession } from 'next-auth/react';
import googleIcon from '@/public/google-icon.svg';

const Login = ({stepProp='1'}) => {
  const router = useRouter();
  const { data: session } = useSession();
  const { setUser } = useUserStore();
  const [step, setStep] = useState(parseInt(stepProp) || 1);
  const [formData, setFormData] = useState({
    name: '',
    age: '4',
    avatarStyle: avatars[0].src,
    email: session?.user?.email || '', // Prefill email if available from OAuth sync
  });

  useEffect(() => {
    if (session?.user?.email) {
      setFormData({ ...formData, email: session.user.email });
    }
  }, [session]);

  const handleOAuthSignIn = async (provider: 'google') => {
    signIn(provider, { callbackUrl: '/login' }); // Redirect back to login to check newUser param
  };

  const handleEmailPasswordSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement)?.value;
    const password = (form.elements.namedItem('password') as HTMLInputElement)?.value;

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      // Handle login error (e.g., display a message)
      console.error('Email/Password Login Error:', res.error);
    } else {
      router.push('/training');
    }
  };

  const handleKidRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 2 && !formData.age) {
      return;
    }

    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else {
      const userData: User = {
        name: formData.name,
        age: parseInt(formData.age),
        avatarUrl: formData.avatarStyle,
        lastLogin: new Date(),
        language: 'en',
        dailyUsage: [{ date: new Date(), totalTimeSpentMinutes: 0, sessionsCount: 1 }],
        areasProgress: {
          ot: { overallScore: undefined, exercisesCompleted: 0, averageScore: 0, lastActivity: undefined, difficultyLevel: 1, enabled: true },
          speech: { overallScore: undefined, exercisesCompleted: 0, averageScore: 0, lastActivity: undefined, difficultyLevel: 1, enabled: true },
          cognitive: { overallScore: undefined, exercisesCompleted: 0, averageScore: 0, lastActivity: undefined, difficultyLevel: 1, enabled: true },
        },
        email: formData.email, // Use the parent's email from OAuth or entered manually
      };
      const res = await userAPI.create(userData);
      const user = res.data;
      setUser(user);
      router.push('/initial-assessment');
    }
  };

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
            {step === 1
              ? "Sign in or create a profile!"
              : step === 2
              ? "Tell us about yourself"
              : "Create your avatar"}
          </p>
        </div>

        {step === 1 ? (
          <div className="auth-container">
            {/* OAuth Section */}
            <div className="oauth-section">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="oauth-button google"
                onClick={() => handleOAuthSignIn('google')}
              >
                <Image src={googleIcon} alt="Google" width={20} height={20}/>
                <span>Continue with Google</span>
              </motion.button>
            </div>

            {/* Divider */}
            <div className="divider">
              <span className="divider-line"></span>
              <span className="divider-text">or</span>
              <span className="divider-line"></span>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleEmailPasswordSignIn} className="credentials-form">
              <div className="form-group">
                <label htmlFor="email" className={lilitaOne.className}>
                  Email
                </label>
                <div className="input-wrapper">
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    placeholder="Enter your email"
                    required 
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="password" className={lilitaOne.className}>
                  Password
                </label>
                <div className="input-wrapper">
                  <input 
                    type="password" 
                    id="password" 
                    name="password" 
                    placeholder="Enter your password"
                    required 
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="submit-button"
              >
                Sign In
              </motion.button>
            </form>
          </div>
        ) : (
          <form className="form" onSubmit={handleKidRegistration}>
            {step === 2 && (
              <>
                <div className="input-group">
                  <label htmlFor="name" className={lilitaOne.className}>What is your name?</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="age" className={lilitaOne.className}>How old are you?</label>
                  <div onClick={(e) => e.preventDefault()}>
                  <AgeSelector
                    age={parseInt(formData.age) || 4}
                    onChange={(age: number) => {
                      setFormData((prevData) => ({
                        ...prevData,
                        age: age.toString(),
                      }));
                    }}
                  />
                  </div>
                </div>
              </>
            )}

            {step === 3 && (
              <div>
                <p>Choose your avatar:</p>
                <div className="avatar-grid">
                  {avatars.map((avatar) => (
                    <motion.div
                      key={avatar.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`avatar-item ${
                        formData.avatarStyle === avatar.id ? 'selected' : ''
                      }`}
                      onClick={() => setFormData({ ...formData, avatarStyle: avatar.id })}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <Image
                        src={avatar.src}
                        alt={`${avatar.id} avatar`}
                        width={100}
                        height={100}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {step !== 1 && (
              <div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="button"
                >
                  {step === 2 ? 'Next' : 'Start Assessment'}
                </motion.button>
              </div>
            )}
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default Login;
                 
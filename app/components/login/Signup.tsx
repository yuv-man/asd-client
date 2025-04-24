'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUserStore } from '@/store/userStore';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { lilitaOne } from '@/assets/fonts';
import bgLogin from '@/public/images/background-login.png';
import AgeSelector from '../../ageSelector';
import { avatars } from '../../helpers/avatars';
import { User } from '@/types/types';
import { userAPI } from '@/lib/api';
import { useSession } from 'next-auth/react';
import '@/app/styles/Login.scss';
import { toast } from 'react-hot-toast';


const Signup = ({ email }: { email?: string }) => {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const { data: session } = useSession();
  const { setUser } = useUserStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    age: '4',
    avatarStyle: avatars[0].src,
    email: session?.user?.email || email,
    password: '',
  });

  useEffect(() => {
    // Get email from session or props
    if (session?.user?.email) {
      setFormData(prev => ({ ...prev, email: session.user.email || '' }));
    }
    
    // Get password from sessionStorage (if available)
    const tempPassword = sessionStorage.getItem('tempSignupPassword');
    if (tempPassword) {
      setFormData(prev => ({ ...prev, password: tempPassword }));
      // Clear the password from sessionStorage immediately after use
      sessionStorage.removeItem('tempSignupPassword');
    }
  }, [session, email]);

  const handleKidRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1 && !formData.age) {
      return;
    }

    if (step === 1) {
      setStep(2);
    } else {
      const userData: User = {
        name: formData.name,
        age: parseInt(formData.age),
        avatarUrl: formData.avatarStyle,
        lastLogin: new Date(),
        language: locale || 'en',  // Use the locale parameter
        dailyUsage: [{ date: new Date(), totalTimeSpentMinutes: 0, sessionsCount: 1 }],
        areasProgress: {
          ot: { overallScore: undefined, exercisesCompleted: 0, averageScore: 0, lastActivity: undefined, difficultyLevel: 1, enabled: true },
          speech: { overallScore: undefined, exercisesCompleted: 0, averageScore: 0, lastActivity: undefined, difficultyLevel: 1, enabled: true },
          cognitive: { overallScore: undefined, exercisesCompleted: 0, averageScore: 0, lastActivity: undefined, difficultyLevel: 1, enabled: true },
        },
        email: formData.email,
        password: formData.password,
      };
      const res = await userAPI.create(userData);
      if(res.status === 400){

      }
      const user = res.data;
      setUser(user);
      router.push(`/${locale}/initial-assessment`);
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
            {step === 1 ? "Tell us about yourself" : "Create your avatar"}
          </p>
        </div>

        <form className="form" onSubmit={handleKidRegistration}>
          {step === 1 && (
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

          {step === 2 && (
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

          <div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="button"
            >
              {step === 1 ? 'Next' : 'Start Assessment'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Signup;
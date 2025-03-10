'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUserStore } from '../../store/userStore';
import bgLogin from '../../assets/backgrounf-login.png';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { lilitaOne, wendyOne } from '../../assets/fonts';
import AgeSelector from '../ageSelector';
import { avatars } from '../helpers/avatars';
import { User } from '@/types/types';
import { userAPI } from '../services/api';

const Login = () => {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    age: '4',
    avatarStyle: avatars[0].src,
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('wonderkid-user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      router.push('/dashboard');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
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
        dailyUsage: [{
          date: new Date(),
          totalTimeSpentMinutes: 0,
          sessionsCount: 1
        }],
        areasProgress: {
          occupationalTherapy: {
            overallScore: undefined,
            exercisesCompleted: 0,
            averageScore: 0,
            lastActivity: undefined
          },
          speechTherapy: {
            overallScore: undefined,
            exercisesCompleted: 0,
            averageScore: 0,
            lastActivity: undefined
          },
          cognitive: {
            overallScore: undefined,
            exercisesCompleted: 0,
            averageScore: 0,
            lastActivity: undefined
          }
        }
      };
      setUser(userData);    
      const res = await userAPI.create(userData);
      const user = res.data;
      localStorage.setItem('wonderkid-user', JSON.stringify(user));
      router.push('/initial-assessment');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 p-8 rounded-xl shadow-lg bg-pastelLightYellow"
      >
        <div className="text-center flex flex-col items-center">
          <Image 
            src={bgLogin} 
            alt="WonderKid Logo" 
            width={1000} 
            height={1000} 
            priority={true}
            loading="eager"
          />
          <h2 className={`mt-3 text-3xl font-extrabold text-pastelOrange ${lilitaOne.className}`}>
            You are a Wonder Kid!
          </h2>
          <p className={`mt-2 text-md text-darkPurple text-gray-600 ${lilitaOne.className}`}>
            {step === 1 ? "Click Start to begin!" : 
             step === 2 ? "Tell us about yourself" : 
             "Create your avatar"} 
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {step === 1 ? (
            <div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Start
              </motion.button>
            </div>
          ) : step === 2 ? (
            <>
              <div>
                <label htmlFor="name" className={`block text-md font-medium text-gray-700 ${lilitaOne.className}`}>
                  What is your name?
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 bg-white"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="age" className={`block text-md font-medium text-gray-700 ${lilitaOne.className}`}>
                  How old are you?
                </label>
                <div onClick={(e) => e.preventDefault()}>
                  <AgeSelector 
                    age={parseInt(formData.age) || 4} 
                    onChange={(age: number) => {
                      setFormData((prevData) => ({
                        ...prevData,
                        age: age.toString()
                      }));
                    }} 
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Choose your avatar:</p>
              <div className="grid grid-cols-3 gap-4">
                {avatars.map((avatar) => (
                  <motion.div
                    key={avatar.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`cursor-pointer p-4 rounded-lg border-2 ${
                      formData.avatarStyle === avatar.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200'
                    }`}
                    onClick={() => setFormData({ ...formData, avatarStyle: avatar.id })}
                  >
                    <Image
                      src={avatar.src}
                      alt={`${avatar.id} avatar`}
                      width={100}
                      height={100}
                      className="w-full h-auto"
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
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                {step === 2 ? 'Next' : 'Start Assessment'}
              </motion.button>
            </div>
          )}
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
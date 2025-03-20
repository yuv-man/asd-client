'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import Image from 'next/image';
import hello from '@/assets/hello.svg';
import { areaTypes } from '@/app/helpers/areas';
import { AreaType } from '@/types/types';
import { useInitialAssessmentStore } from '@/store/userStore';


const InitialAssessment = () => {
  const router = useRouter();
  const [areas, setAreas] = useState<AreaType[]>(Object.values(areaTypes));
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const { user, setUser } = useUserStore();
  const [isHydrated, setIsHydrated] = useState(false);
  const { initialAssessment, setInitialAssessment } = useInitialAssessmentStore();

  useEffect(() => {
    if (user !== undefined) {
      setIsHydrated(true);
    }
  }, [user]);

  useEffect(() => {
    if (initialAssessment) {
      setAreas(prevAreas => {
        const completedAreas = ['ot', 'speech', 'cognitive'] as const;
        return prevAreas.filter(area => {
          return !completedAreas.includes(area.id as typeof completedAreas[number]) || 
                 !initialAssessment.areas[area.id as keyof typeof initialAssessment.areas].isCompleted;
        });
      });
    }
  }, [initialAssessment]);

  const handleStartAssessment = () => {
    if (selectedType) {
      router.push(`/initial-assessment/${selectedType}-assessment`);
    }
  };

  if (!isHydrated) return <p>Loading...</p>;
  return (
    <div className="max-w-4xl mx-auto mt-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className={`flex items-center text-2xl justify-start gap-4 text-darkPurple`}>
            <Image src={hello} alt="Hello" width={50} height={50} />
            <div>Hello <b>{user?.name}</b></div>
        </div>
        <h1 className={`text-3xl font-bold text-darkPurple mb-4`}>
          Let's Start Your Assessment
        </h1>
        <p className={`text-md text-gray-400`}>
          Choose an assessment type to begin. <br />We'll evaluate your current abilities
          and create a personalized improvement plan.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {areas.map((type: AreaType) => (
          <motion.div
            key={type.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
              cursor-pointer rounded-xl overflow-hidden
              ${selectedType === type.id ? 'ring-4 ring-purple-400' : ''}
            `}
            onClick={() => setSelectedType(type.id)}
          >
            <div className={`bg-gradient-to-br ${type.color} p-6 text-darkPurple h-full`}>
              <Image src={type.icon} alt={type.title} width={100} height={100} />
              <h3 className="text-xl font-semibold mb-2">{type.title}</h3>
              <p className="text-darkPurple/80">{type.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-8 text-center mb-8"
      >
        <button
          onClick={handleStartAssessment}
          disabled={!selectedType}
          className={`
            px-8 py-3 rounded-full text-white font-medium
            transition-all duration-200
            ${
              selectedType
                ? 'bg-purple-600 hover:bg-purple-700 cursor-pointer'
                : 'bg-gray-300 cursor-not-allowed'
            }
          `}
        >
          Let's Start
        </button>
      </motion.div>
    </div>
  );
};

export default InitialAssessment;
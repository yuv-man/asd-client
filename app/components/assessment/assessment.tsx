'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import Image from 'next/image';
import { areaTypes } from '@/app/helpers/areas';
import { AreaType } from '@/types/types';
import { useInitialAssessmentStore } from '@/store/userStore';
import '@/app/styles/assessment.scss';
import { useTranslations } from 'next-intl';

const InitialAssessment = () => {
  const router = useRouter();
  const t = useTranslations();
  const [areas, setAreas] = useState<AreaType[]>(Object.values(areaTypes));
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const { user } = useUserStore();
  const [isHydrated, setIsHydrated] = useState(false);
  const { initialAssessment } = useInitialAssessmentStore();

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

  if (!isHydrated) return <span className="loader"></span>;
  return (
    <div className="initial-assessment">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="header"
      >
        <div className="header__greeting">
          <Image src="/hello.svg" alt="Hello" width={50} height={50} />
          <div>{t('assessment.hello')} <b>{user?.name}</b></div>
        </div>
        <h1 className="header__title">
          {t('assessment.startAssessment')}
        </h1>
        <p className="header__description">
          {t('assessment.chooseAssessment')}
        </p>
      </motion.div>

      <div className="assessment-grid">
        {areas.map((type: AreaType) => (
          <motion.div
            key={type.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`assessment-card ${
              selectedType === type.id ? 'assessment-card--selected' : ''
            }`}
            onClick={() => setSelectedType(type.id)}
          >
            <div className={`assessment-card__content ${type.class}`}>
              <Image src={type.icon} alt={type.title} width={100} height={100} />
              <h3>{type.title}</h3>
              <p>{type.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="start-button"
      >
        <button
          onClick={handleStartAssessment}
          disabled={!selectedType}
        >
            {t('assessment.start')}
        </button>
      </motion.div>
    </div>
  );
};

export default InitialAssessment;
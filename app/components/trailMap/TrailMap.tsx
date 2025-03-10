import React from 'react';
import { motion } from 'framer-motion';
import styles from './TrailMap.module.css';
import Image from 'next/image';
import balloon from '@/assets/airballoon.svg';
import { FaCloud } from 'react-icons/fa';
import { Session } from '../../../types/types'

interface TrailMapProps {
  sessions: Session[];
  onSessionSelect: (sessionId: string) => void;
  currentPosition: number;
}

export const TrailMap: React.FC<TrailMapProps> = ({
  sessions,
  onSessionSelect,
  currentPosition,
}) => {
  return (
    <div 
      className={styles.trailMapContainer}
      style={{
        background: 'linear-gradient(135deg, #E0C3FC 0%, #8EC5FC 100%)',
      }}
    >
      <motion.div 
        key="scrollContainer"
        className={styles.scrollContainer}
        animate={{ x: '0%' }}
        transition={{ duration: 1, type: 'spring' }}
        style={{ 
          position: 'relative', 
          width: '100%', 
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {/* Session buttons */}
        {sessions.map((session, index) => {
          const isCurrentOrPrevious = index <= currentPosition;
          const isEven = index % 2 === 0;
          const completedExercises = session.exercises.filter(ex => ex.isCompleted).length;
          const progressPercentage = (completedExercises / session.exercises.length) * 100;

          return (
            <motion.div
              key={session.id}
              className={`${styles.exerciseButton} ${
                progressPercentage === 100 ? styles.completed : ''
              } ${session.isAvailable ? styles.available : styles.locked}`}
              style={{
                position: 'absolute',
                left: isEven ? '45%' : '55%',
                top: `${80 - (index * 25)}%`,
                transform: 'translate(-50%, -50%)',
                opacity: 1,
                cursor: session.isAvailable ? 'pointer' : 'not-allowed',
                zIndex: 2,
                background: session.isAvailable 
                  ? 'linear-gradient(135deg, #63B3ED 0%, #4299E1 100%)'
                  : 'linear-gradient(135deg, #CBD5E0 0%, #A0AEC0 100%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                padding: '16px',
                borderRadius: '50%',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
              initial={{ scale: 1 }}
              whileHover={session.isAvailable ? { scale: 1.1 } : {}}
              onClick={() => session.isAvailable && onSessionSelect(session.id)}
            >
              <div className={styles.progressIndicator}>
                <FaCloud size={24} color="white" />
                <div className={styles.progressText}>
                  {completedExercises}/{session.exercises.length}
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Balloon */}
        <motion.div
          className={styles.balloon}
          animate={{
            left: '50%',
            top: `${80 - (currentPosition * 25) - 10}%`,
            x: '-50%'
          }}
          transition={{ duration: 1, type: 'spring' }}
          style={{ position: 'absolute', pointerEvents: 'none', zIndex: 3 }}
        >
          <Image src={balloon} alt="Hot air balloon" width={75} height={75} priority/>
        </motion.div>
      </motion.div>
    </div>
  );
}; 
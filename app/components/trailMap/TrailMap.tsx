'use client'
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import './TrailMap.scss';
import Image from 'next/image';
import balloon from '@/assets/airballoon.svg';
import { FaCloud, FaCog } from 'react-icons/fa';
import { TrailMapProps } from '@/types/props';
import { areaTypes } from '@/app/helpers/areas';

export const TrailMap: React.FC<TrailMapProps> = ({
  sessions,
  onSessionSelect,
  currentPosition,
  onSettingsClick,
  onQuizSelect
}) => {
  const [displayedSessions, setDisplayedSessions] = React.useState(sessions);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [windowHeight, setWindowHeight] = React.useState(0);
  
  // Fixed session height
  const sessionHeight = 100;
  
  // Initialize window height on client side
  useEffect(() => {
    setWindowHeight(window.innerHeight);
    
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update displayedSessions when sessions prop changes
  useEffect(() => {
    setDisplayedSessions(sessions);
  }, [sessions]);

  // Generate new sessions if needed
  useEffect(() => {
    if (currentPosition >= displayedSessions.length - 1) {
      const newSessions = Array(2).fill(null).map((_, index) => ({
        id: `session-${displayedSessions.length + index}`,
        exercises: Array(3).fill({
          id: 'exercise',
          isCompleted: false
        }),
        isAvailable: false,
        isCompleted: false,
        position: { x: 0, y: 0 },
        completedExercises: 0
      }));
      
      setDisplayedSessions([...displayedSessions, ...newSessions]);
    }
  }, [currentPosition, displayedSessions, sessions]);

  const handleQuizSelect = (areaId: string) => {
    onQuizSelect(areaId);
  };

  // Calculate exact container height - only the space needed for buttons
  const exactContainerHeight = displayedSessions.length * sessionHeight;
  
  // Calculate scroll position to center current session
  const targetScrollY = ((displayedSessions.length - currentPosition - 1) * sessionHeight) - (windowHeight / 2) + (sessionHeight / 2);
  
  // Improved drag constraints
  const maxDragUp = -(exactContainerHeight - windowHeight);
  const maxDragDown = 0;

  return (
    <div 
      className="trailMapContainer"
      style={{
        background: 'linear-gradient(135deg, #E0C3FC 0%, #8EC5FC 100%)',
        overflow: 'hidden',
        position: 'relative',
        height: '100vh',
        width: '100%'
      }}
    >
      {/* Settings button */}
      <motion.div
        className="settingsButton"
        onClick={onSettingsClick}
        whileHover={{ scale: 1.1 }}
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          backgroundColor: 'lightBlue',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 10,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}
      >
        <FaCog size={20} color="white" />
      </motion.div>

      {/* Scrollable content */}
      <motion.div 
        ref={containerRef}
        className="scrollContainer"
        drag="y"
        dragConstraints={{
          top: maxDragUp,
          bottom: maxDragDown
        }}
        animate={{ y: -targetScrollY }}
        transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
        style={{ 
          position: 'absolute',
          width: '100%',
          height: exactContainerHeight,
          paddingTop: windowHeight / 2 - sessionHeight / 2,
          paddingBottom: windowHeight / 2 - sessionHeight / 2
        }}
      >
        {/* Animal buttons */}
        {Object.values(areaTypes).map((area, index) => {
          const positions = [
            { left: '25%', top: '70%' },
            { left: '75%', top: '40%' },
            { left: '25%', top: '10%' }
          ];
          
          return (
            <motion.div
              key={area.title}
              className={`animalButton ${area.title.toLowerCase()}`}
              onClick={() => handleQuizSelect(area.id)}
              style={{
                position: 'absolute',
                ...positions[index],
                cursor: 'pointer',
                zIndex: 2,
                borderRadius: '50%',
                backgroundColor: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              whileHover={{ 
                scale: 1.1,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Image src={area.icon} alt={area.title} width={60} height={60} />  
            </motion.div>
          );
        })}

        {/* Session buttons */}
        {[...displayedSessions].reverse().map((session, index) => {
          const isEven = (displayedSessions.length - 1 - index) % 2 === 0;
          const completedExercises = session.exercises.filter(ex => ex.isCompleted).length;
          const progressPercentage = (completedExercises / session.exercises.length) * 100;

          return (
            <motion.div
              key={session.id}
              className={`exerciseButton ${
                progressPercentage === 100 ? 'completed' : ''
              } ${session.isAvailable ? 'available' : 'locked'}`}
              style={{
                position: 'absolute',
                left: isEven ? '45%' : '55%',
                top: `${index * sessionHeight}px`,
                transform: 'translate(-50%, -50%)',
                opacity: 1,
                cursor: session.isAvailable ? 'pointer' : 'not-allowed',
                zIndex: 2,
                background: progressPercentage === 100
                  ? 'linear-gradient(135deg,rgb(139, 222, 174) 0%, #38A169 100%)'
                  : session.isAvailable
                    ? 'linear-gradient(135deg, #63B3ED 0%, #4299E1 100%)'
                    : 'linear-gradient(135deg, #CBD5E0 0%, #A0AEC0 100%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                padding: '16px',
                borderRadius: '50%',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                width: '60px',
                height: '60px'
              }}
              initial={{ scale: 1 }}
              whileHover={session.isAvailable ? { scale: 1.1 } : {}}
              onClick={() => session.isAvailable && onSessionSelect(session.id)}
            >
              <div className="progressIndicator">
                <FaCloud size={24} color="white" />
                <div className="progressText">
                  {completedExercises}/{session.exercises.length || 3}
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Balloon */}
        <motion.div
          className="balloon"
          animate={{
            left: `${currentPosition % 2 === 0 ? '50%' : '60%'}`,
            top: `${(displayedSessions.length - currentPosition - 1) * sessionHeight}px`,
            transform: 'translate(-50%, -50%)'
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
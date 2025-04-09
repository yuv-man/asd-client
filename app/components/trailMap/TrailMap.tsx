'use client'
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import '@/app/styles/TrailMap.scss';
import Image from 'next/image';
import balloon from '@/assets/airballoon.svg';
import { FaCloud, FaCog } from 'react-icons/fa';
import { TrailMapProps } from '@/types/props';
import { areaTypes } from '@/app/helpers/areas';
import bgStars from '@/assets/stars/bg-stars.svg';

export const TrailMap: React.FC<TrailMapProps> = ({
  sessions,
  onSessionSelect,
  currentPosition,
  onSettingsClick,
  onQuizSelect
}) => {
  // 1. All useState hooks
  const [displayedSessions, setDisplayedSessions] = useState(sessions);
  const containerRef = useRef<HTMLDivElement>(null);
  const [windowHeight, setWindowHeight] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // 2. All derived values and useMemo hooks
  const sessionHeight = Math.min(windowHeight * 0.15, 180);
  
  const buttonSize = useMemo(() => {
    if (windowWidth < 768) {
      return Math.min(50, windowWidth * 0.12);
    } else if (windowWidth < 1024) {
      return Math.min(55, windowWidth * 0.11);
    }
    return 58;
  }, [windowWidth]);

  const animalIconSizes = useMemo(() => {
    if (windowWidth < 768) return Math.min(60, windowWidth * 0.15);
    if (windowWidth < 1024) return Math.min(80, windowWidth * 0.1);
    return 70;
  }, [windowWidth]);

  // 3. All useEffect hooks
  useEffect(() => {
    const updateDimensions = () => {
      setWindowHeight(window.innerHeight);
      setWindowWidth(window.innerWidth);
      setIsLoading(false);
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    setDisplayedSessions(sessions);
  }, [sessions]);

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

  // Loading check after all hooks
  if (isLoading || !windowHeight || !windowWidth) {
    return (
      <div className="trailMapContainer" style={{
        background: `url(${bgStars.src})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div className='loader-container'>
          <span className="loader"></span>
        </div>
      </div>
    );
  }

  const handleQuizSelect = (areaId: string) => {
    onQuizSelect(areaId);
  };

  // Calculate exact container height with padding to prevent cut-off
  const exactContainerHeight = (displayedSessions.length * sessionHeight) + (windowHeight * 0.4);
  
  // Calculate scroll position to center current session with some extra space
  const targetScrollY = Math.max(0, ((displayedSessions.length - currentPosition - 1) * sessionHeight) - (windowHeight / 2) + (sessionHeight / 2));
  
  // Improved drag constraints with padding to prevent cut-off
  const maxDragUp = -(exactContainerHeight - windowHeight);
  const maxDragDown = windowHeight * 0.2; // Allow some overscroll at the top

  // Fixed animal positions that are definitely on screen
  const animalPositions = [
    // Left side - mid screen
    { left: '5%', top: '30%' },
    // Right side - mid screen
    { left: '5%', top: '45%' },
    // Top center - upper area but visible
    { left: '5%', top: '15%' }
  ];

  return (
    <div 
      className="trailMapContainer"
      style={{
        background: `url(${bgStars.src})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        overflow: 'hidden',
        position: 'relative',
        height: '100vh',
        width: '100%'
      }}
    >
      {/* Settings button with original positioning */}
      <motion.div
        className="settingsButton"
        onClick={onSettingsClick}
        whileHover={{ scale: 1.1 }}
        style={{
          position: 'absolute',
          top: 'clamp(10px, 2vh, 20px)',
          left: 'clamp(10px, 2vw, 20px)',
          width: 'clamp(28px, 6vw, 36px)', // Restored to original size
          height: 'clamp(28px, 6vw, 36px)',
          backgroundColor: 'lightBlue',
          border: 'none',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 10,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}
      >
        <FaCog size={Math.min(16, windowWidth * 0.05)} color="white" />
      </motion.div>

      {/* Scrollable content - with increased padding */}
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
          
          width: '100%',
          paddingTop: `${windowHeight * 0.2}px`,  // Add padding to prevent cut-off
          paddingBottom: `${windowHeight * 0.2}px` // Add padding to prevent cut-off
        }}
      >
        {/* Animal buttons with fixed on-screen positions */}
        {Object.values(areaTypes).map((area, index) => {
          // Use pre-defined positions that are guaranteed to be on screen
          const position = animalPositions[index % animalPositions.length];
          
          return (
            <motion.div
              key={area.title}
              className={`animalButton ${area.title.toLowerCase()}`}
              onClick={() => handleQuizSelect(area.id)}
              style={{
                position: 'absolute',
                left: position.left,
                top: position.top,
                cursor: 'pointer',
                zIndex: 5, // Increase z-index to ensure visibility
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
              <Image src={area.icon} alt={area.title} width={animalIconSizes} height={animalIconSizes} />  
            </motion.div>
          );
        })}

        {/* Session buttons with proper spacing */}
        {[...displayedSessions].reverse().map((session, index) => {
          const isEven = (displayedSessions.length - 1 - index) % 2 === 0;
          const completedExercises = session.exercises.filter(ex => ex.isCompleted).length;
          const progressPercentage = (completedExercises / session.exercises.length) * 100;
          
          // Maintain original horizontal positions
          const getHorizontalPosition = () => {
            if (windowWidth < 768) {
              return isEven ? '30%' : '70%'; 
            } else if (windowWidth < 1024) {
              return isEven ? '35%' : '65%';
            }
            return isEven ? '40%' : '60%'; // Original desktop spacing
          };

          return (
            <motion.div
              key={session.id}
              className={`exerciseButton ${
                progressPercentage === 100 ? 'completed' : ''
              } ${session.isAvailable ? 'available' : 'locked'}`}
              style={{
                position: 'absolute',
                left: getHorizontalPosition(),
                top: `${index * sessionHeight}px`, // Increased spacing between buttons
                transform: 'translate(-50%, -50%)',
                cursor: session.isAvailable ? 'pointer' : 'not-allowed',
                zIndex: 2,
                background: progressPercentage === 100
                  ? 'linear-gradient(135deg, rgb(139, 222, 174) 0%, #38A169 100%)'
                  : session.isAvailable
                    ? 'linear-gradient(135deg,rgb(170, 211, 240) 0%,rgb(95, 170, 231) 100%)'
                    : 'linear-gradient(135deg, #CBD5E0 0%, #A0AEC0 100%)',
                display: 'flex',
                border: '2px solid darkBlue',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 'clamp(2vh, 3vh, 4vh)', // Original padding
                borderRadius: '50%',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                width: `${buttonSize}px`,
                height: `${buttonSize}px`
              }}
              initial={{ scale: 1 }}
              whileHover={session.isAvailable ? { scale: 1.1 } : {}}
              onClick={() => session.isAvailable && onSessionSelect(session.id)}
            >
              <div className="progressIndicator">
                <FaCloud size={Math.min(30, windowWidth * 0.050)} color="white" /> 
                <div className="progressText" 
                  style={{ fontSize: 'clamp(12px, 2.5vw, 16px)' }}> 
                  {completedExercises}/{session.exercises.length || 3}
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Balloon with original sizing */}
        <motion.div
          className="balloon"
          animate={{
            left: `${currentPosition % 2 === 0 ? 
              (windowWidth < 768 ? '35%' : '45%') : 
              (windowWidth < 768 ? '65%' : '55%')}`,
            top: `${(displayedSessions.length - currentPosition - 1) * sessionHeight}px`,
            transform: 'translate(-50%, -50%)'
          }}
          transition={{ duration: 1, type: 'spring' }}
          style={{ position: 'absolute', pointerEvents: 'none', zIndex: 3 }}
        >
          <Image 
            src={balloon} 
            alt="Hot air balloon" 
            width={Math.min(110, windowWidth * 0.16)} // Close to original size
            height={Math.min(110, windowWidth * 0.16)}
            priority
          />
        </motion.div>
      </motion.div>
    </div>
  );
};
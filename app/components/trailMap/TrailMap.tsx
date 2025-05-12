'use client'
import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import '@/app/styles/TrailMap.scss';
import Image from 'next/image';
import { FaCloud, FaCog } from 'react-icons/fa';
import { TrailMapProps } from '@/types/props';
import { areaTypes } from '@/app/helpers/areas';
import { Session, Exercise } from '@/types/types';

const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024
} as const;

const ANIMATION_CONFIG = {
  DURATION: 0.8,
  STIFFNESS: 100
} as const;

const STYLE_CONSTANTS = {
  PADDING_TOP: 0.2,
  PADDING_BOTTOM: 0.2,
  BUTTON_GRADIENTS: {
    completed: 'linear-gradient(135deg, rgb(139, 222, 174) 0%, #38A169 100%)',
    available: 'linear-gradient(135deg,rgb(170, 211, 240) 0%,rgb(95, 170, 231) 100%)',
    locked: 'linear-gradient(135deg, #CBD5E0 0%, #A0AEC0 100%)'
  }
} as const;

export const TrailMap: React.FC<TrailMapProps> = ({
  sessions,
  onSessionSelect,
  currentPosition,
  onSettingsClick,
  onQuizSelect
}) => {
  // 1. Move all hooks to the top
  const [displayedSessions, setDisplayedSessions] = useState(sessions);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isLoading, setIsLoading] = useState(true);
  
  // Move these callback hooks before any conditional returns
  const handleQuizSelect = useCallback((areaId: string) => {
    onQuizSelect(areaId);
  }, [onQuizSelect]);

  const handleSessionSelect = useCallback((session: Session) => {
    if (session.isAvailable) {
      onSessionSelect(session.id);
    }
  }, [onSessionSelect]);

  // 2. All derived values and useMemo hooks
  const sessionHeight = Math.min(dimensions.height * 0.15, 180);
  
  const buttonSize = useMemo(() => {
    if (dimensions.width < 768) {
      return Math.min(50, dimensions.width * 0.12);
    } else if (dimensions.width < 1024) {
      return Math.min(55, dimensions.width * 0.11);
    }
    return 58;
  }, [dimensions.width]);

  const animalIconSizes = useMemo(() => {
    if (dimensions.width < 768) return Math.min(60, dimensions.width * 0.15);
    if (dimensions.width < 1024) return Math.min(80, dimensions.width * 0.1);
    return 80;
  }, [dimensions.width]);

  // 3. All useEffect hooks
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
      setIsLoading(false);
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    setDisplayedSessions(sessions);
  }, [sessions]);

  const generateNewSessions = (currentLength: number) => {
    return Array(2).fill(null).map((_, index) => ({
      id: `session-${currentLength + index}`,
      exercises: Array(3).fill({
        id: 'exercise',
        isCompleted: false
      }),
      isAvailable: false,
      isCompleted: false,
      position: { x: 0, y: 0 },
      completedExercises: 0
    }));
  };

  useEffect(() => {
    if (currentPosition >= displayedSessions.length - 1) {
      const newSessions = generateNewSessions(displayedSessions.length);
      setDisplayedSessions([...displayedSessions, ...newSessions]);
    }
  }, [currentPosition, displayedSessions]);

  // Now we can have the loading check
  if (isLoading || !dimensions.height || !dimensions.width) {
    return (
      <div className="trailMapContainer" style={{
        backgroundImage: `url('/stars/bg-stars.svg')`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
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

  // Calculate exact container height with padding to prevent cut-off
  const exactContainerHeight = (displayedSessions.length * sessionHeight) + (dimensions.height * 0.4);
  
  // Calculate scroll position to center current session with some extra space
  const targetScrollY = Math.max(0, ((displayedSessions.length - currentPosition - 1) * sessionHeight) - (dimensions.height / 2) + (sessionHeight / 2));
  
  // Improved drag constraints with padding to prevent cut-off
  const maxDragUp = -(exactContainerHeight - dimensions.height);
  const maxDragDown = dimensions.height * 0.2; // Allow some overscroll at the top

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
        backgroundImage: `url('/stars/bg-stars.svg')`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        overflow: 'hidden',
        position: 'relative',
        height: '100vh',
        width: '100%'
      }}
    >
      {/* Settings button with original positioning */}
      <motion.div
        role="button"
        aria-label="Settings"
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
        <FaCog size={Math.min(16, dimensions.width * 0.05)} color="white" />
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
          paddingTop: `${dimensions.height * STYLE_CONSTANTS.PADDING_TOP}px`,  // Add padding to prevent cut-off
          paddingBottom: `${dimensions.height * STYLE_CONSTANTS.PADDING_BOTTOM}px` // Add padding to prevent cut-off
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
            if (dimensions.width < 768) {
              return isEven ? '30%' : '70%'; 
            } else if (dimensions.width < 1024) {
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
                  ? STYLE_CONSTANTS.BUTTON_GRADIENTS.completed
                  : session.isAvailable
                    ? STYLE_CONSTANTS.BUTTON_GRADIENTS.available
                    : STYLE_CONSTANTS.BUTTON_GRADIENTS.locked,
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
              onClick={() => handleSessionSelect(session)}
            >
              <div className="progressIndicator">
                <FaCloud size={Math.min(30, dimensions.width * 0.050)} color="white" /> 
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
              (dimensions.width < 768 ? '35%' : '45%') : 
              (dimensions.width < 768 ? '65%' : '55%')}`,
            top: `${(displayedSessions.length - currentPosition - 1) * sessionHeight}px`,
            transform: 'translate(-50%, -50%)'
          }}
          transition={{ duration: 1, type: 'spring' }}
          style={{ position: 'absolute', pointerEvents: 'none', zIndex: 3 }}
        >
          <Image 
            src="/airballoon.svg" 
            alt="Hot air balloon" 
            width={Math.min(110, dimensions.width * 0.16)} // Close to original size
            height={Math.min(110, dimensions.width * 0.16)}
            priority
          />
        </motion.div>
      </motion.div>
    </div>
  );
};
import React from 'react';
import { motion } from 'framer-motion';
import './TrailMap.sass';
import Image from 'next/image';
import balloon from '@/assets/airballoon.svg';
import { FaCloud, FaCog } from 'react-icons/fa';
import { TrailMapProps } from '@/types/props';



export const TrailMap: React.FC<TrailMapProps> = ({
  sessions,
  onSessionSelect,
  currentPosition,
  onSettingsClick,
}) => {
  // Add scroll position state
  const [scrollY, setScrollY] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const sessionHeight = 100;
  const [viewportOffset, setViewportOffset] = React.useState(0);

  // Set viewport offset on mount and window resize
  React.useEffect(() => {
    const updateOffset = () => {
      setViewportOffset(document.documentElement.clientHeight / 2);
    };
    
    updateOffset(); // Initial calculation
    window.addEventListener('resize', updateOffset);
    
    return () => window.removeEventListener('resize', updateOffset);
  }, []);

  const targetScroll = Math.max(
    0,
    ((sessions.length - currentPosition - 1) * sessionHeight) - viewportOffset + (sessionHeight / 2)
  );

  // Update scroll position when currentPosition changes
  React.useEffect(() => {
    if (containerRef.current) {
      setScrollY(targetScroll);
    }
  }, [currentPosition, targetScroll]);

  return (
    <div 
      className="trailMapContainer"
      style={{
        background: 'linear-gradient(135deg, #E0C3FC 0%, #8EC5FC 100%)',
        overflow: 'hidden',
        position: 'relative',
        height: '100vh',
        width: '100%',
        minHeight: '400px'
      }}
    >
      <motion.div
        className="settingsButton"
        onClick={onSettingsClick}
        whileHover={{ scale: 1.1 }}
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          backgroundColor:'lightBlue',
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

      <motion.div 
        ref={containerRef}
        key="scrollContainer"
        className="scrollContainer"
        drag="y"
        dragConstraints={{
          top: -(sessions.length * sessionHeight) + viewportOffset,
          bottom: viewportOffset
        }}
        animate={{ y: -targetScroll }}
        transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
        style={{ 
          position: 'absolute',
          width: '100%', 
          height: `${sessions.length * sessionHeight + (viewportOffset * 2)}px`,
          top: 0,
          left: 0
        }}
      >
        
        {/* Session buttons - map through sessions in reverse order */}
        {[...sessions].reverse().map((session, index) => {
          const isCurrentOrPrevious = (sessions.length - 1 - index) <= currentPosition;
          const isEven = (sessions.length - 1 - index) % 2 === 0;
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
                  {completedExercises}/{session.exercises.length}
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Balloon */}
        <motion.div
          className="balloon"
          animate={{
            left: `${currentPosition % 2 === 0 ? '50%' : '61%'}`,
            top: `${(sessions.length - currentPosition - 1) * sessionHeight}px`,
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
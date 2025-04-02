import { useState, useEffect, useCallback } from 'react';
import { ExerciseProps } from '@/types/props';
import { Timer } from 'lucide-react';
import { motion } from 'framer-motion';
import { carsIcons } from '../../helpers/carsIcons';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import '@/app/styles/attentionExercise.scss';

const AttentionExercise: React.FC<ExerciseProps> = ({ onComplete, isTest, difficultyLevel }) => {
  const [vehicles, setVehicles] = useState<string[]>([]);
  const [targetVehicle, setTargetVehicle] = useState<string>('');
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const t = useTranslations();

  // Add difficulty configurations
  const difficultyConfig = {
    1: { gridSize: 2, interval: 6000 },
    2: { gridSize: 3, interval: 5000 },
    3: { gridSize: 4, interval: 4000 },
  } as const;

  const currentConfig = difficultyConfig[(difficultyLevel || 1) as 1 | 2 | 3];

  const generateVehicles = useCallback(() => {
    const vehicleOptions = carsIcons;
    const newVehicles = Array.from({ length: currentConfig.gridSize * currentConfig.gridSize }, () =>
      vehicleOptions[Math.floor(Math.random() * vehicleOptions.length)]
    );
    setVehicles(newVehicles.map((v) => v.name));
    setTargetVehicle(newVehicles[Math.floor(Math.random() * newVehicles.length)].name);
  }, [currentConfig.gridSize]);

  // Single effect to handle game state
  useEffect(() => {
    if (timeLeft <= 0) return;
  
    generateVehicles(); // Generate vehicles immediately on mount
  
    const intervalId = setInterval(() => {
      generateVehicles(); // Now updates correctly at the set interval
    }, currentConfig.interval);
  
    return () => clearInterval(intervalId);
  }, [currentConfig.interval, generateVehicles]);
  

  // Separate effect for timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const calculateNormalizedScore = useCallback(() => {
    if (attempts === 0) return 0;

    const accuracyWeight = 0.7;
    const accuracyScore = (score / attempts) * 1000 * accuracyWeight;

    const attemptsWeight = 0.3;
    const expectedAttempts = 15;
    const attemptsScore = Math.min(attempts / expectedAttempts, 1) * 1000 * attemptsWeight;

    return Math.round(Math.min(1000, accuracyScore + attemptsScore));
  }, [score, attempts]);

  useEffect(() => {
    if (timeLeft === 0) {
      const normalizedScore = calculateNormalizedScore();
      onComplete?.({
        score: normalizedScore,
        metrics: {
          accuracy: Math.round((score / attempts) * 100) || 0,
          timeInSeconds: 30,
          attempts: attempts,
        },
      });
    }
  }, [timeLeft, score, attempts, onComplete, calculateNormalizedScore]);

  const handleShapeClick = (shape: string) => {
    setAttempts((a) => a + 1);
    if (shape === targetVehicle) {
      setScore((s) => s + 1);
    }
  };

  return (
    <div className="attentionEx container">
      <div className="header">
        <h3 className='title'>Vehicle Match</h3>
        <div className="targetSection">
          <div className="flex items-center gap-2">
            <p className="text-secondary">Find this:</p>
            {targetVehicle && carsIcons.find((v) => v.name === targetVehicle)?.icon ? (
              <Image
                src={carsIcons.find((v) => v.name === targetVehicle)!.icon}
                alt={targetVehicle}
                width={70}
                height={70}
                className="targetImage"
              />
            ) : null}
          </div>
          <div className="mt-2 flex justify-center items-center text-secondary">
            <Timer className="timer-icon" />
            {timeLeft} {t('attentionExercise.seconds')}
          </div>
        </div>
      </div>

      <div className={`grid grid-${currentConfig.gridSize}`}>
        {vehicles.map((vehicle, index) => (
          <motion.button
            key={index}
            whileTap={{ scale: 0.95 }}
            className={`gridItem ${
              vehicle === 'truck' ? 'bg-red' : vehicle === 'car' ? 'bg-blue' : 'bg-green'
            }`}
            onClick={() => handleShapeClick(vehicle)}
          >
            {vehicle && carsIcons.find((v) => v.name === vehicle)?.icon ? (
              <Image
                src={carsIcons.find((v) => v.name === vehicle)!.icon}
                alt={vehicle}
                width={50}
                height={50}
                draggable="false"
              />
            ) : null}
          </motion.button>
        ))}
      </div>

      <div className="score-container">
        <div className="score">
          Score: {calculateNormalizedScore()} / 1000
        </div>
        <div className="matches">
          Matches: {score} / {attempts} ({Math.round((score / attempts) * 100) || 0}%)
        </div>
      </div>
    </div>
  );
};

export default AttentionExercise;
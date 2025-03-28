import { useState, useEffect, useCallback } from 'react';
import { ExerciseProps } from '@/types/props';
import { Timer } from 'lucide-react';
import { motion } from 'framer-motion';
import { carsIcons } from '../../helpers/carsIcons';
import Image from 'next/image';

const AttentionExercise: React.FC<ExerciseProps> = ({ onComplete, isTest, difficultyLevel }) => {
    const [vehicles, setVehicles] = useState<string[]>([]);
    const [targetVehicle, setTargetVehicle] = useState<string>('');
    const [score, setScore] = useState(0);
    const [attempts, setAttempts] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
  
    useEffect(() => {
      const vehicleOptions = carsIcons;
      const generateVehicles = () => {
        const newVehicles = Array.from({ length: 9 }, () => 
          vehicleOptions[Math.floor(Math.random() * vehicleOptions.length)]
        );
        setVehicles(newVehicles.map(v => v.name));
        setTargetVehicle(newVehicles[Math.floor(Math.random() * newVehicles.length)].name);
      };
  
      generateVehicles();
      const interval = setInterval(generateVehicles, 5000);
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
  
      return () => {
        clearInterval(interval);
        clearInterval(timer);
      };
    }, []);
  
    const calculateNormalizedScore = useCallback(() => {
      if (attempts === 0) return 0;

      // Accuracy weight (70% of total score)
      const accuracyWeight = 0.7;
      const accuracyScore = (score / attempts) * 1000 * accuracyWeight;

      // Attempts weight (30% of total score)
      const attemptsWeight = 0.3;
      const expectedAttempts = 15; // Expected number of attempts in 30 seconds
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
          }
        });
      }
    }, [timeLeft, score, attempts, onComplete, calculateNormalizedScore]);
  
    const handleShapeClick = (shape: string) => {
      setAttempts(a => a + 1);
      if (shape === targetVehicle) {
        setScore(s => s + 1);
      }
    };
  
    return (
      <div className="max-w-md mx-auto">
        <div className="mb-6 text-center">
          <h3 className="text-2xl font-semibold mb-2 text-pastelOrange">Vehicle Match</h3>
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <p className="text-secondary">Find this:</p>
              {targetVehicle && carsIcons.find(v => v.name === targetVehicle)?.icon ? (
                <Image
                  src={carsIcons.find(v => v.name === targetVehicle)!.icon}
                  alt={targetVehicle}
                  width={40}
                  height={40}
                  className="w-20 h-20"
                />
              ) : null}
            </div>
            <div className="mt-2 flex justify-center items-center text-secondary">
              <Timer className="w-4 h-4 mr-2 text-pastelOrange" />
              {timeLeft}s
            </div>
          </div>
        </div>
  
        <div className="grid grid-cols-3 gap-4">
          {vehicles.map((vehicle, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`h-24 rounded-lg ${
                vehicle === 'truck' ? 'bg-red-200' :
                vehicle === 'car' ? 'bg-blue-200' :
                'bg-green-200'
              } hover:bg-gray-200 flex items-center justify-center`}
              onClick={() => handleShapeClick(vehicle)}
            >
              {vehicle && carsIcons.find(v => v.name === vehicle)?.icon ? (
                <Image
                  src={carsIcons.find(v => v.name === vehicle)!.icon}
                  alt={vehicle}
                  width={24}
                  height={24}
                  className="w-24 h-24"
                />
              ) : null}
            </motion.button>
          ))}
        </div>
  
        <div className="mt-4 text-center">
          <div className="text-gray-600">
            Score: {calculateNormalizedScore()} / 1000
          </div>
          <div className="text-sm text-gray-500">
            Matches: {score} / {attempts} ({Math.round((score / attempts) * 100) || 0}%)
          </div>
        </div>
      </div>
    );
  };

  export default AttentionExercise;
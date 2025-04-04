// pages/index.js
import { useState, useEffect, useRef, useCallback } from 'react';
import soda from '@/assets/memoryIcons/soda-water.svg';
import apple from '@/assets/memoryIcons/apple.svg';
import fish from '@/assets/memoryIcons/fish.svg';
import steak from '@/assets/memoryIcons/steak.svg';
import poachEgg from '@/assets/memoryIcons/poached-eggs.svg';
import Head from 'next/head';
import '@/app/styles/catchObjects.scss';
import { catchObjectSettings } from '../../helpers/difficultySettings';
import { FallingObject } from '@/types/types';
import { ExerciseProps } from '@/types/props';
import Image from 'next/image';
import basket from '@/assets/cars/shopping-card.svg';
import { difficultyEnum } from '@/enums/enumDifficulty';
import { useTranslations } from 'next-intl';

type DifficultyLevel = 'easy' | 'medium' | 'hard';

const CatchObjects: React.FC<ExerciseProps> = ({ onComplete, isTest, difficultyLevel }) => {
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [difficulty, setDifficulty] = useState<Number>(difficultyLevel || 1);
  const [fallingObjects, setFallingObjects] = useState<FallingObject[]>([]);
  const [basketPosition, setBasketPosition] = useState(50);
  const [timeLeft, setTimeLeft] = useState(30); // 60 seconds game duration
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number | null>(null);
  const objectsGenerated = useRef(0);
  const [rawScore, setRawScore] = useState(0);
  const t = useTranslations();

  // Memoize startGame function
  const startGame = useCallback(() => {
    setScore(0);
    setTimeLeft(30);
    setFallingObjects([]);
    setGameActive(true);
    setGameOver(false);
    objectsGenerated.current = 0;
  }, []); // No dependencies since it only uses setState functions

  // Memoize handleMouseMove function
  const handleMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
    e.preventDefault(); // Prevent default behavior
    if (!gameAreaRef.current) return;
    
    const gameAreaRect = (gameAreaRef.current as HTMLElement).getBoundingClientRect();
    const gameAreaWidth = gameAreaRect.width;
    
    let newPosition;
    
    if ('touches' in e) { // Better type checking for TouchEvent
      const touch = e.touches[0];
      newPosition = ((touch.clientX - gameAreaRect.left) / gameAreaWidth) * 100;
    } else {
      newPosition = ((e as MouseEvent).clientX - gameAreaRect.left) / gameAreaWidth * 100;
    }
    
    newPosition = Math.max(0, Math.min(newPosition, 90));
    setBasketPosition(newPosition);
  }, []); // No dependencies since it only uses refs and setState

  // Update the mouse/touch movement effect to use memoized handler
  useEffect(() => {
    if (!gameActive) return;

    const gameArea = gameAreaRef.current;
    if (!gameArea) return;

    // Add passive: false to allow preventDefault()
    gameArea.addEventListener('mousemove', handleMouseMove, { passive: false });
    gameArea.addEventListener('touchmove', handleMouseMove, { passive: false });
    
    return () => {
      gameArea.removeEventListener('mousemove', handleMouseMove);
      gameArea.removeEventListener('touchmove', handleMouseMove);
    };
  }, [gameActive, handleMouseMove]);

  // Timer effect
  useEffect(() => {
    if (!gameActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          setGameActive(false);
          setGameOver(true);
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameActive]);

  // Generate falling objects
  useEffect(() => {
    if (!gameActive) return;
    
    const difficultyKey = difficultyEnum[difficulty as 1 | 2 | 3] as DifficultyLevel;
    const currentSettings = catchObjectSettings[difficultyKey];
    
    const generateObject = () => {
      const objectTypes = currentSettings.objectTypes;
      const type = objectTypes[Math.floor(Math.random() * objectTypes.length)];
      
      // Random x position (0-100%)
      const position = Math.random() * 92;
      
      setFallingObjects(prevObjects => [
        ...prevObjects,
        {
          id: objectsGenerated.current++,
          type,
          position,
          top: 0,
          caught: false,
          missed: false
        }
      ]);
    };

    const generatorInterval = setInterval(generateObject, currentSettings.spawnRate);
    
    return () => clearInterval(generatorInterval);
  }, [gameActive, difficulty]);

  // Calculate normalized score based on age and difficulty
  const calculateNormalizedScore = (rawScore: number): number => {
    const difficultyKey = difficultyEnum[difficulty as 1 | 2 | 3] as DifficultyLevel;
    const currentSettings = catchObjectSettings[difficultyKey];
    
    // Maximum possible score in 30 seconds based on spawn rate
    const maxPossibleScore = Math.floor(30000 / currentSettings.spawnRate);
    
    // Calculate score out of 1000
    return Math.round((rawScore / maxPossibleScore) * 1000);
  };

  // Memoize updateGameState function
  const updateGameState = useCallback(() => {
    setFallingObjects(prevObjects => {
      const updatedObjects = prevObjects.map(obj => {
        if (obj.caught || obj.missed) return obj;
        
        const difficultyKey = difficultyEnum[difficulty as 1 | 2 | 3] as DifficultyLevel;
        const newTop = obj.top + (catchObjectSettings[difficultyKey].fallSpeed / 10);
        
        if (newTop >= 75 && newTop <= 85) {
          const objectCenter = obj.position + 4;
          const basketLeft = basketPosition;
          const basketRight = basketPosition + 15;
          
          if (objectCenter >= basketLeft && objectCenter <= basketRight) {
            setRawScore(prevScore => prevScore + 1);
            return { ...obj, caught: true };
          }
        }
        
        if (newTop > 90) {
          return { ...obj, missed: true };
        }
        
        return { ...obj, top: newTop };
      });
      
      return updatedObjects.filter(obj => !(obj.caught || obj.missed) || obj.top <= 95);
    });
    
    requestRef.current = requestAnimationFrame(updateGameState);
  }, [basketPosition, difficulty]); // Dependencies needed for basket position and difficulty settings

  // Update the animation loop effect to use memoized updateGameState
  useEffect(() => {
    if (!gameActive) return;
    
    requestRef.current = requestAnimationFrame(updateGameState);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [gameActive, updateGameState]);

  // Update the game over effect
  useEffect(() => {
    if (gameOver) {
      const normalizedScore = calculateNormalizedScore(rawScore);
      onComplete?.({ score: normalizedScore });
    }
  }, [gameOver, onComplete, rawScore]);

  return (
    <div className='catchObjects'>

      <div className="container">
        <Head>
          <title className='title'>{t('catchObjects.title')}</title>
          <meta name="description" content="Occupational therapy game to help with motor skills" />

        </Head>

        <main className="main">
          <h1 className="title">
            {t('catchObjects.title')}
          </h1>
          {!gameActive && !gameOver && (
              <div className="instructions">
                <p>{t('catchObjects.instructions')}</p>
                <p>{t('catchObjects.instructions2')}</p>
              </div>
            )}
          
          <div className="gameControls">
            {!gameActive && !gameOver && (
              <>
                <button className="startButton" onClick={startGame}>
                  {t('catchObjects.startButton')}
                </button>
              </>
            )}
            
            {gameOver && (
              <div className="gameOver">
                <h2>{t('catchObjects.gameOver')}</h2>
                <p>{t('catchObjects.score')}: {score}</p>
                <button className="startButton" onClick={startGame}>
                  {t('catchObjects.playAgain')}
                </button>
              </div>
            )}
          </div>
          
          {gameActive && (
            <div 
              ref={gameAreaRef}
              className={`catchObjects gameArea ${gameActive ? 'active' : ''}`}
            >
            {gameActive && fallingObjects.map(obj => (
              <div 
                key={obj.id}
                className="fallingObject"
                style={{ 
                  left: `${obj.position}%`, 
                  top: `${obj.top}%`,
                  display: obj.caught || obj.missed ? 'none' : 'block',
                }}
              >
                <Image 
                  src={
                    {
                      apple,
                      fish,
                      soda,
                      steak,
                      poachedEgg: poachEgg
                    }[obj.type] ?? apple  // Use nullish coalescing to provide a fallback image
                  } 
                  alt={obj.type} 
                  width={50} 
                  height={50} 
                />
              </div>
            ))}
            
            {gameActive && (
              <div 
                className="basket"
                style={{ left: `${basketPosition}%` }}
              >
                <Image src={basket} alt="basket" width={100} height={100} />
              </div>
            )}
            </div>
          )}
          {gameActive && (
              <div className="stats">
                <div className="score">{t('catchObjects.score')}: {rawScore}</div>
                <div className="time">{t('catchObjects.time')}: {timeLeft}s</div>
              </div>
            )}
        </main>
      </div>
    </div>
  );
}

export default CatchObjects;

// pages/index.js
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import './styles/catchObjects.sass';
import { catchObjectSettings } from '../../helpers/difficultySettings';
import { FallingObject } from '@/types/types';
import { ExerciseProps } from '@/types/props';
type Difficulty = 'easy' | 'medium' | 'hard';

const CatchObjects: React.FC<ExerciseProps> = ({ onComplete, isTest, difficultyLevel }) => {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameActive, setGameActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [fallingObjects, setFallingObjects] = useState<FallingObject[]>([]);
  const [basketPosition, setBasketPosition] = useState(50);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number | null>(null);
  const objectsGenerated = useRef(0);

  // Start the game
  const startGame = () => {
    setScore(0);
    setLives(3);
    setFallingObjects([]);
    setGameActive(true);
    setGameOver(false);
    objectsGenerated.current = 0;
  };

  // Handle basket movement using mouse/touch
  useEffect(() => {
    if (!gameActive) return;

    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      if (!gameAreaRef.current) return;
      
      const gameAreaRect = (gameAreaRef.current as HTMLElement).getBoundingClientRect();
      const gameAreaWidth = gameAreaRect.width;
      const basketWidth = 100; // Width of the basket in pixels
      
      // Calculate position as percentage of game area width
      let newPosition;
      
      if (e.type === 'touchmove') {
        // Touch event handling
        const touch = (e as TouchEvent).touches[0];
        newPosition = ((touch.clientX - gameAreaRect.left) / gameAreaWidth) * 100;
      } else {
        // Mouse event handling
        newPosition = ((e as MouseEvent).clientX - gameAreaRect.left) / gameAreaWidth * 100;
      }
      
      // Constrain the basket to stay within the game area
      newPosition = Math.max(0, Math.min(newPosition, 100 - (basketWidth / gameAreaWidth * 100)));
      setBasketPosition(newPosition);
    };

    const gameArea = gameAreaRef.current;
    if (!gameArea) return;

    (gameArea as HTMLDivElement).addEventListener('mousemove', handleMouseMove);
    (gameArea as HTMLDivElement).addEventListener('touchmove', handleMouseMove);
    
    return () => {
      (gameArea as HTMLDivElement).removeEventListener('mousemove', handleMouseMove);
      (gameArea as HTMLDivElement).removeEventListener('touchmove', handleMouseMove);
    };
  }, [gameActive]);

  // Generate falling objects
  useEffect(() => {
    if (!gameActive) return;
    
    const currentSettings = catchObjectSettings[difficulty as keyof typeof catchObjectSettings];
    
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

  // Game animation loop
  useEffect(() => {
    if (!gameActive) return;
    
    const updateGameState = () => {
      setFallingObjects(prevObjects => {
        const updatedObjects = prevObjects.map(obj => {
          if (obj.caught || obj.missed) return obj;
          
          const newTop = obj.top + catchObjectSettings[difficulty as Difficulty].fallSpeed;
          
          // Check for catch
          if (newTop >= 85 && newTop <= 95) { // Basket is at 85-95% from top
            const objectCenter = obj.position + 4; // Object is ~8% wide, so center is at +4%
            const basketLeft = basketPosition;
            const basketRight = basketPosition + 15; // Basket is ~15% wide
            
            if (objectCenter >= basketLeft && objectCenter <= basketRight) {
              // Object caught
              setScore(prevScore => prevScore + 1);
              return { ...obj, caught: true };
            }
          }
          
          // Check if object missed (went beyond bottom)
          if (newTop > 100) {
            if (!obj.caught) {
              // Object missed
              setLives(prevLives => {
                const newLives = prevLives - 1;
                // Check for game over
                if (newLives <= 0) {
                  setGameActive(false);
                  setGameOver(true);
                }
                return newLives;
              });
              return { ...obj, missed: true };
            }
          }
          
          return { ...obj, top: newTop };
        });
        
        // Remove objects that are caught or have gone off-screen
        return updatedObjects.filter(obj => !(obj.caught || obj.missed) || obj.top <= 105);
      });
      
      requestRef.current = requestAnimationFrame(updateGameState);
    };
    
    requestRef.current = requestAnimationFrame(updateGameState);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [gameActive, basketPosition, difficulty]);

  return (
    <div className="container">
      <Head>
        <title>Catch Falling Objects</title>
        <meta name="description" content="Occupational therapy game to help with motor skills" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="main">
        <h1 className="title">
          Catch Falling Objects
        </h1>
        
        <div className="gameControls">
          {!gameActive && !gameOver && (
            <>
              <div className="difficultySelector">
                <h3>Select Difficulty:</h3>
                <div className="difficultyButtons">
                  <button 
                    className={`difficultyButton ${difficulty === 'easy' ? 'selected' : ''}`}
                    onClick={() => setDifficulty('easy')}
                  >
                    Easy
                  </button>
                  <button 
                    className={`difficultyButton ${difficulty === 'medium' ? 'selected' : ''}`}
                    onClick={() => setDifficulty('medium')}
                  >
                    Medium
                  </button>
                  <button 
                    className={`difficultyButton ${difficulty === 'hard' ? 'selected' : ''}`}
                    onClick={() => setDifficulty('hard')}
                  >
                    Hard
                  </button>
                </div>
              </div>
              <button className="startButton" onClick={startGame}>
                Start Game
              </button>
            </>
          )}
          
          {gameOver && (
            <div className="gameOver">
              <h2>Game Over!</h2>
              <p>Your score: {score}</p>
              <button className="startButton" onClick={startGame}>
                Play Again
              </button>
            </div>
          )}
          
          {gameActive && (
            <div className="stats">
              <div className="score">Score: {score}</div>
              <div className="lives">Lives: {lives}</div>
            </div>
          )}
        </div>
        
        <div 
          ref={gameAreaRef}
          className={`gameArea ${gameActive ? 'active' : ''}`}
        >
          {gameActive && fallingObjects.map(obj => (
            <div 
              key={obj.id}
              className={`fallingObject ${obj.type}`}
              style={{ 
                left: `${obj.position}%`, 
                top: `${obj.top}%`,
                display: obj.caught || obj.missed ? 'none' : 'block'
              }}
            />
          ))}
          
          {gameActive && (
            <div 
              className="basket"
              style={{ left: `${basketPosition}%` }}
            />
          )}
          
          {!gameActive && !gameOver && (
            <div className="instructions">
              <h2>How to Play</h2>
              <p>Move your mouse or finger to control the basket</p>
              <p>Catch the falling objects before they hit the ground</p>
              <p>You have 3 lives - don't miss too many objects!</p>
            </div>
          )}
        </div>
      </main>

      <footer className="footer">
        <p>Occupational Therapy Game - Catch Falling Objects</p>
      </footer>
    </div>
  );
}

export default CatchObjects;

// components/BalloonGame.js
import { useState, useEffect, useCallback } from 'react';
import './styles/catchObjects.sass';
import Balloon from './Balloon';
import { BalloonType } from '@/types/types';
import { balloonGameSettings } from '@/app/helpers/difficultySettings';
import { ExerciseProps } from '@/types/props';

const COLORS = ['red', 'blue', 'green', 'yellow', 'purple'];

type Difficulty = 'easy' | 'medium' | 'hard';

const BalloonGame: React.FC<ExerciseProps> = ({ onComplete, isTest, difficultyLevel }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [targetColor, setTargetColor] = useState('');
  const [balloons, setBalloons] = useState<BalloonType[]>([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [misses, setMisses] = useState(0);
  const [hits, setHits] = useState(0);
  const [avgReactionTime, setAvgReactionTime] = useState(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [lastTargetTime, setLastTargetTime] = useState<number | null>(null);

  // Generate random position within the game area
  const getRandomPosition = useCallback(() => {
    return {
      x: Math.floor(Math.random() * 80) + 10, // 10-90% of width
      y: Math.floor(Math.random() * 80) + 10, // 10-90% of height
    };
  }, []);

  // Create a new balloon
  const createBalloon = useCallback(() => {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const position = getRandomPosition();
    const id = Date.now() + Math.random();
    
    return {
      id,
      color,
      position,
      size: Math.floor(Math.random() * 30) + 50, // 50-80px
      popped: false,
    };
  }, [getRandomPosition]);

  // Initialize balloons
  const initializeBalloons = useCallback(() => {
    const settings = balloonGameSettings[difficulty as keyof typeof balloonGameSettings];
    const newBalloons = [];
    
    for (let i = 0; i < settings.balloonCount; i++) {
      newBalloons.push(createBalloon());
    }
    
    setBalloons(newBalloons);
  }, [createBalloon, difficulty]);

  // Set a new target color
  const setNewTarget = useCallback(() => {
    const newTarget = COLORS[Math.floor(Math.random() * COLORS.length)];
    setTargetColor(newTarget);
    setLastTargetTime(Date.now());
  }, []);

  // Handle balloon click
  const handleBalloonClick = useCallback((id: number, color: string) => {
    // Update balloons
    setBalloons(prevBalloons => 
      prevBalloons.map(balloon => 
        balloon.id === id ? { ...balloon, popped: true } : balloon
      )
    );
    
    // Check if the clicked balloon is the target color
    if (color === targetColor) {
      setScore(prevScore => prevScore + 10);
      setHits(prevHits => prevHits + 1);
      
      // Calculate reaction time
      if (lastTargetTime) {
        const reactionTime = (Date.now() - lastTargetTime) / 1000;
        setReactionTimes(prev => [...prev, reactionTime]);
        setAvgReactionTime(
          reactionTimes.length > 0 
            ? [...reactionTimes, reactionTime].reduce((a, b) => a + b, 0) / (reactionTimes.length + 1)
            : reactionTime
        );
      }
      
      // Replace the popped balloon
      setTimeout(() => {
        setBalloons(prevBalloons => 
          prevBalloons.map(balloon => 
            balloon.id === id ? createBalloon() : balloon
          )
        );
      }, 500);
    } else {
      // Wrong color was clicked
      setScore(prevScore => Math.max(0, prevScore - 5));
      setMisses(prevMisses => prevMisses + 1);
      
      // Replace the popped balloon
      setTimeout(() => {
        setBalloons(prevBalloons => 
          prevBalloons.map(balloon => 
            balloon.id === id ? createBalloon() : balloon
          )
        );
      }, 500);
    }
  }, [targetColor, createBalloon, lastTargetTime, reactionTimes]);

  // Move balloons - making movement smoother and more predictable
  const moveBalloons = useCallback(() => {
    setBalloons(prevBalloons => 
      prevBalloons.map(balloon => {
        if (balloon.popped) return balloon;
        
        // More controlled movement with fixed speed
        const newPosition = {
          x: balloon.position.x + (Math.sin(Date.now() / 1000) * 2), // gentle side-to-side movement
          y: balloon.position.y - 1, // constant upward speed
        };
        
        // If balloon goes off screen, reset it at bottom
        if (newPosition.y < -10 || newPosition.x < -10 || newPosition.x > 110) {
          return createBalloon();
        }
        
        return {
          ...balloon,
          position: newPosition,
        };
      })
    );
  }, [createBalloon]);

  // Start the game
  const startGame = useCallback(() => {
    setGameStarted(true);
    setScore(0);
    setTimeLeft(30);
    setMisses(0);
    setHits(0);
    setReactionTimes([]);
    setAvgReactionTime(0);
    initializeBalloons();
    setNewTarget();
  }, [initializeBalloons, setNewTarget]);

  // Reset the game
  const resetGame = useCallback(() => {
    setGameStarted(false);
    setBalloons([]);
    setTargetColor('');
  }, []);

  // Game timer effect
  useEffect(() => {
    if (!gameStarted) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          resetGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameStarted, resetGame]);

  // Balloon movement effect
  useEffect(() => {
    if (!gameStarted) return;
    
    const settings = balloonGameSettings[difficulty as keyof typeof balloonGameSettings];
    const moveInterval = setInterval(moveBalloons, settings.speed / 10);
    
    return () => clearInterval(moveInterval);
  }, [gameStarted, moveBalloons, difficulty]);

  // Target color change effect
  useEffect(() => {
    if (!gameStarted) return;
    
    const settings = balloonGameSettings[difficulty as keyof typeof balloonGameSettings];
    const targetInterval = setInterval(setNewTarget, settings.targetInterval);
    
    return () => clearInterval(targetInterval);
  }, [gameStarted, setNewTarget, difficulty]);

  useEffect(() => {
    if (timeLeft === 0) {
      onComplete(Math.round(score));
    }
  }, [timeLeft, score, onComplete]);

  return (
    <div className="gameContainer">
      {!gameStarted ? (
        <div className="startScreen">
          <h2>Balloon Pop Challenge</h2>
          <p>Pop the balloons that match the target color!</p>
          
          <button className="startButton" onClick={startGame}>
            Start Game
          </button>
        </div>
      ) : (
        <>
          <div className="gameInfo">
            <div className="targetColor">
              <span>Pop the</span>
              <div 
                className="colorIndicator" 
                style={{
                  backgroundColor: targetColor,
                  boxShadow: `0 0 15px ${targetColor}`, // Add glow effect
                  padding: '15px',
                  border: '2px solid white',
                  borderRadius: '50%',
                  width: '50px',
                  height: '50px'
                }}
              ></div>
              <span>balloons!</span>
            </div>
            
          </div>
          
          <div className="gameArea" style={{ cursor: 'crosshair' }}> {/* Add custom cursor */}
            {balloons.map(balloon => (
              <Balloon
                key={balloon.id}
                id={balloon.id}
                color={balloon.color}
                size={balloon.size}
                position={balloon.position}
                popped={balloon.popped}
                onClick={handleBalloonClick}
              />
            ))}
          </div>
          <div className="gameInfo">
          <div className="scoreAndTime">
              <span>Score: {score}</span>
              <span>Time: {timeLeft}s</span>
            </div>
          </div>
        </>
      )}
      
      {!gameStarted && timeLeft === 0 && (
        <div className="gameResults">
          <h2>Game Over!</h2>
          <div className="resultsGrid">
            <div>Final Score: {score}</div>
            <div>Hits: {hits}</div>
            <div>Misses: {misses}</div>
            <div>Accuracy: {hits > 0 ? Math.round((hits / (hits + misses)) * 100) : 0}%</div>
            <div>Avg Reaction Time: {avgReactionTime.toFixed(2)}s</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BalloonGame;

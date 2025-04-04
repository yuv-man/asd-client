// pages/game.js
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import '@/app/styles/rythemGame.scss';
import { RHYMING_SETS } from './rythemGame-helper';
import speakerIcon from '@/assets/speaker.svg';
import star from '@/assets/rythemGame/star.svg';
import { useTranslations } from 'next-intl';

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

interface RhymingSet {
  target: { word: string; image: string };
  options: { word: string; image: string; correct: boolean; }[];
}

export default function Play({ isTest, difficultyLevel, onComplete }: any) {
  const router = useRouter();

  const [score, setScore] = useState(0);
  const [currentSet, setCurrentSet] = useState<RhymingSet | null>(null);
  const [gameState, setGameState] = useState('loading'); // loading, intro, playing, feedback, gameover
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [rounds, setRounds] = useState(0);
  const [attempts, setAttempts] = useState(0);  // Track attempts
  const [timer, setTimer] = useState(0);  // Track time
  const [usedSets, setUsedSets] = useState<number[]>([]);
  const t = useTranslations();

  const speechSynthRef = useRef<SpeechSynthesis | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize audio and speech synthesis
  useEffect(() => {
    speechSynthRef.current = window.speechSynthesis;
    
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
    }

    startGame();
    
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (speechSynthRef.current) speechSynthRef.current.cancel();
    };
  }, [difficultyLevel]);

  // Speak text using speech synthesis
  const speak = (text: string, callback?: () => void) => {
    if (speechSynthRef.current) {
      speechSynthRef.current.cancel(); // Cancel any ongoing speech
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8; // Slower for kids
      utterance.pitch = 1.2; // Slightly higher pitch, friendly
      
      if (callback) {
        utterance.onend = callback;
      }
      
      speechSynthRef.current.speak(utterance);
    }
  };

  // Play a success sound
  const playSuccess = () => {
    if (audioContext.current) {
      const oscillator = audioContext.current.createOscillator();
      const gainNode = audioContext.current.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.value = 400;
      gainNode.gain.value = 0.3;
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.current.destination);
      
      oscillator.start();
      
      // Create a rising pitch effect
      oscillator.frequency.linearRampToValueAtTime(700, audioContext.current.currentTime + 0.5);
      gainNode.gain.linearRampToValueAtTime(0, audioContext.current.currentTime + 0.5);
      
      oscillator.stop(audioContext.current.currentTime + 0.5);
    }
  };

  // Play an error sound
  const playError = () => {
    if (audioContext.current) {
      const oscillator = audioContext.current.createOscillator();
      const gainNode = audioContext.current.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.value = 330;
      gainNode.gain.value = 0.3;
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.current.destination);
      
      oscillator.start();
      
      // Create a falling pitch effect
      oscillator.frequency.linearRampToValueAtTime(220, audioContext.current.currentTime + 0.3);
      gainNode.gain.linearRampToValueAtTime(0, audioContext.current.currentTime + 0.3);
      
      oscillator.stop(audioContext.current.currentTime + 0.3);
    }
  };

  // Get a random rhyming set that hasn't been used yet
  const getRandomRhymingSet = () => {
    const sets = RHYMING_SETS[Number(difficultyLevel) as 1 | 2 | 3] || RHYMING_SETS[1];
    
    // Filter out already used sets
    const availableSets = sets.filter((_, index) => !usedSets.includes(index));
    
    if (availableSets.length === 0) {
      // If all sets have been used, reset
      setUsedSets([]);
      return sets[Math.floor(Math.random() * sets.length)];
    }
    
    const randomSet = availableSets[Math.floor(Math.random() * availableSets.length)];
    const setIndex = sets.findIndex(s => s.target.word === randomSet.target.word);
    
    // Mark this set as used
    setUsedSets([...usedSets, setIndex]);
    
    return randomSet;
  };

  // Start timer when game starts
  useEffect(() => {
    if (gameState === 'playing') {
      timerIntervalRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [gameState]);

  // Start the game
  const startGame = () => {
    setGameState('intro');
    setTimer(0);
    setAttempts(0);
    
    // Get a new rhyming set
    const newSet = getRandomRhymingSet();
    setCurrentSet(newSet);
    
    setSelectedOption(null);
    setMessage('');
    
    // Welcome message
    speak(t('rythemPlay.welcome'), () => {
      timerRef.current = setTimeout(() => {
        setGameState('playing');
        speak(t('rythemPlay.instructions', { word: currentSet?.target.word || '' }), undefined);
      }, 1000);
    });
  };

  // Handle option click
  const handleOptionClick = (index: number) => {
    if (gameState !== 'playing' || !currentSet) return;
    
    setAttempts(prev => prev + 1);
    const option = currentSet.options[index];
    setSelectedOption(index);
    
    setGameState('feedback');
    
    if (option.correct) {
      playSuccess();
      setScore(score + 1);
      setMessage(t('rythemPlay.correct'));
      speak(t('rythemPlay.correct'), undefined);
      
      // Only proceed to next round or game over if answer was correct
      timerRef.current = setTimeout(() => {
        if (rounds >= 2) { // 3 rounds total
          setGameState('gameover');
          // Calculate final score based on accuracy and time
          const accuracy = (score + 1) / attempts;
          const timeBonus = Math.max(0, 1 - (timer / 180));
          const finalScore = Math.round((accuracy * 0.7 + timeBonus * 0.3) * 100);
            onComplete(finalScore);
          
          speak(t('rythemPlay.gameOver'), undefined);
        } else {
          setRounds(rounds + 1);
          // Get next rhyming set
          const newSet = getRandomRhymingSet();
          setCurrentSet(newSet);
          setSelectedOption(null);
          setGameState('playing');
        }
      }, 3000);
    } else {
      playError();
      setMessage(t('rythemPlay.incorrect'));
      speak(t('rythemPlay.incorrect'), undefined);
      
      // For incorrect answers, return to playing state after feedback
      timerRef.current = setTimeout(() => {
        setSelectedOption(null);
        setGameState('playing');
      }, 3000);
    }
  };

  // Speak the word when image is clicked
  const speakWord = (word: string, event: React.MouseEvent) => {
    event.stopPropagation();
    speak(word, undefined);
  };

  return (
    <div className="rythemGame-play">
      <div className="container" style={{ backgroundColor: '#FFD6E0' }}>
        <Head>
          <title>{t('rythemPlay.title')} - Level {difficultyLevel}</title>
          <meta name="description" content="Find words that rhyme" />
        </Head>

        <main className="main">
          <div className="gameHeader">
            <h1 className="title">{t('rythemPlay.title')}</h1>
            <div className="scoreBoard">
              <div className="stats-container">
                <div className="stats-item score">
                  <Image src={star} alt="Score" width={30} height={30} />
                  <span>{score}</span>
                </div>
                <div className="stats-item round">
                  <span>{t('rythemPlay.round', { round: rounds + 1, total: 3 })}</span>
                </div>
                <div className="stats-item attempts">
                  <span>{t('rythemPlay.attempts', { attempts })}</span>
                </div>
                <div className="stats-item timer">
                  <span>{t('rythemPlay.timer', { timer: Math.floor(timer / 60) + ':' + (timer % 60).toString().padStart(2, '0') })}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="gameArea">
            {gameState === 'intro' && (
              <div className="messageBox">
                <p>{t('rythemPlay.intro')}</p>
              </div>
            )}

            {(gameState === 'playing' || gameState === 'feedback') && currentSet && (
              <>
                <div className="targetContainer">
                  <p className="question">{t('rythemPlay.question', { word: currentSet.target.word })}</p>
                  <div className="targetWord">
                    <div className="wordCard">
                      <Image 
                        src={currentSet.target.image} 
                        alt={currentSet.target.word} 
                        width={120}
                        height={120}
                      />
                      <button 
                        className="speakerButton"
                        onClick={(e) => speakWord(currentSet.target.word, e)}
                      >
                        <Image src={speakerIcon} alt="Listen" width={24} height={24} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="optionsContainer">
                  {currentSet.options.map((option, index) => (
                    <div 
                      key={index} 
                      className={`option ${selectedOption === index ? (option.correct ? 'correctOption' : 'incorrectOption') : ''}`}
                      onClick={() => gameState === 'playing' && handleOptionClick(index)}
                    >
                      <div className="wordCard">
                        <Image 
                          src={option.image} 
                          alt={option.word} 
                          width={100} 
                          height={100}
                        />
                        <button 
                          className="speakerButton"
                          onClick={(e) => speakWord(option.word, e)}
                        >
                          <Image src={speakerIcon} alt="Listen" width={20} height={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {gameState === 'feedback' && (
              <div className={`feedbackMessage ${message.includes('Good') ? 'goodMessage' : 'oopsMessage'}`}>
                {message}
              </div>
            )}

            {gameState === 'gameover' && (
              <div className="gameoverArea">
                <h2>{t('rythemPlay.gameOver')}</h2>
                <p>{t('rythemPlay.gameOverMessage', { score })}</p>
                <div className="starsContainer">
                  {Array.from({ length: score }).map((_, i) => (
                    <Image key={i} src={star} alt="Star" width={40} height={40} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
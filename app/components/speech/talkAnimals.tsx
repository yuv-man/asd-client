'use client';
import React, { useEffect, useState } from 'react';
import { ExerciseProps } from '@/types/props';
import '@/app/styles/talkAnimals.scss';
import TalkAnimalsParentInfo from './TalkAnimalsParentInfo';
import Image from 'next/image';
import Play from './talkAnimal-play';
import { useTranslations } from 'next-intl';

const TalkAnimals: React.FC<ExerciseProps> = ({ onComplete, isTest, difficultyLevel = 1 }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isParentModalOpen, setIsParentModalOpen] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const t = useTranslations();

  useEffect(() => {
    // Play welcome message after a short delay
    const timer = setTimeout(() => {
      speak(t('talkAnimals.welcome'));
    }, 1000);
    
    return () => {
      clearTimeout(timer);
      window.speechSynthesis.cancel(); // Cancel any ongoing speech
    };
  }, []);

  const speak = async (text: string) => {
    setIsLoading(true);

    try {
      if ('speechSynthesis' in window) {
        const speech = new SpeechSynthesisUtterance(text);
        speech.rate = 0.9;
        speech.pitch = 1.2;
        
        return new Promise((resolve) => {
          speech.onend = () => {
            setIsLoading(false);
            resolve(true);
          };
          window.speechSynthesis.speak(speech);
        });
      } else {
        console.error('Speech synthesis not supported');
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Speech synthesis failed:', error);
      setIsLoading(false);
      return false;
    }
  };

  const startGame = async () => {
    await speak(t('talkAnimals.start'));
    setTimeout(() => {
      setGameStarted(true);
    }, 1500);
  };

  if (gameStarted) {
    return <Play 
      isTest={isTest} 
      difficultyLevel={difficultyLevel} 
      onComplete={onComplete} 
    />;
  }

  return (
    <div className="talkAnimals container">
      <main className="main">
        <div className="title-container">
          <h1 className="title">
            {t('talkAnimals.title')}
          </h1>
        <div className="parents-help-button-container" onClick={() => setIsParentModalOpen(true)}>
            <Image src="/icons/help.svg" alt="Parents Help" width={20} height={20} />
          </div>
        </div>
        
        <div className="animalFriends">
          <div className="animal">🐵</div>
          <div className="animal">🐶</div>
          <div className="animal">🐱</div>
          <div className="animal">🐰</div>
        </div>

        <div className="buttonContainer">
          <button 
            className="playButton"
            onClick={startGame}
          >
            <span className="playIcon">▶️</span>
            {t('talkAnimals.play')}
          </button>
        </div>
      </main>
      <TalkAnimalsParentInfo isOpen={isParentModalOpen} onClose={() => setIsParentModalOpen(false)} />

      <footer className="footer">
        <p>{t('talkAnimals.footer')}</p>
      </footer>
    </div>
  );
}

export default TalkAnimals;



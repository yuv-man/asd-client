'use client';
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { ExerciseProps } from '@/types/props';
import './styles/talkAnimals.scss';
import TalkAnimalsParentInfo from './TalkAnimalsParentInfo';
import Image from 'next/image';
import parentButton from '@/assets/help.svg';

const TalkAnimals: React.FC<ExerciseProps> = ({ onComplete, isTest, difficultyLevel = "easy" }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isParentModalOpen, setIsParentModalOpen] = useState(false);

  useEffect(() => {
    // Play welcome message after a short delay
    const timer = setTimeout(() => {
      speak('Welcome to Animal Friends! Tap the big green button to play!');
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
    await speak('Let\'s play with our animal friends!');
    setTimeout(() => {
      router.push('/speech/animalGame');
    }, 1500);
  };

  return (
    <div className="container">
      <main className="main">
        <div className="title-container">
          <h1 className="title">
            Animal Friends
          </h1>
        <div className="parents-help-button-container" onClick={() => setIsParentModalOpen(true)}>
            <Image src={parentButton} alt="Parents Help" width={20} height={20} />
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
            Play
          </button>
        </div>
      </main>
      <TalkAnimalsParentInfo isOpen={isParentModalOpen} onClose={() => setIsParentModalOpen(false)} />

      <footer className="footer">
        <p>Animal Friends - Speech Therapy Game for Kids</p>
      </footer>
    </div>
  );
}

export default TalkAnimals;



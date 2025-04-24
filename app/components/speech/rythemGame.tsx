import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import { useUserStore } from '@/store/userStore';
import '@/app/styles/rythemGame.scss';
import { ExerciseProps } from '@/types/props';
import Play from './rythemGame-play';
import RhymeGameParentInfo from './rythemGameParentsInfo';
import { useTranslations } from 'next-intl';

const rythemGame: React.FC<ExerciseProps> = ({ onComplete, isTest, difficultyLevel = 1 }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [isParentModalOpen, setIsParentModalOpen] = useState(false);
  const { user } = useUserStore();
  const t = useTranslations();

  const speechSynthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    speechSynthRef.current = window.speechSynthesis;
    return () => {
      if (speechSynthRef.current) {
        speechSynthRef.current.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (user) {
      speak(t('rythemGame.welcome', { name: user.name }));
    }
  }, [user]);

  const speak = (text: string) => {
    if (speechSynthRef.current) {
      speechSynthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8; // Slower for kids
      utterance.pitch = 1.2; // Slightly higher pitch, friendly
      speechSynthRef.current.speak(utterance);
    }
  };

  const handleStartClick = () => {
    speak(t('rythemGame.start'));
    setTimeout(() => {
      setGameStarted(true);
    }, 1500);
  };

  if (gameStarted) {
    return <Play 
      isTest={isTest} 
      difficultyLevel={user?.areasProgress.speech.difficultyLevel || 1} 
      onComplete={onComplete} 
    />;
  }
  
  return (
    <div className='rythemGame-container'>
      <div className='container'>
        <Head>
          <title>Rhyme Time</title>
          <meta name="description" content="A fun rhyming game for kids ages 4-5" />
        </Head>

        <main className='main'>
          <h1 className='title'>
            <span className='highlight'>{t('rythemGame.title')}</span>
                <div className="parents-help-button-container" onClick={() => setIsParentModalOpen(true)}>
                    <Image src="/icons/help.svg" alt="Parents Help" width={20} height={20} />
                </div>
          </h1>
            
          <div className='instructions'>
            <button onClick={() => speak(t('rythemGame.instructions'))} className='speakerButton'>
              <Image src="/icons/speaker.svg" alt="Listen" width={40} height={40} />
            </button>
            <p>{t('rythemGame.instructions')}</p>
          </div>

          <div className='startButtonContainer'>
            <button 
              className='startButton'
              onClick={handleStartClick}
            >
              {t('rythemGame.play')}
            </button>
          </div>
        </main>
        <RhymeGameParentInfo isOpen={isParentModalOpen} onClose={() => setIsParentModalOpen(false)} />

        <footer className='footer'>
          <p>{t('rythemGame.footer')}</p>
        </footer>
      </div>
    </div>
  );
}

export default rythemGame;

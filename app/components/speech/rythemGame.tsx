import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import { useUserStore } from '@/store/userStore';
import '@/app/styles/rythemGame.scss';
import { ExerciseProps } from '@/types/props';
import Play from './rythemGame-play';
import { characters } from './rythemGame-helper';
import speakerIcon from '@/assets/speaker.svg';

const rythemGame: React.FC<ExerciseProps> = ({ onComplete, isTest, difficultyLevel = 1 }) => {
  const [character, setCharacter] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const { user } = useUserStore();
  
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
      speak(`Hi ${user.name}! Let's play a rhyming game!`);
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

  const handleCharacterClick = (index: number) => {
    setCharacter(index);
    speak(`Hi! I'm ${characters[index].name}! Let's play a rhyming game!`);
    setTimeout(() => {
        setGameStarted(true);
      }, 1500);
  };

  const handleSpeakerClick = (text: string) => {
    speak(text);
  };

  if (gameStarted) {
    return <Play 
      isTest={isTest} 
      difficultyLevel={user?.areasProgress.speech.difficultyLevel || 1} 
      onComplete={onComplete} 
      character={character}
    />;
  }
  
  return (
    <div className='rythemGame-container'>
        <div className='container' style={{ backgroundColor: characters[character].color }}>
        <Head>
            <title>Rhyme Time - Fun Rhyming Game for Kids</title>
            <meta name="description" content="A fun rhyming game for kids ages 4-5" />
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className='main'>
            <h1 className='title'>
            <span className='highlight'>Rhyme</span> Time!
            </h1>
            
            <div className='instructions'>
            <button onClick={() => speak("Choose a friend! Then find words that rhyme!")} className='speakerButton'>
                <Image src={speakerIcon} alt="Listen" width={40} height={40} />
            </button>
            <p>Choose your rhyming buddy!</p>
            </div>

            <div className='characterContainer'>
            {characters.map((char, index) => (
                <div 
                key={index} 
                className={`character ${character === index ? 'selectedCharacter' : ''}`}
                onClick={() => handleCharacterClick(index)}
                >
                <div className='characterImage'>
                    <Image 
                    src={char.image} 
                    alt={char.name} 
                    width={150} 
                    height={150} 
                    priority
                    />
                </div>
                <button className='speakerButton' onClick={() => handleSpeakerClick(char.name)}>
                    <Image src={speakerIcon} alt="Listen" width={30} height={30} />
                </button>
                </div>
            ))}
            </div>
        </main>

        <footer className='footer'>
            <p>Made with ♥ for little rhymers!</p>
        </footer>
        </div>
    </div>
  );
}

export default rythemGame;

'use client';
import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import '@/app/styles/talkAnimals.scss';
import { gameContent } from './talkAnimalsGameContent';
import { SpeechRecognitionInstance } from '@/types/types';
import { ExerciseProps } from '@/types/props';
import { langEnum } from '@/enums/enumLang';
import { useLocale } from 'next-intl';
import { levenshteinDistance } from '@/app/helpers/talkAnimal-helper';

// Speech recognition setup
const setupSpeechRecognition = () => {
  const locale = useLocale();
  if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = langEnum[locale as keyof typeof langEnum];;
    return recognition;
  }
  return null;
};

export default function Play({ isTest, difficultyLevel, onComplete }: ExerciseProps) {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [stars, setStars] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  // Get current game content based on user's difficulty level
  const currentGameContent = gameContent[difficultyLevel as keyof typeof gameContent];

  // Initialize speech recognition
  useEffect(() => {
    recognitionRef.current = setupSpeechRecognition();
    
    if (recognitionRef.current) {
      recognitionRef.current.onresult = (event) => {
        const current = event.resultIndex;
        const transcriptResult = event.results[current][0].transcript.toLowerCase().trim();
        setTranscript(transcriptResult);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        checkAnswer(transcript);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Update reference to transcript for the onend callback
  useEffect(() => {
    const checkAnswerWithCurrentTranscript = () => {
      checkAnswer(transcript);
    };
    
    if (recognitionRef.current) {
      recognitionRef.current.onend = () => {
        setIsListening(false);
        // Only check answer if there is a transcript
        if (transcript) {
          checkAnswerWithCurrentTranscript();
        }
      };
    }
  }, [transcript]);

  // Play initial question when component mounts or question changes
  useEffect(() => {
    let isFirstRender = true;
    
    if (currentQuestionIndex < currentGameContent.length && !gameCompleted && isFirstRender) {
      // Play the current question after a short delay
      const timer = setTimeout(() => {
        playQuestionAudio();
      }, 1000);
      
      isFirstRender = false;
      return () => clearTimeout(timer);
    }
  }, [currentQuestionIndex, gameCompleted]);

  // Function to play audio with synthetic voice
  const playAudio = (src: string, text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const speech = new SpeechSynthesisUtterance(text);
      speech.rate = 0.9; // Slightly slower for children
      speech.pitch = 1.2; // Slightly higher pitch for friendly tone
      window.speechSynthesis.speak(speech);
    }
  };

  // Play the current question audio
  const playQuestionAudio = () => {
    const currentQuestion = getCurrentQuestion();
    if (currentQuestion) {
      playAudio(
        currentQuestion.audioText,
        currentQuestion.audioText
      );
    }
  };

  // Get current question
  const getCurrentQuestion = () => {
    return currentGameContent[currentQuestionIndex];
  };

  // Start listening
  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      setFeedback('');
      setShowFeedback(false);
      
      try {
        // Play a sound to indicate listening has started
        playAudio('/audio/listening.mp3', 'I\'m listening!');
        
        // Start speech recognition after the prompt
        setTimeout(() => {
          if (recognitionRef.current) {
            recognitionRef.current.start();
            setIsListening(true);
          }
        }, 1000);
      } catch (error) {
        console.error('Speech recognition error:', error);
      }
    }
  };

  // Stop listening
  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  // Show hint and play hint audio
  const showHintWithAudio = () => {
    const currentQuestion = getCurrentQuestion();
    if (currentQuestion) {
      setShowHint(true);
      playAudio(
        currentQuestion.hintAudioText, 
        currentQuestion.hintAudioText
      );
    }
  };

  // Check if the spoken answer contains expected phrases
  const checkAnswer = (spoken: string) => {
    const currentQuestion = getCurrentQuestion();
    if (!currentQuestion || !spoken) return;
    
    const spokenText = spoken.toLowerCase().trim();
    const expectedAnswers = currentQuestion.expectedAnswer;
    
    setAttempts(prev => prev + 1);
    
    // Calculate accuracy score (out of 600)
    const calculateAccuracyScore = () => {
      let bestMatchScore = 0;
      expectedAnswers.forEach(expected => {
        // Calculate Levenshtein distance
        const distance = levenshteinDistance(spokenText, expected.toLowerCase());
        const maxLength = Math.max(spokenText.length, expected.length);
        const similarity = 1 - (distance / maxLength);
        bestMatchScore = Math.max(bestMatchScore, similarity);
      });
      return Math.round(bestMatchScore * 600);
    };

    // Calculate complexity score (out of 400)
    const calculateComplexityScore = () => {
      const wordCount = spokenText.split(' ').length;
      const uniqueWords = new Set(spokenText.split(' ')).size;
      const avgWordLength = spokenText.length / wordCount;
      
      // Complexity factors
      const wordCountScore = Math.min(150, wordCount * 30); // Max 150 points
      const uniqueWordsScore = Math.min(150, uniqueWords * 30); // Max 150 points
      const wordLengthScore = Math.min(100, avgWordLength * 10); // Max 100 points
      
      return Math.round(wordCountScore + uniqueWordsScore + wordLengthScore);
    };

    // Check if any expected phrases are in the answer
    const foundMatch = expectedAnswers.some(expected => 
      spokenText.includes(expected)
    );
    
    if (foundMatch) {
      // Calculate final score
      const accuracyScore = calculateAccuracyScore();
      const complexityScore = calculateComplexityScore();
      const attemptsDeduction = Math.max(0, (attempts - 1) * 100); // Deduct 100 points per additional attempt
      const finalScore = Math.max(0, Math.min(1000, accuracyScore + complexityScore - attemptsDeduction));
      
      // Play success feedback
      playAudio('/audio/yay.mp3', 'Yay!');
      setFeedback(currentQuestion.feedback.good);
      setScore(prev => prev + finalScore);
      setStars(prev => [...prev, currentQuestion.id]);
      setShowFeedback(true);
      
      // Move to next question after delay
      setTimeout(() => {
        moveToNextQuestion();
      }, 1500);
    } else {
      // Show hint after first try
      setShowHint(true);
      setFeedback(currentQuestion.feedback.try);
      setShowFeedback(true);
      
      // Play try again audio
      playAudio(
        currentQuestion.feedback.tryAudioText, 
        currentQuestion.feedback.tryAudioText
      );
    }
  };
  // Move to the next question
  const moveToNextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1;
    
    if (nextIndex >= currentGameContent.length) {
      // Game completed
      setGameCompleted(true);
      playAudio('/audio/game-complete.mp3', 'Wow! You did it! You talked to all our animal friends! Great job!');
      onComplete?.({ score: score, metrics: { accuracy: score, timeInSeconds: 0, attempts: attempts } });
    } else {
      // Move to next question
      setCurrentQuestionIndex(nextIndex);
      setTranscript('');
      setFeedback('');
      setShowFeedback(false);
      setAttempts(0);
      setShowHint(false);
    }
  };

  // Play again
  const playAgain = () => {
    setCurrentQuestionIndex(0);
    setTranscript('');
    setFeedback('');
    setScore(0);
    setGameCompleted(false);
    setStars([]);
    setAttempts(0);
    setShowHint(false);
    setShowFeedback(false);
    
    // Play restart audio
    playAudio('/audio/play-again.mp3', 'Let\'s play again with our animal friends!');
  };

  const goHome = () => {
    playAudio('/audio/goodbye.mp3', 'Goodbye! See you next time!');
    
    // Navigate to home after a short delay
    setTimeout(() => {
      router.push('/training/quiz/speech');
    }, 1500);
  };

  const currentQuestion = getCurrentQuestion();

  return (
    <div className="container">
      <Head>
        <title>Play with Animal Friends</title>
        <meta name="description" content="Speech therapy game for kids" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="main">
        {!gameCompleted ? (
          <div className="followWord-gameArea">
            <div className="progressBar">
              {currentGameContent.map((item, index) => (
                <div 
                  key={index} 
                  className={`progressStep ${index === currentQuestionIndex ? 'currentStep' : ''} ${stars.includes(item.id) ? 'completedStep' : ''}`}
                >
                  {item.character}
                </div>
              ))}
            </div>

            <div className="characterCard">
              <div 
                className="characterEmoji"
                onClick={playQuestionAudio} // Allow replaying the question by tapping character
              >
                {currentQuestion.character}
              </div>
              <h2 className="characterName">{currentQuestion.name}</h2>
              
              <div 
                className="speechBubble"
                onClick={playQuestionAudio} // Allow replaying the question by tapping speech bubble
              >
                <p className="question">{currentQuestion.question}</p>
                <div className="replayButton" onClick={playQuestionAudio}>
                  🔊
                </div>
              </div>
              
              {showHint && (
                <div className="hint" onClick={showHintWithAudio}>
                  <p>{currentQuestion.hint}</p>
                  <div className="hintButton">🔊</div>
                </div>
              )}
              
              <div className="controlsArea">
                <button 
                  onClick={isListening ? stopListening : startListening}
                  className={isListening ? "listeningButton" : "speakButton"}
                  disabled={showFeedback}
                >
                  {isListening ? (
                    <>
                      <span className="micIcon">🎤</span>
                      <span className="listeningText">I'm Done</span>
                    </>
                  ) : (
                    <>
                      <span className="micIcon">🎤</span>
                      <span className="speakText">Talk Now</span>
                    </>
                  )}
                </button>
                
                {!showHint && (
                  <button onClick={showHintWithAudio} className="helpButton">
                    <span className="helpIcon">❓</span>
                    <span className="helpText">Help</span>
                  </button>
                )}
              </div>
              
              {isListening && (
                <div className="listeningIndicator">
                  <div className="wavesContainer">
                    <div className="wave"></div>
                    <div className="wave"></div>
                    <div className="wave"></div>
                  </div>
                </div>
              )}
              
              {showFeedback && (
                <div className={`feedbackBox ${feedback === currentQuestion.feedback.good ? 'goodFeedback' : 'tryFeedback'}`}>
                  {feedback === currentQuestion.feedback.good ? (
                    <div className="characterHappy">
                      {currentQuestion.character}
                    </div>
                  ) : (
                    <button 
                      onClick={startListening} 
                      className="tryAgainButton"
                    >
                      Try Again
                    </button>
                  )}
                </div>
              )}
            </div>
            
            <div className="scoreDisplay">
              {stars.map((starId, index) => (
                <div key={index} className="starIcon">⭐</div>
              ))}
            </div>
          </div>
        ) : (
          <div className="completionScreen">
            <h1 className="completionTitle">Amazing Job!</h1>
            
            <div className="starsContainer">
              {currentGameContent.map((item, index) => (
                <div key={index} className="starCharacter">
                  <div className="characterCircle">
                    {item.character}
                  </div>
                  {stars.includes(item.id) && (
                    <div className="starBadge">⭐</div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="confetti"></div>
            
            <div className="completionButtons">
              <button onClick={playAgain} className="playAgainButton">
                <span className="playAgainIcon">🔄</span>
                Play Again
              </button>
              <button onClick={goHome} className="homeButton">
                <span className="homeIcon">🏠</span>
                Home
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
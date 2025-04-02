import { useState, useEffect, useRef, useCallback } from "react";
import { ExerciseProps } from "@/types/props";
import useLanguageStore from "@/store/languageStore";
import { wordsIcons } from "./wordsIcons";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { langEnum } from "@/enums/enumLang";

interface SpeechRecognitionInstance extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: (event: any) => void;
  onerror: (event: any) => void;
  onend: (event: any) => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition: new () => SpeechRecognitionInstance;
  }
}

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

// Words organized by difficulty level
const wordsByLevel = {
  easy: ["apple", "banana", "cat", "dog", "elephant"],
  medium: ["giraffe", "helicopter", "igloo", "jellyfish", "kangaroo"],
  hard: ["xylophone", "strawberry", "butterfly", "umbrella", "rectangle"]
};

const FollowWord: React.FC<ExerciseProps> = ({ onComplete, isTest, difficultyLevel = "easy" }) => {
  const [currentWord, setCurrentWord] = useState("");
  const [spokenWord, setSpokenWord] = useState("");
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [wordList, setWordList] = useState<string[]>([]);
  
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const currentWordRef = useRef(""); // Reference to track currentWord across renders
  
  const { locale } = useLanguageStore();
  const t = useTranslations();

  // Add state to track if we're on client side
  const [isBrowser, setIsBrowser] = useState(false);

  // Add this useEffect at the beginning
  useEffect(() => {
    setIsBrowser(true);
  }, []);

  // Set words based on difficulty level
  useEffect(() => {
    const words = wordsByLevel[difficultyLevel as keyof typeof wordsByLevel] || wordsByLevel.easy;
    setWordList([...words]); // Create a new array to ensure proper state update
  }, [difficultyLevel]);

  // Pick a random word
  const pickRandomWord = useCallback(() => {
    const words = wordsByLevel[difficultyLevel as keyof typeof wordsByLevel] || wordsByLevel.easy;
    
    // Make sure we get a different word if possible
    let randomWord;
    if (words.length > 1) {
      // Try to get a different word than the current one
      do {
        randomWord = words[Math.floor(Math.random() * words.length)];
      } while (randomWord === currentWordRef.current && words.length > 1);
    } else {
      randomWord = words[0];
    }
    
    console.log("Setting new word:", randomWord, "Previous word was:", currentWordRef.current);
    
    setCurrentWord(randomWord);
    currentWordRef.current = randomWord; // Update ref to match state
    
    setSpokenWord("");
    setFeedback("");
  }, [difficultyLevel]);

  // Initialize with first word
  useEffect(() => {
    if (wordList.length > 0 && !currentWord) {
      pickRandomWord();
    }
  }, [wordList, currentWord, pickRandomWord]);

  // Setup speech recognition
  useEffect(() => {
    if (!isBrowser) return; // Only run on client side

    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      setError(t("speech.browserError"));
      return;
    }
    
    const setupRecognition = () => {
      if (recognitionRef.current) {
        // Clean up existing instance
        recognitionRef.current.onresult = () => null;
        recognitionRef.current.onerror = () => null;
        recognitionRef.current.onend = () => null;
      }
      
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = langEnum[locale as keyof typeof langEnum];
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase().trim();
        setSpokenWord(transcript);
        setIsListening(false);
        
        // Use the ref value instead of state to ensure we have the latest
        console.log(`Spoken: "${transcript}", Expected: "${currentWordRef.current}"`);
        checkAnswer(transcript, currentWordRef.current);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
        setError(t("speech.recognitionError"));
        
        // Show "try again" feedback instead of an error message
        setFeedback(t("speech.incorrect"));
        setIsProcessing(true);
        
        setTimeout(() => {
          setIsProcessing(false);
        }, 2000);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    };
    
    setupRecognition();
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onresult = () => null;
        recognitionRef.current.onerror = () => null;
        recognitionRef.current.onend = () => null;
      }
    };
  }, [locale, t, isBrowser]); // Add isBrowser to dependencies

  const startListening = () => {
    if (!isBrowser || !recognitionRef.current || isProcessing || isListening) return;
    
    setIsListening(true);
    setError(""); // Reset error on new attempt
    setFeedback(""); // Clear previous feedback
    
    try {
      recognitionRef.current.start();
    } catch (e) {
      console.error("Error starting recognition:", e);
      // Try to recover by recreating the recognition object
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = locale === "en" ? "en-US" : "he-IL";
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase().trim();
        setSpokenWord(transcript);
        setIsListening(false);
        console.log(`Spoken: "${transcript}", Expected: "${currentWordRef.current}"`);
        checkAnswer(transcript, currentWordRef.current);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
        setFeedback(t("speech.incorrect"));
        setIsProcessing(true);
        setTimeout(() => {
          setIsProcessing(false);
        }, 2000);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
      
      try {
        recognitionRef.current.start();
      } catch (e2) {
        console.error("Failed to recover speech recognition:", e2);
        setIsListening(false);
        setError(t("speech.recognitionError"));
      }
    }
  };

  const checkAnswer = (transcript: string, expectedWord: string) => {
    console.log("Checking answer:", transcript, "vs", expectedWord);
    setIsProcessing(true); // Prevent multiple clicks during processing
    
    // Calculate new attempts count
    const newAttempts = attempts + 1;
    setAttempts(prev => prev + 1);
    console.log("Attempt count updated:", newAttempts);
    
    // Strict matching - only exact match or very close match
    const isCorrect = 
      transcript.toLowerCase() === expectedWord.toLowerCase() || 
      (transcript.toLowerCase().includes(expectedWord.toLowerCase()) && 
       transcript.length <= expectedWord.length + 3);
    
    console.log("Answer correct?", isCorrect);
    
    // Check if test is complete based on attempts
    if (score >= wordList.length) {
      // Test is complete, call onComplete with final score
      setTimeout(() => {
        const finalScore = isCorrect ? score + 1 : score;
        onComplete?.({
          score: finalScore,
          metrics: {
            accuracy: (finalScore / wordList.length) * 100,
            timeInSeconds: 0,
            attempts: newAttempts
          }
        });
        setIsProcessing(false);
      }, 2000);
      
      // Still provide feedback for this answer
      if (isCorrect) {
        setScore(prev => prev + 1);
        setFeedback(t("speech.correct"));
      } else {
        setFeedback(t("speech.incorrect"));
      }
      
      return; // Exit early since test is complete
    }
    
    // Normal gameplay (not test completion)
    if (isCorrect) {
      // Update score for correct answer
      setScore(prev => prev + 1);
      setFeedback(t("speech.correct"));
      
      // Move to next word after delay (only on correct answer)
      console.log("Word was correct, scheduling move to next word");
      setTimeout(() => {
        console.log("Timeout fired, picking new random word");
        // Move to next word only on correct answer
        pickRandomWord();
        setIsProcessing(false);
        
        // If not in test mode, increment attempts for each new word
        if (isTest) {
          console.log("Incremented attempts for new word");
        }
      }, 2000);
    } else {
      // For incorrect answer, don't move to next word
      setFeedback(t("speech.incorrect"));
      
      setTimeout(() => {
        // Just allow retrying the same word
        setIsProcessing(false);
      }, 2000);
    }
  };

  // Calculate percentage for progress bar
  const progressPercentage = isTest ? (score / (isTest ? 5 : 10)) * 100 : 0;

  return (
    <div className="follow-word">
      <h1>{t("speech.title")}</h1>
      
      {error && <p className="error-message">{error}</p>}
      
      {isTest && (
        <div className="progress-bar">
          <div 
            className="progress-bar__fill"
            style={{ width: `${progressPercentage}%` }}
          ></div>
          <p className="progress-bar__text">{score}/5</p>
        </div>
      )}
      
      <div className="word-display">
        <p className="word-display__instruction">{t("speech.instruction")}</p>
        {currentWord && wordsIcons[currentWord as keyof typeof wordsIcons] ? (
          <div className="word-display__image-container">
            <Image 
              src={wordsIcons[currentWord as keyof typeof wordsIcons]} 
              alt={currentWord} 
              width={150} 
              height={150}
              className="object-contain" 
            />
            <p className="debug-text">Current word: {currentWord}</p>
            <span className="sr-only">{currentWord}</span>
          </div>
        ) : (
          <p className="word-display__word">{currentWord}</p>
        )}
      </div>
      
      {feedback && (
        <div className={`feedback ${feedback === t("speech.correct") ? 'feedback--correct' : 'feedback--incorrect'}`}>
          {feedback}
        </div>
      )}
      
      <button 
        onClick={startListening} 
        className="control-button"
        disabled={isListening || !!error || isProcessing}
      >
        {isListening ? (
          <>
            <span className="listening-indicator">●</span>
            {t("speech.listening")}
          </>
        ) : (
          <>
            <svg className="mic-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            {t("speech.startButton")}
          </>
        )}
      </button>
      
      <div className="results-panel">
        <p className="results-panel__text">
          {t("speech.youSaid")} <span className="results-panel__spoken-word">{spokenWord || "—"}</span>
        </p>
        <p className="results-panel__score">{t("speech.score")} {score} / {attempts}</p>
      </div>
    </div>
  );
};

export default FollowWord;
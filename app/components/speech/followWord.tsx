import { useState, useEffect, useRef } from "react";
import { ExerciseProps } from "@/types/props";
import useLanguageStore from "@/store/languageStore";

interface SpeechRecognitionInstance extends EventTarget {
  lang: string;
  start: () => void;
  onresult: (event: any) => void;
  onerror: (event: any) => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition: new () => SpeechRecognitionInstance;
  }
}

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const words = ["apple", "banana", "cat", "dog", "elephant"]; // List of words

const FollowWord: React.FC<ExerciseProps> = ({ onComplete, isTest, difficultyLevel }) => {
  const [currentWord, setCurrentWord] = useState("");
  const [spokenWord, setSpokenWord] = useState("");
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState("");
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const { locale } = useLanguageStore();

  useEffect(() => {
    pickRandomWord();

    // Check browser compatibility
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      setError("Speech recognition is not supported in this browser. Please use Chrome.");
    } else {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current!.lang = locale === "en" ? "en-US" : "he-IL";
      recognitionRef.current!.onresult = handleResult;
      recognitionRef.current!.onerror = handleError;
    }
  }, []);

  const pickRandomWord = () => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setCurrentWord(randomWord);
    setSpokenWord("");
  };

  const startListening = () => {
    if (!recognitionRef.current) return;
    
    setIsListening(true);
    setError(""); // Reset error on new attempt
    recognitionRef.current!.start();
  };

  const handleResult = (event: any) => {
    const transcript = event.results[0][0].transcript.toLowerCase();
    setSpokenWord(transcript);
    setIsListening(false);
    checkAnswer(transcript);
  };

  const handleError = (event: any) => {
    setIsListening(false);
    setError("Speech recognition error. Try again.");
  };

  const checkAnswer = (transcript: string) => {
    setAttempts(attempts + 1);
    if (transcript === currentWord) {
      setScore(score + 1);
    }
    setTimeout(pickRandomWord, 2000); // Move to next word after 2s
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-100 p-4">
      <h1 className="text-2xl font-bold">Speech Therapy Game</h1>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <p className="text-lg mt-2">Say the word: <span className="font-semibold">{currentWord}</span></p>
      <button 
        onClick={startListening} 
        className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg shadow-lg hover:bg-blue-700 disabled:bg-gray-400"
        disabled={isListening || !!error}
      >
        {isListening ? "Listening..." : "Start Speaking"}
      </button>
      <p className="mt-4 text-gray-700">You said: <span className="font-semibold">{spokenWord}</span></p>
      <p className="mt-4">Score: {score} / {attempts}</p>
    </div>
  );
}

export default FollowWord;
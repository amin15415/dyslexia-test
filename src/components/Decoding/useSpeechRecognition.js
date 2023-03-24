import { useState } from 'react';

export const useSpeechRecognition = () => {
  const [recognition, setRecognition] = useState(null);

  // Initialize the recognition instance if it doesn't exist.
  if (!recognition) {
    setRecognition(new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)());
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
  }

  return recognition;
};

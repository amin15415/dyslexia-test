import { useEffect, useRef, useState } from 'react';

export const useSpeechRecognition = () => {
  const recognition = useRef(null);
  const [isRecognitionInProgress, setIsRecognitionInProgress] = useState(false);

  useEffect(() => {
    if (!recognition.current) {
      recognition.current = new (window.SpeechRecognition ||
        window.webkitSpeechRecognition ||
        window.mozSpeechRecognition ||
        window.msSpeechRecognition)();

      recognition.current.continuous = false;
      recognition.current.lang = 'en-US';
      recognition.current.interimResults = false;
      recognition.current.maxAlternatives = 1;
    }
  }, []);

  const recognizeSpeech = () => {
    return new Promise((resolve, reject) => {
      if (!recognition.current) {
        reject(new Error('SpeechRecognition not available'));
        return;
      }

      recognition.onstart = () => {
        setIsRecognitionInProgress(true);
      };
      recognition.onend = () => {
        setIsRecognitionInProgress(false);
      };

      recognition.current.onresult = (event) => {
        const speechResult = event.results[0][0].transcript;
        resolve(speechResult);
      };

      recognition.current.onerror = (event) => {
        reject(event.error);
      };
      
      recognition.current.start();
    });
  };

  const stopSpeechRecognition = () => {
    if (recognition.current) {
      recognition.current.stop();
    }
  };

  return {
    isRecognitionInProgress,
    recognizeSpeech,
    stopSpeechRecognition,
  };
};

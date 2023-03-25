import { useState, useEffect } from 'react';

export const useSpeechRecognition = () => {
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if (!recognition) {
      const newRecognition = new (window.SpeechRecognition ||
        window.webkitSpeechRecognition ||
        window.mozSpeechRecognition ||
        window.msSpeechRecognition)();

      newRecognition.lang = 'en-US';
      newRecognition.interimResults = false;
      newRecognition.maxAlternatives = 1;

      setRecognition(newRecognition);
    }
  }, [recognition]);

  const recognizeSpeech = () => {
    return new Promise((resolve, reject) => {
      if (!recognition) {
        reject(new Error('SpeechRecognition not available'));
        return;
      }

      recognition.onresult = (event) => {
        const speechResult = event.results[0][0].transcript;
        resolve(speechResult);
      };

      recognition.onerror = (event) => {
        reject(event.error);
      };

      recognition.start();
    });
  };

  return recognizeSpeech;
};
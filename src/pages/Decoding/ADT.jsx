import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { adtWords } from '../../data/adt-data';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition'; 
import convertNumberToWords from '../../utils/numToWord';
import AudioVisualizer from '../../components/AudioVisualizer';
import './Decoding.css';

const ADT = () => {
  const navigate = useNavigate();
  const [hasMicPermission, setHasMicPermission] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [gradeIndex, setGradeIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [wrongAboveGradeLevel, setWrongAboveGradeLevel] = useState(0);
  const [frozenWrongAboveGradeLevel, setFrozenWrongAboveGradeLevel] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isLastWord, setIsLastWord] = useState(false);
  const [buttonActive, setButtonActive] = useState(false);
  const [readingLevel, setReadingLevel] = useState(null);
  const [gradeLevel, setGradeLevel] = useState(adtWords[gradeIndex].grade);
  const [words, setWords] = useState(Object.keys(adtWords[gradeIndex].words));
  const [currentWord, setCurrentWord] = useState(words[wordIndex]);
  const lastGradeIndex = adtWords.length - 1;
  const lastWordIndex = Object.keys(adtWords[lastGradeIndex].words).length - 1;

  const [countdown, setCountdown] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const speechRecognition = useSpeechRecognition();
  const [speechResultReceived, setSpeechResultReceived] = useState(false);
  const [retryMessage, setRetryMessage] = useState('');
  let speechResult;

  const requestMicPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (stream) {
        setHasMicPermission(true);
        stream.getTracks().forEach((track) => track.stop());
      }
    } catch (err) {
      console.error('Error getting microphone access:', err);
      alert('No microphone detected. Please connect a microphone to use this app.');
    }
  };

  useEffect(() => {
    requestMicPermission();
  }, []);

  const startDecoding = async () => {
    if (!hasMicPermission) {
      await requestMicPermission();
    }

    if (hasMicPermission) {
      setIsStarted(true);
      handleNextWord();
    }
  };

  const handleNextWord = async () => {
    setButtonActive(false);
    setSpeechResultReceived(false);
    setRetryMessage('');
	  setCountdown(3);

    try {
		  const speechRecognitionPromise = speechRecognition.recognizeSpeech();
		  const countdownPromise = new Promise((resolve) => {
		  const timer = setInterval(() => {
			setCountdown((count) => {
			  if (count === 1) {
				clearInterval(timer);
				resolve();
			  }
			  return count - 1;
			  });
		    }, 1000);
		  });
      
		  const [speechReturn] = await Promise.all([speechRecognitionPromise, countdownPromise]);
      speechResult = convertNumberToWords(speechReturn).toLowerCase();
      setSpeechResultReceived(true);
      console.log('Speech result:', speechResult);
	  } catch (error) {
      console.error('Speech recognition error:', error);
      return;
    }

    let isCorrect;
    if (currentWord === 'know') {
      isCorrect = speechResult === 'no' || speechResult === 'know'
    } else if (currentWord === 'could') {
      isCorrect = speechResult === 'could' || speechResult === "couldn't"
    }else if (currentWord === 'meadow') {
      isCorrect = speechResult === 'metal' || speechResult === 'meadow'
    } else if (currentWord === 'islet') {
      isCorrect = speechResult === 'eyelet' || speechResult === 'islet'
    } else {
      isCorrect = speechResult === currentWord;
    }
    const updatedCorrect = isCorrect ? correct + 1 : correct;
    const updatedWrong = !isCorrect ? wrong + 1 : wrong;
    const lastWordReached = gradeIndex === lastGradeIndex && wordIndex === lastWordIndex;

    setIsLastWord(lastWordReached);
    setCorrect(updatedCorrect);
    setWrong(updatedWrong);
    setWrongAboveGradeLevel((prevWrongAboveGradeLevel) => {
        if (!frozenWrongAboveGradeLevel && !isCorrect) {
          return prevWrongAboveGradeLevel + 1;
        } else {
          return prevWrongAboveGradeLevel;
        }
    });
    setWordIndex((prevState) => prevState + 1);
    adtWords[gradeIndex].words[currentWord] = isCorrect;
  };

  useEffect(() => {
    setGradeLevel(adtWords[gradeIndex].grade);
    setWords((prevWords) => {
      const newWords = Object.keys(adtWords[gradeIndex].words);
      setCurrentWord(newWords[wordIndex]);
      return newWords;
    });
  }, [gradeIndex, wordIndex]);
  
  const handleLogic = useCallback(() => {
    if (adtWords[gradeIndex] && correct >= words.length / 2) {
      setReadingLevel(adtWords[gradeIndex].level);
      setWrongAboveGradeLevel(0);
      setFrozenWrongAboveGradeLevel(true);
    }

    if (wrong >= words.length / 2 && wrongAboveGradeLevel >= words.length && wordIndex >= words.length) {
      setTimeout(() => {
        navigate('/eidetic', { state: { testWords: adtWords, gradeIndex: gradeIndex, readingLevel: readingLevel, test: 'ADT' } });
      }, 500);
    }

    if (isLastWord) {
        navigate('/eidetic', { state: { adtWords: adtWords } });
    }
  }, [correct, gradeIndex, isLastWord, navigate, wrongAboveGradeLevel, wordIndex, wrong, words, readingLevel]);

  useEffect(() => {
    handleLogic();
  }, [handleLogic]);

  useEffect(() => {
    if (wordIndex >= lastWordIndex + 1) {
      if (gradeIndex < adtWords.length - 1) {
        setGradeIndex((prevState) => (prevState + 1 ));
        setFrozenWrongAboveGradeLevel(false);
        setWrongAboveGradeLevel(0);
      }
      setCorrect(0)
      setWrong(0);
      setWordIndex(0)
    }
  }, [wordIndex, gradeIndex, lastWordIndex]);

  useEffect(() => {
    console.log(`current word: ${words[wordIndex]} word index: ${wordIndex}, grade index: ${gradeIndex}, 
                grade level: ${gradeLevel}, correct: ${correct}, wrong: ${wrong}, 
                wrong above grade level: ${wrongAboveGradeLevel}, reading level: ${readingLevel}
                is_paused: ${isPaused}`);
  }, [words, wordIndex, gradeIndex, gradeLevel, correct, wrong, wrongAboveGradeLevel, readingLevel, isPaused]);

  useEffect(() => {
    if (isStarted) {
      if (countdown > 0) {
        const timer = setTimeout(() => {
          setCountdown(countdown - 1);
        }, 1000);
        return () => clearTimeout(timer);
      } 
      else {
        if (!speechResultReceived) {
          speechRecognition.stopSpeechRecognition();
          setIsPaused(true);
          setTimeout(() => {
            setIsPaused(false);
          }, 1000);
        }
        if (speechResultReceived) {
          setButtonActive(true);
          setRetryMessage(''); 
        }
        else {
        setRetryMessage("We didn't quite catch that. Please try again.");
        setButtonActive(true);
        } 
      }
    }
  }, [countdown, setCountdown, isStarted, speechResultReceived, speechRecognition]);

  return (
    <div className="centered-content">
      <div className="decoding-content">
        {!isPaused && isStarted && !isLastWord && buttonActive ? (
                <div className="button-container">
                  <div>
                    {retryMessage && <p>{retryMessage}</p>}
                    <button onClick={handleNextWord}>{retryMessage ? 'Try Again' : 'Next Word'}</button>
                  </div>
                </div>
              ) : null }
        {!isStarted && (
              <div className="button-container">
                <div>
                <button onClick={startDecoding}>Start</button>
                </div>
              </div>
            )}
        {!buttonActive && isStarted && (
              <>
                <p className='custom-p'>Say this word: </p>
                <h2 className='custom-h2'>{currentWord}</h2>
                <AudioVisualizer isActive={(true)} countdownValue={countdown} size="300"/>
              </>
            )}
      </div>
    </div>
  );
  
};

export default ADT;

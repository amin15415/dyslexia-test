import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { desdWords } from '../../data/data';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition'; 
import convertNumberToWords from '../../utils/numToWord';
import AudioVisualizer from '../../components/AudioVisualizer';
import './Decoding.css';

const Decoding = () => {
  const navigate = useNavigate();
  const [wordIndex, setWordIndex] = useState(0);
  const [gradeIndex, setGradeIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [totalWrong, setTotalWrong] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isLastWord, setIsLastWord] = useState(false);
  const [buttonActive, setButtonActive] = useState(false);
  const [readingLevel, setReadingLevel] = useState(null);
  const [gradeLevel, setGradeLevel] = useState(desdWords[gradeIndex].grade);
  const [words, setWords] = useState(Object.keys(desdWords[gradeIndex].words));
  const [currentWord, setCurrentWord] = useState(words[wordIndex]);
  const lastGradeIndex = desdWords.length - 1;
  const lastWordIndex = Object.keys(desdWords[lastGradeIndex].words).length - 1;

  const [countdown, setCountdown] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const speechRecognition = useSpeechRecognition();
  const [speechResultReceived, setSpeechResultReceived] = useState(false);
  const [retryMessage, setRetryMessage] = useState('');
  let speechResult;

  const startDecoding = () => {
    setIsStarted(true);
    handleNextWord();
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
  
		  [speechResult] = await Promise.all([speechRecognitionPromise, countdownPromise]);
      setSpeechResultReceived(true);
      console.log('Speech result:', speechResult);
      speechRecognition.stopSpeechRecognition();
	  } catch (error) {
      console.error('Speech recognition error:', error);
      return;
    }

    const isCorrect = convertNumberToWords(speechResult).toLowerCase() === currentWord.toLowerCase();
    const updatedCorrect = isCorrect ? correct + 1 : correct;
    const updatedWrong = !isCorrect ? wrong + 1 : wrong;
    const updatedTotalWrong = !isCorrect ? totalWrong + 1 : totalWrong;
    const lastWordReached = gradeIndex === lastGradeIndex && wordIndex === lastWordIndex;

    setIsLastWord(lastWordReached);
    setCorrect(updatedCorrect);
    setWrong(updatedWrong);
    setTotalWrong(updatedTotalWrong);
    setWordIndex((prevState) => prevState + 1);
    desdWords[gradeIndex].words[currentWord] = isCorrect;
  };

  useEffect(() => {
    setGradeLevel(desdWords[gradeIndex].grade);
    setWords((prevWords) => {
      const newWords = Object.keys(desdWords[gradeIndex].words);
      setCurrentWord(newWords[wordIndex]);
      return newWords;
    });
  }, [gradeIndex, wordIndex]);
  
  const handleLogic = useCallback(() => {
    if (desdWords[gradeIndex] && correct >= 3) {
      setReadingLevel(desdWords[gradeIndex].grade);
    }

    if (wrong >= 3 && totalWrong >= 5 && wordIndex >= 5) {
      setTimeout(() => {
        navigate('/encoding', { state: { desdWords: desdWords } });
      }, 500);
    }

    if (isLastWord) {
        navigate('/encoding', { state: { desdWords: desdWords } });
    }
  }, [correct, gradeIndex, isLastWord, navigate, totalWrong, wordIndex, wrong]);

  useEffect(() => {
    handleLogic();
  }, [handleLogic]);

  useEffect(() => {
    if (wordIndex >= 5) {
      if (gradeIndex < desdWords.length - 1) {
        setGradeIndex((prevState) => (prevState + 1 ));
      }
      setCorrect(0)
      setWrong(0);
      setWordIndex(0)
    }
  }, [wordIndex, gradeIndex]);

  useEffect(() => {
    console.log(`current word: ${words[wordIndex]} word index: ${wordIndex}, grade index: ${gradeIndex}, 
                grade level: ${gradeLevel}, correct: ${correct}, wrong: ${wrong}, 
                total wrong: ${totalWrong}, reading level: ${readingLevel}
                is_paused: ${isPaused}`);
  }, [words, wordIndex, gradeIndex, gradeLevel, correct, wrong, totalWrong, readingLevel, isPaused]);

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
  }, [countdown, setCountdown, isStarted, speechResultReceived]);

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
                <AudioVisualizer isStarted={isStarted} buttonActive={buttonActive} countdownValue={countdown} size="300"/>
              </>
            )}
      </div>
    </div>
  );
  
};

export default Decoding;

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { desdWords } from './data';
import { useSpeechRecognition } from './useSpeechRecognition';
import { useCountdown } from './useCountdown.js';

const Decoding = () => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    wordIndex: 0,
    gradeIndex: 9,
    gradeLevel: desdWords[9].grade,
    readingLevel: null,
    buttonActive: false,
    isStarted: false,
    correct: 0,
    wrong: 0,
    totalWrong: 0,
    isLastWord: false,
    noSpeechDetected: false,
    retry: false,
  });

  const { wordIndex, gradeIndex, gradeLevel, readingLevel, buttonActive, isStarted, correct, wrong, totalWrong, isLastWord, noSpeechDetected, retry } = state;
  const words = Object.keys(desdWords[gradeIndex].words);
  const currentWord = words[wordIndex];
  const recognizeSpeech = useSpeechRecognition();
  const { countdown, setCountdown } = useCountdown({ initialCountdown: 4 });

  const startDecoding = () => {
    setState((prevState) => ({ ...prevState, isStarted: true }));
	setCountdown(4);
    handleNextWord();
  };

  const handleNextWord = async () => {
    setState((prevState) => ({
      ...prevState,
      buttonActive: false,
      noSpeechDetected: false,
    }));

	setCountdown(4);
    let speechResult;

    try {
		// Run the countdown and the speech recognition simultaneously
		const speechRecognitionPromise = recognizeSpeech();
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
  
		// Wait for both the countdown and the speech recognition to complete
		[speechResult] = await Promise.all([speechRecognitionPromise, countdownPromise]);
	  } catch (error) {
      console.error('Speech recognition error:', error);
      setState((prevState) => ({ ...prevState, noSpeechDetected: true, retry: true }));
      return;
    }

    console.log('Speech result:', speechResult);

    const isCorrect = speechResult.toLowerCase() === currentWord.toLowerCase();
    const updatedCorrect = isCorrect ? correct + 1 : correct;
    const updatedWrong = !isCorrect ? wrong + 1 : wrong;
    const updatedTotalWrong = !isCorrect ? totalWrong + 1 : totalWrong;

    setState((prevState) => ({
      ...prevState,
      correct: updatedCorrect,
      wrong: updatedWrong,
      totalWrong: updatedTotalWrong,
    }));

    setState((prevState) => {
      const nextWordIndex = prevState.wordIndex + 1;
      const lastWordReached = words[nextWordIndex - 1] === 'liquidate';

      return {
        ...prevState,
        wordIndex: nextWordIndex,
        isLastWord: lastWordReached,
      };
    });
  };

  const handleLogic = useCallback(() => {
    if (desdWords[gradeIndex] && correct >= 3) {
      setState((prevState) => ({ ...prevState, readingLevel: desdWords[gradeIndex].grade }));
    }

    if (wrong >= 3 && totalWrong >= 5 && wordIndex >= 5) {
      setTimeout(() => {
        navigate('/encoding');
      }, 1000);
    }

    if (isLastWord) {
        navigate('/encoding');
    }
  }, [correct, desdWords, gradeIndex, isLastWord, navigate, totalWrong, wordIndex, wrong]);

  useEffect(() => {
    handleLogic();
  }, [handleLogic]);

  useEffect(() => {
    if (wordIndex >= 5) {
      if (gradeIndex < desdWords.length - 1) {
        setState((prevState) => ({ ...prevState, gradeIndex: gradeIndex + 1 }));
      }
      setState((prevState) => ({ ...prevState, wordIndex: 0, correct: 0, wrong: 0 }));
    }
  }, [wordIndex]);

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      gradeLevel: desdWords[gradeIndex].grade,
      words: Object.keys(desdWords[gradeIndex].words),
    }));
  }, [gradeIndex]);

  useEffect(() => {
    console.log(`current word: ${words[wordIndex]} word index: ${wordIndex}, grade index: ${gradeIndex}, 
                grade level: ${gradeLevel}, correct: ${correct}, wrong: ${wrong}, 
                total wrong: ${totalWrong}, reading level: ${readingLevel}`);
  }, [words, wordIndex, gradeIndex, gradeLevel, correct, wrong, totalWrong, readingLevel]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setState((prevState) => ({ ...prevState, buttonActive: true }));
    }
  }, [countdown, setCountdown]);

  return (
		<div>
		  <h1>Online DESD</h1>
		  {isStarted ? (
			!isLastWord && buttonActive ? (
			  <button onClick={handleNextWord}>Next Word</button>
			) : (
			  <p>Next Word will be available in {countdown} seconds</p>
			)
		  ) : (
			<button onClick={startDecoding}>Start</button>
		  )}
		  {!buttonActive && isStarted && (
			<>
			  <p>Say this word: </p>
			  <h2>{currentWord}</h2>
			</>
		  )}
		</div>
	  );
};

export default Decoding;

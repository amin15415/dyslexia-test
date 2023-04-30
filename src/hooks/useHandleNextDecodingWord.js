import { useState, useEffect, useCallback } from 'react';
import { useSpeechRecognition } from './useSpeechRecognition';
import convertNumberToWords from '../utils/numToWord';
import { useNavigate } from 'react-router-dom';

export const useHandleNextDecodingWord = ({ startCountdown, 
                                            countdownPromise,
                                            setRetryMessage,
                                            setSpeechResultReceived,
                                            testWords,
                                            isPaused,
                                            setButtonActive  }) => {
    const navigate = useNavigate();
    const [wordIndex, setWordIndex] = useState(0);
    const [levelIndex, setLevelIndex] = useState(0);
    const [correct, setCorrect] = useState(0);
    const [wrong, setWrong] = useState(0);
    const [wrongAboveCurrentLevel, setWrongAboveCurrentLevel] = useState(0);
    const [frozenWrongAboveCurrentLevel, setFrozenWrongAboveCurrentLevel] = useState(false);
    const [isLastWord, setIsLastWord] = useState(false);
    const [readingLevel, setReadingLevel] = useState(null);
    const [currentLevel, setCurrentLevel] = useState(testWords[levelIndex].level);
    const [words, setWords] = useState(Object.keys(testWords[levelIndex].words));
    const [currentWord, setCurrentWord] = useState(words[wordIndex]);
    const lastLevelIndex = testWords.length - 1;
    const lastWordIndex = Object.keys(testWords[lastLevelIndex].words).length - 1;
    const speechRecognition = useSpeechRecognition();
    let speechResult;

    const nextDecodingWord = async () => {
        setButtonActive(false);
        setSpeechResultReceived(false);
        setRetryMessage('');

        try {
            const speechRecognitionPromise = speechRecognition.recognizeSpeech();
            startCountdown(3);
            const [speechReturn] = await Promise.all([speechRecognitionPromise, countdownPromise]);
            speechResult = convertNumberToWords(speechReturn).toLowerCase();
            setSpeechResultReceived(true);
            console.log('Speech result:', speechResult);
        } catch (error) {
            console.error('Speech recognition error:', error);
            return;
        }

        let isCorrect;
        if (currentWord === 'clique') {
            isCorrect = speechResult === 'click' || speechResult === 'clique'
        } else if (currentWord === 'know') {
            isCorrect = speechResult === 'no' || speechResult === 'know'
        } else if (currentWord === 'could') {
            isCorrect = speechResult === 'could' || speechResult === "couldn't"
        } else if (currentWord === 'meadow') {
            isCorrect = speechResult === 'metal' || speechResult === 'meadow'
        } else if (currentWord === 'glisten') {
            isCorrect = speechResult === 'listen' || speechResult === 'glisten'
        } else if (currentWord === 'toughen') {
            isCorrect = speechResult === 'toughen' || speechResult === 'puffin'
        } else if (currentWord === 'islet') {
            isCorrect = speechResult === 'eyelet' || speechResult === 'islet'
        } else if (currentWord === 'leitmotif') {
            isCorrect = speechResult === 'leitmotiv' || speechResult === 'leitmotif'
        } else {
            isCorrect = speechResult === currentWord;
        }
        const updatedCorrect = isCorrect ? correct + 1 : correct;
        const updatedWrong = !isCorrect ? wrong + 1 : wrong;
        const lastWordReached = levelIndex === lastLevelIndex && wordIndex === lastWordIndex;

        setIsLastWord(lastWordReached);
        setCorrect(updatedCorrect);
        setWrong(updatedWrong);
        setWrongAboveCurrentLevel((prevWrongAboveCurrentLevel) => {
            if (!frozenWrongAboveCurrentLevel && !isCorrect) {
            return prevWrongAboveCurrentLevel + 1;
            } else {
            return prevWrongAboveCurrentLevel;
            }
        });
        setWordIndex((prevState) => prevState + 1);
        testWords[levelIndex].words[currentWord] = isCorrect;
    };

    useEffect(() => {
        setCurrentLevel(testWords[levelIndex].level);
        setWords((prevWords) => {
        const newWords = Object.keys(testWords[levelIndex].words);
        setCurrentWord(newWords[wordIndex]);
        return newWords;
        });
    }, [levelIndex, wordIndex, testWords]);


    const handleLogic = useCallback(() => {
        if (testWords[levelIndex] && correct >= words.length / 2) {
          setReadingLevel(testWords[levelIndex].level);
          setWrongAboveCurrentLevel(0);
          setFrozenWrongAboveCurrentLevel(true);
        }
    
        if (wrong >= words.length / 2 && wrongAboveCurrentLevel >= words.length && wordIndex >= words.length) {
          setTimeout(() => {
            navigate('/eidetic', { state: { testWords: testWords, levelIndex: levelIndex, readingLevel: readingLevel, test: 'ADT' } });
          }, 500);
        }
    
        if (isLastWord) {
            navigate('/completed', { state: { testWords: testWords } });
        }
      }, [correct, levelIndex, isLastWord, navigate, wrongAboveCurrentLevel, wordIndex, wrong, words, readingLevel, testWords]);
    
      useEffect(() => {
        handleLogic();
      }, [handleLogic]);
    
      useEffect(() => {
        if (wordIndex >= lastWordIndex + 1) {
          if (levelIndex < testWords.length - 1) {
            setLevelIndex((prevState) => (prevState + 1 ));
            setFrozenWrongAboveCurrentLevel(false);
            setWrongAboveCurrentLevel(0);
          }
          setCorrect(0)
          setWrong(0);
          setWordIndex(0)
        }
      }, [wordIndex, levelIndex, lastWordIndex, testWords]);
    
      useEffect(() => {
        console.log(`current word: ${words[wordIndex]} word index: ${wordIndex}, grade index: ${levelIndex}, 
                    grade level: ${currentLevel}, correct: ${correct}, wrong: ${wrong}, 
                    wrong above grade level: ${wrongAboveCurrentLevel}, reading level: ${readingLevel}
                    is_paused: ${isPaused}`);
      }, [words, wordIndex, levelIndex, currentLevel, correct, wrong, wrongAboveCurrentLevel, readingLevel, isPaused]);

    return [nextDecodingWord, currentWord, isLastWord];
};



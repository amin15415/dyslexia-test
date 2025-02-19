import { useState, useEffect, useCallback, useRef } from 'react';
import { useSpeechRecognition } from './useSpeechRecognition';
import convertNumberToWords from '../utils/numToWord';
import { useNavigate } from 'react-router-dom';
import { useSessionStorage } from './useSessionStorage';
import { wordHomophones } from '../data/TestWords';

export const useHandleDecodingLogic = ({ startCountdown, 
                                        stopCountdown,
                                        countdownPromise,
                                        countdownFinished,
                                        setSpeechResultReceived,
                                        setRetryMessage,
                                        isPaused,
                                        setButtonActive, 
                                        setError, 
                                        setIsTranscribing,
                                        setIsStarted,
                                        audioStream,
                                        setUserHasSpoken,
                                        userHasSpoken  }) => {

    const isProcessedPreCountdown = useRef(false);

    const navigate = useNavigate();
    const [testWords, setTestWords] = useSessionStorage('testWords', '');
    const [speechWords, setSpeechWords] = useSessionStorage('speechWords', {});

    const [wordIndex, setWordIndex] = useSessionStorage('wordIndex', 0);
    const [levelIndex, setLevelIndex] = useSessionStorage('levelIndex', 0);
    const [correct, setCorrect] = useSessionStorage('correct', 0);
    const [wrong, setWrong] = useSessionStorage('wrong', 0);
    const [wrongAboveCurrentLevel, setWrongAboveCurrentLevel] = useSessionStorage('wrongAboveCurrentLevel', 0);
    const [frozenWrongAboveCurrentLevel, setFrozenWrongAboveCurrentLevel] = useSessionStorage('frozenWrongAboveCurrentLevel', false);
    const [isLastWord, setIsLastWord] = useSessionStorage('isLastWord', false);
    const [readingLevel, setReadingLevel] = useSessionStorage('readingLevel', null);
    const [currentLevel, setCurrentLevel] = useState(testWords[levelIndex].level);
    const [words, setWords] = useState(Object.keys(testWords[levelIndex].words));
    const [currentWord, setCurrentWord] = useState(words[wordIndex]);
    const lastLevelIndex = testWords.length - 1;
    const lastWordIndex = Object.keys(testWords[lastLevelIndex].words).length - 1;
    const {startRecording, stopRecordingAndTranscribe, transcription, transcriptionError, isRecording, stopRecording} = useSpeechRecognition(audioStream);
    const totalWords = testWords.reduce((total, level) => total + Object.keys(level.words).length, 0);
    const progress = ((levelIndex * words.length) + wordIndex) / totalWords * 100;

    let speechResult;

    useEffect(() => {
        return () => {
            if (audioStream.current) {
                const audioTracks = audioStream.current.getTracks();
                audioTracks.forEach((track) => track.stop());
            }
        }
    },[])

    // check if the recording is started so as to start count down
    useEffect(() => {

        if (isRecording) {
            setButtonActive(false);
            setIsStarted(true)
            startCountdown(3);
        }
    } , [isRecording])

    // check if the countdown is finished
    useEffect(() => {
        if (countdownFinished && !isProcessedPreCountdown.current) {
            stopRecordingAndTranscribe();
            setIsTranscribing(true);
        }
    } , [countdownFinished])

    // check if the user has spoken
    useEffect(() => {
        if (!countdownFinished && userHasSpoken) {
            isProcessedPreCountdown.current = true;
            stopRecordingAndTranscribe();
            setIsTranscribing(true);
            setUserHasSpoken(false);
            stopCountdown();
        }
    } , [userHasSpoken])

    // check if transcription is received
    useEffect(() => {
        if (transcription) {
            setIsTranscribing(false);
            isProcessedPreCountdown.current = false;
            checkTranscription();
        }
    } , [transcription])

    // check for transcription error
    useEffect(() => {
        if (transcriptionError) {
            setIsTranscribing(false);
            isProcessedPreCountdown.current = false;
            setButtonActive(true);
            setError(transcriptionError);
            console.error('Speech recognition error:', transcriptionError);
        }
    } , [transcriptionError])


    const checkTranscription = async () => {
        
        if (transcription && transcription !== '') {

            setSpeechResultReceived(true);
            speechResult = transcription.toLowerCase();
            console.log('Speech result:', speechResult);


            let isCorrect;
            isCorrect = speechResult.includes(currentWord) || wordHomophones[currentWord] && wordHomophones[currentWord].includes(speechResult); 
            console.log('is correct: ' + isCorrect);
            // if (currentWord === 'clique') {
            //     isCorrect = speechResult === 'click' || speechResult === 'clique'
            // } else if (currentWord === 'know') {
            //     isCorrect = speechResult === 'no' || speechResult === 'know'
            // } else if (currentWord === 'could') {
            //     isCorrect = speechResult === 'could' || speechResult === "couldn't"
            // } else if (currentWord === 'meadow') {
            //     isCorrect = speechResult === 'metal' || speechResult === 'meadow'
            // } else if (currentWord === 'glisten') {
            //     isCorrect = speechResult === 'listen' || speechResult === 'glisten'
            // } else if (currentWord === 'toughen') {
            //     isCorrect = speechResult === 'toughen' || speechResult === 'puffin'
            // } else if (currentWord === 'islet') {
            //     isCorrect = speechResult === 'eyelet' || speechResult === 'islet'
            // } else if (currentWord === 'leitmotif') {
            //     isCorrect = speechResult === 'leitmotiv' || speechResult === 'leitmotif'
            // } else {
            //     isCorrect = speechResult === currentWord;
            // }
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
            // set the speech recognized word in a parallel data
            if (!speechWords[levelIndex]) speechWords[levelIndex] = {};
            if (!speechWords[levelIndex].words) speechWords[levelIndex].words = {};
            if (!speechWords[levelIndex].words[currentWord]) speechWords[levelIndex].words[currentWord] = {};
            speechWords[levelIndex].words[currentWord] = {isCorrect: isCorrect , speech: speechResult };
        }
    }

    const nextDecodingWord = async () => {
        isProcessedPreCountdown.current = false;
        setUserHasSpoken(false);

        setError(null);
        setSpeechResultReceived(false);
        setRetryMessage('');

        startRecording();

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
          setTestWords(testWords);
          setSpeechWords(speechWords);
          navigate('/eidetic');
        }

        if (isLastWord) {
            navigate('/completed');
        }
      }, [correct, levelIndex, isLastWord, navigate, wrongAboveCurrentLevel, wordIndex, wrong, words, testWords, speechWords, setTestWords, setFrozenWrongAboveCurrentLevel, setReadingLevel, setWrongAboveCurrentLevel]);
    
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
      }, [wordIndex, levelIndex, lastWordIndex, testWords, setCorrect, setFrozenWrongAboveCurrentLevel, setLevelIndex, setWordIndex, setWrong, setWrongAboveCurrentLevel]);
    
      useEffect(() => {
        console.log(`current word: ${words[wordIndex]} word index: ${wordIndex}, grade index: ${levelIndex}, 
                    grade level: ${currentLevel}, correct: ${correct}, wrong: ${wrong}, 
                    wrong above grade level: ${wrongAboveCurrentLevel}, reading level: ${readingLevel}
                    is_paused: ${isPaused}`);
      }, [words, wordIndex, levelIndex, currentLevel, correct, wrong, wrongAboveCurrentLevel, readingLevel, isPaused]);

    return [nextDecodingWord, currentWord, isLastWord, progress];
};



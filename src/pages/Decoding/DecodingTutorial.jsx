import React, { useEffect, useRef, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import WordByWordTyping from '../../components/WordByWordFadeTyping';
import AudioVisualizer from '../../components/AudioVisualizer';
import { useRequestMicPermission } from '../../hooks/useRequestMicPermission';
import { useCountdown } from '../../hooks/useCountdown';
import { useSpeechRecognition11 } from '../../hooks/useSpeechRecognition11';
import './Decoding.css';

const DecodingTutorial = ({ setIsTutorial }) => {
  const [animationPhase, setAnimationPhase] = useState(0);
  const [instruction1Typed, setInstruction1Typed] = useState(false);
  const [instruction2Typed, setInstruction2Typed] = useState(false);
  const [successMessageTyped, setSuccessMessageTyped] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [showTestWord, setShowTestWord] = useState(false);
  const [userHasSpoken, setUserHasSpoken] = useState(false);
  const [speechResultReceived, setSpeechResultReceived] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [demoCount, setDemoCount] = useState(3);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState(null);
  const [isStarted, setIsStarted] = useState(false);
  const [showVisualizer, setShowVisualizer] = useState(false);
  const [tutorialCompleted, setTutorialCompleted] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const instructionAudioRef1 = useRef();
  const instructionAudioRef2 = useRef();
  const instructionAudioRef3 = useRef();
  const audioStream = useRef(null);
  const audioAnalyser = useRef(null);
  const isProcessedPreCountdown = useRef(false);
  
  const [count, startCountdown, stopCountdown, countdownPromise, countdownFinished] = useCountdown();
  const [hasMicPermission, requestMicPermission] = useRequestMicPermission(audioStream);
  const { startRecording, stopRecordingAndTranscribe, transcription, transcriptionError, isRecording, stopRecording } = useSpeechRecognition11(audioStream);

  const startTutorial = () => {
    setAnimationPhase(1);
    setInstruction1Typed(true);
    instructionAudioRef1.current.play();
  };

  const playInstruction2 = () => {
    setAnimationPhase(3);
    setInstruction2Typed(true);
    instructionAudioRef2.current.play();
  };

  const playSuccessMessage = () => {
    setSuccessMessageTyped(true);
    if (instructionAudioRef3.current) {
      instructionAudioRef3.current.play();
    } else {
      console.error("Success audio element not found");
      setTimeout(() => setIsTutorial(false), 3000);
    }
  };

  // Handle audio completion for success message
  const handleSuccessMessageEnd = () => {
    setIsPlaying(false);
    setTimeout(() => setIsTutorial(false), 500);
  };

  // Demo countdown
  useEffect(() => {
    let timer;
    if (showDemo && demoCount > 0) {
      timer = setTimeout(() => setDemoCount(demoCount - 1), 1000);
    } else if (showDemo && demoCount === 0) {
      setTimeout(() => {
        setShowDemo(false);
        setDemoCount(3); // Reset for next time
        playInstruction2();
      }, 500);
    }
    return () => clearTimeout(timer);
  }, [showDemo, demoCount]);

  // Handle audio completion for first instruction
  const handleInstruction1End = () => {
    setIsPlaying(false);
    setShowDemo(true);
  };

  // Handle audio completion for second instruction
  const handleInstruction2End = () => {
    setIsPlaying(false);
    setAnimationPhase(4);
  };

  // Initialize audio analyzer when stream is available
  useEffect(() => {
    if (audioStream.current) {
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const newAnalyser = audioContext.createAnalyser();
        audioAnalyser.current = newAnalyser;
        const source = audioContext.createMediaStreamSource(audioStream.current);
        source.connect(newAnalyser);
        console.log("Audio analyzer initialized");
      } catch (err) {
        console.error("Error initializing audio analyzer:", err);
      }
    }
  }, [audioStream.current]);

  // Handle recording state
  useEffect(() => {
    if (isRecording) {
      setShowVisualizer(true);
      startCountdown(3);
    }
  }, [isRecording]);

  // Handle countdown finish
  useEffect(() => {
    if (countdownFinished && !isProcessedPreCountdown.current) {
      isProcessedPreCountdown.current = true;
      stopRecordingAndTranscribe();
      setIsTranscribing(true);
      setShowVisualizer(false);
    }
  }, [countdownFinished]);

  // Handle user speaking
  useEffect(() => {
    if (userHasSpoken) {
      isProcessedPreCountdown.current = true;
      stopRecordingAndTranscribe();
      setIsTranscribing(true);
      setUserHasSpoken(false);
      stopCountdown();
      setShowVisualizer(false);
    }
  }, [userHasSpoken]);

  // Handle transcription result
  useEffect(() => {
    if (transcription) {
      setIsTranscribing(false);
      isProcessedPreCountdown.current = false;
      checkTranscription();
    }
  }, [transcription]);

  // Handle transcription error
  useEffect(() => {
    if (transcriptionError) {
      setIsTranscribing(false);
      isProcessedPreCountdown.current = false;
      setError("Sorry, we couldn't understand what you said. Please try again.");
      setTimeout(() => {
        setShowTestWord(false);
        setError(null);
      }, 2000);
    }
  }, [transcriptionError]);

  // Clean up audio analyzer on unmount
  useEffect(() => {
    return () => {
      if (audioAnalyser.current) {
        try {
          audioAnalyser.current.disconnect();
        } catch (err) {
          console.error("Error disconnecting analyzer:", err);
        }
      }
    };
  }, []);

  const checkTranscription = () => {
    if (transcription && transcription !== '') {
      setSpeechResultReceived(true);
      const speechResult = transcription.toLowerCase();
      const firstSpeechWord = speechResult.replace(/\./g, "").trim().split(' ')[0];
      console.log('Speech result:', firstSpeechWord);
      
      const isCorrect = firstSpeechWord === 'cat';
      setIsCorrect(isCorrect);
      
      if (isCorrect) {
        setShowTestWord(false);
        setShowSuccessMessage(true);
        setTimeout(() => playSuccessMessage(), 100);
      } else {
        setTimeout(() => {
          setShowTestWord(false);
          setSpeechResultReceived(false);
        }, 2000);
      }
    }
  };

  const startTestWord = async () => {
    console.log("Starting test word...");
    
    try {
      // First ensure we have microphone permission
      if (!hasMicPermission) {
        console.log("Requesting mic permission...");
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioStream.current = stream;
        await requestMicPermission();
      }
      
      // Mark tutorial as completed when first attempting the test word
      setTutorialCompleted(true);
      
      // Reset states
      setError(null);
      setSpeechResultReceived(false);
      setUserHasSpoken(false);
      isProcessedPreCountdown.current = false;
      setShowTestWord(true);
      
      console.log("Starting recording...");
      await startRecording();
      console.log("Recording started successfully");
      
    } catch (err) {
      console.error("Error in startTestWord:", err);
      setError("Failed to start recording. Please ensure microphone access is allowed.");
    }
  };

  return (
    <Stack sx={{px: "10px"}} justifyContent="center" alignItems="center" spacing={2}>
      <audio 
        ref={instructionAudioRef1} 
        src={require('../../assets/audio/decoding-instruction-1.mp3')}
        onPlay={() => setIsPlaying(true)}
        onEnded={handleInstruction1End}
        style={{display: 'none'}}
      />
      
      <audio 
        ref={instructionAudioRef2}
        src={require('../../assets/audio/decoding-instruction-2.mp3')}
        onPlay={() => setIsPlaying(true)}
        onEnded={handleInstruction2End}
        style={{display: 'none'}}
      />
      
      <audio 
        ref={instructionAudioRef3}
        src={require('../../assets/audio/decoding-instruction-3.mp3')}
        onPlay={() => setIsPlaying(true)}
        onEnded={handleSuccessMessageEnd}
        style={{display: 'none'}}
      />

      {!showTestWord && !isTranscribing && !tutorialCompleted && (
        <>
          <Typography variant='h4'>Reading Test Tutorial</Typography>
          
          {animationPhase === 0 && (
            <button onClick={startTutorial}>
              Start Tutorial
            </button>
          )}

          {animationPhase >= 1 && (
            <div className="word-by-word-container">
              <WordByWordTyping 
                text="When you click to begin this test you will be shown a word."
                speed={150}
                startAnimation={instruction1Typed}
                onStart={() => setIsAnimating(true)}
                onComplete={() => setIsAnimating(false)}
              />
            </div>
          )}

          {showDemo && (
            <div style={{textAlign: 'center'}}>
              <Typography variant='h2'>cat</Typography>
              <Typography variant='h1'>{demoCount}</Typography>
            </div>
          )}

          {animationPhase >= 3 && (
            <div className="word-by-word-container">
              <WordByWordTyping 
                text='You should say the word "cat" out loud, speaking clearly and forcefully. The test will then allow you to reveal the next word until you have completed the reading assessment.'
                speed={200}
                indexPauses={{
                  8: 800,
                  12: 800,
                  24: 400,
                }}
                startAnimation={instruction2Typed}
                onStart={() => setIsAnimating(true)}
                onComplete={() => setIsAnimating(false)}
              />
            </div>
          )}

          {animationPhase >= 4 && (
            <button onClick={startTestWord}>Show Test Word</button>
          )}
        </>
      )}

      {(!showTestWord && !isTranscribing && tutorialCompleted && !showSuccessMessage) && (
        <>
          <Typography variant='h4'>Reading Test Tutorial</Typography>
          <button onClick={startTestWord}>Show Test Word</button>
        </>
      )}

      {showTestWord && !showSuccessMessage && (
        <div style={{textAlign: 'center', width: '100%'}}>
          <p className='custom-p'>Say this word: </p>
          <h2 className='custom-h2'>cat</h2>
          {showVisualizer && (
            <AudioVisualizer 
              isActive={true}
              setUserHasSpoken={setUserHasSpoken}
              userHasSpoken={userHasSpoken}
              audioAnalyser={audioAnalyser}
              countdownValue={count}
              size={300}
            />
          )}
          {speechResultReceived && !isCorrect && (
            <Typography color="error">
              Please try again
            </Typography>
          )}
          {error && (
            <Typography color="error">
              {error}
            </Typography>
          )}
        </div>
      )}

      {showSuccessMessage && (
        <div className="word-by-word-container">
          <WordByWordTyping 
            text="Great job! You are ready to begin the reading portion of the test."
            speed={150}
            startAnimation={successMessageTyped}
            onStart={() => setIsAnimating(true)}
            onComplete={() => setIsAnimating(false)}
          />
        </div>
      )}

      {isTranscribing && (
        <div style={{textAlign: 'center', width: '100%'}}>
          <button disabled={true}>Analyzing...</button>
        </div>
      )}
    </Stack>
  );
};

export default DecodingTutorial; 
import React, { useState, useEffect, useRef } from 'react';
import { useRequestMicPermission } from '../../hooks/useRequestMicPermission';
import { useHandleDecodingLogic } from '../../hooks/useHandleDecodingLogic';
import AudioVisualizer from '../../components/AudioVisualizer';
import { useCountdown } from '../../hooks/useCountdown';
import ProgressBar from '../../components/ProgressBar';
import './Decoding.css';
import { errorMessages } from '../../utils/constants';
import DecodingTutorial from './DecodingTutorial';

const Decoding = () => {

  const audioStream = useRef(null);
  const audioAnalyser = useRef(null);
  const [userHasSpoken, setUserHasSpoken] = useState(false);

  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcribingError, setTranscribingError] = useState(null);

  const [count, startCountdown, stopCountdown, countdownPromise, countdownFinished] = useCountdown();
  const [hasMicPermission, requestMicPermission] = useRequestMicPermission(audioStream);
  const [isStarted, setIsStarted] = useState(false);
  const [buttonActive, setButtonActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [retryMessage, setRetryMessage] = useState('');
  const [speechResultReceived, setSpeechResultReceived] = useState(false);
  const [nextDecodingWord, currentWord, isLastWord, progress] = useHandleDecodingLogic({ startCountdown, stopCountdown, countdownPromise, countdownFinished, setSpeechResultReceived, setRetryMessage, isPaused, setButtonActive, setError: setTranscribingError, setIsTranscribing, setIsStarted, audioStream, setUserHasSpoken, userHasSpoken });
  const [buttonDisable, setButtonDisable] = useState(false);
  const [isTutorial, setIsTutorial] = useState(true);


  useEffect(() => {

    if (audioStream.current) {
      setButtonDisable(false);
      getAudioContext();
      nextDecodingWord();
    }
  }, [audioStream.current]);

  useEffect(() => {
    if (!isStarted || count > 0) return 
      
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
    // deleted so that the errors are handled by setError in the logic
    // else {
    //   setRetryMessage("We didn't quite catch that. Please try again.");
    //   setButtonActive(true);
    // } 
  }, [isStarted, speechResultReceived, count]);

  // reduntant with the previous useEffect
  // useEffect(() => {
  //   if (speechResultReceived) {
  //     setButtonActive(true);   
  //   }
  // }, [speechResultReceived]);

  const getAudioContext = async () => {
    console.log('Getting audio context analyzer...');
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    const newAnalyser = audioContext.createAnalyser();
    audioAnalyser.current = newAnalyser;

    try {
      const stream = audioStream.current;
      console.log('Got audio stream:', stream);
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(newAnalyser);
    } catch (error) {
      console.error('Error getting audio stream:', error);
    }
  };


  const startDecoding = async () => {
    if (!hasMicPermission || !audioStream.current) {
      setButtonDisable(true);
      await requestMicPermission();
    }

    if (hasMicPermission) {
      nextDecodingWord();
    }
  };


  return (
    <div className="centered-content">
      {isTutorial ? (
        <DecodingTutorial setIsTutorial={setIsTutorial} />
      ) : (
        <div className='decoding-page'>
          <div className="decoding-content">
            {!isPaused && isStarted && !isLastWord && buttonActive && !isTranscribing && !transcribingError ? (
                    <div className="button-container">
                      <div>
                        {retryMessage && <p>{retryMessage}</p>}
                        <button disabled={buttonDisable} onClick={nextDecodingWord}>{retryMessage ? 'Try Again' : 'Next Word'}</button>
                      </div>
                    </div>
                  ) : null }
            {!isStarted && !transcribingError && (
                  <div className="button-container">
                    <div>
                    <button disabled={buttonDisable} onClick={startDecoding}>Start</button>
                    </div>
                  </div>
                )}
            {transcribingError && (
                  <div className="button-container">
                    
                    {transcribingError == errorMessages.EPMTY_TRANSCRIPTION ? 
                      (
                        <div>
                          <p className='custom-p-error'>{transcribingError}</p>
                          <button onClick={nextDecodingWord}>Try Again</button>
                        </div>
                        )
                      : (
                        <div>
                          <p className='custom-p-error'>It seems your connection to the server has a problem. You can try to recoonect.</p>
                          <button  onClick={nextDecodingWord}>Retry Connection</button>
                        </div>
                        )
                    }
                    
                  </div>
                )}
            {isTranscribing && !transcribingError && (
                  <div className="button-container">
                    <div>
                    <button disabled={true} >Analyzing...</button>
                    </div>
                  </div>
                )}
            {!buttonActive && isStarted && !speechResultReceived &&  !isTranscribing && !transcribingError && (
                  <>
                    <p className='custom-p'>Say this word: </p>
                    <h2 className='custom-h2'>{currentWord}</h2>
                    <AudioVisualizer isActive={(true)} setUserHasSpoken={setUserHasSpoken} userHasSpoken={userHasSpoken} audioAnalyser={audioAnalyser} countdownValue={count} size="300"/>
                  </>
                )}
          </div>
          <ProgressBar progress={progress} />
        </div>
      )}
    </div>
  );
};

export default Decoding;

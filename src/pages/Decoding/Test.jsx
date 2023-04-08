import React, { useState, useEffect } from 'react';
import './Decoding.css'
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import useCountdown from '../../hooks/useCountdown';
import AudioVisualizer from '../../components/AudioVisualizer';

export const Test = () => {
    const [isRecording, setIsRecording] = useState(false);
    const { recognizeSpeech, stopSpeechRecognition } = useSpeechRecognition();
    const [countdownValue, startCountdown] = useCountdown();
    const [currentWord, setCurrentWord] = useState('word');

    const toggleRecording = () => {
        setIsRecording(!isRecording);
        
    }

    useEffect(() => {
        if (isRecording) {
          startCountdown(10);
          recognizeSpeech();
        } else {
          stopSpeechRecognition();
        }
      }, [isRecording]);
      
  return (
    <div className="centered-content">
        <div className="decoding-content">
            <div>
                <button onClick={toggleRecording}>{isRecording ? 'Stop' : 'Start'}</button>
            </div>
            {isRecording && (
              <>
                <p className='custom-p'>Say this word: </p>
                <h2 className='custom-h2'>{currentWord}</h2>
                <AudioVisualizer isActive={isRecording} countdownValue={countdownValue} size="300"/>
              </>
            )}
        </div>
    </div>
  )
}
export default Test
import React, { useState, useEffect, useRef } from 'react';
import './Decoding.css'
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import useCountdown from '../../hooks/useCountdown';
import AudioVisualizer from '../../components/AudioVisualizer';
import useDecodingLogic from '../../hooks/useDecodingLogic';
import { useNavigate } from 'react-router-dom';

export const Test = () => {
    const navigate = useNavigate();
    const {
        readingLevel,
        gradeIndex,
        desdWords,
        currentWord,
        stop,
        updateResults
      } = useDecodingLogic();
    const [isRecording, setIsRecording] = useState(false);
    const { recognizeSpeech, stopSpeechRecognition } = useSpeechRecognition();
    const [countdownValue, startCountdown] = useCountdown();
    const [transcription, setTranscription] = useState('');
    const prevTranscription = useRef('');
    const [isStarted, setIsStarted] = useState(false);

    const startDecoding = () => {
        setIsStarted(true);
        toggleRecording();
      };

    const toggleRecording = () => {
        setIsRecording(!isRecording);   
    }

    useEffect(() => {
        if (isRecording) {
          startCountdown(3);
          recognizeSpeech()
        .then((result) => {
            setTranscription(result);
        })
        .catch((error) => {
            console.log(error);
        });
        } else {
          stopSpeechRecognition();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [isRecording]);

    useEffect(() => {
    if (countdownValue === 0 || prevTranscription.current !== transcription) {
        setIsRecording(false);
    }
    }, [countdownValue, transcription]);

    useEffect(() => {
        if (!stop && transcription && prevTranscription.current !== transcription) {
          prevTranscription.current = transcription;
          updateResults(transcription);
        }
      }, [transcription, stop, updateResults]);

    useEffect(() => {
    updateResults('', true);
    }, []);

    useEffect(() => {
    if (stop) {
        setTimeout(() => {
          navigate('/eidetic', { state: { desdWords: desdWords, gradeIndex: gradeIndex, readingLevel: readingLevel } });
        }, 500);
      }
    }, [stop, navigate]);
      
  return (
    <div className="centered-content">
        <div className="decoding-content">
            {!isRecording && (
            <div>
                <button onClick={startDecoding}>{!isStarted ? 'Start' : 'Next Word'}</button>
            </div>
            )}
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
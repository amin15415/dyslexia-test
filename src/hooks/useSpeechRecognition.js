import {  useRef, useState } from 'react';
import RecordRTC from 'recordrtc';
import { errorMessages } from '../utils/constants';
import axios from 'axios';

export const useSpeechRecognition = (stream) => {

  const apiURL = process.env.REACT_APP_DEEPGRAM_URL;
  const apiKey = process.env.REACT_APP_DEEPGRAM_API_KEY;
  const apiModel = process.env.REACT_APP_DEEPGRAM_MODEL;

  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState(null);
  const [error, setError] = useState(null);
  
  const recorder = useRef(null);
  

    const startRecording = async () => {
      resetRecording();
      try {  
        recorder.current = new RecordRTC(stream.current, {
          type: 'audio',
          mimeType: 'audio/wav',
          recorderType: RecordRTC.StereoAudioRecorder,
          numberOfAudioChannels: 1,
          desiredSampRate: 16000,
          bufferSize: 16384,
          disableLogs: true, // Disable logging
          timeSlice: 1000,
        });
  
        recorder.current.startRecording();
        setIsRecording(true);
        setError(null);
      } catch (err) {
        setError('Error accessing microphone. Please ensure you have granted microphone permissions.');
        console.error('Error starting recording:', err);
      }
    };
  
    const stopRecordingAndTranscribe = async () => {
      if (recorder.current && isRecording) {
        
        recorder.current.stopRecording(async () => {
          const blob = recorder.current.getBlob();
          setIsRecording(false);

          // if (stream.current) {
          //   stream.current.getTracks().forEach(track => track.stop());
          // }

          const theTranscription = await getTranscription(blob);
          setTranscription(theTranscription)
        });

      }
    };
  
    const stopRecording = async () => {
      if (recorder.current && isRecording) {
        
        recorder.current.stopRecording(() => {
          setIsRecording(false);

        });
      }
      if (stream.current) {
        stream.current.getTracks().forEach(track => track.stop());
      }
    };

    const getTranscription = async (blob) => {
  
        if (!blob) {
          console.error('Recorded data is not found.'); 
          return;
        }
    
        setError(null);

    
        try {

          // Set the URL and headers for the POST request
          // In Future API key should not be at users access
          const url = `${apiURL}?model=${apiModel}&smart_format=false&language=en`;
          const headers = {
              'Authorization': `Token ${apiKey}`,
              'Content-Type': 'audio/wav'
          };

          const response = await axios.post(url, blob, {
            headers,
            timeout: 5000  // Timeout in milliseconds (5 seconds in this case)
        });

        
          const data = response?.data;
          let speechResult = '';

          if (data)
            speechResult = data.results?.channels[0]?.alternatives[0]?.transcript || '';

          if (speechResult === '') throw errorMessages.EMPTY_TRANSCRIPTION;

          return speechResult
          
        } catch (err) {
          // Handle the error - this will catch both HTTP errors and network errors
          let theError = null;
          if (err && err.response) {
              // Request was made and server responded with a status outside the 2xx range
              console.error('Server error', err.response.status);
              theError = errorMessages.SERVER_ERROR;
          } else if (err && err.request) {
              // Request was made but no response was received
              console.error('No response from server');
              theError = errorMessages.NETWORK_ERROR;
          } else {
              // Something else went wrong
              console.error('Transcription error:', err);
              theError = err;
          }

          setError(theError);
        }
    };

    const resetRecording = () => {
      if (recorder.current) {
        recorder.current.reset();
      }

      setTranscription(null);
      setError(null);
    };


  return {startRecording, stopRecordingAndTranscribe, transcription, transcriptionError: error, isRecording, stopRecording};
};
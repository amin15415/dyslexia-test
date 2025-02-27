import { useRef, useState } from 'react';
import RecordRTC from 'recordrtc';
import { errorMessages } from '../utils/constants';
import axios from 'axios';

export const useSpeechRecognition11 = (stream) => {
  const apiKey = process.env.REACT_APP_ELEVENLABS_API_KEY;
  
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
        disableLogs: true,
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

        const theTranscription = await getTranscription(blob);
        setTranscription(theTranscription);
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
      // Create FormData and append all required parameters
      const formData = new FormData();
      formData.append('file', blob, 'audio.wav');
      formData.append('model_id', 'scribe_v1');
      formData.append('language_code', 'eng');
      formData.append('tag_audio_events', 'true');
      formData.append('timestamps_granularity', 'word');
      formData.append('diarize', 'false');

      const response = await axios.post('https://api.elevenlabs.io/v1/speech-to-text', formData, {
        headers: {
          'Accept': 'application/json',
          'xi-api-key': apiKey,
        }
      });

      console.log('ElevenLabs response:', response.data);
      
      // Extract the text from the response
      const speechResult = response.data.text || '';

      if (speechResult === '') throw errorMessages.EMPTY_TRANSCRIPTION;

      return speechResult;

    } catch (err) {
      let theError = null;
      if (err.response) {
        console.error('Server error', err.response.status, err.response.data);
        theError = errorMessages.SERVER_ERROR;
      } else if (err.request) {
        console.error('No response from server');
        theError = errorMessages.NETWORK_ERROR;
      } else {
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

  return {
    startRecording,
    stopRecordingAndTranscribe,
    transcription,
    transcriptionError: error,
    isRecording,
    stopRecording
  };
}; 
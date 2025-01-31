import React, { useState, useRef } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  TextField,
  Box,
  Container,
  CircularProgress
} from '@mui/material';
import {
  Mic as MicIcon,
  Stop as StopIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import RecordRTC from 'recordrtc';

const VoiceRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [transcription, setTranscription] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const recorder = useRef(null);
  const stream = useRef(null);

  const startRecording = async () => {
    try {
      stream.current = await navigator.mediaDevices.getUserMedia({ 
        audio: { 
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });

      recorder.current = new RecordRTC(stream.current, {
        type: 'audio',
        mimeType: 'audio/wav',
        recorderType: RecordRTC.StereoAudioRecorder,
        numberOfAudioChannels: 1,
        desiredSampRate: 16000,
        bufferSize: 16384
      });

      recorder.current.startRecording();
      setIsRecording(true);
      setError('');
    } catch (err) {
      setError('Error accessing microphone. Please ensure you have granted microphone permissions.');
      console.error('Error starting recording:', err);
    }
  };

  const stopRecording = () => {
    if (recorder.current && isRecording) {
      recorder.current.stopRecording(() => {
        const blob = recorder.current.getBlob();
        setAudioBlob(blob);
        setIsRecording(false);
        
        if (stream.current) {
          stream.current.getTracks().forEach(track => track.stop());
        }
      });
    }
  };

  const resetRecording = () => {
    if (recorder.current) {
      recorder.current.reset();
    }
    setAudioBlob(null);
    setTranscription('');
    setError('');
  };

  const sendForTranscription = async () => {
    if (!audioBlob) return;

    setIsLoading(true);
    setError('');

    try {
      // Replace YOUR_DEEPGRAM_API_KEY with your actual API key
      const response = await fetch('https://api.deepgram.com/v1/listen?model=nova&smart_format=false&language=en', {
        method: 'POST',
        headers: {
          'Authorization': 'Token 019e421584eaa619f6642466c62e5060240e54f0',
          'Content-Type': 'audio/wav'
        },
        body: audioBlob
      });

      if (!response.ok) {
        throw new Error('Failed to transcribe audio');
      }

      const data = await response.json();
      setTranscription(data.results?.channels[0]?.alternatives[0]?.transcript || '');
      setIsLoading(false);
    } catch (err) {
      setError('Error during transcription. Please try again.');
      setIsLoading(false);
      console.error('Transcription error:', err);
    }
  };

  return (
    <Container maxWidth="md">
      <Card sx={{ mt: 4, pt: 10 }}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            Voice Recorder
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
            {!isRecording ? (
              <Button
                variant="contained"
                color="primary"
                startIcon={<MicIcon />}
                onClick={startRecording}
                disabled={isLoading}
              >
                Start Recording
              </Button>
            ) : (
              <Button
                variant="contained"
                color="error"
                startIcon={<StopIcon />}
                onClick={stopRecording}
              >
                Stop Recording
              </Button>
            )}
            
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={resetRecording}
              disabled={!audioBlob || isLoading}
            >
              Reset
            </Button>
          </Box>

          {audioBlob && (
            <Box sx={{ width: '100%', mb: 3 }}>
              <audio
                src={URL.createObjectURL(audioBlob)}
                controls
                style={{ width: '100%' }}
              />
            </Box>
          )}

          {audioBlob && (
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={sendForTranscription}
              disabled={isLoading}
              sx={{ mb: 2 }}
            >
              {isLoading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} color="inherit" />
                  Transcribing...
                </Box>
              ) : (
                'Transcribe Recording'
              )}
            </Button>
          )}

          {(transcription || isLoading) && (
            <TextField
              multiline
              rows={4}
              value={isLoading ? 'Transcribing...' : transcription}
              fullWidth
              variant="outlined"
              disabled
              placeholder="Transcription will appear here..."
            />
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default VoiceRecorder;
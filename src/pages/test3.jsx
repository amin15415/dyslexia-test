// App.js
import React, { useState, useRef, useEffect } from 'react';
import RecordRTC, { StereoAudioRecorder } from 'recordrtc';
import { createClient, LiveTranscriptionEvents } from "@deepgram/sdk";

import {
  Button,
  Container,
  Paper,
  Typography,
  Box,
  Chip,
  Alert,
  createTheme,
  ThemeProvider,
  TextField
} from '@mui/material';
import {
  Mic as MicIcon,
  MicOff as MicOffIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const DEEPGRAM_URL = 'wss://api.deepgram.com/v1/listen';




const App = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState('');
  const [transcription, setTranscription] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  
  const recorder = useRef(null);
  const microphone = useRef(null);
  const socket = useRef(null);
  const connection = useRef(null);

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  const cleanup = () => {
    stopRecording();
    // closeDeepgramSocket();
  };

  const initializeDeepgram = async () => {
      // STEP 1: Create a Deepgram client using the API key
    const deepgram = createClient('019e421584eaa619f6642466c62e5060240e54f0');

    // STEP 2: Create a live transcription connection
    try {
    connection.current = deepgram.listen.live({
      model: "nova-2",
      language: "en-US",
      smart_format: true,
    });
    

    // STEP 3: Listen for events from the live transcription connection
    connection.current.on(LiveTranscriptionEvents.Open, () => {
      connection.current.on(LiveTranscriptionEvents.Close, () => {
        console.log("Connection closed. !!!!!!!!!!!!!!!!!!");
      });

      connection.current.on(LiveTranscriptionEvents.Transcript, (data) => {
        console.log(data.channel.alternatives[0].transcript);
      });

      connection.current.on(LiveTranscriptionEvents.Metadata, (data) => {
        console.log(data);
      });

      connection.current.on(LiveTranscriptionEvents.Error, (err) => {
        console.error(err);
      });
    });
    } catch (e) {console.log(e)}
  }

  const startRecording = async () => {
    // if (!apiKey) {
    //   setError('Please enter your Deepgram API key');
    //   return;
    // }

    try {
      // Initialize Deepgram first
      // await initializeDeepgram();

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000
        }
      });
      
      microphone.current = stream;

      // Initialize RecordRTC
      recorder.current = new RecordRTC(stream, {
        type: 'audio',
        mimeType: 'audio/webm;codecs=pcm',
        recorderType: RecordRTC.StereoAudioRecorder,
        timeSlice: 250,
        desiredSampRate: 16000,
        numberOfAudioChannels: 1,
        bufferSize: 4096,
        audioBitsPerSecond: 128000,
        // ondataavailable: async (blob) => {
        //   if(!realtimeTranscriber.current) { console.log('no connection available'); return};
        //   console.log('getting audio data...')
        //   const buffer = await blob.arrayBuffer();
        //   realtimeTranscriber.current.sendAudio(buffer);
        // },
      });

      recorder.current.startRecording();
      setIsRecording(true);
      setError('');
    } catch (err) {
      console.error('Error starting recording:', err);
      setError(`Error starting recording: ${err.message}`);
      cleanup();
    }
  };

  const stopRecording = () => {
    if (recorder.current && isRecording) {
      recorder.current.stopRecording( async () => {
        const blob = recorder.current.getBlob();
        if (connection.current) {
          console.log('sending to socket')
          const buffer = await blob.arrayBuffer();
          connection.current.send(buffer);
        }

        if (microphone.current) {
          microphone.current.getTracks().forEach(track => track.stop());
        }

        let url = URL.createObjectURL(blob);
        let audio = new Audio(url);
  
        // Display an audio element for user to play the recording
        const audioContainer = document.createElement('div');
        const playButton = document.createElement('button');
        playButton.innerHTML = 'Play Recording';
        playButton.onclick = () => {
          audio.play();
        };
        audioContainer.appendChild(playButton);
        document.body.appendChild(audioContainer);
        
        // closeDeepgramSocket();
        microphone.current = null;
        recorder.current = null;
        setIsRecording(false);
      });
    }
  };

  const closeDeepgramSocket = () => {
    if (socket.current) {
      socket.current.close();
      socket.current = null;
      setConnectionStatus('disconnected');
    }
  };

  const clearTranscription = () => {
    setTranscription('');
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'success';
      case 'error':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm" sx={{ pt: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5" component="h1" gutterBottom>
            Deepgram Speech Recognition
          </Typography>

          <TextField
            fullWidth
            label="Deepgram API Key"
            variant="outlined"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            margin="normal"
            disabled={isRecording}
            error={!apiKey && error?.includes('API key')}
            helperText={!apiKey && error?.includes('API key') ? error : ''}
          />

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, my: 3 }}>
            <Button
              variant="outlined"
              onClick={initializeDeepgram}

              >
              Initialize Deepgram
            </Button>
            <Button
              variant="contained"
              color={isRecording ? "secondary" : "primary"}
              startIcon={isRecording ? <MicOffIcon /> : <MicIcon />}
              onClick={isRecording ? stopRecording : startRecording}
              // disabled={!apiKey}
            >
              {isRecording ? "Stop Recording" : "Start Recording"}
            </Button>
            <Button
              variant="outlined"
              startIcon={<DeleteIcon />}
              onClick={clearTranscription}
              disabled={!transcription}
            >
              Clear Text
            </Button>
          </Box>

          {transcription && (
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 2, 
                mb: 2, 
                bgcolor: 'grey.50',
                maxHeight: '200px',
                overflow: 'auto'
              }}
            >
              <Typography>{transcription}</Typography>
            </Paper>
          )}

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 1, alignItems: 'center' }}>
            <Typography variant="caption">Status:</Typography>
            <Chip
              label={connectionStatus.charAt(0).toUpperCase() + connectionStatus.slice(1)}
              color={getStatusColor()}
              size="small"
            />
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default App;
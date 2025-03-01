import React, { useState, useRef, useEffect } from 'react';
import { IconButton, Stack, Typography } from '@mui/material';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';

const AudioCheck = ({ onComplete }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReadyToStart, setIsReadyToStart] = useState(false);
  const voiceTestButton = useRef();

  // Load the test audio
  const voiceTestPath = require(`../assets/audio/eidetic-voice-test.mp3`);

  // Autoplay the audio when component mounts
  useEffect(() => {
    // Small delay to ensure the audio element is fully loaded
    const timer = setTimeout(() => {
      if (voiceTestButton.current) {
        voiceTestButton.current.play().catch(err => {
          console.error("Autoplay failed:", err);
          // Autoplay might be blocked by browser policy
        });
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <Stack sx={{px: "10px"}} justifyContent="center" alignItems="center" spacing={2}>
      <Typography variant='h4'>Audio Check</Typography>
      
      <Stack justifyContent="center" alignItems="center" spacing={1}>
        <Typography variant='h6'>Please ensure your audio is functioning and that your device is not muted.</Typography>
        
        {!isPlaying ? (
          <IconButton onClick={() => voiceTestButton.current.play()}>
            <PlayCircleOutlineIcon sx={{width: "100px", height: "100px", color: "#FFC107"}} />
          </IconButton>
        ) : (
          <IconButton onClick={() => voiceTestButton.current.pause()}>
            <PauseCircleOutlineIcon sx={{width: "100px", height: "100px", color: "#FFC107"}} />
          </IconButton>
        )}
        
        <Typography variant='h6'>Click on the play button and continue if you heard the voice clearly.</Typography>
        
        <audio 
          ref={voiceTestButton} 
          src={voiceTestPath} 
          onPlay={() => setIsPlaying(true)} 
          onPause={() => setIsPlaying(false)} 
          onEnded={() => {
            setIsReadyToStart(true);
            setIsPlaying(false);
          }} 
        />
      </Stack>

      {isReadyToStart && (
        <button onClick={onComplete}>
          I Heard The Voice
        </button>
      )}
    </Stack>
  );
};

export default AudioCheck; 
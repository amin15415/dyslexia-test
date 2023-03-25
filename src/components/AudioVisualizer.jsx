import React, { useRef } from 'react';
import { useAudioVisualizer } from '../hooks/useAudioVisualizer';
import { useCountdown } from '../hooks/useCountdown'; // Import the useCountdown hook

const AudioVisualizer = ({ isStarted, buttonActive }) => {
  const canvasRef = useRef(null);
  const { countdown, setCountdown } = useCountdown({ initialCountdown: 3 }); // Add the countdown state
  const { startVisualization, stopVisualization } = useAudioVisualizer(canvasRef, countdown);
  
  React.useEffect(() => {
    if (isStarted && !buttonActive) {
      startVisualization();
    } else {
      stopVisualization();
    }
  }, [isStarted, buttonActive, startVisualization, stopVisualization]);
  
  return <canvas ref={canvasRef} width="300" height="300"></canvas>;
};

export default AudioVisualizer;

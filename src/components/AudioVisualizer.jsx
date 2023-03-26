import React, { useRef } from 'react';
import { useAudioVisualizer } from '../hooks/useAudioVisualizer';
import { useCountdown } from '../hooks/useCountdown'; // Import the useCountdown hook

const AudioVisualizer = ({ isStarted, buttonActive, countdownValue }) => {
  const canvasRef = useRef(null);
  const isActive = isStarted && !buttonActive;
  const { startVisualization, stopVisualization } = useAudioVisualizer(canvasRef, countdownValue);

  React.useEffect(() => {
    if (isActive) {
      startVisualization();
    } else {
      stopVisualization();
    }
  }, [isActive, startVisualization, stopVisualization]);

  return <canvas ref={canvasRef} width="300" height="300"></canvas>;
};

export default AudioVisualizer;


import React, { useRef } from 'react';
import { useAudioVisualizer } from '../hooks/useAudioVisualizer';

const AudioVisualizer = ({ isStarted, buttonActive, countdownValue, size }) => {
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

  return <canvas ref={canvasRef} width={size} height={size}></canvas>;
};

export default AudioVisualizer;


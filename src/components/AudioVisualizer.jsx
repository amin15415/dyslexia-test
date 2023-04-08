import React, { useEffect, useRef } from 'react';
import { useAudioVisualizer } from '../hooks/useAudioVisualizer';

const AudioVisualizer = ({ isActive, countdownValue, size }) => {
  const canvasRef = useRef(null);
  const { startVisualization, stopVisualization } = useAudioVisualizer(canvasRef, countdownValue);

  useEffect(() => {
    if (isActive) {
      startVisualization();
    } else {
      stopVisualization();
    }
  }, [isActive, startVisualization, stopVisualization]);

  return <canvas ref={canvasRef} width={size} height={size}></canvas>;
};

export default AudioVisualizer;


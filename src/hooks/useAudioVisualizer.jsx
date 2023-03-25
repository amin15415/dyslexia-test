import { useState, useEffect, useRef } from 'react';
import { useCountdown } from './useCountdown';

export const useAudioVisualizer = (canvasRef, countdownValue) => {
  const [analyser, setAnalyser] = useState(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    const getAudioContext = async () => {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const newAnalyser = audioContext.createAnalyser();
      setAnalyser(newAnalyser);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(newAnalyser);
    };

    if (!analyser) {
      getAudioContext();
    }
  }, [analyser]);

  const draw = () => {
    if (!canvasRef.current || !analyser) return;
    const canvasContext = canvasRef.current.getContext('2d');
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(dataArray);
  
    canvasContext.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  
    const radius = Math.min(canvasRef.current.width, canvasRef.current.height) / 2;
    const centerX = canvasRef.current.width / 2;
    const centerY = canvasRef.current.height / 2;
    const numBars = dataArray.length;
    const angleBetweenBars = (2 * Math.PI) / numBars;
  
    for (let i = 0; i < numBars; i++) {
      const barHeight = dataArray[i] / 2;
      const barWidth = 2;
      const angle = i * angleBetweenBars;
      const x1 = centerX + Math.cos(angle) * (radius - barHeight);
      const y1 = centerY + Math.sin(angle) * (radius - barHeight);
      const x2 = centerX + Math.cos(angle) * radius;
      const y2 = centerY + Math.sin(angle) * radius;
  
      canvasContext.beginPath();
      canvasContext.lineWidth = barWidth;
      canvasContext.strokeStyle = `rgb(${dataArray[i]}, 50, 50)`;
      canvasContext.moveTo(x1, y1);
      canvasContext.lineTo(x2, y2);
      canvasContext.stroke();
    }

    // Draw countdown value in the center
    canvasContext.font = '48px sans-serif';
    canvasContext.fillStyle = 'white';
    canvasContext.textAlign = 'center';
    canvasContext.textBaseline = 'middle';
    canvasContext.fillText(countdownValue, centerX, centerY);
  
    animationFrameRef.current = requestAnimationFrame(draw);
  };

  const startVisualization = () => {
    if (!animationFrameRef.current) {
      draw();
    }
  };

  const stopVisualization = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };

  return {
    startVisualization,
    stopVisualization,
  };
};

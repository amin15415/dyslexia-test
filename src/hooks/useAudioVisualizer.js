import { useState, useEffect, useRef } from 'react';

export const useAudioVisualizer = (canvasRef, countdownValue, audioAnalyser, setUserHasSpoken, userHasSpoken) => {
  // const [analyser, setAnalyser] = useState(null);
  const animationFrameRef = useRef(null);
  const hasSpoken = useRef(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const draw = () => {
    // console.log('Drawing...');
    if (!canvasRef.current || !audioAnalyser.current) return;
    const canvasContext = canvasRef.current.getContext('2d');
    const dataArray = new Uint8Array(audioAnalyser.current.frequencyBinCount);
    audioAnalyser.current.getByteFrequencyData(dataArray);
  
    const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
    if (average > 25) hasSpoken.current = true;
    if (average < 8 && hasSpoken.current && countdownValue < 3) {
      console.log("Silence detected after user has spoken");
      setTimeout(()=> {setUserHasSpoken(true);}, 200)
      
      hasSpoken.current = false;
    }
    

    canvasContext.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  
    const radius = Math.min(canvasRef.current.width, canvasRef.current.height) / 2;
    const centerX = canvasRef.current.width / 2;
    const centerY = canvasRef.current.height / 2;
    const numBars = dataArray.length;
    const angleBetweenBars = (2 * Math.PI) / numBars;
  
    for (let i = 0; i < numBars; i+=5) {
      // let barHeight;
      // if (Math.random() < 0.8) { // 80% of the time, use correct index
      //   barHeight = dataArray[i] * 1;
      // } else { // 20% of the time, use random index
      //   const randomIndex = Math.floor(Math.random() * dataArray.length);
      //   barHeight = dataArray[randomIndex]/2;
      // }
      const barHeight = dataArray[i] / 1.5;
      const barWidth = 4;
      const angle = i * angleBetweenBars;
      const x1 = centerX + Math.cos(angle) * (radius - barHeight);
      const y1 = centerY + Math.sin(angle) * (radius - barHeight);
      const x2 = centerX + Math.cos(angle) * radius;
      const y2 = centerY + Math.sin(angle) * radius;
  
      canvasContext.beginPath();
      canvasContext.lineWidth = barWidth;
      // const colorValue = dataArray[i] / 255;
      canvasContext.strokeStyle = '#FFC107';
      canvasContext.moveTo(x1, y1);
      canvasContext.lineTo(x2, y2);
      canvasContext.stroke();
    }

    // Draw countdown value in the center
    canvasContext.font = '256px "Delicious Handrawn"';
    canvasContext.fillStyle = 'black';
    canvasContext.textAlign = 'center';
    canvasContext.textBaseline = 'middle';
    canvasContext.fillText(countdownValue, centerX, centerY);
  
    animationFrameRef.current = requestAnimationFrame(draw);
  };

  useEffect(() => {
    if (!animationFrameRef.current) {
      animationFrameRef.current = requestAnimationFrame(draw);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [draw, countdownValue]);

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
    stopVisualization
  };
};
import React, { useEffect, useRef } from 'react';

export default function AudioVisualizer({ isSpeaking, speakerColor = '#6366f1', height = 36 }) {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    ctx.scale(dpr, dpr);

    const numBars = 32;
    const barWidth = 3;
    const gap = 3;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const startX = (width - (numBars * (barWidth + gap))) / 2;

      for (let i = 0; i < numBars; i++) {
        let barHeight = 4;
        if (isSpeaking) {
          // Dynamic harmonic wave
          const wave1 = Math.sin(phase + i * 0.28) * 0.5 + 0.5;
          const wave2 = Math.cos(phase * 1.5 + i * 0.15) * 0.5 + 0.5;
          const centerDist = 1 - Math.abs(i - numBars / 2) / (numBars / 2);
          barHeight = 4 + (wave1 * 0.6 + wave2 * 0.4) * (h - 8) * centerDist;
        }

        const x = startX + i * (barWidth + gap);
        const y = (h - barHeight) / 2;

        ctx.fillStyle = isSpeaking ? speakerColor : 'rgba(255, 255, 255, 0.15)';
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 2);
        ctx.fill();
      }

      if (isSpeaking) {
        phase += 0.12;
      }
      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isSpeaking, speakerColor]);

  return (
    <canvas 
      ref={canvasRef} 
      style={{
        width: '100%',
        height: `${height}px`,
        display: 'block'
      }} 
    />
  );
}

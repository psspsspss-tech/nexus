import React, { useEffect, useRef } from 'react';

export default function MatrixBackground({ matrixMode = true }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Matrix Rain Setup
    const characters = '01ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzλµπΩ<>{}[]/*+=-_';
    const fontSize = 14;
    const columns = Math.floor(width / fontSize);
    const drops = Array(columns).fill(1);

    // Particles Setup
    const particleCount = 65;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      radius: Math.random() * 2 + 1,
      color: Math.random() > 0.5 ? '#00f3ff' : '#00ff66'
    }));

    const render = () => {
      // Semi-transparent background clear for trail effect
      ctx.fillStyle = 'rgba(7, 9, 14, 0.2)';
      ctx.fillRect(0, 0, width, height);

      if (matrixMode) {
        ctx.fillStyle = '#00ff66';
        ctx.font = `${fontSize}px 'Fira Code', monospace`;

        for (let i = 0; i < drops.length; i++) {
          const text = characters.charAt(Math.floor(Math.random() * characters.length));
          const x = i * fontSize;
          const y = drops[i] * fontSize;

          // Random neon highlight
          ctx.fillStyle = Math.random() > 0.95 ? '#00f3ff' : 'rgba(0, 255, 102, 0.4)';
          ctx.fillText(text, x, y);

          if (y > height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        }
      }

      // Draw Neural Particle Connections
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 243, 255, ${0.15 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [matrixMode]);

  return <canvas id="bg-canvas" ref={canvasRef} />;
}

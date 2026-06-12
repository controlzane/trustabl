'use client';

import { useEffect, useRef } from 'react';

export default function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const context = ctx;

    const dpr = window.devicePixelRatio || 1;

    function getCenter() {
      return { x: canvas!.offsetWidth / 2, y: canvas!.offsetHeight / 2 };
    }

    const MAX_SPEED = 0.48;
    const TRAIL = 6;
    const N = 145;
    const DRAG = 0.996;
    const SPAWN_MARGIN = 48;

    type Particle = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      trail: [number, number][];
      teal: boolean;
      age: number;
      swirl: number;
      swirlSpeed: number;
      wobble: number;
    };

    function createParticle(x: number, y: number): Particle {
      return {
        x,
        y,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        size: 0.45 + Math.random() * 0.95,
        opacity: 0.1 + Math.random() * 0.22,
        trail: [],
        teal: Math.random() < 0.12,
        age: 0,
        swirl: Math.random() * Math.PI * 2,
        swirlSpeed: 0.0018 + Math.random() * 0.0018,
        wobble: 0.0008 + Math.random() * 0.0012,
      };
    }

    function spawnAnywhere(): Particle {
      const w = canvas!.offsetWidth;
      const h = canvas!.offsetHeight;
      return createParticle(Math.random() * w, Math.random() * h);
    }

    function spawnFromEdge(): Particle {
      const w = canvas!.offsetWidth;
      const h = canvas!.offsetHeight;
      const side = Math.floor(Math.random() * 4);
      let x = 0;
      let y = 0;
      if (side === 0) { x = -SPAWN_MARGIN; y = Math.random() * h; }
      else if (side === 1) { x = w + SPAWN_MARGIN; y = Math.random() * h; }
      else if (side === 2) { x = Math.random() * w; y = -SPAWN_MARGIN; }
      else { x = Math.random() * w; y = h + SPAWN_MARGIN; }
      return createParticle(x, y);
    }

    let particles: Particle[] = [];

    function resetParticles() {
      particles = Array.from({ length: N }, spawnAnywhere);
      context.clearRect(0, 0, canvas!.offsetWidth, canvas!.offsetHeight);
    }

    function resize() {
      const w = canvas!.offsetWidth;
      const h = canvas!.offsetHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      resetParticles();
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let raf = 0;
    function draw() {
      const w = canvas!.offsetWidth;
      const h = canvas!.offsetHeight;
      context.clearRect(0, 0, w, h);
      const center = getCenter();

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const dx = center.x - p.x;
        const dy = center.y - p.y;
        const dist = Math.hypot(dx, dy);
        const safeDist = Math.max(dist, 1);
        p.age += 1;

        if (p.x < -SPAWN_MARGIN || p.x > w + SPAWN_MARGIN || p.y < -SPAWN_MARGIN || p.y > h + SPAWN_MARGIN) {
          particles[i] = spawnFromEdge();
          continue;
        }

        p.swirl += p.swirlSpeed;
        const nx = dx / safeDist;
        const ny = dy / safeDist;
        const tangentialX = -ny;
        const tangentialY = nx;
        const drift = Math.sin(p.swirl) * 0.02;
        p.vx += tangentialX * drift + Math.cos(p.swirl * 0.7) * p.wobble;
        p.vy += tangentialY * drift + Math.sin(p.swirl * 0.7) * p.wobble;
        p.vx += Math.sin(p.age * 0.012 + p.swirl) * 0.006;
        p.vy += Math.cos(p.age * 0.011 + p.swirl) * 0.006;

        p.vx *= DRAG;
        p.vy *= DRAG;

        const speed = Math.hypot(p.vx, p.vy);
        if (speed > MAX_SPEED) {
          p.vx = (p.vx / speed) * MAX_SPEED;
          p.vy = (p.vy / speed) * MAX_SPEED;
        }

        p.trail.push([p.x, p.y]);
        if (p.trail.length > TRAIL) p.trail.shift();

        p.x += p.vx;
        p.y += p.vy;

        const centerFade = 0.85 - Math.min(0.35, dist / Math.max(w, h) * 0.25);
        const alpha = p.opacity * centerFade;

        if (speed > 0.12 && p.trail.length > 2) {
          for (let t = 1; t < p.trail.length; t++) {
            const tf = t / p.trail.length;
            context.beginPath();
            context.moveTo(p.trail[t - 1][0], p.trail[t - 1][1]);
            context.lineTo(p.trail[t][0], p.trail[t][1]);
            context.strokeStyle = p.teal
              ? `rgba(45,212,191,${alpha * tf * 0.18})`
              : `rgba(220,232,255,${alpha * tf * 0.14})`;
            context.lineWidth = p.size * tf * 0.35;
            context.lineCap = 'round';
            context.stroke();
          }
        }

        context.beginPath();
        context.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        context.fillStyle = p.teal ? `rgba(45,212,191,${alpha})` : `rgba(220,232,255,${alpha})`;
        context.fill();
      }

      raf = requestAnimationFrame(draw);
    }

    draw();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 h-full w-full pointer-events-none" />;
}

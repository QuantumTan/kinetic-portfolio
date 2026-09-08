"use client";

import { useEffect, useRef } from "react";

interface PixelParticle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  maxOpacity: number;
  twinkleSpeed: number;
}

export default function KineticPixelBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse tracking for hover particle scatter
    const mouse = {
      x: -1000,
      y: -1000,
      radius: 140,
      isActive: false,
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.isActive = true;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
      mouse.isActive = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener("resize", onResize);

    // Grid configuration
    const GRID_SPACING = 32;
    let particles: PixelParticle[] = [];

    const initParticles = () => {
      particles = [];
      const count = Math.min(180, Math.floor((width * height) / 9000));
      for (let i = 0; i < count; i++) {
        const size = Math.random() > 0.85 ? 4 : 2;
        const initialX = Math.random() * width;
        const initialY = Math.random() * height;
        particles.push({
          x: initialX,
          y: initialY,
          originX: initialX,
          originY: initialY,
          vx: 0,
          vy: 0,
          size,
          speedY: (Math.random() * 0.4 + 0.15) * (Math.random() > 0.5 ? 1 : -1),
          speedX: (Math.random() * 0.25 + 0.1) * (Math.random() > 0.5 ? 1 : -1),
          opacity: Math.random() * 0.5 + 0.15,
          maxOpacity: Math.random() * 0.6 + 0.25,
          twinkleSpeed: Math.random() * 0.02 + 0.005,
        });
      }
    };

    initParticles();

    // Kinetic Scanning Lines
    let scanLineY = 0;
    const scanLineSpeed = 0.75;

    let scanBeamX = 0;
    const scanBeamSpeed = 0.5;

    const render = () => {
      const isLight = document.documentElement.classList.contains("light");
      const pixelColor = isLight ? "0, 0, 0" : "255, 255, 255";
      const scanLineColor = isLight
        ? "rgba(0, 0, 0, 0.04)"
        : "rgba(255, 255, 255, 0.035)";
      const beamLineColor = isLight
        ? "rgba(0, 0, 0, 0.06)"
        : "rgba(255, 255, 255, 0.05)";

      ctx.clearRect(0, 0, width, height);

      // 1. Moving Horizontal Scan Beam
      scanLineY = (scanLineY + scanLineSpeed) % height;
      ctx.fillStyle = scanLineColor;
      ctx.fillRect(0, scanLineY, width, 2);

      // Subtle trailing ghost scan
      const trailY = (scanLineY - 40 + height) % height;
      ctx.fillRect(0, trailY, width, 1);

      // 2. Moving Vertical Grid Tracker
      scanBeamX = (scanBeamX + scanBeamSpeed) % width;
      ctx.fillStyle = beamLineColor;
      ctx.fillRect(scanBeamX, 0, 1, height);

      // 3. Kinetic Pixels with Hover Scatter Physics
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Normal drift
        p.y += p.speedY;
        p.x += p.speedX;

        // Hover scatter repulsion physics
        if (mouse.isActive) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius && dist > 0) {
            // Force is inversely proportional to distance (stronger when closer)
            const force = (mouse.radius - dist) / mouse.radius;
            const angle = Math.atan2(dy, dx);
            const scatterPower = 7.5;

            p.vx += Math.cos(angle) * force * scatterPower;
            p.vy += Math.sin(angle) * force * scatterPower;
          }
        }

        // Apply velocities and drag / damping
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.92;
        p.vy *= 0.92;

        // Wrap around boundaries
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        // Twinkle opacity
        p.opacity += p.twinkleSpeed;
        if (p.opacity > p.maxOpacity || p.opacity < 0.08) {
          p.twinkleSpeed = -p.twinkleSpeed;
        }

        ctx.fillStyle = `rgba(${pixelColor}, ${Math.max(0.08, p.opacity)})`;

        // Render crisp 1-bit pixel square
        ctx.fillRect(
          Math.floor(p.x),
          Math.floor(p.y),
          p.size,
          p.size
        );
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[-1] w-full h-full"
      style={{ imageRendering: "pixelated" }}
      aria-hidden="true"
    />
  );
}

"use client";

import { useEffect, useRef } from "react";

interface PixelParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  maxOpacity: number;
  twinkleSpeed: number;
}

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  speed: number;
  alpha: number;
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

    // Mouse tracking for hover particle scatter & grid connection
    const mouse = {
      x: -1000,
      y: -1000,
      radius: 170,
      isActive: false,
    };

    // Active kinetic shockwaves
    let shockwaves: Shockwave[] = [];

    const triggerRipple = (clientX: number, clientY: number, power = 1) => {
      shockwaves.push({
        x: clientX,
        y: clientY,
        radius: 4,
        maxRadius: Math.min(260 * power, 320),
        speed: 7.5 * power,
        alpha: 0.75,
      });

      // Cap concurrent shockwaves to keep 60fps
      if (shockwaves.length > 5) {
        shockwaves.shift();
      }
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

    const handlePointerDown = (e: MouseEvent) => {
      // Create ripple on pointer click
      triggerRipple(e.clientX, e.clientY, 1);
    };

    // Custom event listener so other components can dispatch kinetic ripples
    const handleCustomPulse = (e: Event) => {
      const customEvt = e as CustomEvent<{ x?: number; y?: number; power?: number }>;
      const rx = customEvt.detail?.x ?? width / 2;
      const ry = customEvt.detail?.y ?? height / 2;
      const p = customEvt.detail?.power ?? 1.2;
      triggerRipple(rx, ry, p);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("kinetic:pulse", handleCustomPulse);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener("resize", onResize);

    // Grid configuration
    let particles: PixelParticle[] = [];

    const initParticles = () => {
      particles = [];
      const count = Math.min(220, Math.max(100, Math.floor((width * height) / 7500)));
      for (let i = 0; i < count; i++) {
        const rand = Math.random();
        const size = rand > 0.88 ? 4 : rand > 0.5 ? 3 : 2;
        const initialX = Math.random() * width;
        const initialY = Math.random() * height;
        particles.push({
          x: initialX,
          y: initialY,
          vx: 0,
          vy: 0,
          size,
          speedY: (Math.random() * 0.45 + 0.15) * (Math.random() > 0.5 ? 1 : -1),
          speedX: (Math.random() * 0.3 + 0.1) * (Math.random() > 0.5 ? 1 : -1),
          opacity: Math.random() * 0.5 + 0.25,
          maxOpacity: Math.random() * 0.45 + 0.5,
          twinkleSpeed: Math.random() * 0.02 + 0.008,
        });
      }
    };

    initParticles();

    // Kinetic Scanning Lines
    let scanLineY = 0;
    const scanLineSpeed = 0.85;

    let scanBeamX = 0;
    const scanBeamSpeed = 0.6;

    const render = () => {
      const isLight = document.documentElement.classList.contains("light");
      const pixelColor = isLight ? "0, 0, 0" : "255, 255, 255";
      const scanLineColor = isLight
        ? "rgba(0, 0, 0, 0.025)"
        : "rgba(255, 255, 255, 0.05)";
      const beamLineColor = isLight
        ? "rgba(0, 0, 0, 0.035)"
        : "rgba(255, 255, 255, 0.07)";

      ctx.clearRect(0, 0, width, height);

      // 1. Moving Horizontal Scan Beam
      scanLineY = (scanLineY + scanLineSpeed) % height;
      ctx.fillStyle = scanLineColor;
      ctx.fillRect(0, scanLineY, width, 2);

      // Trailing ghost scan
      const trailY = (scanLineY - 35 + height) % height;
      ctx.fillRect(0, trailY, width, 1);

      // 2. Moving Vertical Grid Tracker
      scanBeamX = (scanBeamX + scanBeamSpeed) % width;
      ctx.fillStyle = beamLineColor;
      ctx.fillRect(scanBeamX, 0, 1, height);

      // 3. Render and advance Shockwave Ripples
      for (let sIdx = shockwaves.length - 1; sIdx >= 0; sIdx--) {
        const sw = shockwaves[sIdx];
        sw.radius += sw.speed;
        sw.alpha = Math.max(0, 1 - sw.radius / sw.maxRadius);

        if (sw.radius >= sw.maxRadius || sw.alpha <= 0) {
          shockwaves.splice(sIdx, 1);
          continue;
        }

        const ringAlpha = isLight ? sw.alpha * 0.18 : sw.alpha * 0.45;
        ctx.strokeStyle = `rgba(${pixelColor}, ${ringAlpha})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.stroke();

        // Push nearby particles with shockwave wave-front
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const dx = p.x - sw.x;
          const dy = p.y - sw.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const diff = Math.abs(dist - sw.radius);

          if (diff < 30 && dist > 0) {
            const push = ((30 - diff) / 30) * 4.5 * sw.alpha;
            p.vx += (dx / dist) * push;
            p.vy += (dy / dist) * push;
          }
        }
      }

      // 4. Kinetic Pixels with Hover Scatter Physics
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Normal continuous kinetic drift
        p.y += p.speedY;
        p.x += p.speedX;

        // Hover scatter repulsion physics
        if (mouse.isActive) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius && dist > 0) {
            const force = (mouse.radius - dist) / mouse.radius;
            const angle = Math.atan2(dy, dx);
            const scatterPower = 8.5;

            p.vx += Math.cos(angle) * force * scatterPower;
            p.vy += Math.sin(angle) * force * scatterPower;
          }
        }

        // Apply velocities and drag / damping
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.91;
        p.vy *= 0.91;

        // Wrap around boundaries
        if (p.y < -15) p.y = height + 15;
        if (p.y > height + 15) p.y = -15;
        if (p.x < -15) p.x = width + 15;
        if (p.x > width + 15) p.x = -15;

        // Twinkle opacity
        p.opacity += p.twinkleSpeed;
        if (p.opacity > p.maxOpacity || p.opacity < 0.15) {
          p.twinkleSpeed = -p.twinkleSpeed;
        }

        // Gentle low-contrast alpha in light mode, crisp cybernetic alpha in dark mode
        const alpha = isLight
          ? Math.min(0.18, Math.max(0.04, p.opacity * 0.22))
          : Math.max(0.12, p.opacity);

        ctx.fillStyle = `rgba(${pixelColor}, ${alpha})`;

        // Render crisp 1-bit pixel square
        ctx.fillRect(
          Math.floor(p.x),
          Math.floor(p.y),
          p.size,
          p.size
        );
      }

      // 5. Proximity Constellation Grid Links near Cursor
      if (mouse.isActive) {
        const linkDistance = 70;
        const activeRadius = mouse.radius + 30;

        for (let i = 0; i < particles.length; i++) {
          const p1 = particles[i];
          const distToMouse = Math.hypot(p1.x - mouse.x, p1.y - mouse.y);
          if (distToMouse > activeRadius) continue;

          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < linkDistance) {
              const lineAlpha = (1 - dist / linkDistance) * (isLight ? 0.08 : 0.22);
              ctx.strokeStyle = `rgba(${pixelColor}, ${lineAlpha})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(Math.floor(p1.x), Math.floor(p1.y));
              ctx.lineTo(Math.floor(p2.x), Math.floor(p2.y));
              ctx.stroke();
            }
          }
        }
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("kinetic:pulse", handleCustomPulse);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[0] w-full h-full"
      style={{ imageRendering: "pixelated" }}
      aria-hidden="true"
    />
  );
}

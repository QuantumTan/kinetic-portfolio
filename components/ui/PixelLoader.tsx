"use client";

import { useState, useEffect } from "react";

const BOOT_LOGS = [
  "SYS_BOOT: INITIALIZING QUANTUM_CORE v2.7...",
  "LOADING_STACK: LARAVEL 12 // BLADE & BS5...",
  "LOADING_BACKEND: .NET 8 CLEAN_ARCH // JAVA...",
  "SYNCING REPOSITORIES & METRICS...",
  "KINETIC CANVAS CALIBRATION: NOMINAL [100%]",
];

export default function PixelLoader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Progress tick
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsFading(true);
            setTimeout(onComplete, 350);
          }, 200);
          return 100;
        }
        const increment = Math.floor(Math.random() * 18) + 8;
        const next = Math.min(100, prev + increment);
        if (next > 25 && next <= 50) setLogIndex(1);
        else if (next > 50 && next <= 75) setLogIndex(2);
        else if (next > 75 && next < 100) setLogIndex(3);
        else if (next === 100) setLogIndex(4);
        return next;
      });
    }, 65);

    return () => clearInterval(interval);
  }, [onComplete]);

  // Generate 20-character block progress bar
  const totalBlocks = 20;
  const filledBlocks = Math.round((progress / 100) * totalBlocks);
  const emptyBlocks = totalBlocks - filledBlocks;
  const progressBarStr = "█".repeat(filledBlocks) + "░".repeat(emptyBlocks);

  return (
    <div
      className={`fixed inset-0 z-[99999] bg-black text-white flex flex-col items-center justify-center p-4 select-none transition-opacity duration-300 ${
        isFading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{ imageRendering: "pixelated" }}
    >
      {/* SCANLINE OVERLAY */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-[480px] border-2 border-white p-6 sm:p-8 bg-[#0a0a0a] shadow-[8px_8px_0px_#ffffff]">
        {/* LOADER HEADER */}
        <div className="flex items-center justify-between border-b-2 border-white pb-3 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-white inline-block animate-pulse" />
            <span className="font-pixel text-xs text-white tracking-wider">
              SYS_LOADER // BOOT
            </span>
          </div>
          <span className="font-mono text-[0.65rem] text-neutral-400">
            [v2.7.0]
          </span>
        </div>

        {/* LOG MESSAGES */}
        <div className="font-mono text-xs text-neutral-300 min-h-[44px] mb-4 space-y-1">
          <p className="text-white font-bold flex items-center">
            <span className="text-neutral-500 mr-2">&gt;</span>
            {BOOT_LOGS[logIndex]}
            <span className="terminal-cursor ml-1 text-white animate-pulse">█</span>
          </p>
        </div>

        {/* PROGRESS BAR */}
        <div className="space-y-2">
          <div className="font-mono text-xs sm:text-sm tracking-widest text-white overflow-hidden text-center sm:text-left bg-black p-2 border border-neutral-700">
            {progressBarStr}
          </div>

          <div className="flex items-center justify-between font-pixel text-[0.65rem] text-neutral-400 pt-1">
            <span>MEM_BUFFER: READY</span>
            <span className="text-white font-bold">{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

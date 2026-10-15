"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

const BOOT_LOGS = [
  "SYS_BOOT: INITIALIZING QUANTUM_CORE v3.0...",
  "LOADING_STACK: .NET 8 CLEAN_ARCH // LARAVEL 12...",
  "VERIFYING DOMAIN BOUNDARIES & PERSISTENCE...",
  "SYNCING LIVE TELEMETRY & REPOSITORIES...",
  "SYSTEM STATUS: 100% NOMINAL // READY",
];

export default function PixelLoader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  const dismissLoader = useCallback(() => {
    setIsFading(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("quantum_booted", "true");
    }
    setTimeout(onComplete, 120);
  }, [onComplete]);

  useEffect(() => {
    // Check if user already booted this session - zero delay bypass
    if (typeof window !== "undefined" && sessionStorage.getItem("quantum_booted") === "true") {
      onComplete();
      return;
    }

    // High-performance progress tick (completes in ~450ms, well under 750ms requirement)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(dismissLoader, 80);
          return 100;
        }
        const increment = Math.floor(Math.random() * 8) + 8; // avg 11% per 40ms -> ~400ms
        const next = Math.min(100, prev + increment);
        if (next > 20 && next <= 45) setLogIndex(1);
        else if (next > 45 && next <= 70) setLogIndex(2);
        else if (next > 70 && next < 100) setLogIndex(3);
        else if (next === 100) setLogIndex(4);
        return next;
      });
    }, 40);

    // Fast-skip on Escape or Enter
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter") {
        e.preventDefault();
        clearInterval(interval);
        dismissLoader();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onComplete, dismissLoader]);

  // Generate 20-character block progress bar
  const totalBlocks = 20;
  const filledBlocks = Math.round((progress / 100) * totalBlocks);
  const emptyBlocks = totalBlocks - filledBlocks;
  const progressBarStr = "█".repeat(filledBlocks) + "░".repeat(emptyBlocks);

  return (
    <div
      className={`fixed inset-0 z-[99999] bg-black text-white flex flex-col items-center justify-center p-4 select-none transition-opacity duration-150 ${
        isFading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{ imageRendering: "pixelated" }}
      aria-label="Quantum Core Boot Sequence"
    >
      {/* SCANLINE OVERLAY */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-[490px] border-2 border-white p-6 sm:p-7 bg-[#0a0a0a] shadow-[8px_8px_0px_#ffffff]">
        {/* LOADER HEADER */}
        <div className="flex items-center justify-between border-b-2 border-white pb-3 mb-5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-emerald-400 inline-block animate-pulse" />
            <span className="font-pixel text-xs text-white tracking-wider">
              SYS_LOADER // FAST_BOOT
            </span>
          </div>

          <button
            type="button"
            onClick={dismissLoader}
            className="font-pixel text-[0.65rem] border border-white/60 bg-white/10 hover:bg-white hover:text-black px-2 py-1 text-white transition-colors cursor-pointer"
            title="Skip boot sequence (Esc or Enter)"
          >
            [ESC // SKIP_BOOT]
          </button>
        </div>

        {/* LOG MESSAGES */}
        <div className="font-mono text-xs text-neutral-300 min-h-[44px] mb-4 space-y-1">
          <p className="text-white font-bold flex items-center">
            <span className="text-emerald-400 mr-2">&gt;</span>
            {BOOT_LOGS[logIndex]}
            <span className="terminal-cursor ml-1 text-emerald-400 animate-pulse">█</span>
          </p>
        </div>

        {/* PROGRESS BAR */}
        <div className="space-y-2">
          <div className="font-mono text-xs sm:text-sm tracking-widest text-emerald-300 overflow-hidden text-center sm:text-left bg-black p-2 border border-neutral-700">
            {progressBarStr}
          </div>

          <div className="flex items-center justify-between font-mono text-[0.68rem] text-neutral-400 pt-1">
            <span>RUNTIME: .NET 8 / LARAVEL 12</span>
            <span className="text-white font-bold font-pixel text-[0.7rem]">{progress}%</span>
          </div>
        </div>

        {/* SKIP ACTIONS FOOTER */}
        <div className="mt-5 pt-3 border-t border-dashed border-neutral-800 flex items-center justify-between font-mono text-[0.68rem] text-neutral-400">
          <span>PRESS [ESC] OR [ENTER]</span>
          <button
            type="button"
            onClick={dismissLoader}
            className="text-white hover:text-emerald-400 cursor-pointer flex items-center gap-1 font-mono"
          >
            <span>[SKIP_NOW]</span>
            <ArrowRightIcon className="w-3 h-3 text-emerald-400" />
          </button>
        </div>
      </div>
    </div>
  );
}

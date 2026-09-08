"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const ROLES = [
  "FULL_STACK_LARAVEL_DEVELOPER",
  "LARAVEL_12_BLADE_BOOTSTRAP",
  ".NET_CLEAN_ARCHITECTURE_DEV",
  "JAVA_OOP_SPECIALIST",
  "FULL_STACK_SYSTEMS_ENGINEER",
];

const STATS = [
  { value: "4+", label: "CERTIFICATIONS" },
  { value: "4+", label: "ACTIVE_PROJECTS" },
  { value: "2+", label: "YEARS_CODING" },
];

export default function Hero() {
  const container = useRef<HTMLDivElement>(null);
  const [roleIndex, setRoleIndex] = useState(0);
  const [roleText, setRoleText] = useState(ROLES[0]);
  const [isDeleting, setIsDeleting] = useState(false);

  // Smooth Typewriter effect
  useEffect(() => {
    const currentFull = ROLES[roleIndex];
    const typingSpeed = isDeleting ? 25 : 55;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setRoleText(currentFull.slice(0, roleText.length + 1));
        if (roleText.length === currentFull.length) {
          setTimeout(() => setIsDeleting(true), 1600);
        }
      } else {
        setRoleText(currentFull.slice(0, roleText.length - 1));
        if (roleText.length === 0) {
          setIsDeleting(false);
          setRoleIndex((prev) => (prev + 1) % ROLES.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [roleText, isDeleting, roleIndex]);

  // Fail-safe GSAP Entrance
  useGSAP(
    () => {
      if (!container.current) return;
      gsap.fromTo(
        [".hero-hud-badge", ".hero-title-box", ".hero-telemetry-box", ".hero-stat-box", ".hero-action-btn"],
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: "power2.out" }
      );
    },
    { scope: container }
  );

  return (
    <section
      id="home"
      ref={container}
      className="w-full max-w-[1200px] mx-auto pt-4 sm:pt-6 pb-8 sm:pb-12 flex flex-col justify-center"
    >
      {/* TOP TELEMETRY STRIP */}
      <div className="hero-hud-badge flex flex-wrap items-center justify-between gap-2 border-2 border-[var(--color-border)] bg-[var(--color-surface)] p-2.5 sm:p-3 mb-6 font-mono text-[0.65rem] sm:text-xs text-[var(--color-text-dim)]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-white inline-block animate-pulse" />
          <span className="font-pixel text-[0.6rem] sm:text-[0.65rem] text-[var(--color-text)]">
            SYSTEM_STATUS: ONLINE // VER 2.7
          </span>
        </div>
        <div>
          <span>UNIV_OF_MINDANAO // BS_IT</span>
        </div>
        <div className="hidden md:block">
          <span>STACK: LARAVEL 12 (BLADE + BS5) / .NET 8 / NEXT.JS / JAVA</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
        {/* ── LEFT COLUMN ── */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-4 sm:gap-5">
          {/* ROCK-SOLID STABLE PIXEL TITLE (NO SHAKING / GLITCHING) */}
          <div className="hero-title-box pixel-box p-4 sm:p-6 relative group transition-all">
            <div className="text-[0.65rem] sm:text-xs font-mono text-[var(--color-text-dim)] mb-1 sm:mb-2">
              // OPERATOR: QUANTUM_TAN [SYS_DEV]
            </div>
            <h1 className="font-pixel text-xl sm:text-3xl md:text-5xl text-[var(--color-text)] tracking-tight leading-none uppercase select-none">
              JONATHAN PEGUIT JR.
            </h1>
            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-[var(--color-border)] flex flex-wrap items-center gap-2 font-pixel text-[0.65rem] sm:text-xs text-[var(--color-text-muted)]">
              <span>[ROLE]</span>
              <span className="text-[var(--color-text)] bg-[var(--color-surface)] px-2 py-0.5 border border-[var(--color-border)]">
                {roleText}
                <span className="terminal-cursor text-white font-bold ml-1">█</span>
              </span>
            </div>
          </div>

          {/* BIO TERMINAL PARAGRAPH */}
          <div className="pixel-box p-4 sm:p-5 font-mono text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed">
            <span className="text-[var(--color-text)] font-bold">INFO_LOG: </span>
            Full-stack Laravel developer specialized in dynamic Blade templating, Bootstrap 5 UI, and RESTful API backends. Proficient in C# .NET 8 Clean Architecture, Java algorithms, and relational MySQL systems. Student organization officer and peer mentor at the University of Mindanao.
          </div>

          {/* STATS MATRIX */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {STATS.map((st) => (
              <div
                key={st.label}
                className="hero-stat-box pixel-box p-2.5 sm:p-3 text-center"
              >
                <div className="font-pixel text-base sm:text-xl text-[var(--color-text)]">
                  {st.value}
                </div>
                <div className="font-mono text-[0.6rem] sm:text-[0.65rem] text-[var(--color-text-dim)] mt-0.5">
                  {st.label}
                </div>
              </div>
            ))}
          </div>

          {/* ACTIONS & DISPATCH BUTTONS */}
          <div className="flex flex-wrap gap-2 sm:gap-3 pt-1">
            <a
              href="/assets/Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-action-btn pixel-btn text-[0.65rem] sm:text-xs"
            >
              [+] GET_RESUME_PDF
            </a>
            <a
              href="https://github.com/QuantumTan"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-action-btn pixel-btn text-[0.65rem] sm:text-xs"
            >
              [#] GITHUB
            </a>
            <a
              href="https://www.linkedin.com/in/jonathan-jr-peguit-a446ba1b8/"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-action-btn pixel-btn text-[0.65rem] sm:text-xs"
            >
              [IN] LINKEDIN
            </a>
            <a
              href="mailto:jonathanjrhayo@gmail.com"
              className="hero-action-btn pixel-btn text-[0.65rem] sm:text-xs"
            >
              [@] EMAIL_ME
            </a>
          </div>
        </div>

        {/* ── RIGHT COLUMN: PIXEL ASCII TELEMETRY MODULE ── */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div className="hero-telemetry-box pixel-box p-4 sm:p-5 bg-[var(--color-surface)] h-full flex flex-col justify-between font-mono text-xs">
            {/* TERMINAL HEADER */}
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2 mb-3">
              <span className="font-pixel text-[0.65rem] text-[var(--color-text)]">
                CORE_DIAGNOSTICS // HUD
              </span>
              <span className="text-[0.65rem] text-[var(--color-text-dim)]">
                [LIVE_STREAM]
              </span>
            </div>

            {/* ASCII ART & ARCHITECTURE BLOCK */}
            <pre className="font-mono text-[0.6rem] sm:text-[0.65rem] text-[var(--color-text)] leading-tight bg-[var(--color-bg)] p-3 border border-[var(--color-border)] select-none overflow-x-auto">
{`+-------------------------------+
|  QUANTUM_TAN // CORE_MATRIX   |
|  ===========================  |
|  [01] FULLSTACK: LARAVEL 12   |
|  [02] FRONTEND: BLADE & BS5   |
|  [03] BACKEND: .NET 8 / C#    |
|  [04] MODERN: NEXT.JS / TS    |
|  [05] DATABASE: MYSQL / SQL   |
+-------------------------------+`}
            </pre>

            {/* TELEMETRY METRICS */}
            <div className="space-y-2 pt-3 border-t border-[var(--color-border)] text-[0.65rem] sm:text-[0.7rem]">
              <div className="flex justify-between">
                <span className="text-[var(--color-text-dim)]">SYSTEM_HEALTH:</span>
                <span className="text-[var(--color-text)] font-bold">100% NOMINAL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-dim)]">LOCATION:</span>
                <span className="text-[var(--color-text)]">DAVAO CITY, PH (UTC+8)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-dim)]">EDUCATION:</span>
                <span className="text-[var(--color-text)]">BS INFORMATION TECH</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-dim)]">PEER_MENTOR:</span>
                <span className="text-[var(--color-text)]">ACTIVE (UM)</span>
              </div>
            </div>

            {/* BOTTOM STATUS HINT */}
            <div className="mt-4 pt-2 border-t border-dashed border-[var(--color-border)] text-[0.65rem] text-[var(--color-text-dim)] flex items-center justify-between">
              <span>STATUS:</span>
              <span className="font-pixel text-white">[READY_FOR_DISPATCH]</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

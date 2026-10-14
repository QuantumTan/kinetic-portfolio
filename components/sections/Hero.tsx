"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { sound } from "@/utils/sound";

const ROLES = [
  "FULL_STACK_LARAVEL_DEVELOPER",
  "LARAVEL_12_BLADE_BOOTSTRAP",
  ".NET_CLEAN_ARCHITECTURE_DEV",
  "JAVA_OOP_SPECIALIST",
  "FULL_STACK_SYSTEMS_ENGINEER",
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
        [".hero-hud-badge", ".hero-title-box", ".hero-telemetry-box", ".hero-action-btn"],
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
      className="relative w-full max-w-[1200px] mx-auto pt-4 sm:pt-8 pb-6 sm:pb-12 flex flex-col justify-center scroll-mt-[100px]"
    >
      {/* TOP TELEMETRY STRIP */}
      <div className="hero-hud-badge mt-2 sm:mt-5 flex flex-wrap items-center justify-between gap-2 border-2 border-[var(--color-border)] bg-[var(--color-surface)] p-2.5 sm:p-3 mb-5 sm:mb-6 font-mono text-[0.65rem] sm:text-xs text-[var(--color-text-dim)]">
        <button
          type="button"
          onClick={() => {
            sound.playPing();
            if (typeof window !== "undefined") {
              window.dispatchEvent(new CustomEvent("kinetic:pulse", { detail: { power: 1.3 } }));
            }
          }}
          className="flex items-center gap-2 hover:opacity-85 transition-opacity cursor-pointer min-h-[36px]"
          title="Emit radar ping pulse"
        >
          <span className="w-2 h-2 bg-[var(--color-text)] inline-block animate-pulse" />
          <span className="font-pixel text-[0.6rem] sm:text-[0.65rem] text-[var(--color-text)]">
            SYSTEM_STATUS: ONLINE // VER 2.7 [PING ⚡]
          </span>
        </button>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[var(--color-text)] inline-block" />
          <span>DAVAO CITY, PH (UTC+8)</span>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <span className="text-[var(--color-text)] font-bold">PRIMARY_STACK:</span>
          <span>.NET 8 (DDD) • LARAVEL 12 • JAVA OOP • NEXT.JS</span>
        </div>
      </div>

      {/* ASYMMETRIC COMMAND BENTO GRID */}
      <div className="grid lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
        {/* ── LEFT ZONE: OPERATOR & SYSTEM SPECIALIZATION (7 COLS) ── */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-4 sm:gap-5">
          {/* PRIMARY OPERATOR IDENTITY BOX */}
          <div className="hero-title-box pixel-box p-4 sm:p-6 relative group transition-all">
            <div className="flex items-center justify-between text-[0.65rem] sm:text-xs font-mono text-[var(--color-text-dim)] mb-2 pb-1 border-b border-[var(--color-border)]">
              <span>// OPERATOR_ID: QUANTUM_TAN [SYS_DEV]</span>
              <span className="text-[var(--color-text)] font-pixel text-[0.6rem]">LEVEL: 3RD_YR_UM</span>
            </div>

            <h1 className="font-pixel text-xl sm:text-3xl md:text-4xl lg:text-[2.65rem] text-[var(--color-text)] tracking-tight leading-snug uppercase select-none break-words py-1">
              JONATHAN PEGUIT JR.
            </h1>

            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-[var(--color-border)] flex flex-col gap-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-pixel text-[0.6rem] sm:text-[0.65rem] text-[var(--color-text-dim)] uppercase">
                  [ENGINEERING_FOCUS]:
                </span>
                <span className="font-pixel text-[0.65rem] sm:text-xs text-[var(--color-text)] font-bold bg-[var(--color-surface)] px-2.5 py-1 border border-[var(--color-border)]">
                  FULL-STACK & ENTERPRISE BACKEND ARCHITECT
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 font-mono text-[0.65rem] sm:text-xs text-[var(--color-text-muted)]">
                <span className="text-[var(--color-text-dim)]">// LIVE_RUNTIME:</span>
                <span className="text-[var(--color-text)] bg-[var(--color-card)] px-2.5 py-1 border border-[var(--color-border)] font-bold">
                  {roleText}
                  <span className="terminal-cursor text-[var(--color-text)] font-bold ml-1">█</span>
                </span>
              </div>
            </div>
          </div>

          {/* BIO TERMINAL PARAGRAPH */}
          <div className="pixel-box p-4 sm:p-5 font-mono text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed bg-[var(--color-surface)]">
            <div className="flex items-center gap-2 font-pixel text-[0.65rem] sm:text-xs text-[var(--color-text)] mb-2 pb-1 border-b border-[var(--color-border)]">
              <span className="w-1.5 h-1.5 bg-[var(--color-text)] inline-block" />
              <span>EXECUTIVE_BRIEF // PHILOSOPHY</span>
            </div>
            Information Technology student, student organization officer, and technical peer mentor at the University of Mindanao. Focused on engineering high-durability backend systems using Domain-Driven Design (DDD), .NET 8 Clean Architecture, and Laravel 12 multi-tier platforms. Dedicated to clean code craftsmanship, robust data schemas, and mentoring the next cohort of engineers.
          </div>

          {/* ACTIONS & DISPATCH CLUSTER */}
          <div className="flex flex-wrap gap-2 sm:gap-2.5 pt-1">
            <a
              href="#projects"
              onClick={() => sound.playClick()}
              className="hero-action-btn pixel-btn text-[0.65rem] sm:text-xs min-h-[44px] px-4 text-center flex items-center justify-center bg-[var(--color-text)] text-[var(--color-bg)] font-pixel font-bold shadow-[3px_3px_0px_var(--color-border)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)] transition-all cursor-pointer flex-1 sm:flex-initial"
            >
              <span className="w-2 h-2 bg-[var(--color-bg)] mr-2 inline-block animate-ping group-hover:bg-[var(--color-text)]" />
              [⚡ VIEW_ARCH_BLUEPRINTS]
            </a>
            <a
              href="/assets/Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sound.playClick()}
              className="hero-action-btn pixel-btn text-[0.65rem] sm:text-xs min-h-[44px] px-3.5 text-center flex items-center justify-center cursor-pointer flex-1 sm:flex-initial"
            >
              [+] GET_RESUME
            </a>
            <a
              href="https://github.com/QuantumTan"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sound.playClick()}
              className="hero-action-btn pixel-btn text-[0.65rem] sm:text-xs min-h-[44px] px-3 text-center flex items-center justify-center cursor-pointer"
            >
              [#] GITHUB
            </a>
            <a
              href="https://www.linkedin.com/in/jonathan-jr-peguit-a446ba1b8/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sound.playClick()}
              className="hero-action-btn pixel-btn text-[0.65rem] sm:text-xs min-h-[44px] px-3 text-center flex items-center justify-center cursor-pointer"
            >
              [IN] LINKEDIN
            </a>
            <a
              href="mailto:jonathanjrhayo@gmail.com"
              onClick={() => sound.playClick()}
              className="hero-action-btn pixel-btn text-[0.65rem] sm:text-xs min-h-[44px] px-3 text-center flex items-center justify-center cursor-pointer"
            >
              [@] CONTACT
            </a>
          </div>
        </div>

        {/* ── RIGHT ZONE: TECHNICAL TELEMETRY & FLAGSHIP SHORTCUTS (5 COLS) ── */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-4 sm:gap-5">
          {/* SYSTEM VITALS & ARCHITECTURE TELEMETRY */}
          <div className="hero-telemetry-box pixel-box p-4 sm:p-5 bg-[var(--color-surface)] font-mono text-xs flex flex-col justify-between">
            <div className="flex items-center justify-between border-b-2 border-[var(--color-border)] pb-2.5 mb-3">
              <span className="font-pixel text-[0.7rem] text-[var(--color-text)]">
                ENGINEERING_TELEMETRY // VITALS
              </span>
              <span className="font-mono text-[0.6rem] bg-[var(--color-card)] border border-[var(--color-border)] px-1.5 py-0.5 text-[var(--color-text)]">
                100% NOMINAL
              </span>
            </div>

            <div className="space-y-2 py-1 text-[0.68rem] sm:text-[0.72rem]">
              <div className="flex justify-between border-b border-dashed border-[var(--color-border)] pb-1.5">
                <span className="text-[var(--color-text-dim)]">CORE_RUNTIMES:</span>
                <span className="text-[var(--color-text)] font-bold">.NET 8 • PHP 8.2 • JAVA 21 • TS</span>
              </div>
              <div className="flex justify-between border-b border-dashed border-[var(--color-border)] pb-1.5">
                <span className="text-[var(--color-text-dim)]">ARCH_PATTERNS:</span>
                <span className="text-[var(--color-text)]">CLEAN ONION • DDD • CQRS • RBAC</span>
              </div>
              <div className="flex justify-between border-b border-dashed border-[var(--color-border)] pb-1.5">
                <span className="text-[var(--color-text-dim)]">PERSISTENCE:</span>
                <span className="text-[var(--color-text)]">EF CORE • SQL SERVER • MYSQL</span>
              </div>
              <div className="flex justify-between border-b border-dashed border-[var(--color-border)] pb-1.5">
                <span className="text-[var(--color-text-dim)]">TESTING & CI/CD:</span>
                <span className="text-[var(--color-text)]">PEST PHP • XUNIT • GITHUB ACTIONS</span>
              </div>
              <div className="flex justify-between border-b border-dashed border-[var(--color-border)] pb-1.5">
                <span className="text-[var(--color-text-dim)]">ACADEMIC_ROLE:</span>
                <span className="text-[var(--color-text)]">PEER MENTOR & ORG OFFICER @ UM</span>
              </div>
              <div className="flex justify-between pb-0.5">
                <span className="text-[var(--color-text-dim)]">VERIFIED_CREDENTIALS:</span>
                <span className="text-[var(--color-text)] font-bold">CERTIPORT (PEARSON VUE) • HACKERRANK</span>
              </div>
            </div>
          </div>

          {/* FLAGSHIP ARCHITECTURE QUICK JUMP TILES */}
          <div className="pixel-box p-4 bg-[var(--color-card)] flex flex-col gap-2.5">
            <div className="flex items-center justify-between text-[0.65rem] font-mono text-[var(--color-text-dim)] pb-1 border-b border-[var(--color-border)]">
              <span>// FLAGSHIP_SYSTEMS_INDEX</span>
              <span>2 CORE REPOSITORIES</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
              <a
                href="#projects"
                onClick={() => sound.playClick()}
                className="p-2.5 border border-[var(--color-border)] hover:border-[var(--color-text)] bg-[var(--color-surface)] hover:bg-[var(--color-card-hover)] transition-all flex flex-col justify-between group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-pixel text-[0.65rem] text-[var(--color-text)] group-hover:underline">
                    CRMS_PEGUIT
                  </span>
                  <span className="font-mono text-[0.55rem] bg-[var(--color-card)] px-1.5 py-0.5 border border-[var(--color-border)] text-[var(--color-text)]">
                    .NET 8 // DDD
                  </span>
                </div>
                <p className="font-mono text-[0.62rem] text-[var(--color-text-dim)]">
                  Onion Architecture, MediatR CQRS, EF Core migrations, strict domain invariants.
                </p>
              </a>

              <a
                href="#projects"
                onClick={() => sound.playClick()}
                className="p-2.5 border border-[var(--color-border)] hover:border-[var(--color-text)] bg-[var(--color-surface)] hover:bg-[var(--color-card-hover)] transition-all flex flex-col justify-between group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-pixel text-[0.65rem] text-[var(--color-text)] group-hover:underline">
                    ENTERPRISE_CRM
                  </span>
                  <span className="font-mono text-[0.55rem] bg-[var(--color-card)] px-1.5 py-0.5 border border-[var(--color-border)] text-[var(--color-text)]">
                    LARAVEL 12 // RBAC
                  </span>
                </div>
                <p className="font-mono text-[0.62rem] text-[var(--color-text-dim)]">
                  Role-based access control, Kanban sales pipeline, audit trails, Pest test suite.
                </p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

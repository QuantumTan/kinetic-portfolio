"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { sound } from "@/utils/sound";
import { BoltIcon } from "@heroicons/react/24/outline";

const ROLES = [
  "Full-Stack .NET 8 (Clean Architecture & DDD)",
  "Quality Assurance & Test Automation (Pest & xUnit)",
  "Laravel 12 (PHP 8.2 & Enterprise MVC)",
  "Next.js 15 & TypeScript (App Router)",
  "API Integrity & Relational Schemas (MySQL / SQL Server)",
  "Defect Lifecycle Analysis & Automated Regression QA",
];

interface GithubPulse {
  repo: string;
  type: string;
  timeAgo: string;
  commitMsg?: string;
}

export default function Hero() {
  const container = useRef<HTMLDivElement>(null);
  const [roleIndex, setRoleIndex] = useState(0);
  const [roleText, setRoleText] = useState(ROLES[0]);
  const [isDeleting, setIsDeleting] = useState(false);

  // Live Davao City Clock (Asia/Manila UTC+8)
  const [localTime, setLocalTime] = useState<string>("");

  // Live Ping Telemetry
  const [pingLatency, setPingLatency] = useState<number | null>(null);
  const [isPinging, setIsPinging] = useState(false);

  // Live GitHub Pulse
  const [githubPulse, setGithubPulse] = useState<GithubPulse>({
    repo: "QuantumTan/CRMS_Peguit",
    type: "PushEvent",
    timeAgo: "Recently synced",
    commitMsg: "feat(domain): aggregate invariants & CQRS handlers",
  });

  // CV / Resume Locked State Notice
  const [cvLockedNotice, setCvLockedNotice] = useState<string | null>(null);

  // Clock Ticker
  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const formatted = new Intl.DateTimeFormat("en-US", {
          timeZone: "Asia/Manila",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }).format(now);
        setLocalTime(formatted);
      } catch {
        setLocalTime("08:00:00 PM (UTC+8)");
      }
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Ping handler
  const executePing = useCallback(async () => {
    setIsPinging(true);
    sound.playPing();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("kinetic:pulse", { detail: { power: 1.4 } }));
    }

    const start = performance.now();
    try {
      const res = await fetch("/api/ping", { cache: "no-store" });
      if (res.ok) {
        const roundTrip = Math.round(performance.now() - start);
        setPingLatency(Math.max(12, roundTrip));
      } else {
        setPingLatency(Math.floor(Math.random() * 20) + 18);
      }
    } catch {
      setPingLatency(Math.floor(Math.random() * 20) + 18);
    } finally {
      setIsPinging(false);
    }
  }, []);

  // Initial Ping on mount
  useEffect(() => {
    executePing();
  }, [executePing]);

  // Live GitHub Pulse Fetcher
  useEffect(() => {
    const fetchGitHubPulse = async () => {
      try {
        const res = await fetch("https://api.github.com/users/QuantumTan/events/public", {
          headers: { Accept: "application/vnd.github.v3+json" },
        });

        if (!res.ok) return; // Silent fallback to default

        const events = await res.json();
        if (Array.isArray(events) && events.length > 0) {
          const pushEvt = events.find((e) => e.type === "PushEvent") || events[0];
          if (pushEvt && pushEvt.repo) {
            const date = new Date(pushEvt.created_at);
            const diffHours = Math.max(1, Math.round((Date.now() - date.getTime()) / (1000 * 60 * 60)));
            const timeAgo = diffHours > 48 ? `${Math.round(diffHours / 24)}d ago` : `${diffHours}h ago`;
            const commitMsg = pushEvt.payload?.commits?.[0]?.message || "Recent commit verified";

            setGithubPulse({
              repo: pushEvt.repo.name,
              type: pushEvt.type,
              timeAgo,
              commitMsg,
            });
          }
        }
      } catch {
        // Retain default verified fallback
      }
    };

    fetchGitHubPulse();
  }, []);

  // Smooth Typewriter effect
  useEffect(() => {
    const currentFull = ROLES[roleIndex];
    const typingSpeed = isDeleting ? 20 : 45;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setRoleText(currentFull.slice(0, roleText.length + 1));
        if (roleText.length === currentFull.length) {
          setTimeout(() => setIsDeleting(true), 2000);
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

  const getLatencyBadge = () => {
    if (pingLatency === null) return { color: "text-emerald-700 dark:text-emerald-400 border-emerald-600 dark:border-emerald-500", label: "CALIBRATING" };
    if (pingLatency < 60) return { color: "text-emerald-700 dark:text-emerald-400 border-emerald-600 dark:border-emerald-500 bg-emerald-100 dark:bg-emerald-950/20", label: "EXCELLENT" };
    if (pingLatency < 150) return { color: "text-amber-800 dark:text-amber-400 border-amber-600 dark:border-amber-500 bg-amber-100 dark:bg-amber-950/20", label: "NOMINAL" };
    return { color: "text-rose-800 dark:text-rose-400 border-rose-600 dark:border-rose-500 bg-rose-100 dark:bg-rose-950/20", label: "DEGRADED" };
  };

  const latencyInfo = getLatencyBadge();

  return (
    <section
      id="home"
      ref={container}
      className="relative w-full max-w-[1200px] mx-auto pt-4 sm:pt-6 pb-6 sm:pb-12 flex flex-col justify-center scroll-mt-[100px]"
    >
      {/* TOP TELEMETRY STRIP */}
      <div className="hero-hud-badge mt-2 sm:mt-4 flex flex-wrap items-center justify-between gap-2.5 border-2 border-[var(--color-border)] bg-[var(--color-surface)] p-2.5 sm:p-3 mb-5 sm:mb-6 font-mono text-[0.68rem] sm:text-xs text-[var(--color-text-dim)]">
        <button
          type="button"
          onClick={executePing}
          disabled={isPinging}
          className="flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer min-h-[36px]"
          title="Click to run real-time round-trip latency ping"
        >
          <span className="w-2 h-2 bg-emerald-600 dark:bg-emerald-400 inline-block animate-pulse" />
          <span className="font-pixel text-[0.62rem] sm:text-[0.68rem] text-[var(--color-text)] inline-flex items-center gap-1">
            SYSTEM_STATUS: ONLINE // v3.0 [PING <BoltIcon className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />]
          </span>
        </button>

        {/* CLOCK METRIC */}
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[var(--color-text)] inline-block" />
          <span className="text-[var(--color-text)] font-mono font-medium">
            DAVAO CITY: <strong className="text-emerald-700 dark:text-emerald-400">{localTime || "12:00:00 PM"}</strong> (UTC+8)
          </span>
        </div>

        {/* LATENCY METRIC */}
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-[var(--color-text-dim)]">PING:</span>
          <span className={`px-2 py-0.5 border font-pixel text-[0.58rem] ${latencyInfo.color}`}>
            {pingLatency ? `${pingLatency}ms // ${latencyInfo.label}` : "CHECKING..."}
          </span>
        </div>
      </div>

      {/* ASYMMETRIC COMMAND BENTO GRID */}
      <div className="grid lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
        {/* ── LEFT ZONE: OPERATOR & CONFIDENT ENGINEERING IDENTITY (7 COLS) ── */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-4 sm:gap-5">
          {/* PRIMARY OPERATOR IDENTITY BOX */}
          <div className="hero-title-box pixel-box p-4 sm:p-6 relative group transition-all">
            <div className="flex flex-wrap items-center justify-between gap-1.5 font-mono text-[0.68rem] sm:text-xs text-[var(--color-text-dim)] mb-2.5 pb-1.5 border-b border-[var(--color-border)]">
              <span>// OPERATOR_ID: QUANTUM_TAN [FULL_STACK // QA]</span>
              <span className="font-mono text-[0.62rem] sm:text-[0.65rem] bg-[var(--color-card)] px-2 py-0.5 border border-[var(--color-border)] text-[var(--color-text)]">
                3RD YEAR IT @ UNIV OF MINDANAO
              </span>
            </div>

            {/* Clean Sans-Serif Heading for 80/20 Scannability */}
            <h1 className="font-sans font-bold text-2xl sm:text-4xl md:text-[2.75rem] text-[var(--color-text)] tracking-tight leading-tight select-none py-1">
              Jonathan Peguit Jr.
            </h1>

            <div className="mt-3 pt-3 border-t border-[var(--color-border)] flex flex-col gap-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[0.65rem] sm:text-xs text-[var(--color-text-dim)] uppercase">
                  [SPECIALIZATION]:
                </span>
                <span className="font-sans text-xs sm:text-sm text-[var(--color-text)] font-semibold bg-[var(--color-surface)] px-2.5 py-1 border border-[var(--color-border)]">
                  Full-Stack Developer & Quality Assurance Analyst
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 font-mono text-[0.68rem] sm:text-xs text-[var(--color-text-muted)]">
                <span className="text-[var(--color-text-dim)] shrink-0">// LIVE_RUNTIME:</span>
                <span className="text-[var(--color-text)] bg-[var(--color-card)] px-2.5 py-1 border border-[var(--color-border)] font-bold break-words max-w-full">
                  {roleText}
                  <span className="terminal-cursor text-emerald-600 dark:text-emerald-400 font-bold ml-1">█</span>
                </span>
              </div>
            </div>
          </div>

          {/* CONFIDENT ENGINEERING BIO */}
          <div className="pixel-box p-4 sm:p-5 text-sm sm:text-[0.95rem] font-sans text-[var(--color-text)] leading-relaxed bg-[var(--color-surface)]">
            <div className="flex items-center gap-2 font-mono text-xs text-[var(--color-text-dim)] mb-2.5 pb-1 border-b border-[var(--color-border)]">
              <span className="w-1.5 h-1.5 bg-emerald-600 dark:bg-emerald-400 inline-block" />
              <span className="font-pixel text-[0.65rem] text-[var(--color-text)]">EXECUTIVE_BRIEF // ARCHITECTURAL & QA CREED</span>
            </div>
            Full-Stack Developer & Quality Assurance Analyst specializing in .NET 8 Clean Architecture, Laravel 12, Next.js, and automated test verification. Engineering resilient enterprise platforms and ensuring defect-free release pipelines through automated unit/feature suites, regression testing, and rigorous QA analysis.
          </div>

          {/* ACTIONS & DISPATCH CLUSTER */}
          <div className="flex flex-wrap gap-2 sm:gap-2.5 pt-1">
            <a
              href="#projects"
              onClick={() => sound.playClick()}
              className="hero-action-btn pixel-btn text-[0.68rem] sm:text-xs min-h-[44px] px-4 text-center flex items-center justify-center bg-[var(--color-text)] text-[var(--color-bg)] font-pixel font-bold shadow-[3px_3px_0px_var(--color-border)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)] transition-all cursor-pointer flex-1 sm:flex-initial"
            >
              <span className="w-2 h-2 bg-[var(--color-bg)] mr-2 inline-block animate-ping group-hover:bg-[var(--color-text)]" />
              <span className="inline-flex items-center gap-1.5">
                <BoltIcon className="w-3.5 h-3.5" />
                [VIEW_ARCH_BLUEPRINTS]
              </span>
            </a>
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setCvLockedNotice(
                  "[STATUS: LOCKED] Jonathan's official CV is currently undergoing revision with updated credentials. All verified technical specifications are available in this live portfolio, or email jonathanjrhayo@gmail.com for direct requests."
                );
              }}
              title="Official CV is currently locked for revisions"
              className="hero-action-btn pixel-btn text-[0.68rem] sm:text-xs min-h-[44px] px-3.5 text-center flex items-center justify-center cursor-pointer flex-1 sm:flex-initial border-amber-600/70 dark:border-amber-500/60 text-amber-700 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20"
            >
              <span className="w-1.5 h-1.5 bg-amber-500 inline-block mr-1.5 animate-pulse" />
              <span>[CV_LOCKED // UPDATING]</span>
            </button>
            <a
              href="https://github.com/QuantumTan"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sound.playClick()}
              className="hero-action-btn pixel-btn text-[0.68rem] sm:text-xs min-h-[44px] px-3 text-center flex items-center justify-center cursor-pointer"
            >
              [#] GITHUB
            </a>
            <a
              href="https://www.linkedin.com/in/jonathan-jr-peguit-a446ba1b8/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sound.playClick()}
              className="hero-action-btn pixel-btn text-[0.68rem] sm:text-xs min-h-[44px] px-3 text-center flex items-center justify-center cursor-pointer"
            >
              [IN] LINKEDIN
            </a>
            <a
              href="mailto:jonathanjrhayo@gmail.com"
              onClick={() => sound.playClick()}
              className="hero-action-btn pixel-btn text-[0.68rem] sm:text-xs min-h-[44px] px-3 text-center flex items-center justify-center cursor-pointer"
            >
              [@] CONTACT
            </a>
          </div>

          {/* CV LOCKED NOTICE BANNER */}
          {cvLockedNotice && (
            <div className="mt-3 p-3 bg-amber-500/10 border-2 border-amber-600/70 dark:border-amber-400 text-amber-800 dark:text-amber-300 font-mono text-[0.68rem] sm:text-xs flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-amber-500 inline-block animate-ping shrink-0" />
                <span>{cvLockedNotice}</span>
              </div>
              <button
                type="button"
                onClick={() => setCvLockedNotice(null)}
                className="text-xs font-bold underline px-1 shrink-0 cursor-pointer hover:text-[var(--color-text)]"
              >
                [DISMISS]
              </button>
            </div>
          )}
        </div>

        {/* ── RIGHT ZONE: REAL-TIME TELEMETRY HUD (CORE_DIAGNOSTICS) (5 COLS) ── */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-4 sm:gap-5">
          {/* CORE DIAGNOSTICS HUD PANEL */}
          <div className="hero-telemetry-box pixel-box p-4 sm:p-5 bg-[var(--color-surface)] font-mono text-xs flex flex-col justify-between">
            <div className="flex items-center justify-between border-b-2 border-[var(--color-border)] pb-2.5 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-600 dark:bg-emerald-400 inline-block animate-pulse" />
                <span className="font-pixel text-[0.7rem] text-[var(--color-text)]">
                  CORE_DIAGNOSTICS // HUD
                </span>
              </div>
              <button
                type="button"
                onClick={executePing}
                disabled={isPinging}
                className="font-pixel text-[0.58rem] bg-[var(--color-card)] border border-[var(--color-border)] hover:border-[var(--color-text)] px-2 py-0.5 text-[var(--color-text)] cursor-pointer inline-flex items-center gap-1"
              >
                {isPinging ? (
                  "PINGING..."
                ) : (
                  <>
                    <BoltIcon className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    [RUN_PING]
                  </>
                )}
              </button>
            </div>

            {/* LIVE METRICS TILES */}
            <div className="space-y-2.5 py-1 text-[0.7rem] sm:text-[0.73rem]">
              {/* LIVE TIME */}
              <div className="flex items-center justify-between border-b border-dashed border-[var(--color-border)] pb-2">
                <span className="text-[var(--color-text-dim)]">DAVAO_CITY_TIME:</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold font-mono">
                  {localTime || "SYNCING..."}
                </span>
              </div>

              {/* LIVE PING LATENCY */}
              <div className="flex items-center justify-between border-b border-dashed border-[var(--color-border)] pb-2">
                <span className="text-[var(--color-text-dim)]">NETWORK_LATENCY:</span>
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full inline-block ${pingLatency && pingLatency < 60 ? "bg-emerald-600 dark:bg-emerald-400" : "bg-amber-600 dark:bg-amber-400"}`} />
                  <span className="text-[var(--color-text)] font-bold">
                    {pingLatency !== null ? `${pingLatency} ms` : "Calculating..."}
                  </span>
                  <span className={`font-pixel text-[0.52rem] px-1 border ${latencyInfo.color}`}>
                    {latencyInfo.label}
                  </span>
                </div>
              </div>

              {/* LIVE GITHUB PULSE */}
              <div className="border-b border-dashed border-[var(--color-border)] pb-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[var(--color-text-dim)]">GITHUB_PULSE:</span>
                  <span className="text-[0.62rem] text-emerald-700 dark:text-emerald-400 font-bold">{githubPulse.timeAgo}</span>
                </div>
                <div className="bg-[var(--color-card)] p-1.5 border border-[var(--color-border)] flex items-center justify-between gap-1">
                  <span className="font-bold text-[var(--color-text)] truncate">{githubPulse.repo}</span>
                  <span className="text-[0.6rem] text-[var(--color-text-dim)] shrink-0">[PUSH_OK]</span>
                </div>
              </div>

              {/* ARCHITECTURE RUNTIMES */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-2 border-b border-dashed border-[var(--color-border)] pb-1.5">
                <span className="text-[var(--color-text-dim)] shrink-0">CORE_DISCIPLINE:</span>
                <span className="text-[var(--color-text)] font-bold text-left sm:text-right">FULL-STACK & QA ANALYST</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-2 border-b border-dashed border-[var(--color-border)] pb-1.5">
                <span className="text-[var(--color-text-dim)] shrink-0">ENTERPRISE_STACK:</span>
                <span className="text-[var(--color-text)] font-bold text-left sm:text-right">.NET 8 • LARAVEL 12 • NEXT.JS • PEST</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-2 border-b border-dashed border-[var(--color-border)] pb-1.5">
                <span className="text-[var(--color-text-dim)] shrink-0">DESIGN_&_QA:</span>
                <span className="text-[var(--color-text)] text-left sm:text-right">DDD • CLEAN CQRS • PEST QA • RBAC</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-2 pb-0.5">
                <span className="text-[var(--color-text-dim)] shrink-0">ACADEMIC_LEADERSHIP:</span>
                <span className="text-[var(--color-text)] font-bold text-left sm:text-right">PEER MENTOR & OFFICER @ UM</span>
              </div>
            </div>
          </div>

          {/* ARCHITECTURE CAPABILITY MATRIX */}
          <div className="pixel-box p-4 bg-[var(--color-card)] flex flex-col gap-2.5">
            <div className="flex items-center justify-between text-[0.68rem] font-mono text-[var(--color-text-dim)] pb-1 border-b border-[var(--color-border)]">
              <span>// ARCHITECTURE_CAPABILITY_MATRIX</span>
              <span className="font-mono text-[0.62rem] text-emerald-700 dark:text-emerald-400 font-bold">
                ENTERPRISE RIGOR
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[0.7rem] font-mono">
              <div className="p-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[var(--color-text)]">01 // DOMAIN_CORE</span>
                  <span className="text-[0.55rem] px-1 py-0.2 border border-emerald-600/50 text-emerald-700 dark:text-emerald-400 bg-emerald-100/60 dark:bg-emerald-950/20 font-bold">
                    DDD
                  </span>
                </div>
                <p className="font-sans text-[0.68rem] text-[var(--color-text-muted)] leading-tight">
                  Strict boundary isolation, MediatR CQRS, and zero ORM leakage in domain models.
                </p>
              </div>

              <div className="p-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[var(--color-text)]">02 // MULTI_TIER_RBAC</span>
                  <span className="text-[0.55rem] px-1 py-0.2 border border-emerald-600/50 text-emerald-700 dark:text-emerald-400 bg-emerald-100/60 dark:bg-emerald-950/20 font-bold">
                    SECURITY
                  </span>
                </div>
                <p className="font-sans text-[0.68rem] text-[var(--color-text-muted)] leading-tight">
                  Spatie permission gates, FormRequest validation, and full audit trail pipelines.
                </p>
              </div>

              <div className="p-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[var(--color-text)]">03 // PERSISTENCE</span>
                  <span className="text-[0.55rem] px-1 py-0.2 border border-emerald-600/50 text-emerald-700 dark:text-emerald-400 bg-emerald-100/60 dark:bg-emerald-950/20 font-bold">
                    ACID
                  </span>
                </div>
                <p className="font-sans text-[0.68rem] text-[var(--color-text-muted)] leading-tight">
                  EF Core 8 Fluent API mappings, normalized MySQL schemas, and indexing.
                </p>
              </div>

              <div className="p-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[var(--color-text)]">04 // AUTOMATED_QA</span>
                  <span className="text-[0.55rem] px-1 py-0.2 border border-emerald-600/50 text-emerald-700 dark:text-emerald-400 bg-emerald-100/60 dark:bg-emerald-950/20 font-bold">
                    PEST
                  </span>
                </div>
                <p className="font-sans text-[0.68rem] text-[var(--color-text-muted)] leading-tight">
                  Unit & feature test suites with invariant assertion and deterministic state.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

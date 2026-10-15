"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { sound } from "@/utils/sound";
import { UserGroupIcon, AcademicCapIcon, CommandLineIcon } from "@heroicons/react/24/outline";

const COMPETENCIES = [
  "Domain-Driven Design",
  "Object-Oriented Analysis",
  "Data Structures & Algorithms",
  "Enterprise Systems Architecture",
  "Technical Peer Coaching",
  "Code Review Rigor",
];

export default function Education() {
  const container = useRef<HTMLDivElement>(null);
  const [honorsExpanded, setHonorsExpanded] = useState(false);

  useGSAP(
    () => {
      if (!container.current) return;
      gsap.fromTo(
        ".edu-ledger-item",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.35, stagger: 0.05, ease: "power2.out" }
      );
    },
    { scope: container }
  );

  return (
    <section id="education" ref={container} className="section-card scroll-mt-[100px] w-full h-full flex flex-col">
      {/* SECTION HEADER */}
      <div className="flex flex-wrap items-center justify-between border-b-2 border-[var(--color-border)] pb-3 mb-5 gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-emerald-600 dark:bg-emerald-400 inline-block animate-pulse" />
          <h2 className="font-pixel text-xs sm:text-base text-[var(--color-text)] tracking-wider uppercase">
            04 // ACADEMIC_TRAJECTORY
          </h2>
        </div>
        <span className="font-mono text-xs text-[var(--color-text-dim)]">
          [UNIVERSITY OF MINDANAO // ACTIVE ENROLLMENT]
        </span>
      </div>

      <div className="space-y-4 flex-1 flex flex-col justify-between">
        {/* ── PRIMARY FEATURED DEGREE: UNIVERSITY OF MINDANAO (BS IT) ── */}
        <article className="edu-ledger-item pixel-box p-4 sm:p-5 bg-[var(--color-card)] border-2 border-emerald-600 dark:border-emerald-400/80 shadow-[4px_4px_0px_var(--color-accent)]">
          {/* HEADER STRIP */}
          <div className="flex flex-wrap items-center justify-between gap-1.5 font-mono text-[0.65rem] text-[var(--color-text-dim)] mb-2 pb-1.5 border-b border-[var(--color-border)]">
            <div className="flex items-center gap-2">
              <span className="font-bold text-emerald-700 dark:text-emerald-400 font-mono">[EDU-01 // PRIMARY DEGREE]</span>
              <span className="text-[var(--color-text)] font-mono text-[0.62rem]">
                // 2024 - PRESENT
              </span>
            </div>
            <span className="font-mono text-[0.58rem] bg-emerald-100/60 dark:bg-emerald-950/20 border border-emerald-600/50 dark:border-emerald-500 px-2 py-0.5 text-emerald-700 dark:text-emerald-400 font-bold">
              3RD YEAR ENROLLED
            </span>
          </div>

          {/* INSTITUTION & PROGRAM */}
          <h3 className="font-sans font-bold text-base sm:text-lg text-[var(--color-text)] mb-0.5">
            University of Mindanao
          </h3>
          <div className="font-sans text-xs sm:text-sm text-emerald-700 dark:text-emerald-400 font-semibold mb-3">
            Bachelor of Science in Information Technology (BS IT)
          </div>

          {/* ACADEMIC & LEADERSHIP HIGHLIGHTS */}
          <div className="space-y-2 mb-3.5 font-sans text-xs text-[var(--color-text-muted)]">
            <div className="flex items-start gap-2 bg-[var(--color-surface)] p-2.5 border border-[var(--color-border)]">
              <UserGroupIcon className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-[var(--color-text)]">Student Organization Officer:</strong> Co-organizing institutional tech clinics, programming hackathons, and collaborative software engineering workshops.
              </div>
            </div>

            <div className="flex items-start gap-2 bg-[var(--color-surface)] p-2.5 border border-[var(--color-border)]">
              <AcademicCapIcon className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-[var(--color-text)]">Technical Peer Mentor:</strong> Coaching students in Java Object-Oriented Programming, .NET Clean Architecture, and relational database schema design.
              </div>
            </div>

            <div className="flex items-start gap-2 bg-[var(--color-surface)] p-2.5 border border-[var(--color-border)]">
              <CommandLineIcon className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-[var(--color-text)]">Core Curriculum:</strong> Relational Database Systems, Systems Analysis & Design, Data Structures & Algorithms, Network Routing.
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[var(--color-border)] flex flex-wrap items-center justify-between gap-1 font-mono text-[0.62rem] text-[var(--color-text-dim)]">
            <span>CAMPUS: MATINA, DAVAO CITY</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-bold">STATUS: VERIFIED ACTIVE</span>
          </div>
        </article>

        {/* ── SECONDARY / FOUNDATIONAL HONORS: ACCORDION FOOTER CARD ── */}
        <div className="edu-ledger-item pixel-box p-3 sm:p-3.5 bg-[var(--color-surface)] border border-[var(--color-border)]">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setHonorsExpanded((prev) => !prev);
            }}
            className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-left cursor-pointer min-h-[44px]"
          >
            <div className="flex items-center gap-2">
              <span className="font-mono text-[0.62rem] text-emerald-700 dark:text-emerald-400 font-bold shrink-0">[EDU-02]</span>
              <span className="font-sans font-semibold text-xs sm:text-sm text-[var(--color-text)]">
                Foundational Academic Honors — Calinan National High School
              </span>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
              <span className="font-mono text-[0.58rem] bg-[var(--color-card)] border border-emerald-600/40 dark:border-[var(--color-border)] px-1.5 py-0.5 text-emerald-700 dark:text-emerald-400 font-bold">
                HIGH HONORS
              </span>
              <span className="font-mono text-xs text-[var(--color-text-dim)]">
                {honorsExpanded ? "▲" : "▼"}
              </span>
            </div>
          </button>

          {honorsExpanded && (
            <div className="mt-3 pt-3 border-t border-dashed border-[var(--color-border)] font-sans text-xs text-[var(--color-text-muted)] space-y-2 animate-in fade-in duration-150">
              <div className="flex flex-wrap items-center justify-between gap-1 font-mono text-[0.62rem] text-[var(--color-text-dim)]">
                <span>PROGRAM: ACCOUNTANCY, BUSINESS & MANAGEMENT (ABM)</span>
                <span>TIMELINE: 2022 - 2024</span>
              </div>
              <p>
                Graduated with <strong className="text-[var(--color-text)]">High Honors</strong> and presented quantitative business research. Developed early foundation in financial ledgers, audit workflows, and business domain logic that directly informs my CRM architecture.
              </p>
            </div>
          )}
        </div>

        {/* CORE ACADEMIC COMPETENCIES STRIP */}
        <div className="pixel-box p-3 bg-[var(--color-surface)] border border-[var(--color-border)] font-mono text-[0.62rem]">
          <div className="text-[var(--color-text-dim)] text-[0.62rem] uppercase mb-1.5 pb-0.5 border-b border-[var(--color-border)] flex items-center justify-between">
            <span>// CORE_ACADEMIC_COMPETENCIES:</span>
            <span>VERIFIED SKILLSETS</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {COMPETENCIES.map((comp) => (
              <span
                key={comp}
                className="font-sans text-[0.68rem] px-2 py-0.5 border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-text)]"
              >
                {comp}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { mentorshipData } from "@/data/mentorship-data";
import { sound } from "@/utils/sound";

export default function MentorshipTelemetry() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!container.current) return;
      gsap.fromTo(
        ".mentorship-item",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.35, stagger: 0.05, ease: "power2.out" }
      );
    },
    { scope: container }
  );

  return (
    <section
      id="mentorship"
      ref={container}
      className="section-card scroll-mt-[100px] w-full"
    >
      {/* SECTION HEADER */}
      <div className="flex flex-wrap items-center justify-between border-b-2 border-[var(--color-border)] pb-3 mb-6 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[var(--color-text)] animate-ping inline-block" />
            <h2 className="font-pixel text-xs sm:text-base text-[var(--color-text)] tracking-wider uppercase">
              05 // MENTORSHIP & TECHNICAL LEADERSHIP
            </h2>
          </div>
          <p className="font-mono text-[0.6rem] sm:text-xs text-[var(--color-text-dim)] mt-0.5">
            [UNIVERSITY OF MINDANAO // PEER COACHING, CODE REVIEWS & ARCHITECTURE LABS]
          </p>
        </div>

        <span className="font-mono text-xs text-[var(--color-text-dim)]">
          [ROLE: {mentorshipData.role.toUpperCase()}]
        </span>
      </div>

      {/* TOP TELEMETRY KPI TILES */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {mentorshipData.metrics.map((m) => (
          <div
            key={m.id}
            className="mentorship-item pixel-box p-3 sm:p-4 text-center bg-[var(--color-surface)] flex flex-col justify-between"
          >
            <div className="font-pixel text-lg sm:text-2xl text-[var(--color-text)] mb-1">
              {m.value}
            </div>
            <div className="font-pixel text-[0.6rem] sm:text-[0.65rem] text-[var(--color-text)] tracking-wider mb-1">
              {m.label}
            </div>
            <p className="font-mono text-[0.6rem] text-[var(--color-text-dim)] line-clamp-2">
              {m.description}
            </p>
          </div>
        ))}
      </div>

      {/* 3 CORE MENTORSHIP PILLARS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {mentorshipData.pillars.map((pillar, idx) => (
          <div
            key={idx}
            className="mentorship-item pixel-box p-4 bg-[var(--color-card)] border border-[var(--color-border)] flex flex-col justify-between hover:border-[var(--color-text)] transition-all"
          >
            <div>
              <div className="flex items-center justify-between font-mono text-[0.65rem] text-[var(--color-text-dim)] mb-2 border-b border-[var(--color-border)] pb-1.5">
                <span>PILLAR_0{idx + 1}</span>
                <span className="text-[var(--color-text)] font-bold">CORE DOMAIN</span>
              </div>
              <h3 className="font-pixel text-xs sm:text-sm text-[var(--color-text)] mb-1.5 leading-snug">
                {pillar.title}
              </h3>
              <p className="font-mono text-[0.65rem] text-[var(--color-text-dim)] mb-3">
                SCOPE: {pillar.scope}
              </p>
              <p className="font-mono text-xs text-[var(--color-text-muted)] leading-relaxed mb-4">
                {pillar.impactStatement}
              </p>
            </div>

            <div className="flex flex-wrap gap-1 pt-2 border-t border-[var(--color-border)]">
              {pillar.skills.map((skill, sIdx) => (
                <span
                  key={sIdx}
                  className="pixel-tag text-[0.55rem] font-mono border border-[var(--color-border)]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* FACULTY & COHORT ENDORSEMENT QUOTES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mentorshipData.endorsements.map((end, idx) => (
          <div
            key={idx}
            className="mentorship-item p-4 bg-[var(--color-surface)] border-2 border-[var(--color-border)] flex flex-col justify-between"
          >
            <p className="font-mono text-xs text-[var(--color-text)] italic leading-relaxed mb-3">
              &ldquo;{end.quote}&rdquo;
            </p>
            <div className="border-t border-dashed border-[var(--color-border)] pt-2 flex items-center justify-between text-[0.65rem] font-mono">
              <span className="font-bold text-[var(--color-text)]">{end.author}</span>
              <span className="text-[var(--color-text-dim)]">{end.role}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

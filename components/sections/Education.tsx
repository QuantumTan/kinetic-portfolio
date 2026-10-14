"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const EDUCATION_RECORDS = [
  {
    code: "EDU-01",
    institution: "UNIVERSITY OF MINDANAO",
    timeline: "2024 - PRESENT",
    program: "BACHELOR OF SCIENCE IN INFORMATION TECHNOLOGY",
    status: "3RD YEAR // ENROLLED",
    badgeLabel: "PRIMARY_DEGREE",
    highlights: [
      "Student Organization Officer: Co-organizing institutional tech clinics and hackathons.",
      "Technical Peer Mentor: Coaching students in Java OOP, Clean Architecture, and SQL.",
      "Core Coursework: Relational Database Systems, Software Engineering, Network Routing.",
    ],
  },
  {
    code: "EDU-02",
    institution: "CALINAN NATIONAL HIGH SCHOOL",
    timeline: "2022 - 2024",
    program: "ACCOUNTANCY, BUSINESS & MANAGEMENT (ABM)",
    status: "GRADUATED // HIGH HONORS",
    badgeLabel: "SECONDARY_EDUCATION",
    highlights: [
      "Graduated with High Honors: Consistent academic excellence recognition.",
      "Research Presentation Awardee: Applied quantitative business analysis.",
      "Domain Transfer: Financial logic, ledger workflows, and ERP/CRM business processes.",
    ],
  },
];

const COMPETENCIES = [
  "RELATIONAL_DATABASE_DESIGN",
  "OBJECT_ORIENTED_ANALYSIS",
  "DATA_STRUCTURES_&_ALGORITHMS",
  "ENTERPRISE_SYSTEMS_DESIGN",
  "TECHNICAL_PEER_COACHING",
  "CODE_REVIEW_RIGOR",
];

export default function Education() {
  const container = useRef<HTMLDivElement>(null);

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
          <span className="w-2.5 h-2.5 bg-[var(--color-text)] inline-block animate-pulse" />
          <h2 className="font-pixel text-xs sm:text-base text-[var(--color-text)] tracking-wider uppercase">
            04 // ACADEMIC_TRAJECTORY
          </h2>
        </div>
        <span className="font-mono text-xs text-[var(--color-text-dim)]">
          [RECORDS: {EDUCATION_RECORDS.length}]
        </span>
      </div>

      {/* TIMELINE RECORDS */}
      <div className="space-y-3.5 flex-1 flex flex-col justify-between">
        {EDUCATION_RECORDS.map((rec) => (
          <article
            key={rec.code}
            className="edu-ledger-item pixel-box p-3.5 sm:p-4 bg-[var(--color-card)] border border-[var(--color-border)] hover:border-[var(--color-text)] transition-all flex flex-col justify-between group"
          >
            <div>
              {/* HEADER ROW */}
              <div className="flex items-center justify-between font-mono text-[0.65rem] text-[var(--color-text-dim)] mb-1.5 pb-1 border-b border-[var(--color-border)]">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[var(--color-text)]">{rec.code}</span>
                  <span className="text-[var(--color-text)] font-pixel text-[0.55rem]">
                    // {rec.timeline}
                  </span>
                </div>
                <span className="font-pixel text-[0.5rem] bg-[var(--color-surface)] border border-[var(--color-border)] px-1.5 py-0.5 text-[var(--color-text)]">
                  [{rec.status}]
                </span>
              </div>

              {/* INSTITUTION & PROGRAM */}
              <h3 className="font-pixel text-xs text-[var(--color-text)] mb-0.5 leading-snug">
                {rec.institution}
              </h3>
              <div className="font-mono text-[0.68rem] text-[var(--color-text-dim)] mb-2 font-bold">
                {rec.program}
              </div>

              {/* HIGHLIGHTS */}
              <ul className="space-y-1 mb-2 font-mono text-[0.65rem] text-[var(--color-text-muted)]">
                {rec.highlights.map((hl, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-[var(--color-text)] font-bold shrink-0">↳</span>
                    <span>{hl}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 border-t border-[var(--color-border)] flex items-center justify-between font-mono text-[0.6rem] text-[var(--color-text-dim)]">
              <span>STATUS: VERIFIED_ENROLLMENT</span>
              <span className="text-[var(--color-text)]">LEVEL: ACTIVE</span>
            </div>
          </article>
        ))}

        {/* CORE ACADEMIC COMPETENCY STRIP */}
        <div className="pixel-box p-3 bg-[var(--color-surface)] border border-[var(--color-border)] font-mono text-[0.62rem]">
          <div className="text-[var(--color-text-dim)] text-[0.6rem] uppercase mb-1.5 pb-0.5 border-b border-[var(--color-border)]">
            // CORE_ACADEMIC_COMPETENCIES:
          </div>
          <div className="flex flex-wrap gap-1">
            {COMPETENCIES.map((comp) => (
              <span
                key={comp}
                className="pixel-tag text-[0.55rem] border border-[var(--color-border)] bg-[var(--color-card)]"
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

"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const EDUCATION_RECORDS = [
  {
    institution: "UNIVERSITY OF MINDANAO",
    timeline: "2024 - PRESENT",
    program: "BACHELOR OF SCIENCE IN INFORMATION TECHNOLOGY",
    status: "ENROLLED // 2ND YEAR",
    details:
      "Student Organization Officer & Peer Mentor. Engaging in backend software architecture, networking algorithms, relational databases, and institutional tech events.",
  },
  {
    institution: "CALINAN NATIONAL HIGH SCHOOL",
    timeline: "2022 - 2024",
    program: "ACCOUNTANCY, BUSINESS & MANAGEMENT (ABM)",
    status: "GRADUATED // HIGH HONORS",
    details:
      "Graduated with High Honors. Recipient of academic and research presentation awards.",
  },
  {
    institution: "DACUDAO NATIONAL HIGH SCHOOL",
    timeline: "2018 - 2022",
    program: "JUNIOR HIGH SCHOOL CURRICULUM",
    status: "GRADUATED // HIGH HONORS",
    details:
      "Graduated with High Honors. Active contributor in academic clubs and mathematics/science symposiums.",
  },
];

export default function Education() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!container.current) return;
      gsap.fromTo(
        ".edu-log-entry",
        { opacity: 0, x: -15 },
        { opacity: 1, x: 0, duration: 0.35, stagger: 0.08, ease: "power2.out" }
      );
    },
    { scope: container }
  );

  return (
    <section id="education" ref={container} className="section-card">
      <div className="flex flex-wrap items-center justify-between border-b-2 border-[var(--color-border)] pb-3 mb-6 gap-2">
        <h2 className="font-pixel text-xs sm:text-base text-[var(--color-text)] tracking-wider uppercase">
          04 // ACADEMIC_TRAJECTORY
        </h2>
        <span className="font-mono text-xs text-[var(--color-text-dim)]">
          [LOGS: {EDUCATION_RECORDS.length}]
        </span>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {EDUCATION_RECORDS.map((rec, i) => (
          <div
            key={rec.institution}
            className="edu-log-entry pixel-box p-4 sm:p-5 group hover:border-[var(--color-text)] transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-[var(--color-border)] mb-3">
              <span className="font-pixel text-xs text-[var(--color-text)]">
                [0{i + 1}] {rec.institution}
              </span>
              <span className="font-mono text-xs text-[var(--color-text-dim)]">
                {rec.timeline}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="font-mono text-xs text-[var(--color-text)] font-bold">
                {rec.program}
              </span>
              <span className="pixel-tag text-[0.6rem]">
                {rec.status}
              </span>
            </div>

            <p className="font-mono text-xs text-[var(--color-text-muted)] leading-relaxed">
              {rec.details}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

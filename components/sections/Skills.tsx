"use client";

import { useState, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { sound } from "@/utils/sound";

interface SkillItem {
  name: string;
  query: string;
  spec: string;
  highlight?: boolean;
}

interface SkillTier {
  tierNumber: string;
  tierTitle: string;
  roleScope: string;
  badge: string;
  skills: SkillItem[];
}

const SKILL_TIERS: SkillTier[] = [
  {
    tierNumber: "01",
    tierTitle: "Core Backend & Architecture",
    badge: "TIER 1 // BACKEND & SYSTEMS",
    roleScope: "Strict domain boundaries, DDD aggregates, asynchronous concurrency, and clean API design.",
    skills: [
      {
        name: "C# .NET 8 (DDD / Clean Arch)",
        query: ".NET",
        spec: "Domain Invariants, CQRS, MediatR, Generics",
        highlight: true,
      },
      {
        name: "Laravel 12 (PHP 8.2 / MVC)",
        query: "Laravel",
        spec: "Multi-tier Services, Spatie RBAC, FormRequests",
        highlight: true,
      },
      {
        name: "RESTful API Design",
        query: "REST",
        spec: "OpenAPI Contracts, Problem Details RFC 7807",
        highlight: true,
      },
      {
        name: "Java (OOP)",
        query: "Java",
        spec: "Design Patterns, Collections, Thread Concurrency",
        highlight: true,
      },
    ],
  },
  {
    tierNumber: "02",
    tierTitle: "Frontend & Full-Stack",
    badge: "TIER 2 // FRONTEND & VIEWPORTS",
    roleScope: "Dynamic server-rendered interfaces, kinetic web motion, reactive states, and accessible layouts.",
    skills: [
      {
        name: "TypeScript & Next.js (App Router)",
        query: "Next.js",
        spec: "Server Components, Server Actions, Strict Types",
        highlight: true,
      },
      {
        name: "Blade & Livewire",
        query: "Blade",
        spec: "Component Slots, Server Rendering, Reactive Hooks",
        highlight: true,
      },
      {
        name: "Tailwind CSS & Bootstrap 5",
        query: "Tailwind",
        spec: "Fluid Grids, HUD Glassmorphism, Micro-animations",
        highlight: true,
      },
      {
        name: "HTML5 / CSS3",
        query: "CSS",
        spec: "Semantic DOM, Responsive Typography, Canvas APIs",
      },
    ],
  },
  {
    tierNumber: "03",
    tierTitle: "Quality Assurance, Testing & Persistence",
    badge: "TIER 3 // QA & VERIFICATION",
    roleScope: "Test automation suites, QA defect analysis, regression verification, and relational schema normalization.",
    skills: [
      {
        name: "Pest Automated Testing",
        query: "Pest",
        spec: "Feature & Unit Suites, Regression Assertions",
        highlight: true,
      },
      {
        name: "xUnit & Integration QA",
        query: ".NET",
        spec: "Domain Invariant Validation, Mocking",
        highlight: true,
      },
      {
        name: "SQL Server & EF Core",
        query: "SQL Server",
        spec: "Code-First Migrations, Fluent API, Query Optimization",
        highlight: true,
      },
      {
        name: "MySQL & Relational Integrity",
        query: "MySQL",
        spec: "ACID Transactions, Foreign Constraints, Indexing",
        highlight: true,
      },
    ],
  },
];

export default function Skills() {
  const container = useRef<HTMLDivElement>(null);
  const [activeSkillQuery, setActiveSkillQuery] = useState<string | null>(null);

  useGSAP(
    () => {
      if (!container.current) return;
      gsap.fromTo(
        ".skill-tier-block",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.35, stagger: 0.08, ease: "power2.out" }
      );
    },
    { scope: container }
  );

  const handleSkillClick = (query: string) => {
    sound.playBlip();
    setActiveSkillQuery(query);

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("kinetic:filter-skill", {
          detail: { query },
        })
      );
      // Smooth scroll to projects section
      const target = document.getElementById("projects");
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const totalSkillCount = SKILL_TIERS.reduce((acc, tier) => acc + tier.skills.length, 0);

  return (
    <section id="skills" ref={container} className="section-card scroll-mt-[100px] w-full">
      {/* SECTION HEADER & TELEMETRY */}
      <div className="flex flex-wrap items-center justify-between border-b-2 border-[var(--color-border)] pb-3 mb-6 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-emerald-600 dark:bg-emerald-400 inline-block animate-pulse" />
            <h2 className="font-pixel text-xs sm:text-base text-[var(--color-text)] tracking-wider uppercase">
              01 // CATEGORIZED_ARCHITECTURE_STACK
            </h2>
          </div>
          <p className="font-mono text-[0.65rem] sm:text-xs text-[var(--color-text-dim)] mt-0.5">
            [3-TIER ARCHITECTURAL MATRIX // ZERO TRUNCATION // CLICK TO FILTER MATCHED REPOSITORIES]
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-[var(--color-text-dim)]">
          <span className="text-emerald-700 dark:text-emerald-400 font-bold">[3 TIERS]</span>
          <span>//</span>
          <span>[{totalSkillCount} TECHNOLOGIES ALL VISIBLE]</span>
        </div>
      </div>

      {/* 3 DISTINCT ARCHITECTURAL TIERS (NO HIDDEN ITEMS) */}
      <div className="flex flex-col gap-4 sm:gap-5 w-full">
        {SKILL_TIERS.map((tier) => (
          <div
            key={tier.tierNumber}
            className="skill-tier-block pixel-box p-4 sm:p-5 bg-[var(--color-surface)] border-2 border-[var(--color-border)] hover:border-[var(--color-text)] transition-colors"
          >
            {/* TIER HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-3 mb-3 border-b border-[var(--color-border)]">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="font-mono text-[0.68rem] font-bold bg-[var(--color-card)] px-2.5 py-1 border border-emerald-600/40 dark:border-[var(--color-border)] text-emerald-700 dark:text-emerald-400">
                  {tier.badge}
                </span>
                <h3 className="font-sans text-sm sm:text-base font-bold text-[var(--color-text)] tracking-tight">
                  {tier.tierTitle}
                </h3>
              </div>
              <p className="font-sans text-xs text-[var(--color-text-dim)]">
                {tier.roleScope}
              </p>
            </div>

            {/* TECHNOLOGY BADGE CHIPS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {tier.skills.map((skill) => {
                const isSelected = activeSkillQuery === skill.query;
                return (
                  <button
                    type="button"
                    key={skill.name}
                    onClick={() => handleSkillClick(skill.query)}
                    className={`text-left p-3 border transition-all min-h-[50px] cursor-pointer flex flex-col justify-between group ${
                      isSelected
                        ? "border-[var(--color-text)] bg-[var(--color-card)] shadow-[3px_3px_0px_var(--color-text)]"
                        : "border-[var(--color-border)] bg-[var(--color-card)] hover:border-[var(--color-text)] hover:shadow-[2px_2px_0px_var(--color-border)]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-sans font-semibold text-xs sm:text-[0.82rem] text-[var(--color-text)] group-hover:underline flex items-center gap-1.5">
                        {isSelected && (
                          <span className="w-1.5 h-1.5 bg-emerald-600 dark:bg-emerald-400 inline-block animate-ping" />
                        )}
                        {skill.name}
                      </span>
                      {skill.highlight && (
                        <span className="font-mono text-[0.55rem] bg-[var(--color-surface)] border border-emerald-600/40 dark:border-[var(--color-border)] px-1 py-0.2 text-emerald-700 dark:text-emerald-400 font-bold">
                          CORE
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between font-mono text-[0.62rem] text-[var(--color-text-dim)]">
                      <span className="truncate pr-1">{skill.spec}</span>
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity text-emerald-700 dark:text-emerald-400 shrink-0 font-bold">
                        ↳ FILTER
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

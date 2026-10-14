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
  layerName: string;
  roleScope: string;
  badge: string;
  skills: SkillItem[];
}

const SKILL_TIERS: SkillTier[] = [
  {
    tierNumber: "01",
    layerName: "CORE_LANGUAGES_&_RUNTIMES",
    badge: "TIER_01 // RUNTIME",
    roleScope: "Strict typing, OOP algorithms, memory lifecycle & asynchronous concurrency.",
    skills: [
      { name: "C# (.NET 8)", query: ".NET", spec: "OOP, Generics, LINQ, Async/Await", highlight: true },
      { name: "PHP 8.2+", query: "Laravel", spec: "Strict Types, Attributes, Enums", highlight: true },
      { name: "JAVA (OOP)", query: "Java", spec: "Design Patterns, Collections, Concurrency" },
      { name: "TYPESCRIPT", query: "Next.js", spec: "Static Type Invariants, Interfaces" },
      { name: "PYTHON", query: "Python", spec: "Data Logic, Scripting, Automation" },
    ],
  },
  {
    tierNumber: "02",
    layerName: "ENTERPRISE_ARCHITECTURE_&_FRAMEWORKS",
    badge: "TIER_02 // SYSTEM_ARCH",
    roleScope: "Domain boundaries, CQRS pipelines, RESTful controllers & middleware.",
    skills: [
      { name: "CLEAN ARCHITECTURE / DDD", query: ".NET", spec: "Domain Invariants, Inversion of Control", highlight: true },
      { name: "ASP.NET CORE WEB API", query: ".NET", spec: "REST Controllers, Filters, JWT Auth", highlight: true },
      { name: "LARAVEL 12 PLATFORMS", query: "Laravel", spec: "MVC, FormRequests, Spatie RBAC, Gates", highlight: true },
      { name: "NEXT.JS 15 (APP ROUTER)", query: "Next.js", spec: "Server Components, Server Actions, SSR" },
    ],
  },
  {
    tierNumber: "03",
    layerName: "PERSISTENCE_&_DATA_MODELING",
    badge: "TIER_03 // DATA_STORE",
    roleScope: "Relational schema design, migrations, ACID transactions & ORM mapping.",
    skills: [
      { name: "ENTITY FRAMEWORK CORE", query: ".NET", spec: "Code-First Migrations, Fluent API, Linq", highlight: true },
      { name: "SQL SERVER", query: ".NET", spec: "Relational Schemas, Constraints, Foreign Keys" },
      { name: "MYSQL", query: "MySQL", spec: "Indexing, Normalization, Query Optimization", highlight: true },
      { name: "ELOQUENT ORM", query: "Laravel", spec: "Active Record, Eager Loading, Model Events" },
    ],
  },
  {
    tierNumber: "04",
    layerName: "INTERFACE_&_PRESENTATION_ENGINE",
    badge: "TIER_04 // UI_CLIENT",
    roleScope: "Dynamic server-rendered views, responsive viewport engines & kinetic motion.",
    skills: [
      { name: "BLADE TEMPLATES", query: "Blade", spec: "Component Slots, View Directives, Layouts", highlight: true },
      { name: "BOOTSTRAP 5", query: "Bootstrap", spec: "Enterprise Grid System, Modals, Forms" },
      { name: "TAILWIND CSS V4", query: "Tailwind", spec: "Utility-First Styling, Custom Design Tokens" },
      { name: "GSAP MOTION ENGINE", query: "GSAP", spec: "Kinetic Timelines, SVG Animations" },
    ],
  },
  {
    tierNumber: "05",
    layerName: "TOOLING,_TESTING_&_DEVOPS",
    badge: "TIER_05 // CI_CD",
    roleScope: "Version control pipelines, automated test coverage & build tooling.",
    skills: [
      { name: "GIT & GITHUB ACTIONS", query: "Git", spec: "Branching Strategies, CI/CD Automated Pipelines" },
      { name: "PEST PHP", query: "Pest", spec: "Unit & Feature Test Suites, Assertions", highlight: true },
      { name: "POSTMAN / REST SUITE", query: "REST", spec: "API Contract Validation, Mock Environments" },
      { name: "VITE & COMPILER", query: "Vite", spec: "Asset Compilation, Bundling, Hot Reload" },
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
        { opacity: 1, y: 0, duration: 0.35, stagger: 0.06, ease: "power2.out" }
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
            <span className="w-2.5 h-2.5 bg-[var(--color-text)] inline-block animate-pulse" />
            <h2 className="font-pixel text-xs sm:text-base text-[var(--color-text)] tracking-wider uppercase">
              01 // ARCHITECTURAL_SYSTEM_STACK
            </h2>
          </div>
          <p className="font-mono text-[0.6rem] sm:text-xs text-[var(--color-text-dim)] mt-0.5">
            [5-TIER ENGINEERING HIERARCHY // CLICK ANY BADGE TO INSPECT MATCHED REPOSITORIES]
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs text-[var(--color-text-dim)]">
          <span className="text-[var(--color-text)] font-bold">[5 TIERS]</span>
          <span>//</span>
          <span>[{totalSkillCount} TECHNOLOGIES]</span>
        </div>
      </div>

      {/* 5-TIER ARCHITECTURAL SHELF STACK (ZERO TRUNCATION) */}
      <div className="flex flex-col gap-4 sm:gap-5 w-full">
        {SKILL_TIERS.map((tier) => (
          <div
            key={tier.tierNumber}
            className="skill-tier-block pixel-box p-4 sm:p-5 bg-[var(--color-surface)] border-2 border-[var(--color-border)] hover:border-[var(--color-text)] transition-colors"
          >
            {/* TIER HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-3 mb-3 border-b border-[var(--color-border)]">
              <div className="flex items-center gap-2">
                <span className="font-pixel text-[0.65rem] sm:text-xs bg-[var(--color-card)] px-2 py-0.5 border border-[var(--color-border)] text-[var(--color-text)]">
                  {tier.badge}
                </span>
                <h3 className="font-pixel text-xs sm:text-sm text-[var(--color-text)] uppercase tracking-wide">
                  {tier.layerName}
                </h3>
              </div>
              <p className="font-mono text-[0.65rem] sm:text-xs text-[var(--color-text-dim)]">
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
                    className={`text-left p-2.5 sm:p-3 border transition-all min-h-[44px] cursor-pointer flex flex-col justify-between group ${
                      isSelected
                        ? "border-[var(--color-text)] bg-[var(--color-card)] shadow-[3px_3px_0px_var(--color-text)]"
                        : "border-[var(--color-border)] bg-[var(--color-card)] hover:border-[var(--color-text)] hover:shadow-[2px_2px_0px_var(--color-border)]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-pixel text-[0.65rem] sm:text-xs text-[var(--color-text)] group-hover:underline flex items-center gap-1.5">
                        {isSelected && (
                          <span className="w-1.5 h-1.5 bg-[var(--color-text)] inline-block animate-ping" />
                        )}
                        {skill.name}
                      </span>
                      {skill.highlight && (
                        <span className="font-pixel text-[0.5rem] bg-[var(--color-surface)] border border-[var(--color-border)] px-1 py-0.2 text-[var(--color-text)]">
                          [CORE]
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between font-mono text-[0.6rem] text-[var(--color-text-dim)]">
                      <span className="truncate pr-1">{skill.spec}</span>
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--color-text)] shrink-0 font-bold">
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

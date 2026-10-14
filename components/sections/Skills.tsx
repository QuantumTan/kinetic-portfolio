"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { sound } from "@/utils/sound";

const SKILLS = [
  { name: "LARAVEL 12 & PHP", src: "/assets/icons/java-icon.png", spec: "FULL-STACK / MVC ARCHITECTURE", tag: "FULLSTACK", query: "Laravel" },
  { name: "BLADE TEMPLATES", src: "/assets/icons/html-icon.png", spec: "DYNAMIC VIEWS & COMPONENTS", tag: "FRONTEND", query: "Blade" },
  { name: "BOOTSTRAP 5", src: "/assets/icons/css-icon.png", spec: "RESPONSIVE UI & GRID SYSTEM", tag: "FRONTEND", query: "Bootstrap" },
  { name: "C# .NET 8", src: "/assets/icons/java-icon.png", spec: "CLEAN ARCHITECTURE / REST APIs", tag: "BACKEND", query: ".NET" },
  { name: "JAVA (OOP)", src: "/assets/icons/java-icon.png", spec: "ALGORITHMS & DATA STRUCTURES", tag: "CORE", query: "Java" },
  { name: "PYTHON", src: "/assets/icons/py-icon.png", spec: "AUTOMATION & DATA LOGIC", tag: "CORE", query: "Python" },
  { name: "TYPESCRIPT & NEXT.JS", src: "/assets/icons/html-icon.png", spec: "SSR / REACT APP ROUTER", tag: "FULLSTACK", query: "Next.js" },
  { name: "HTML5 & CSS3", src: "/assets/icons/css-icon.png", spec: "SEMANTIC PIXEL PRECISION", tag: "FRONTEND", query: "CSS" },
  { name: "MYSQL", src: "/assets/icons/mysql-icon.png", spec: "RELATIONAL SCHEMA & QUERIES", tag: "DATABASE", query: "MySQL" },
  { name: "GIT & GITHUB", src: "/assets/icons/github-icon.png", spec: "VERSION CONTROL & CI/CD", tag: "TOOLING", query: "Git" },
];

const MOBILE_INITIAL_COUNT = 4;

export default function Skills() {
  const container = useRef<HTMLDivElement>(null);
  const [showAllMobile, setShowAllMobile] = useState(false);
  const [activeSkillQuery, setActiveSkillQuery] = useState<string | null>(null);

  useGSAP(
    () => {
      if (!container.current) return;
      gsap.fromTo(
        ".skill-matrix-item",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.35, stagger: 0.04, ease: "power2.out" }
      );
    },
    { scope: container, dependencies: [showAllMobile] }
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
      // Smooth scroll to projects
      const target = document.getElementById("projects");
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section id="skills" ref={container} className="section-card scroll-mt-[100px]">
      <div className="flex flex-wrap items-center justify-between border-b-2 border-[var(--color-border)] pb-3 mb-6 gap-2">
        <div>
          <h2 className="font-pixel text-xs sm:text-base text-[var(--color-text)] tracking-wider uppercase">
            01 // SKILLS_MATRIX & TOOLCHAIN
          </h2>
          <p className="font-mono text-[0.6rem] sm:text-xs text-[var(--color-text-dim)] mt-0.5">
            [CLICK ANY STACK ITEM TO HIGHLIGHT ASSOCIATED REPOSITORIES]
          </p>
        </div>
        <span className="font-mono text-xs text-[var(--color-text-dim)]">
          <span className="sm:hidden">
            [{showAllMobile ? `${SKILLS.length}/${SKILLS.length}` : `${MOBILE_INITIAL_COUNT}/${SKILLS.length}`}]
          </span>
          <span className="hidden sm:inline">[TOTAL: {SKILLS.length}]</span>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {SKILLS.map((skill, index) => {
          const isHiddenOnMobile = !showAllMobile && index >= MOBILE_INITIAL_COUNT;
          const isSelected = activeSkillQuery === skill.query;

          return (
            <button
              type="button"
              key={skill.name}
              onClick={() => handleSkillClick(skill.query)}
              className={`skill-matrix-item pixel-box p-3.5 sm:p-4 text-left flex flex-col justify-between group transition-all duration-150 min-h-[110px] sm:min-h-[120px] cursor-pointer ${
                isSelected
                  ? "border-[var(--color-text)] bg-[var(--color-surface)] shadow-[4px_4px_0px_var(--color-text)]"
                  : "hover:border-[var(--color-text)] hover:shadow-[4px_4px_0px_var(--color-border)]"
              } ${isHiddenOnMobile ? "hidden sm:flex" : "flex"}`}
            >
              <div className="flex items-center justify-between mb-3 w-full">
                <div className="w-9 h-9 sm:w-10 sm:h-10 border border-[var(--color-border)] p-1 bg-[var(--color-surface)] flex items-center justify-center grayscale contrast-125 group-hover:grayscale-0 transition-all">
                  <Image
                    src={skill.src}
                    alt={skill.name}
                    width={28}
                    height={28}
                    className="object-contain"
                  />
                </div>
                <div className="flex items-center gap-1">
                  {isSelected && (
                    <span className="w-1.5 h-1.5 bg-[var(--color-text)] inline-block animate-ping mr-1" />
                  )}
                  <span className="pixel-tag text-[0.55rem] sm:text-[0.6rem] font-pixel">
                    {skill.tag}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-pixel text-[0.7rem] sm:text-xs text-[var(--color-text)] group-hover:underline mb-1 flex items-center justify-between">
                  <span>{skill.name}</span>
                  <span className="font-mono text-[0.6rem] text-[var(--color-text-dim)] group-hover:text-[var(--color-text)] opacity-60 group-hover:opacity-100">
                    ↳ VIEW
                  </span>
                </h3>
                <p className="font-mono text-[0.65rem] sm:text-[0.7rem] text-[var(--color-text-dim)]">
                  {skill.spec}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* MOBILE-ONLY SEE MORE TOGGLE */}
      {SKILLS.length > MOBILE_INITIAL_COUNT && (
        <div className="sm:hidden mt-6 pt-4 border-t border-dashed border-[var(--color-border)] flex justify-center">
          <button
            onClick={() => {
              sound.playClick();
              setShowAllMobile((prev) => !prev);
            }}
            className="pixel-btn text-xs px-5 py-2.5 w-full text-center transition-all min-h-[44px]"
          >
            {showAllMobile
              ? "[-] COLLAPSE_TOOLS"
              : `[+] VIEW_ALL_TOOLS (+${SKILLS.length - MOBILE_INITIAL_COUNT}_MORE)`}
          </button>
        </div>
      )}
    </section>
  );
}

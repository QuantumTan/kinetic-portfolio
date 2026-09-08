"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const SKILLS = [
  { name: "LARAVEL 12 & PHP", src: "/assets/icons/java-icon.png", spec: "FULL-STACK / MVC ARCHITECTURE", tag: "FULLSTACK" },
  { name: "BLADE TEMPLATES", src: "/assets/icons/html-icon.png", spec: "DYNAMIC VIEWS & COMPONENTS", tag: "FRONTEND" },
  { name: "BOOTSTRAP 5", src: "/assets/icons/css-icon.png", spec: "RESPONSIVE UI & GRID SYSTEM", tag: "FRONTEND" },
  { name: "C# .NET 8", src: "/assets/icons/java-icon.png", spec: "CLEAN ARCHITECTURE / REST APIs", tag: "BACKEND" },
  { name: "JAVA (OOP)", src: "/assets/icons/java-icon.png", spec: "ALGORITHMS & DATA STRUCTURES", tag: "CORE" },
  { name: "PYTHON", src: "/assets/icons/py-icon.png", spec: "AUTOMATION & DATA LOGIC", tag: "CORE" },
  { name: "TYPESCRIPT & NEXT.JS", src: "/assets/icons/html-icon.png", spec: "SSR / REACT APP ROUTER", tag: "FULLSTACK" },
  { name: "HTML5 & CSS3", src: "/assets/icons/css-icon.png", spec: "SEMANTIC PIXEL PRECISION", tag: "FRONTEND" },
  { name: "MYSQL", src: "/assets/icons/mysql-icon.png", spec: "RELATIONAL SCHEMA & QUERIES", tag: "DATABASE" },
  { name: "GIT & GITHUB", src: "/assets/icons/github-icon.png", spec: "VERSION CONTROL & CI/CD", tag: "TOOLING" },
];

export default function Skills() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!container.current) return;
      gsap.fromTo(
        ".skill-matrix-item",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.35, stagger: 0.04, ease: "power2.out" }
      );
    },
    { scope: container }
  );

  return (
    <section id="skills" ref={container} className="section-card">
      <div className="flex flex-wrap items-center justify-between border-b-2 border-[var(--color-border)] pb-3 mb-6 gap-2">
        <h2 className="font-pixel text-xs sm:text-base text-[var(--color-text)] tracking-wider uppercase">
          01 // SKILLS_MATRIX & TOOLCHAIN
        </h2>
        <span className="font-mono text-xs text-[var(--color-text-dim)]">
          [TOTAL: {SKILLS.length}]
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {SKILLS.map((skill) => (
          <div
            key={skill.name}
            className="skill-matrix-item pixel-box p-3.5 sm:p-4 flex flex-col justify-between group hover:border-[var(--color-text)] transition-all duration-150"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 border border-[var(--color-border)] p-1 bg-[var(--color-surface)] flex items-center justify-center grayscale contrast-125 group-hover:grayscale-0 transition-all">
                <Image
                  src={skill.src}
                  alt={skill.name}
                  width={28}
                  height={28}
                  className="object-contain"
                />
              </div>
              <span className="pixel-tag text-[0.55rem] sm:text-[0.6rem] font-pixel">
                {skill.tag}
              </span>
            </div>

            <div>
              <h3 className="font-pixel text-[0.7rem] sm:text-xs text-[var(--color-text)] group-hover:underline mb-1">
                {skill.name}
              </h3>
              <p className="font-mono text-[0.65rem] sm:text-[0.7rem] text-[var(--color-text-dim)]">
                {skill.spec}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

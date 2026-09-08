"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { projects } from "@/data/projects";

const INITIAL_VISIBLE_COUNT = 2;

export default function Projects() {
  const container = useRef<HTMLDivElement>(null);
  const [showAll, setShowAll] = useState(false);

  const visibleProjects = showAll ? projects : projects.slice(0, INITIAL_VISIBLE_COUNT);

  useGSAP(
    () => {
      if (!container.current) return;
      gsap.fromTo(
        ".project-card-item",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.35, stagger: 0.06, ease: "power2.out" }
      );
    },
    { scope: container, dependencies: [showAll] }
  );

  return (
    <section id="projects" ref={container} className="section-card">
      <div className="flex flex-wrap items-center justify-between border-b-2 border-[var(--color-border)] pb-3 mb-6 gap-2">
        <h2 className="font-pixel text-xs sm:text-base text-[var(--color-text)] tracking-wider uppercase">
          02 // PROJECT_REGISTRY
        </h2>
        <span className="font-mono text-xs text-[var(--color-text-dim)]">
          [SHOWING: {visibleProjects.length}/{projects.length}]
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 items-stretch">
        {visibleProjects.map((proj) => (
          <article
            key={proj.id}
            className="project-card-item pixel-box p-4 sm:p-5 flex flex-col justify-between group hover:border-[var(--color-text)] transition-all duration-150 h-full"
          >
            <div>
              {/* HEADER TAGS */}
              <div className="flex items-center justify-between text-xs font-mono text-[var(--color-text-dim)] mb-3 pb-2 border-b border-[var(--color-border)]">
                <span className="font-bold">{proj.code}</span>
                <span className="font-pixel text-[0.55rem] sm:text-[0.6rem] bg-[var(--color-surface)] border border-[var(--color-border)] px-2 py-0.5 text-[var(--color-text)]">
                  [{proj.status}]
                </span>
              </div>

              {/* IMAGE PREVIEW */}
              <div className="relative aspect-[16/10] w-full border-2 border-[var(--color-border)] mb-3 overflow-hidden bg-black group-hover:border-[var(--color-text)] transition-colors">
                <Image
                  src={proj.image}
                  alt={proj.title}
                  fill
                  className="object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-300"
                />
              </div>

              {/* TITLE & DETAILS */}
              <h3 className="font-pixel text-xs sm:text-sm text-[var(--color-text)] tracking-wide mb-1">
                {proj.title}
              </h3>
              <p className="font-mono text-[0.65rem] sm:text-xs text-[var(--color-text-dim)] mb-2">
                ROLE: {proj.role}
              </p>
              <p className="font-mono text-[0.7rem] sm:text-xs text-[var(--color-text-muted)] leading-relaxed mb-3">
                {proj.description}
              </p>

              {/* STACK BADGES */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {proj.stack.map((st) => (
                  <span
                    key={st}
                    className="pixel-tag text-[0.55rem] sm:text-[0.6rem] font-mono border border-[var(--color-border)]"
                  >
                    {st}
                  </span>
                ))}
              </div>
            </div>

            {/* ACTION TRIGGERS */}
            <div className="flex gap-2 pt-3 border-t border-[var(--color-border)] mt-auto">
              {proj.link && proj.link !== "#" ? (
                <a
                  href={proj.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pixel-btn flex-1 text-[0.6rem] sm:text-[0.65rem] py-2"
                >
                  [&gt;] LAUNCH
                </a>
              ) : (
                <span className="pixel-box flex-1 text-center py-2 text-[0.6rem] sm:text-[0.65rem] font-pixel text-[var(--color-text-dim)] cursor-not-allowed">
                  [DEV_STAGE]
                </span>
              )}
              {proj.github && (
                <a
                  href={proj.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pixel-btn flex-1 text-[0.6rem] sm:text-[0.65rem] py-2"
                >
                  [#] REPO_SRC
                </a>
              )}
            </div>
          </article>
        ))}
      </div>

      {/* SEE MORE / EXPAND CONTROLLER */}
      {projects.length > INITIAL_VISIBLE_COUNT && (
        <div className="mt-8 pt-4 border-t border-dashed border-[var(--color-border)] flex justify-center">
          <button
            onClick={() => setShowAll((prev) => !prev)}
            className="pixel-btn text-xs px-6 py-2.5 hover:bg-white hover:text-black transition-all"
          >
            {showAll
              ? "[-] COLLAPSE_REGISTRY"
              : `[+] VIEW_ALL_PROJECTS (+${projects.length - INITIAL_VISIBLE_COUNT}_MORE)`}
          </button>
        </div>
      )}
    </section>
  );
}

"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { projects } from "@/data/projects";
import { architectureData } from "@/data/architecture-data";
import ArchitectureModal from "@/components/architecture/ArchitectureModal";

const INITIAL_VISIBLE_COUNT = 2;

export default function Projects() {
  const container = useRef<HTMLDivElement>(null);
  const [showAll, setShowAll] = useState(false);
  const [archModalOpen, setArchModalOpen] = useState(false);
  const [selectedArchId, setSelectedArchId] = useState<string>("crms-peguit");

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
        <div className="flex items-center gap-3">
          <h2 className="font-pixel text-xs sm:text-base text-[var(--color-text)] tracking-wider uppercase">
            02 // PROJECT_REGISTRY
          </h2>
          <button
            onClick={() => {
              setSelectedArchId("crms-peguit");
              setArchModalOpen(true);
            }}
            aria-label="Open System Architecture Blueprint"
            className="pixel-btn text-[0.6rem] sm:text-xs py-1 px-2.5 flex items-center gap-1.5"
          >
            <span className="w-1.5 h-1.5 bg-[var(--color-text)] inline-block animate-ping" />
            <span>[⚡ SYS_BLUEPRINT]</span>
          </button>
        </div>
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
              <div className="relative aspect-[16/10] w-full border-2 border-[var(--color-border)] mb-3 overflow-hidden bg-[var(--color-surface)] group-hover:border-[var(--color-text)] transition-colors">
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
            <div className="flex flex-col gap-2 pt-3 border-t border-[var(--color-border)] mt-auto">
              {architectureData[proj.id] && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedArchId(proj.id);
                    setArchModalOpen(true);
                  }}
                  className="pixel-btn w-full text-[0.6rem] sm:text-[0.65rem] py-1.5 flex items-center justify-center gap-1.5 bg-[var(--color-surface)] border-2 border-[var(--color-text)] hover:bg-[var(--color-card-hover)]"
                >
                  <span className="w-1.5 h-1.5 bg-[var(--color-text)] inline-block" />
                  <span>[⚡ ARCH_BLUEPRINT]</span>
                </button>
              )}
              <div className="flex gap-2">
                {proj.link && proj.link !== "#" ? (
                  <a
                    href={proj.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pixel-btn flex-1 text-[0.6rem] sm:text-[0.65rem] py-2 text-center"
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
                    className="pixel-btn flex-1 text-[0.6rem] sm:text-[0.65rem] py-2 text-center"
                  >
                    [#] REPO_SRC
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* SEE MORE / EXPAND CONTROLLER */}
      {projects.length > INITIAL_VISIBLE_COUNT && (
        <div className="mt-8 pt-4 border-t border-dashed border-[var(--color-border)] flex justify-center">
          <button
            onClick={() => setShowAll((prev) => !prev)}
            className="pixel-btn text-xs px-6 py-2.5 transition-all"
          >
            {showAll
              ? "[-] COLLAPSE_REGISTRY"
              : `[+] VIEW_ALL_PROJECTS (+${projects.length - INITIAL_VISIBLE_COUNT}_MORE)`}
          </button>
        </div>
      )}

      {/* SYSTEM ARCHITECTURE BLUEPRINT MODAL */}
      <ArchitectureModal
        isOpen={archModalOpen}
        initialProjectId={selectedArchId}
        onClose={() => setArchModalOpen(false)}
      />
    </section>
  );
}

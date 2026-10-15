"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { projects, Project } from "@/data/projects";
import { architectureData } from "@/data/architecture-data";
import ArchitectureModal from "@/components/architecture/ArchitectureModal";
import InteractiveApiSandbox from "@/components/architecture/InteractiveApiSandbox";
import InteractiveKanbanPreview from "@/components/architecture/InteractiveKanbanPreview";
import { sound } from "@/utils/sound";
import { BoltIcon, CheckIcon, XMarkIcon, ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

export default function Projects() {
  const container = useRef<HTMLDivElement>(null);
  const [archModalOpen, setArchModalOpen] = useState(false);
  const [selectedArchId, setSelectedArchId] = useState<string>("crms-peguit");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // In-card interactive sandbox preview toggles
  const [showDotNetSandbox, setShowDotNetSandbox] = useState(false);
  const [showLaravelKanban, setShowLaravelKanban] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      const customEvt = e as CustomEvent<{ query: string }>;
      if (customEvt.detail?.query) {
        setActiveFilter(customEvt.detail.query);
      }
    };
    window.addEventListener("kinetic:filter-skill", handler);
    return () => window.removeEventListener("kinetic:filter-skill", handler);
  }, []);

  const isMatch = (proj: Project) => {
    if (!activeFilter) return true;
    const q = activeFilter.toLowerCase();
    return (
      proj.title.toLowerCase().includes(q) ||
      proj.short.toLowerCase().includes(q) ||
      proj.description.toLowerCase().includes(q) ||
      proj.stack.some((s) => s.toLowerCase().includes(q))
    );
  };

  useGSAP(
    () => {
      if (!container.current) return;
      gsap.fromTo(
        ".project-card-item",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.35, stagger: 0.06, ease: "power2.out" }
      );
    },
    { scope: container, dependencies: [activeFilter] }
  );

  const flagshipProjects = projects.filter((p) => p.id === "crms-peguit" || p.id === "crm-system");
  const specializedProjects = projects.filter((p) => p.id !== "crms-peguit" && p.id !== "crm-system");

  const openArchitectureModal = (projectId: string) => {
    sound.playClick();
    setSelectedArchId(projectId);
    setArchModalOpen(true);
  };

  return (
    <section id="projects" ref={container} className="section-card scroll-mt-[100px] w-full">
      {/* SECTION HEADER & CONTROL BAR */}
      <div className="flex flex-wrap items-center justify-between border-b-2 border-[var(--color-border)] pb-3 mb-6 gap-2">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-emerald-600 dark:bg-emerald-400 inline-block animate-pulse" />
            <h2 className="font-pixel text-xs sm:text-base text-[var(--color-text)] tracking-wider uppercase">
              02 // SYSTEMS_SHOWCASE & REPOSITORY_INDEX
            </h2>
          </div>
          <button
            onClick={() => openArchitectureModal("crms-peguit")}
            aria-label="Open System Architecture Blueprint"
            className="pixel-btn text-[0.62rem] sm:text-xs py-1.5 px-3 flex items-center gap-1.5 min-h-[36px] cursor-pointer"
          >
            <span className="w-1.5 h-1.5 bg-emerald-600 dark:bg-emerald-400 inline-block animate-ping" />
            <span className="inline-flex items-center gap-1">
              <BoltIcon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              [ARCH_BLUEPRINT]
            </span>
          </button>
          <Link
            href="/projects"
            className="pixel-btn text-[0.62rem] sm:text-xs py-1.5 px-2.5 flex items-center gap-1.5 min-h-[36px] bg-[var(--color-surface)] hover:bg-[var(--color-card)]"
          >
            <span>[CATALOG_INDEX]</span>
            <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5 text-[var(--color-primary)]" />
          </Link>
        </div>
        <span className="font-mono text-xs text-[var(--color-text-dim)]">
          [TOTAL SYSTEMS: {projects.length} // ALL VISIBLE BENTO GRID]
        </span>
      </div>

      {/* ACTIVE STACK FILTER BANNER */}
      {activeFilter && (
        <div className="mb-6 p-3 bg-[var(--color-surface)] border-2 border-emerald-600 dark:border-emerald-400 flex flex-wrap items-center justify-between gap-2 font-mono text-xs shadow-[3px_3px_0px_var(--color-accent)] animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-600 dark:bg-emerald-400 inline-block animate-ping" />
            <span className="font-mono text-[0.68rem] sm:text-xs text-[var(--color-text)] font-bold">
              ACTIVE_STACK_FILTER: [{activeFilter.toUpperCase()}]
            </span>
            <span className="text-[var(--color-text-dim)] hidden sm:inline">
              // {projects.filter(isMatch).length} OF {projects.length} MATCHED
            </span>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              setActiveFilter(null);
            }}
            className="font-pixel text-[0.6rem] sm:text-xs bg-[var(--color-card)] border border-[var(--color-border)] px-2.5 py-1 text-[var(--color-text)] hover:bg-[var(--color-invert-bg)] hover:text-[var(--color-invert-text)] transition-colors min-h-[36px] cursor-pointer inline-flex items-center gap-1"
          >
            [CLEAR_FILTER <XMarkIcon className="w-3 h-3 text-[var(--color-text)]" />]
          </button>
        </div>
      )}

      {/* ── BENTO TOP: 2 LARGE FEATURED ENTERPRISE SYSTEMS ── */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3.5 pb-1 border-b border-dashed border-[var(--color-border)] font-mono text-xs text-[var(--color-text-dim)]">
          <span className="font-mono text-[0.68rem] sm:text-xs text-emerald-700 dark:text-emerald-400 font-bold uppercase">
            // FEATURED_FLAGSHIP_SYSTEMS
          </span>
          <span>[2 ENTERPRISE PLATFORMS]</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {flagshipProjects.map((proj) => {
            const matched = isMatch(proj);
            const isDotNet = proj.id === "crms-peguit";
            const showSandbox = isDotNet ? showDotNetSandbox : showLaravelKanban;

            return (
              <article
                key={proj.id}
                className={`project-card-item pixel-box p-5 sm:p-6 flex flex-col justify-between group transition-all duration-200 bg-[var(--color-card)] border-2 ${
                  activeFilter
                    ? matched
                      ? "border-emerald-600 dark:border-emerald-400 shadow-[6px_6px_0px_var(--color-accent)]"
                      : "opacity-40 border-[var(--color-border-subtle)]"
                    : "border-[var(--color-border)] hover:border-[var(--color-text)] hover:shadow-[4px_4px_0px_var(--color-border)]"
                }`}
              >
                <div>
                  {/* HEADER TAGS */}
                  <div className="flex items-center justify-between text-xs font-mono text-[var(--color-text-dim)] mb-3 pb-2 border-b border-[var(--color-border)]">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 border border-emerald-600/50 dark:border-emerald-500 text-emerald-700 dark:text-emerald-400 bg-emerald-100/60 dark:bg-emerald-950/20">
                        [{proj.code} // {proj.status}]
                      </span>
                      <span className="font-mono text-[0.6rem] bg-[var(--color-surface)] border border-[var(--color-border)] px-2 py-0.5 text-[var(--color-text)]">
                        {isDotNet ? ".NET 8 // DDD" : "LARAVEL 12 // RBAC"}
                      </span>
                    </div>
                    <span className="font-mono text-[0.62rem] text-[var(--color-text-dim)]">
                      ENTERPRISE REPO
                    </span>
                  </div>

                  {/* IMAGE PREVIEW */}
                  <div className="relative aspect-[16/9] w-full border-2 border-[var(--color-border)] mb-4 overflow-hidden bg-[var(--color-surface)] group-hover:border-[var(--color-text)] transition-colors">
                    <Image
                      src={proj.image}
                      alt={proj.title}
                      fill
                      className="object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-300"
                    />
                  </div>

                  {/* CLEAN TITLE & ROLE */}
                  <h3 className="font-sans font-bold text-lg sm:text-xl text-[var(--color-text)] tracking-tight mb-1">
                    {proj.title}
                  </h3>
                  <div className="font-mono text-xs text-[var(--color-text-dim)] mb-3">
                    ROLE: <span className="text-[var(--color-text)] font-semibold">{proj.role}</span>
                  </div>

                  {/* ARCHITECTURE PIPELINE RIBBON */}
                  <div className="p-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] mb-3.5 font-mono text-[0.65rem]">
                    <div className="text-[var(--color-text-dim)] text-[0.6rem] uppercase mb-1">
                      // ARCHITECTURAL_PIPELINE:
                    </div>
                    {isDotNet ? (
                      <div className="flex flex-wrap items-center gap-1.5 text-[var(--color-text)] font-bold">
                        <span className="bg-[var(--color-card)] px-1.5 py-0.5 border border-[var(--color-border)]">Domain Core</span>
                        <span className="text-emerald-700 dark:text-emerald-400 font-bold">→</span>
                        <span className="bg-[var(--color-card)] px-1.5 py-0.5 border border-[var(--color-border)]">MediatR CQRS</span>
                        <span className="text-emerald-700 dark:text-emerald-400 font-bold">→</span>
                        <span className="bg-[var(--color-card)] px-1.5 py-0.5 border border-[var(--color-border)]">EF Core 8</span>
                        <span className="text-emerald-700 dark:text-emerald-400 font-bold">→</span>
                        <span className="bg-[var(--color-card)] px-1.5 py-0.5 border border-[var(--color-border)]">Web API</span>
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center gap-1.5 text-[var(--color-text)] font-bold">
                        <span className="bg-[var(--color-card)] px-1.5 py-0.5 border border-[var(--color-border)]">FormRequests</span>
                        <span className="text-emerald-700 dark:text-emerald-400 font-bold">→</span>
                        <span className="bg-[var(--color-card)] px-1.5 py-0.5 border border-[var(--color-border)]">Spatie RBAC</span>
                        <span className="text-emerald-700 dark:text-emerald-400 font-bold">→</span>
                        <span className="bg-[var(--color-card)] px-1.5 py-0.5 border border-[var(--color-border)]">Service Layer</span>
                        <span className="text-emerald-700 dark:text-emerald-400 font-bold">→</span>
                        <span className="bg-[var(--color-card)] px-1.5 py-0.5 border border-[var(--color-border)]">Eloquent DB</span>
                      </div>
                    )}
                  </div>

                  {/* SYSTEM DESCRIPTION (CLEAN FONT-SANS) */}
                  <p className="font-sans text-xs sm:text-[0.85rem] text-[var(--color-text-muted)] leading-relaxed mb-4">
                    {proj.description}
                  </p>

                  {/* KEY ARCHITECTURAL HIGHLIGHTS */}
                  <div className="space-y-1 mb-4 font-sans text-xs text-[var(--color-text-dim)]">
                    {isDotNet ? (
                      <>
                        <div className="flex items-center gap-2">
                          <CheckIcon className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 shrink-0" />
                          <span>Domain boundary isolation with zero external ORM coupling</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckIcon className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 shrink-0" />
                          <span>MediatR CQRS command & query pipeline behaviors</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckIcon className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 shrink-0" />
                          <span>FluentValidation automated request validation & DI container</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-2">
                          <CheckIcon className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 shrink-0" />
                          <span>Multi-tier drag-and-drop Kanban sales pipeline workflows</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckIcon className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 shrink-0" />
                          <span>Role-based access control (Admin, Manager, Sales) & policy gates</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckIcon className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 shrink-0" />
                          <span>Automated Pest test suite & relational activity audit logging</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* STACK BADGES */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {proj.stack.map((st) => {
                      const isBadgeMatch = activeFilter && st.toLowerCase().includes(activeFilter.toLowerCase());
                      return (
                        <span
                          key={st}
                          className={`pixel-tag text-[0.58rem] sm:text-[0.62rem] font-mono border ${
                            isBadgeMatch
                              ? "border-emerald-600/50 dark:border-emerald-400 bg-emerald-100/60 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 font-bold"
                              : "border-[var(--color-border)]"
                          }`}
                        >
                          {st}
                        </span>
                      );
                    })}
                  </div>

                  {/* IN-CARD INTERACTIVE MICRO-PREVIEW TOGGLE */}
                  <div className="mb-4">
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        if (isDotNet) {
                          setShowDotNetSandbox((prev) => !prev);
                        } else {
                          setShowLaravelKanban((prev) => !prev);
                        }
                      }}
                      className="w-full py-2 px-2.5 sm:px-3 border border-emerald-600/50 dark:border-emerald-500/60 bg-[var(--color-surface)] hover:bg-[var(--color-card-hover)] font-mono text-[0.62rem] sm:text-xs text-emerald-700 dark:text-emerald-400 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <span className="flex items-center gap-1.5 font-bold truncate pr-1">
                        <span className="w-1.5 h-1.5 bg-emerald-600 dark:bg-emerald-400 inline-block animate-ping shrink-0" />
                        <span className="hidden sm:inline">
                          {isDotNet
                            ? showDotNetSandbox
                              ? "[HIDE_API_SANDBOX ▲]"
                              : "[INTERACTIVE API SANDBOX: TEST GET / POST LEADS ▼]"
                            : showLaravelKanban
                            ? "[HIDE_KANBAN_PREVIEW ▲]"
                            : "[INTERACTIVE KANBAN PREVIEW: TEST RBAC PERMISSIONS ▼]"}
                        </span>
                        <span className="sm:hidden">
                          {isDotNet
                            ? showDotNetSandbox
                              ? "[HIDE_SANDBOX ▲]"
                              : "[API SANDBOX: TEST LEADS ▼]"
                            : showLaravelKanban
                            ? "[HIDE_KANBAN ▲]"
                            : "[KANBAN: TEST RBAC ▼]"}
                        </span>
                      </span>
                      <span className="text-[var(--color-text-dim)] shrink-0 text-[0.6rem]">[DEMO]</span>
                    </button>

                    {showSandbox && (
                      <div className="mt-3 animate-in fade-in duration-200">
                        {isDotNet ? <InteractiveApiSandbox /> : <InteractiveKanbanPreview />}
                      </div>
                    )}
                  </div>
                </div>

                {/* ACTION TRIGGERS */}
                <div className="flex flex-col gap-2 pt-3 border-t border-[var(--color-border)] mt-auto">
                  <div className="flex gap-2 w-full">
                    <button
                      type="button"
                      onClick={() => openArchitectureModal(proj.id)}
                      className="pixel-btn flex-1 text-[0.62rem] sm:text-[0.68rem] py-2 min-h-[44px] flex items-center justify-center gap-1.5 bg-[var(--color-surface)] border-2 border-emerald-600 dark:border-emerald-400 text-[var(--color-text)] hover:bg-[var(--color-card-hover)] cursor-pointer"
                      title="Open Full System Architecture Inspector Modal"
                    >
                      <span className="w-1.5 h-1.5 bg-emerald-600 dark:bg-emerald-400 inline-block animate-ping" />
                      <span className="inline-flex items-center gap-1">
                        <BoltIcon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        [ARCH_BLUEPRINT]
                      </span>
                    </button>
                    <Link
                      href={`/projects/${proj.id}`}
                      className="pixel-btn flex-1 text-[0.62rem] sm:text-[0.68rem] py-2 min-h-[44px] flex items-center justify-center gap-1.5 bg-[var(--color-card)] hover:bg-[var(--color-card-hover)] border border-[var(--color-border)] hover:border-[var(--color-text)] text-[var(--color-text)] cursor-pointer text-center"
                      title="Open Dedicated Full-Page Blueprint"
                    >
                      <span>[PAGE_BLUEPRINT]</span>
                      <ArrowTopRightOnSquareIcon className="w-3 h-3 text-[var(--color-primary)]" />
                    </Link>
                  </div>
                  <div className="flex gap-2">
                    {proj.link && proj.link !== "#" ? (
                      <a
                        href={proj.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => sound.playClick()}
                        className="pixel-btn flex-1 text-[0.62rem] sm:text-[0.68rem] py-2 min-h-[44px] text-center flex items-center justify-center cursor-pointer"
                      >
                        [&gt;] LAUNCH
                      </a>
                    ) : (
                      <span className="pixel-box flex-1 text-center py-2 min-h-[44px] flex items-center justify-center text-[0.62rem] sm:text-[0.68rem] font-mono text-[var(--color-text-dim)] cursor-not-allowed">
                        [ACTIVE_PRODUCTION]
                      </span>
                    )}
                    {proj.github && (
                      <a
                        href={proj.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => sound.playClick()}
                        className="pixel-btn flex-1 text-[0.62rem] sm:text-[0.68rem] py-2 min-h-[44px] text-center flex items-center justify-center cursor-pointer"
                      >
                        [#] REPO_SRC
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* ── BENTO BOTTOM: 2 SPECIALIZED REPOSITORIES IN 2-COLUMN ROW ── */}
      <div>
        <div className="flex items-center justify-between mb-3.5 pb-1 border-b border-dashed border-[var(--color-border)] font-mono text-xs text-[var(--color-text-dim)]">
          <span className="font-mono text-[0.68rem] sm:text-xs text-[var(--color-text)] uppercase">
            // SPECIALIZED_SYSTEMS_&_APPLICATIONS
          </span>
          <span>[2 PRODUCTION PLATFORMS]</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {specializedProjects.map((proj) => {
            const matched = isMatch(proj);
            const arch = architectureData[proj.id];

            return (
              <article
                key={proj.id}
                className={`project-card-item pixel-box p-4 sm:p-5 flex flex-col justify-between group transition-all duration-200 bg-[var(--color-card)] border-2 ${
                  activeFilter
                    ? matched
                      ? "border-emerald-600 dark:border-emerald-400 shadow-[4px_4px_0px_var(--color-accent)]"
                      : "opacity-40 border-[var(--color-border-subtle)]"
                    : "border-[var(--color-border)] hover:border-[var(--color-text)]"
                }`}
              >
                <div>
                  {/* HEADER TAGS */}
                  <div className="flex items-center justify-between text-xs font-mono text-[var(--color-text-dim)] mb-2.5 pb-1.5 border-b border-[var(--color-border)]">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)]">
                      [{proj.code} // {proj.status}]
                    </span>
                    <span className="font-mono text-[0.6rem] text-[var(--color-text-dim)]">
                      ACTIVE_PROJECT
                    </span>
                  </div>

                  {/* IMAGE PREVIEW */}
                  <div className="relative aspect-[16/10] w-full border border-[var(--color-border)] mb-3 overflow-hidden bg-[var(--color-surface)] group-hover:border-[var(--color-text)] transition-colors">
                    <Image
                      src={proj.image}
                      alt={proj.title}
                      fill
                      className="object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-300"
                    />
                  </div>

                  <h3 className="font-sans font-bold text-base text-[var(--color-text)] mb-1">
                    {proj.title}
                  </h3>
                  <div className="font-mono text-xs text-[var(--color-text-dim)] mb-2">
                    ROLE: <span className="text-[var(--color-text)] font-semibold">{proj.role}</span>
                  </div>

                  <p className="font-sans text-xs sm:text-[0.82rem] text-[var(--color-text-muted)] leading-relaxed mb-3">
                    {proj.short}
                  </p>

                  {/* STACK BADGES */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {proj.stack.map((st) => (
                      <span
                        key={st}
                        className="pixel-tag text-[0.58rem] font-mono border border-[var(--color-border)]"
                      >
                        {st}
                      </span>
                    ))}
                  </div>
                </div>

                {/* ACTION TRIGGERS */}
                <div className="flex gap-2 pt-3 border-t border-[var(--color-border)] mt-auto">
                  {arch ? (
                    <button
                      type="button"
                      onClick={() => openArchitectureModal(proj.id)}
                      className="pixel-btn flex-1 text-[0.62rem] sm:text-[0.68rem] py-2 min-h-[44px] flex items-center justify-center gap-1 bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-text)] cursor-pointer"
                    >
                      <span className="inline-flex items-center gap-1">
                        <BoltIcon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        [ARCH_BLUEPRINT]
                      </span>
                    </button>
                  ) : (
                    <Link
                      href={`/projects`}
                      className="pixel-btn flex-1 text-[0.62rem] sm:text-[0.68rem] py-2 min-h-[44px] flex items-center justify-center gap-1 bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-text)] cursor-pointer text-center"
                    >
                      <span>[INDEX]</span>
                      <ArrowTopRightOnSquareIcon className="w-3 h-3 text-[var(--color-primary)]" />
                    </Link>
                  )}
                  {proj.github && (
                    <a
                      href={proj.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => sound.playClick()}
                      className="pixel-btn flex-1 text-[0.62rem] sm:text-[0.68rem] py-2 min-h-[44px] text-center flex items-center justify-center cursor-pointer"
                    >
                      [#] REPO_SRC
                    </a>
                  )}
                  {proj.link && proj.link !== "#" && (
                    <a
                      href={proj.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => sound.playClick()}
                      className="pixel-btn flex-1 text-[0.62rem] sm:text-[0.68rem] py-2 min-h-[44px] text-center flex items-center justify-center cursor-pointer"
                    >
                      [&gt;] LAUNCH
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* SYSTEM ARCHITECTURE BLUEPRINT MODAL */}
      <ArchitectureModal
        isOpen={archModalOpen}
        initialProjectId={selectedArchId}
        onClose={() => setArchModalOpen(false)}
      />
    </section>
  );
}

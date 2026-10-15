import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { projects } from "@/data/projects";
import { architectureData } from "@/data/architecture-data";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ChatTrigger from "@/components/chatbot/ChatTrigger";

export const metadata: Metadata = {
  title: "Project Registry & Architecture Specifications",
  description:
    "Explore enterprise .NET 8 Clean Architecture solutions, Laravel 12 platforms, and kinetic web interfaces engineered by Jonathan Peguit Jr.",
};

export default function ProjectsIndexPage() {
  return (
    <div className="w-full flex flex-col items-center">
      <Navbar />
      {/* HEADER OFFSET SPACER */}
      <div className="h-[88px] sm:h-[96px] w-full shrink-0" aria-hidden="true" />

      <main className="w-full max-w-[1200px] px-4 sm:px-6 pt-6 sm:pt-10 pb-16 flex flex-col items-center">
        {/* BREADCRUMB */}
        <div className="w-full flex items-center justify-between pb-4 mb-6 border-b border-[var(--color-border)] font-mono text-xs">
          <Link
            href="/"
            className="pixel-btn text-[0.65rem] sm:text-xs py-1.5 px-3 flex items-center gap-2 cursor-pointer hover:underline"
          >
            <span>[← RETURN_TO_DASHBOARD]</span>
          </Link>

          <span className="text-[var(--color-text-dim)]">
            SYSTEMS_INDEX // [TOTAL: {projects.length}]
          </span>
        </div>

        {/* HERO HEADER */}
        <div className="w-full pixel-box p-5 sm:p-7 bg-[var(--color-surface)] border-2 border-[var(--color-border)] mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 bg-[var(--color-text)] animate-ping inline-block" />
            <span className="font-pixel text-xs text-[var(--color-text)] tracking-wider">
              PROJECT_REGISTRY // ARCHITECTURAL BLUEPRINTS
            </span>
          </div>
          <h1 className="font-pixel text-xl sm:text-3xl text-[var(--color-text)] uppercase mb-3">
            ENGINEERED SYSTEMS & REPOSITORIES
          </h1>
          <p className="font-mono text-xs sm:text-sm text-[var(--color-text-muted)] max-w-3xl leading-relaxed">
            Every repository below is documented with comprehensive architectural specifications,
            relational database schemas, execution telemetry, and Architecture Decision Records (ADRs).
            Select any system to inspect its 5-tier blueprint.
          </p>
        </div>

        {/* PROJECTS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full items-stretch">
          {projects.map((proj) => {
            const arch = architectureData[proj.id];
            return (
              <article
                key={proj.id}
                className="pixel-box p-5 bg-[var(--color-card)] border-2 border-[var(--color-border)] hover:border-[var(--color-text)] transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-[var(--color-text-dim)] mb-3 pb-2 border-b border-[var(--color-border)]">
                    <span className="font-bold">{proj.code}</span>
                    <span className="font-pixel text-[0.55rem] sm:text-[0.6rem] bg-[var(--color-surface)] border border-[var(--color-border)] px-2 py-0.5 text-[var(--color-text)]">
                      [{proj.status}]
                    </span>
                  </div>

                  <div className="relative aspect-[16/10] w-full border border-[var(--color-border)] mb-4 overflow-hidden bg-[var(--color-surface)]">
                    <Image
                      src={proj.image}
                      alt={proj.title}
                      fill
                      className="object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-300"
                    />
                  </div>

                  <h2 className="font-pixel text-sm sm:text-base text-[var(--color-text)] mb-1">
                    {proj.title}
                  </h2>
                  <div className="font-mono text-xs text-[var(--color-text-dim)] mb-3">
                    ROLE: {proj.role}
                  </div>

                  <p className="font-mono text-xs text-[var(--color-text-muted)] leading-relaxed mb-4">
                    {proj.description}
                  </p>

                  {arch && (
                    <div className="p-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] mb-4 font-mono text-[0.65rem] text-[var(--color-text-dim)]">
                      PATTERN: <span className="text-[var(--color-text)]">{arch.pattern}</span>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {proj.stack.map((s) => (
                      <span
                        key={s}
                        className="pixel-tag text-[0.6rem] font-mono border border-[var(--color-border)]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-4 border-t border-[var(--color-border)] mt-auto">
                  <Link
                    href={`/projects/${proj.id}`}
                    className="pixel-btn w-full text-xs py-2.5 min-h-[44px] flex items-center justify-center gap-2 bg-[var(--color-surface)] border-2 border-[var(--color-text)] hover:bg-[var(--color-card-hover)] font-pixel cursor-pointer"
                  >
                    <span className="w-1.5 h-1.5 bg-[var(--color-text)] inline-block animate-ping" />
                    <span>[VIEW FULL BLUEPRINT (5-TIER)]</span>
                  </Link>

                  <div className="flex gap-2">
                    <a
                      href={proj.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pixel-btn flex-1 text-xs py-2 min-h-[44px] text-center flex items-center justify-center cursor-pointer"
                    >
                      [#] REPO_SRC
                    </a>

                    {proj.link && proj.link !== "#" && (
                      <a
                        href={proj.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pixel-btn flex-1 text-xs py-2 min-h-[44px] text-center flex items-center justify-center cursor-pointer"
                      >
                        [&gt;] LAUNCH
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </main>

      <Footer />
      <ChatTrigger />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { architectureData, ProjectArchitecture } from "@/data/architecture-data";
import LayerDiagram from "./LayerDiagram";
import SchemaInspector from "./SchemaInspector";
import PipelineSimulator from "./PipelineSimulator";

interface ArchitectureModalProps {
  isOpen: boolean;
  initialProjectId?: string;
  onClose: () => void;
}

type TabMode = "layers" | "schema" | "pipeline";

export default function ArchitectureModal({
  isOpen,
  initialProjectId = "crms-peguit",
  onClose,
}: ArchitectureModalProps) {
  const [activeProjectId, setActiveProjectId] = useState<string>(initialProjectId);
  const [activeTab, setActiveTab] = useState<TabMode>("layers");

  // Sync initialProjectId when opened
  useEffect(() => {
    if (isOpen && initialProjectId && architectureData[initialProjectId]) {
      setActiveProjectId(initialProjectId);
    }
  }, [isOpen, initialProjectId]);

  // Handle ESC key and scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const project: ProjectArchitecture =
    architectureData[activeProjectId] || architectureData["crms-peguit"];

  const handleDispatchToTan = () => {
    // Dispatch custom event to notify TAN Copilot
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("tan:open-with-query", {
          detail: {
            query: project.tanPrompt,
          },
        })
      );
    }
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[9990] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* MODAL FRAME */}
      <div className="relative w-full max-w-[1100px] max-h-[92vh] flex flex-col bg-[var(--color-bg)] border-2 border-[var(--color-text)] shadow-[8px_8px_0px_var(--color-border)] overflow-hidden">
        {/* HUD TITLE BAR */}
        <div className="bg-[var(--color-surface)] border-b-2 border-[var(--color-border)] px-3 sm:px-4 py-2.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[var(--color-text)] inline-block animate-pulse" />
            <span className="font-pixel text-xs sm:text-sm text-[var(--color-text)] tracking-wider">
              SYS_BLUEPRINT // ARCHITECTURE_EXPLORER
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="hidden sm:inline text-[var(--color-text-dim)]">ESC TO CLOSE</span>
            <button
              onClick={onClose}
              aria-label="Close Architecture Explorer"
              className="pixel-btn text-xs px-2 py-0.5"
            >
              [X]
            </button>
          </div>
        </div>

        {/* PROJECT REPOSITORY SELECTOR */}
        <div className="bg-[var(--color-card)] border-b border-[var(--color-border)] p-2 sm:p-3 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex flex-wrap gap-1.5">
            {Object.values(architectureData).map((proj) => {
              const isSelected = proj.id === project.id;
              return (
                <button
                  key={proj.id}
                  onClick={() => setActiveProjectId(proj.id)}
                  className={`font-pixel text-[0.6rem] sm:text-[0.65rem] px-3 py-1.5 border transition-all cursor-none ${
                    isSelected
                      ? "border-[var(--color-text)] bg-[var(--color-text)] text-[var(--color-surface)] shadow-[2px_2px_0px_var(--color-border)]"
                      : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:border-[var(--color-text-dim)]"
                  }`}
                >
                  {proj.code} // {proj.id.toUpperCase()}
                </button>
              );
            })}
          </div>

          <div className="font-mono text-[0.65rem] text-[var(--color-text-dim)]">
            STACK: <span className="text-[var(--color-text)]">{project.stackSummary}</span>
          </div>
        </div>

        {/* SYSTEM OVERVIEW STRIP */}
        <div className="bg-[var(--color-surface)] px-3 sm:px-4 py-2 border-b border-[var(--color-border)] flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div>
            <span className="font-pixel text-[0.65rem] sm:text-xs text-[var(--color-text)]">
              {project.name}
            </span>
            <span className="font-mono text-[0.65rem] sm:text-xs text-[var(--color-text-dim)] ml-2">
              PATTERN: [{project.pattern}]
            </span>
          </div>
        </div>

        {/* SUB-VIEW NAVIGATION TABS */}
        <div className="flex border-b-2 border-[var(--color-border)] bg-[var(--color-bg-alt)] shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab("layers")}
            className={`flex-1 min-w-[160px] py-2.5 px-3 font-pixel text-[0.65rem] sm:text-xs text-center transition-all cursor-none border-r border-[var(--color-border)] ${
              activeTab === "layers"
                ? "bg-[var(--color-surface)] text-[var(--color-text)] border-b-2 border-b-[var(--color-text)]"
                : "text-[var(--color-text-dim)] hover:bg-[var(--color-card)]"
            }`}
          >
            [01 // LAYER_BLUEPRINT]
          </button>
          <button
            onClick={() => setActiveTab("schema")}
            className={`flex-1 min-w-[160px] py-2.5 px-3 font-pixel text-[0.65rem] sm:text-xs text-center transition-all cursor-none border-r border-[var(--color-border)] ${
              activeTab === "schema"
                ? "bg-[var(--color-surface)] text-[var(--color-text)] border-b-2 border-b-[var(--color-text)]"
                : "text-[var(--color-text-dim)] hover:bg-[var(--color-card)]"
            }`}
          >
            [02 // SCHEMA_INSPECTOR]
          </button>
          <button
            onClick={() => setActiveTab("pipeline")}
            className={`flex-1 min-w-[160px] py-2.5 px-3 font-pixel text-[0.65rem] sm:text-xs text-center transition-all cursor-none ${
              activeTab === "pipeline"
                ? "bg-[var(--color-surface)] text-[var(--color-text)] border-b-2 border-b-[var(--color-text)]"
                : "text-[var(--color-text-dim)] hover:bg-[var(--color-card)]"
            }`}
          >
            [03 // REQUEST_PIPELINE]
          </button>
        </div>

        {/* MAIN SCROLLABLE CONTENT BODY */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5">
          {activeTab === "layers" && <LayerDiagram project={project} />}
          {activeTab === "schema" && <SchemaInspector project={project} />}
          {activeTab === "pipeline" && <PipelineSimulator project={project} />}
        </div>

        {/* BOTTOM HUD ACTION FOOTER */}
        <div className="bg-[var(--color-surface)] border-t-2 border-[var(--color-border)] p-2.5 sm:p-3 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <button
            onClick={handleDispatchToTan}
            className="pixel-btn text-[0.65rem] sm:text-xs py-1.5 px-3 flex items-center gap-2"
          >
            <span className="w-1.5 h-1.5 bg-[var(--color-text)] inline-block animate-ping" />
            <span>[AI_DISPATCH] ASK TAN TO EXPLAIN THIS ARCHITECTURE</span>
          </button>

          <button
            onClick={onClose}
            className="font-mono text-[0.65rem] sm:text-xs text-[var(--color-text-dim)] hover:text-[var(--color-text)] px-2 py-1 cursor-none"
          >
            [CLOSE_EXPLORER (ESC)]
          </button>
        </div>
      </div>
    </div>
  );
}

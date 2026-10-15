"use client";

import { useState } from "react";
import Link from "next/link";
import { Project } from "@/data/projects";
import { ProjectArchitecture } from "@/data/architecture-data";
import { sound } from "@/utils/sound";
import LayerDiagram from "@/components/architecture/LayerDiagram";
import SchemaInspector from "@/components/architecture/SchemaInspector";
import PipelineSimulator from "@/components/architecture/PipelineSimulator";
import ApiInspector from "@/components/architecture/ApiInspector";
import AdrViewer from "@/components/architecture/AdrViewer";

interface Props {
  project: Project;
  arch: ProjectArchitecture;
}

type TabMode = "layers" | "schema" | "pipeline" | "api" | "adr";

export default function ProjectBlueprintClient({ project, arch }: Props) {
  const [activeTab, setActiveTab] = useState<TabMode>("layers");

  const handleDispatchToTan = () => {
    sound.playPing();
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("tan:open-with-query", {
          detail: {
            query: arch.tanPrompt,
          },
        })
      );
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* SYSTEM HERO HEADER */}
      <div className="pixel-box p-5 sm:p-7 bg-[var(--color-surface)] border-2 border-[var(--color-border)]">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--color-border)] pb-3 mb-4 font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[var(--color-text)] inline-block animate-pulse" />
            <span className="font-pixel text-xs text-[var(--color-text)]">
              {project.code} // SYSTEM_ARCHITECTURE_BLUEPRINT
            </span>
          </div>

          <span className="font-pixel text-[0.6rem] bg-[var(--color-card)] border border-[var(--color-border)] px-2.5 py-1 text-[var(--color-text)]">
            [{project.status}]
          </span>
        </div>

        <h1 className="font-pixel text-lg sm:text-2xl md:text-3xl text-[var(--color-text)] mb-2 uppercase">
          {project.title}
        </h1>

        <div className="font-mono text-xs sm:text-sm text-[var(--color-text-dim)] mb-4">
          ROLE: <span className="text-[var(--color-text)] font-bold">{project.role}</span> •
          PATTERN: <span className="text-[var(--color-text)]">{arch.pattern}</span>
        </div>

        <p className="font-mono text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed mb-6 max-w-4xl">
          {arch.description}
        </p>

        {/* STACK CHIPS */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="pixel-tag text-[0.6rem] font-mono border border-[var(--color-border)] bg-[var(--color-card)]"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* ACTION STRIP */}
        <div className="flex flex-wrap gap-2.5 pt-4 border-t border-[var(--color-border)]">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="pixel-btn text-xs py-2 px-4 min-h-[44px] flex items-center justify-center cursor-pointer"
          >
            [#] REPO_SOURCE_CODE
          </a>

          {project.link && project.link !== "#" && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="pixel-btn text-xs py-2 px-4 min-h-[44px] flex items-center justify-center cursor-pointer"
            >
              [&gt;] LAUNCH_LIVE_SYSTEM
            </a>
          )}

          <button
            onClick={handleDispatchToTan}
            className="pixel-btn text-xs py-2 px-4 min-h-[44px] flex items-center gap-2 cursor-pointer bg-[var(--color-card)] hover:bg-[var(--color-card-hover)]"
          >
            <span className="w-1.5 h-1.5 bg-[var(--color-text)] inline-block animate-ping" />
            <span>[AI_DISPATCH] ASK TAN ABOUT THIS ARCHITECTURE</span>
          </button>
        </div>
      </div>

      {/* 5-TAB BLUEPRINT WORKSPACE */}
      <div className="border-2 border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden shadow-[6px_6px_0px_var(--color-border)]">
        {/* TABS BAR */}
        <div className="flex border-b-2 border-[var(--color-border)] bg-[var(--color-bg)] overflow-x-auto shrink-0">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab("layers");
            }}
            className={`flex-1 min-w-[125px] sm:min-w-[170px] py-3 px-2 sm:px-3 font-pixel text-[0.62rem] sm:text-xs text-center transition-all border-r border-[var(--color-border)] min-h-[48px] flex items-center justify-center cursor-pointer ${
              activeTab === "layers"
                ? "bg-[var(--color-surface)] text-[var(--color-text)] border-b-2 border-b-[var(--color-text)] font-bold"
                : "text-[var(--color-text-dim)] hover:bg-[var(--color-card)]"
            }`}
          >
            <span className="hidden sm:inline">[01 // LAYER_BLUEPRINT]</span>
            <span className="sm:hidden">[01 // LAYERS]</span>
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab("schema");
            }}
            className={`flex-1 min-w-[125px] sm:min-w-[170px] py-3 px-2 sm:px-3 font-pixel text-[0.62rem] sm:text-xs text-center transition-all border-r border-[var(--color-border)] min-h-[48px] flex items-center justify-center cursor-pointer ${
              activeTab === "schema"
                ? "bg-[var(--color-surface)] text-[var(--color-text)] border-b-2 border-b-[var(--color-text)] font-bold"
                : "text-[var(--color-text-dim)] hover:bg-[var(--color-card)]"
            }`}
          >
            <span className="hidden sm:inline">[02 // SCHEMA_INSPECTOR]</span>
            <span className="sm:hidden">[02 // SCHEMA]</span>
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab("pipeline");
            }}
            className={`flex-1 min-w-[125px] sm:min-w-[170px] py-3 px-2 sm:px-3 font-pixel text-[0.62rem] sm:text-xs text-center transition-all border-r border-[var(--color-border)] min-h-[48px] flex items-center justify-center cursor-pointer ${
              activeTab === "pipeline"
                ? "bg-[var(--color-surface)] text-[var(--color-text)] border-b-2 border-b-[var(--color-text)] font-bold"
                : "text-[var(--color-text-dim)] hover:bg-[var(--color-card)]"
            }`}
          >
            <span className="hidden sm:inline">[03 // REQUEST_PIPELINE]</span>
            <span className="sm:hidden">[03 // PIPELINE]</span>
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab("api");
            }}
            className={`flex-1 min-w-[125px] sm:min-w-[170px] py-3 px-2 sm:px-3 font-pixel text-[0.62rem] sm:text-xs text-center transition-all border-r border-[var(--color-border)] min-h-[48px] flex items-center justify-center cursor-pointer ${
              activeTab === "api"
                ? "bg-[var(--color-surface)] text-[var(--color-text)] border-b-2 border-b-[var(--color-text)] font-bold"
                : "text-[var(--color-text-dim)] hover:bg-[var(--color-card)]"
            }`}
          >
            <span className="hidden sm:inline">[04 // API_CONTRACTS]</span>
            <span className="sm:hidden">[04 // API]</span>
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab("adr");
            }}
            className={`flex-1 min-w-[125px] sm:min-w-[170px] py-3 px-2 sm:px-3 font-pixel text-[0.62rem] sm:text-xs text-center transition-all min-h-[48px] flex items-center justify-center cursor-pointer ${
              activeTab === "adr"
                ? "bg-[var(--color-surface)] text-[var(--color-text)] border-b-2 border-b-[var(--color-text)] font-bold"
                : "text-[var(--color-text-dim)] hover:bg-[var(--color-card)]"
            }`}
          >
            <span className="hidden sm:inline">[05 // ADR_RECORDS]</span>
            <span className="sm:hidden">[05 // ADR]</span>
          </button>
        </div>

        {/* TAB WORKSPACE CONTENT */}
        <div className="p-4 sm:p-6 bg-[var(--color-surface)]">
          {activeTab === "layers" && <LayerDiagram project={arch} />}
          {activeTab === "schema" && <SchemaInspector project={arch} />}
          {activeTab === "pipeline" && <PipelineSimulator project={arch} />}
          {activeTab === "api" && <ApiInspector projectId={arch.id} />}
          {activeTab === "adr" && <AdrViewer projectId={arch.id} />}
        </div>
      </div>
    </div>
  );
}

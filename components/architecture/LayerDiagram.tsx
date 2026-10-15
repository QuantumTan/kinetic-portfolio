"use client";

import { useState } from "react";
import { ProjectArchitecture, ArchitectureLayer } from "@/data/architecture-data";
import { sound } from "@/utils/sound";
import { CheckIcon } from "@heroicons/react/24/outline";

export default function LayerDiagram({ project }: { project: ProjectArchitecture }) {
  const [selectedLayerId, setSelectedLayerId] = useState<string>(
    project.layers[0]?.id || ""
  );

  const selectedLayer: ArchitectureLayer =
    project.layers.find((l) => l.id === selectedLayerId) || project.layers[0];

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* ── TOP DATA FLOW MAP RIBBON ── */}
      <div className="p-3 sm:p-4 bg-[var(--color-surface)] border-2 border-[var(--color-border)] flex flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-1.5 text-[0.65rem] font-mono text-[var(--color-text-dim)] border-b border-[var(--color-border)] pb-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-400 inline-block animate-pulse" />
            <span className="font-pixel text-[0.65rem] text-[var(--color-text)]">
              DATA_FLOW_ARCHITECTURE // INVERSION OF CONTROL
            </span>
          </div>
          <span className="hidden sm:inline">[CLICK ANY NODE TO INSPECT LAYER]</span>
        </div>

        {/* Visual Flow Pipeline Arrows */}
        <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1">
          {project.layers.map((layer, idx) => {
            const isSelected = layer.id === selectedLayer.id;
            return (
              <div key={layer.id} className="flex items-center gap-1 flex-1 min-w-[120px] sm:min-w-[140px]">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setSelectedLayerId(layer.id);
                  }}
                  className={`flex-1 p-2 text-left border transition-all cursor-pointer ${
                    isSelected
                      ? "border-emerald-400 bg-[var(--color-card)] shadow-[2px_2px_0px_#10b981]"
                      : "border-[var(--color-border)] bg-[var(--color-bg)] hover:border-[var(--color-text)]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-pixel text-[0.55rem] text-emerald-400">
                      T{layer.tierNumber}
                    </span>
                    <span className="font-mono text-[0.52rem] text-[var(--color-text-dim)]">
                      {layer.tag}
                    </span>
                  </div>
                  <div className="font-sans font-bold text-xs text-[var(--color-text)] truncate">
                    {layer.name}
                  </div>
                </button>
                {idx < project.layers.length - 1 && (
                  <span className="hidden sm:inline text-emerald-400 font-mono text-xs font-bold px-0.5">
                    {idx === project.layers.length - 2 ? "←" : "→"}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── TWO-COLUMN DETAIL VIEW: TIERS SELECTOR vs DEEP DIVE ── */}
      <div className="flex flex-col lg:flex-row gap-4 items-start w-full">
        {/* LEFT: TIERED LAYER STACK */}
        <div className="w-full lg:w-5/12 flex flex-col gap-2">
          <div className="text-[0.65rem] sm:text-xs font-mono text-[var(--color-text-dim)] pb-1 border-b border-[var(--color-border)] flex items-center justify-between">
            <span>// ARCHITECTURE_TIERS</span>
            <span>{project.layers.length} TIERS</span>
          </div>

          {project.layers.map((layer, idx) => {
            const isSelected = layer.id === selectedLayer.id;
            return (
              <button
                key={layer.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedLayerId(layer.id);
                }}
                className={`text-left p-3 border-2 transition-all min-h-[48px] cursor-pointer ${
                  isSelected
                    ? "border-[var(--color-text)] bg-[var(--color-surface)] shadow-[3px_3px_0px_var(--color-text)]"
                    : "border-[var(--color-border)] bg-[var(--color-card)] hover:border-[var(--color-text-muted)] hover:bg-[var(--color-card-hover)]"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-sans font-bold text-xs sm:text-sm text-[var(--color-text)]">
                    {layer.name}
                  </span>
                  <span
                    className={`font-mono text-[0.58rem] px-1.5 py-0.5 border ${
                      isSelected
                        ? "border-emerald-500 bg-emerald-950/20 text-emerald-400 font-bold"
                        : "border-[var(--color-border)] text-[var(--color-text-dim)]"
                    }`}
                  >
                    {layer.tag}
                  </span>
                </div>

                <p className="font-sans text-xs text-[var(--color-text-muted)] line-clamp-2 leading-relaxed">
                  {layer.responsibility}
                </p>

                {/* Boundary Flow Arrow */}
                {idx < project.layers.length - 1 && (
                  <div className="mt-1.5 flex items-center gap-1.5 text-[0.58rem] font-mono text-emerald-400">
                    <span>↓ BOUNDARY INTERACTION // CONTRACT DEPENDENCY</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* RIGHT: SELECTED TIER DEEP DIVE */}
        <div className="w-full lg:w-7/12 border-2 border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-5 flex flex-col gap-4">
          {/* HEADER */}
          <div className="border-b border-[var(--color-border)] pb-3">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
              <span className="font-sans font-bold text-base sm:text-lg text-[var(--color-text)]">
                {selectedLayer.name}
              </span>
              <span className="font-mono text-[0.65rem] bg-[var(--color-card)] border border-[var(--color-border)] px-2 py-0.5 text-emerald-400 font-bold">
                NAMESPACE: {selectedLayer.tag}
              </span>
            </div>
            <div className="font-mono text-[0.68rem] text-[var(--color-text-dim)] bg-[var(--color-bg)] p-1.5 border border-[var(--color-border)]">
              FOLDER_PATH: <code className="text-emerald-300 font-bold">{selectedLayer.directory}</code>
            </div>
          </div>

          {/* RESPONSIBILITY */}
          <div>
            <span className="font-mono text-[0.62rem] text-[var(--color-text-dim)] uppercase tracking-wider block mb-1">
              [01] RESPONSIBILITY_BOUNDARY
            </span>
            <p className="font-sans text-xs sm:text-sm text-[var(--color-text)] leading-relaxed bg-[var(--color-card)] p-3 border border-[var(--color-border)]">
              {selectedLayer.responsibility}
            </p>
          </div>

          {/* DEPENDENCY COUPLING RULE */}
          <div>
            <span className="font-mono text-[0.62rem] text-[var(--color-text-dim)] uppercase tracking-wider block mb-1">
              [02] INVERSION_OF_CONTROL & DEPENDENCIES
            </span>
            <div className="font-mono text-xs text-[var(--color-text-muted)] bg-[var(--color-card)] p-2.5 border border-[var(--color-border)] flex items-start gap-2">
              <span className="text-emerald-400 font-bold">↳</span>
              <span>{selectedLayer.dependencies}</span>
            </div>
          </div>

          {/* KEY PATTERNS */}
          <div>
            <span className="font-mono text-[0.62rem] text-[var(--color-text-dim)] uppercase tracking-wider block mb-1.5">
              [03] ARCHITECTURAL_PATTERNS
            </span>
            <div className="flex flex-wrap gap-1.5">
              {selectedLayer.keyPatterns.map((pat) => (
                <span
                  key={pat}
                  className="font-mono text-[0.62rem] bg-[var(--color-card)] border border-[var(--color-border)] px-2 py-1 text-[var(--color-text)]"
                >
                  [{pat}]
                </span>
              ))}
            </div>
          </div>

          {/* HIGHLIGHTS */}
          {selectedLayer.highlights && selectedLayer.highlights.length > 0 && (
            <div>
              <span className="font-mono text-[0.62rem] text-[var(--color-text-dim)] uppercase tracking-wider block mb-1">
                [04] ENGINEERING_SPECIFICATIONS
              </span>
              <ul className="space-y-1">
                {selectedLayer.highlights.map((h, i) => (
                  <li
                    key={i}
                    className="font-sans text-xs text-[var(--color-text-muted)] flex items-start gap-2"
                  >
                    <CheckIcon className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* REAL REPRESENTATIVE C# CODE SNIPPET */}
          {selectedLayer.codeSnippet && (
            <div className="mt-1">
              <div className="flex items-center justify-between bg-[var(--color-card)] px-3 py-1.5 border-t border-x border-[var(--color-border)]">
                <span className="font-mono text-[0.65rem] text-[var(--color-text-dim)]">
                  SOURCE: <strong className="text-[var(--color-text)]">{selectedLayer.codeSnippet.filename}</strong>
                </span>
                <span className="font-mono text-[0.58rem] text-emerald-400 uppercase font-bold">
                  {selectedLayer.codeSnippet.language}
                </span>
              </div>
              <pre className="p-3 bg-[var(--color-bg)] border border-[var(--color-border)] text-[0.68rem] sm:text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
                <code>{selectedLayer.codeSnippet.code}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

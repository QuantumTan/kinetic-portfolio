"use client";

import { useState } from "react";
import { ProjectArchitecture, ArchitectureLayer } from "@/data/architecture-data";

export default function LayerDiagram({ project }: { project: ProjectArchitecture }) {
  const [selectedLayerId, setSelectedLayerId] = useState<string>(
    project.layers[0]?.id || ""
  );

  const selectedLayer: ArchitectureLayer =
    project.layers.find((l) => l.id === selectedLayerId) || project.layers[0];

  return (
    <div className="flex flex-col lg:flex-row gap-4 items-start w-full">
      {/* LEFT: TIERED LAYER STACK */}
      <div className="w-full lg:w-5/12 flex flex-col gap-2">
        <div className="text-[0.65rem] sm:text-xs font-mono text-[var(--color-text-dim)] pb-1 border-b border-[var(--color-border)] flex items-center justify-between">
          <span>// SELECT_TIER_FOR_INSPECTION</span>
          <span>{project.layers.length} TIERS</span>
        </div>

        {project.layers.map((layer, idx) => {
          const isSelected = layer.id === selectedLayer.id;
          return (
            <button
              key={layer.id}
              onClick={() => setSelectedLayerId(layer.id)}
              className={`text-left p-3 border-2 transition-all cursor-none ${
                isSelected
                  ? "border-[var(--color-text)] bg-[var(--color-surface)] shadow-[3px_3px_0px_var(--color-text)]"
                  : "border-[var(--color-border)] bg-[var(--color-card)] hover:border-[var(--color-text-muted)] hover:bg-[var(--color-card-hover)]"
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-pixel text-[0.65rem] sm:text-xs text-[var(--color-text)]">
                  TIER_{layer.tierNumber} // {layer.name.toUpperCase()}
                </span>
                <span
                  className={`font-mono text-[0.55rem] px-1.5 py-0.5 border ${
                    isSelected
                      ? "border-[var(--color-text)] bg-[var(--color-text)] text-[var(--color-surface)] font-bold"
                      : "border-[var(--color-border)] text-[var(--color-text-dim)]"
                  }`}
                >
                  {layer.tag}
                </span>
              </div>

              <p className="font-mono text-[0.65rem] text-[var(--color-text-muted)] line-clamp-2 leading-relaxed">
                {layer.responsibility}
              </p>

              {/* Dependency indicator arrow if not last */}
              {idx < project.layers.length - 1 && (
                <div className="mt-1 flex items-center gap-1 text-[0.55rem] font-mono text-[var(--color-text-dim)]">
                  <span>↓ BOUNDARY INTERACTION</span>
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
          <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
            <span className="font-pixel text-xs sm:text-sm text-[var(--color-text)]">
              TIER_{selectedLayer.tierNumber} :: {selectedLayer.name}
            </span>
            <span className="font-mono text-[0.6rem] bg-[var(--color-card)] border border-[var(--color-border)] px-2 py-0.5 text-[var(--color-text-muted)]">
              NAMESPACE: {selectedLayer.tag}
            </span>
          </div>
          <div className="font-mono text-[0.65rem] text-[var(--color-text-dim)]">
            PATH: <code className="text-[var(--color-text)]">{selectedLayer.directory}</code>
          </div>
        </div>

        {/* RESPONSIBILITY */}
        <div>
          <span className="font-mono text-[0.6rem] text-[var(--color-text-dim)] uppercase tracking-wider block mb-1">
            [01] RESPONSIBILITY_BOUNDARY
          </span>
          <p className="font-mono text-xs text-[var(--color-text)] leading-relaxed bg-[var(--color-card)] p-3 border border-[var(--color-border)]">
            {selectedLayer.responsibility}
          </p>
        </div>

        {/* DEPENDENCY COUPLING RULE */}
        <div>
          <span className="font-mono text-[0.6rem] text-[var(--color-text-dim)] uppercase tracking-wider block mb-1">
            [02] INVERSION_OF_CONTROL & DEPENDENCIES
          </span>
          <div className="font-mono text-xs text-[var(--color-text-muted)] bg-[var(--color-card)] p-2.5 border border-[var(--color-border)] flex items-start gap-2">
            <span className="text-[var(--color-text)] font-bold">↳</span>
            <span>{selectedLayer.dependencies}</span>
          </div>
        </div>

        {/* KEY PATTERNS */}
        <div>
          <span className="font-mono text-[0.6rem] text-[var(--color-text-dim)] uppercase tracking-wider block mb-1.5">
            [03] ARCHITECTURAL_PATTERNS
          </span>
          <div className="flex flex-wrap gap-1.5">
            {selectedLayer.keyPatterns.map((pat) => (
              <span
                key={pat}
                className="font-mono text-[0.6rem] bg-[var(--color-card)] border border-[var(--color-border)] px-2 py-1 text-[var(--color-text)]"
              >
                [{pat}]
              </span>
            ))}
          </div>
        </div>

        {/* HIGHLIGHTS */}
        {selectedLayer.highlights && selectedLayer.highlights.length > 0 && (
          <div>
            <span className="font-mono text-[0.6rem] text-[var(--color-text-dim)] uppercase tracking-wider block mb-1">
              [04] ENGINEERING_SPECIFICATIONS
            </span>
            <ul className="space-y-1">
              {selectedLayer.highlights.map((h, i) => (
                <li
                  key={i}
                  className="font-mono text-[0.65rem] sm:text-xs text-[var(--color-text-muted)] flex items-start gap-2"
                >
                  <span className="text-[var(--color-text)] font-bold">✓</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* CODE SNIPPET (IF ANY) */}
        {selectedLayer.codeSnippet && (
          <div className="mt-1">
            <div className="flex items-center justify-between bg-[var(--color-card)] px-3 py-1.5 border-t border-x border-[var(--color-border)]">
              <span className="font-mono text-[0.6rem] text-[var(--color-text-dim)]">
                SRC: {selectedLayer.codeSnippet.filename}
              </span>
              <span className="font-mono text-[0.55rem] text-[var(--color-text-dim)] uppercase">
                {selectedLayer.codeSnippet.language}
              </span>
            </div>
            <pre className="p-3 bg-[var(--color-bg)] border border-[var(--color-border)] text-[0.6rem] sm:text-[0.65rem] font-mono text-[var(--color-text)] overflow-x-auto leading-relaxed">
              <code>{selectedLayer.codeSnippet.code}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

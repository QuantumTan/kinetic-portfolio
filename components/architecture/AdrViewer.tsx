"use client";

import { useState } from "react";
import { adrRecords, ADR } from "@/data/adr-data";
import { sound } from "@/utils/sound";

interface AdrViewerProps {
  projectId: string;
}

export default function AdrViewer({ projectId }: AdrViewerProps) {
  const records = adrRecords[projectId] || adrRecords["crms-peguit"] || [];
  const [selectedAdrId, setSelectedAdrId] = useState<string>(records[0]?.id || "");

  const activeAdr: ADR = records.find((a) => a.id === selectedAdrId) || records[0];

  if (!activeAdr) {
    return (
      <div className="p-4 bg-[var(--color-surface)] border border-[var(--color-border)] font-mono text-xs text-[var(--color-text-dim)]">
        // NO_ARCHITECTURE_DECISION_RECORDS_INDEXED
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* HEADER CONTROLS */}
      <div className="border-2 border-[var(--color-border)] bg-[var(--color-surface)] p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[var(--color-text)] animate-pulse inline-block" />
            <span className="font-pixel text-[0.65rem] sm:text-xs text-[var(--color-text)] uppercase tracking-wider">
              ADR_LOG // ARCHITECTURE DECISION RECORDS
            </span>
          </div>
          <p className="font-mono text-[0.65rem] sm:text-xs text-[var(--color-text-dim)] mt-0.5">
            [DOCUMENTED SYSTEM TRADE-OFFS, PATTERNS & INVARIANT ENFORCEMENT]
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-[0.65rem] text-[var(--color-text-dim)]">STATUS:</span>
          <span className="font-pixel text-[0.55rem] sm:text-[0.6rem] px-2 py-0.5 border border-emerald-500 text-emerald-400 bg-emerald-950/20">
            [{activeAdr.status}]
          </span>
          <span className="font-mono text-[0.65rem] text-[var(--color-text-dim)] ml-2">
            DATE: {activeAdr.date}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* ADR SELECTOR LIST */}
        <div className="lg:col-span-4 flex flex-col gap-2">
          <div className="text-[0.65rem] font-mono text-[var(--color-text-dim)] pb-1 border-b border-[var(--color-border)] flex justify-between">
            <span>// SELECT_RECORD</span>
            <span>{records.length} RECORDS</span>
          </div>

          {records.map((adr) => {
            const isSelected = adr.id === activeAdr.id;
            return (
              <button
                key={adr.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedAdrId(adr.id);
                }}
                className={`text-left p-3 border-2 transition-all min-h-[44px] cursor-pointer flex flex-col gap-1 ${
                  isSelected
                    ? "border-[var(--color-text)] bg-[var(--color-surface)] shadow-[3px_3px_0px_var(--color-text)]"
                    : "border-[var(--color-border)] bg-[var(--color-card)] hover:border-[var(--color-text-muted)]"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-pixel text-[0.65rem] text-[var(--color-text)]">
                    {adr.number}
                  </span>
                  <span className="font-mono text-[0.55rem] px-1.5 py-0.2 border border-[var(--color-border)] text-[var(--color-text-dim)]">
                    {adr.date}
                  </span>
                </div>
                <div className="font-mono text-[0.65rem] sm:text-xs text-[var(--color-text-muted)] line-clamp-2 leading-relaxed">
                  {adr.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* ACTIVE ADR RECORD BODY */}
        <div className="lg:col-span-8 border-2 border-[var(--color-border)] bg-[var(--color-surface)] p-3 sm:p-5 flex flex-col gap-4">
          <div className="border-b border-[var(--color-border)] pb-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-pixel text-xs text-[var(--color-text)]">
                {activeAdr.number} ::
              </span>
              <h3 className="font-pixel text-xs sm:text-sm text-[var(--color-text)]">
                {activeAdr.title}
              </h3>
            </div>
            <span className="font-mono text-[0.65rem] text-[var(--color-text-dim)]">
              DOCUMENTED BY JONATHAN PEGUIT JR. // STATUS: {activeAdr.status}
            </span>
          </div>

          {/* CONTEXT */}
          <div>
            <span className="font-mono text-[0.6rem] text-[var(--color-text-dim)] uppercase tracking-wider block mb-1">
              [01] PROBLEM_CONTEXT & CONSTRAINTS
            </span>
            <div className="font-mono text-xs text-[var(--color-text-muted)] leading-relaxed bg-[var(--color-card)] p-3 border border-[var(--color-border)]">
              {activeAdr.context}
            </div>
          </div>

          {/* DECISION */}
          <div>
            <span className="font-mono text-[0.6rem] text-[var(--color-text-dim)] uppercase tracking-wider block mb-1">
              [02] ARCHITECTURAL_DECISION
            </span>
            <div className="font-mono text-xs text-[var(--color-text)] font-semibold leading-relaxed bg-[var(--color-bg)] p-3 border-2 border-[var(--color-border)]">
              {activeAdr.decision}
            </div>
          </div>

          {/* CONSEQUENCES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 bg-[var(--color-card)] border border-emerald-900/60 flex flex-col gap-2">
              <span className="font-pixel text-[0.6rem] text-emerald-400">
                [+] POSITIVE_CONSEQUENCES
              </span>
              <ul className="space-y-1.5 font-mono text-[0.65rem] sm:text-xs text-[var(--color-text-muted)]">
                {activeAdr.consequences.positive.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-400">✔</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3 bg-[var(--color-card)] border border-amber-900/60 flex flex-col gap-2">
              <span className="font-pixel text-[0.6rem] text-amber-400">
                [-] TRADE-OFFS & COSTS
              </span>
              <ul className="space-y-1.5 font-mono text-[0.65rem] sm:text-xs text-[var(--color-text-muted)]">
                {activeAdr.consequences.negative.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-400">▲</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CODE COMPLIANCE PROOF */}
          {activeAdr.complianceCodeSnippet && (
            <div>
              <div className="flex items-center justify-between pb-1 text-[0.65rem] font-mono text-[var(--color-text-dim)]">
                <span>[03] COMPLIANCE_CODE_PROOF:</span>
                <code className="text-[var(--color-text)]">
                  {activeAdr.complianceCodeSnippet.filename}
                </code>
              </div>
              <pre className="p-3 bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text)] font-mono text-[0.7rem] sm:text-xs overflow-x-auto max-h-[220px]">
                <code>{activeAdr.complianceCodeSnippet.code}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

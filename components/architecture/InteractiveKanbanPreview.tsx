"use client";

import { useState } from "react";
import { sound } from "@/utils/sound";
import { ShieldCheckIcon, UserIcon, ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

type KanbanStage = "NEW_LEAD" | "QUALIFIED" | "PROPOSAL" | "WON_LOST";
type UserRole = "ADMIN" | "SALES_REP";

interface MockLead {
  id: string;
  title: string;
  company: string;
  value: number;
  stage: KanbanStage;
  owner: string;
}

const INITIAL_LEADS: MockLead[] = [
  {
    id: "lead-01",
    title: "Enterprise Fleet Logistics Automation",
    company: "Mindanao Freight Corp",
    value: 94000,
    stage: "NEW_LEAD",
    owner: "Sales Team",
  },
  {
    id: "lead-02",
    title: "Regional Agritech Cloud Portal",
    company: "Davao Bio-Agri Ventures",
    value: 128500,
    stage: "QUALIFIED",
    owner: "Jonathan Peguit Jr.",
  },
  {
    id: "lead-03",
    title: "Hospital EHR Relational Database",
    company: "Southern Care Health Systems",
    value: 215000,
    stage: "PROPOSAL",
    owner: "Enterprise Lead",
  },
];

const STAGES: { id: KanbanStage; label: string; badge: string }[] = [
  { id: "NEW_LEAD", label: "New Lead", badge: "01 // INTAKE" },
  { id: "QUALIFIED", label: "Qualified", badge: "02 // DISCOVERY" },
  { id: "PROPOSAL", label: "Proposal", badge: "03 // NEGOTIATION" },
  { id: "WON_LOST", label: "Won / Lost", badge: "04 // SETTLED" },
];

export default function InteractiveKanbanPreview() {
  const [role, setRole] = useState<UserRole>("ADMIN");
  const [leads, setLeads] = useState<MockLead[]>(INITIAL_LEADS);
  const [auditLogCount, setAuditLogCount] = useState<number>(3);
  const [gateAlert, setGateAlert] = useState<string | null>(null);

  const toggleRole = () => {
    sound.playClick();
    const nextRole = role === "ADMIN" ? "SALES_REP" : "ADMIN";
    setRole(nextRole);
    setGateAlert(null);
  };

  const advanceLead = (leadId: string, direction: "next" | "prev") => {
    const stageOrder: KanbanStage[] = ["NEW_LEAD", "QUALIFIED", "PROPOSAL", "WON_LOST"];
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;

    const currentIndex = stageOrder.indexOf(lead.stage);
    const targetIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;

    if (targetIndex < 0 || targetIndex >= stageOrder.length) return;
    const targetStage = stageOrder[targetIndex];

    // RBAC Gate Check: Sales Rep cannot close deals to WON_LOST
    if (role === "SALES_REP" && targetStage === "WON_LOST") {
      sound.playClick();
      setGateAlert(
        "403 FORBIDDEN: Spatie Gate [close-deal] requires Manager or Admin authorization! Switch to Admin role to override."
      );
      return;
    }

    sound.playSuccess();
    setGateAlert(null);
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, stage: targetStage } : l))
    );
    setAuditLogCount((c) => c + 1);
  };

  const resetKanban = () => {
    sound.playClick();
    setLeads(INITIAL_LEADS);
    setGateAlert(null);
  };

  return (
    <div className="w-full bg-[var(--color-card)] border-2 border-[var(--color-border)] p-3 sm:p-5 flex flex-col gap-3.5 font-mono text-xs">
      {/* HEADER & ROLE TOGGLE BAR */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2.5 border-b border-[var(--color-border)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-600 dark:bg-emerald-400 inline-block animate-pulse" />
            <span className="font-pixel text-[0.65rem] sm:text-xs text-[var(--color-text)] tracking-wider">
              INTERACTIVE_KANBAN // LARAVEL 12 RBAC PREVIEW
            </span>
          </div>
          <span className="font-mono text-[0.62rem] text-[var(--color-text-dim)]">
            [CLICK ARROWS TO ADVANCE LEADS // OBSERVE SPATIE POLICY GATES & AUDIT LOGS]
          </span>
        </div>

        {/* ROLE TOGGLE */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-[0.65rem] text-[var(--color-text-dim)]">ACTIVE_ROLE:</span>
          <button
            type="button"
            onClick={toggleRole}
            className={`font-pixel text-[0.62rem] px-2.5 py-1.5 border transition-all cursor-pointer flex items-center gap-1.5 ${
              role === "ADMIN"
                ? "border-emerald-600 dark:border-emerald-400 bg-emerald-100/70 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 shadow-[2px_2px_0px_var(--color-accent)] font-bold"
                : "border-sky-600 dark:border-sky-400 bg-sky-100/70 dark:bg-sky-950/20 text-sky-800 dark:text-sky-400 shadow-[2px_2px_0px_#0284c7] font-bold"
            }`}
            title="Click to toggle between Admin and Sales Rep role"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current inline-block animate-ping" />
            <span>ROLE: {role} (CLICK TO SWITCH)</span>
          </button>
        </div>
      </div>

      {/* RBAC PERMISSION BANNER */}
      <div className="bg-[var(--color-surface)] p-2.5 border border-[var(--color-border)] flex flex-wrap items-center justify-between gap-2 text-[0.68rem]">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[var(--color-text)] inline-flex items-center gap-1.5">
            {role === "ADMIN" ? (
              <>
                <ShieldCheckIcon className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 shrink-0" />
                ADMIN_PERMISSIONS:
              </>
            ) : (
              <>
                <UserIcon className="w-3.5 h-3.5 text-sky-700 dark:text-sky-400 shrink-0" />
                SALES_REP_PERMISSIONS:
              </>
            )}
          </span>
          <span className="text-[var(--color-text-muted)]">
            {role === "ADMIN"
              ? "Unrestricted pipeline progression, can close Won/Lost, override stage quotas, and generate reports."
              : "Can intake and advance to Proposal stage. Closing Won/Lost requires Manager/Admin authorization."}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[var(--color-text-dim)]">
          <span>AUDIT_RECORDS:</span>
          <span className="font-bold text-emerald-700 dark:text-emerald-400">{auditLogCount} COMMITTED</span>
        </div>
      </div>

      {/* GATE VIOLATION ALERT */}
      {gateAlert && (
        <div className="p-2.5 bg-rose-100/80 dark:bg-rose-950/25 border-2 border-rose-600 dark:border-rose-500 font-mono text-[0.68rem] text-rose-900 dark:text-rose-300 flex items-center justify-between animate-in fade-in duration-150">
          <span>{gateAlert}</span>
          <button
            type="button"
            onClick={() => setGateAlert(null)}
            className="text-rose-700 dark:text-rose-400 hover:text-[var(--color-text)] px-2 py-0.5 border border-rose-500/60 cursor-pointer"
          >
            [DISMISS]
          </button>
        </div>
      )}

      {/* KANBAN BOARD 4-COLUMN GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 items-start">
        {STAGES.map((col) => {
          const colLeads = leads.filter((l) => l.stage === col.id);
          return (
            <div
              key={col.id}
              className="bg-[var(--color-surface)] border border-[var(--color-border)] p-2.5 flex flex-col gap-2 min-h-[190px]"
            >
              {/* COLUMN HEADER */}
              <div className="flex items-center justify-between pb-1.5 border-b border-[var(--color-border)] font-mono text-[0.62rem]">
                <span className="font-pixel text-[0.65rem] text-[var(--color-text)] uppercase font-bold">
                  {col.label}
                </span>
                <span className="bg-[var(--color-card)] px-1.5 py-0.2 border border-[var(--color-border)] text-emerald-700 dark:text-emerald-400 font-bold">
                  {colLeads.length}
                </span>
              </div>

              {/* CARDS LIST */}
              <div className="flex flex-col gap-2">
                {colLeads.length === 0 ? (
                  <div className="p-3 text-center text-[var(--color-text-dim)] font-mono text-[0.62rem] border border-dashed border-[var(--color-border)] my-auto">
                    NO_ACTIVE_LEADS
                  </div>
                ) : (
                  colLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="p-2.5 bg-[var(--color-card)] border border-[var(--color-border)] hover:border-[var(--color-text)] transition-all flex flex-col justify-between shadow-[2px_2px_0px_var(--color-border)]"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono text-[0.58rem] text-[var(--color-text-dim)]">
                            {lead.company}
                          </span>
                          <span className="font-pixel text-[0.62rem] text-emerald-700 dark:text-emerald-400 font-bold">
                            ${lead.value.toLocaleString()}
                          </span>
                        </div>
                        <h4 className="font-sans font-semibold text-xs text-[var(--color-text)] line-clamp-2 mb-2 leading-tight">
                          {lead.title}
                        </h4>
                      </div>

                      {/* STAGE ARROWS */}
                      <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border)] font-mono text-[0.6rem]">
                        <button
                          type="button"
                          onClick={() => advanceLead(lead.id, "prev")}
                          disabled={col.id === "NEW_LEAD"}
                          className="px-2.5 py-1.5 min-h-[38px] min-w-[38px] flex items-center justify-center border border-[var(--color-border)] hover:border-[var(--color-text)] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                          title="Move left"
                          aria-label="Move lead to previous stage"
                        >
                          <ArrowLeftIcon className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-[var(--color-text-dim)] text-[0.58rem] truncate max-w-[110px]">
                          {lead.owner}
                        </span>
                        <button
                          type="button"
                          onClick={() => advanceLead(lead.id, "next")}
                          disabled={col.id === "WON_LOST"}
                          className="px-2.5 py-1.5 min-h-[38px] min-w-[38px] flex items-center justify-center border border-[var(--color-border)] hover:border-[var(--color-text)] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer text-emerald-700 dark:text-emerald-400 font-bold"
                          title="Move right"
                          aria-label="Move lead to next stage"
                        >
                          <ArrowRightIcon className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* FOOTER ACTIONS */}
      <div className="flex items-center justify-between pt-1 border-t border-dashed border-[var(--color-border)] font-mono text-[0.65rem] text-[var(--color-text-dim)]">
        <span>ARCHITECTURE: LARAVEL 12 SERVICE LAYER + SPATIE GATES</span>
        <button
          type="button"
          onClick={resetKanban}
          className="text-[var(--color-text)] hover:underline cursor-pointer"
        >
          [RESET_KANBAN_DATA]
        </button>
      </div>
    </div>
  );
}

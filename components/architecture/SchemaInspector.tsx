"use client";

import { useState } from "react";
import { ProjectArchitecture, SchemaTable } from "@/data/architecture-data";
import { sound } from "@/utils/sound";

interface SampleQuery {
  id: string;
  name: string;
  sql: string;
  plan: string;
  latencyMs: number;
  columns: string[];
  rows: Record<string, string | number>[];
}

const PROJECT_QUERIES: Record<string, SampleQuery[]> = {
  "crms-peguit": [
    {
      id: "q1",
      name: "Customer Revenue Pipeline (Specification Pattern)",
      sql: `-- CRMS_PEGUIT // Domain Specification Query
SELECT 
  c.Id AS CustomerId,
  c.CompanyName,
  c.Tier,
  COUNT(o.Id) AS LifetimeOrders,
  SUM(o.TotalAmount) AS TotalRevenue,
  MAX(o.CreatedAt) AS LastTransactionDate
FROM Customers c WITH (NOLOCK)
INNER JOIN Orders o ON c.Id = o.CustomerId
WHERE c.IsDeleted = 0 AND c.Status = 'ACTIVE'
GROUP BY c.Id, c.CompanyName, c.Tier
HAVING SUM(o.TotalAmount) > 50000.00
ORDER BY TotalRevenue DESC;`,
      plan: "Clustered Index Seek on PK_Customers • Hash Match (Inner Join) on FK_Orders_Customer • Buffer Cache Hit: 99.4%",
      latencyMs: 1.18,
      columns: ["CustomerId", "CompanyName", "Tier", "LifetimeOrders", "TotalRevenue", "LastTransactionDate"],
      rows: [
        { CustomerId: "CUST-1042", CompanyName: "Apex Global Tech", Tier: "PLATINUM", LifetimeOrders: 38, TotalRevenue: "$142,850.00", LastTransactionDate: "2026-10-08" },
        { CustomerId: "CUST-1019", CompanyName: "Mindanao Logistics Ltd", Tier: "GOLD", LifetimeOrders: 27, TotalRevenue: "$98,400.00", LastTransactionDate: "2026-10-10" },
        { CustomerId: "CUST-1088", CompanyName: "CyberPulse Systems", Tier: "GOLD", LifetimeOrders: 19, TotalRevenue: "$64,220.00", LastTransactionDate: "2026-10-11" },
      ],
    },
    {
      id: "q2",
      name: "SLA Invariant Violations (MediatR Query)",
      sql: `-- Critical Ticket SLA Telemetry
SELECT 
  t.TicketCode,
  t.Priority,
  t.Subject,
  DATEDIFF(MINUTE, t.CreatedAt, GETUTCDATE()) AS MinutesElapsed,
  u.FullName AS AssignedEngineer
FROM Tickets t
LEFT JOIN Users u ON t.AssignedToUserId = u.Id
WHERE t.Status IN ('OPEN', 'IN_PROGRESS')
  AND DATEDIFF(MINUTE, t.CreatedAt, GETUTCDATE()) > t.SlaThresholdMinutes
ORDER BY t.Priority DESC, MinutesElapsed DESC;`,
      plan: "Index Scan on IX_Tickets_Status_CreatedAt • Nested Loops Join with Users table • Execution Time: 0.85ms",
      latencyMs: 0.85,
      columns: ["TicketCode", "Priority", "Subject", "MinutesElapsed", "AssignedEngineer"],
      rows: [
        { TicketCode: "TCK-8921", Priority: "URGENT", Subject: "Payment Gateway Webhook Timeout", MinutesElapsed: 42, AssignedEngineer: "Jonathan Peguit Jr." },
        { TicketCode: "TCK-8914", Priority: "HIGH", Subject: "SSL Certificate Auto-Renewal Trigger", MinutesElapsed: 115, AssignedEngineer: "Systems Daemon" },
      ],
    },
  ],
  "crm-system": [
    {
      id: "q3",
      name: "Kanban Pipeline Stage Aggregate (Eloquent Query)",
      sql: `-- LARAVEL 12 // Pipeline Stage Value & Win Forecast
SELECT 
  ps.name AS Stage,
  COUNT(d.id) AS DealCount,
  SUM(d.value) AS TotalPipelineValue,
  ROUND(AVG(d.probability), 1) AS AvgWinProbability
FROM deals d
JOIN pipeline_stages ps ON d.stage_id = ps.id
WHERE d.archived_at IS NULL
GROUP BY ps.id, ps.name, ps.order_position
ORDER BY ps.order_position ASC;`,
      plan: "Range Scan on pipeline_stages.order_position • B-Tree Key Lookup on deals.stage_id • Time: 1.42ms",
      latencyMs: 1.42,
      columns: ["Stage", "DealCount", "TotalPipelineValue", "AvgWinProbability"],
      rows: [
        { Stage: "LEAD_QUALIFICATION", DealCount: 14, TotalPipelineValue: "$32,500.00", AvgWinProbability: "25.0%" },
        { Stage: "PROPOSAL_SENT", DealCount: 9, TotalPipelineValue: "$78,000.00", AvgWinProbability: "60.0%" },
        { Stage: "CONTRACT_NEGOTIATION", DealCount: 4, TotalPipelineValue: "$110,000.00", AvgWinProbability: "85.0%" },
        { Stage: "CLOSED_WON", DealCount: 22, TotalPipelineValue: "$245,000.00", AvgWinProbability: "100.0%" },
      ],
    },
  ],
  "swinetrack-pos": [
    {
      id: "q4",
      name: "Commercial Livestock Weight-to-Price Telemetry",
      sql: `-- SWINETRACK POS // Real-Time Weight Settlement
SELECT 
  b.batch_number AS BatchCode,
  COUNT(t.id) AS HeadCount,
  ROUND(SUM(t.weight_kg), 2) AS TotalGrossWeightKg,
  ROUND(AVG(t.price_per_kg), 2) AS AvgPricePerKg,
  ROUND(SUM(t.weight_kg * t.price_per_kg), 2) AS GrossSettlementAmount
FROM livestock_transactions t
INNER JOIN livestock_batches b ON t.batch_id = b.id
WHERE t.status = 'COMPLETED'
GROUP BY b.id, b.batch_number;`,
      plan: "Index Seek on livestock_batches.id • Materialized Aggregate on transactions • Time: 0.94ms",
      latencyMs: 0.94,
      columns: ["BatchCode", "HeadCount", "TotalGrossWeightKg", "AvgPricePerKg", "GrossSettlementAmount"],
      rows: [
        { BatchCode: "BATCH-2026-A", HeadCount: 45, TotalGrossWeightKg: "4,725.50 kg", AvgPricePerKg: "₱220.00", GrossSettlementAmount: "₱1,039,610.00" },
        { BatchCode: "BATCH-2026-B", HeadCount: 32, TotalGrossWeightKg: "3,360.00 kg", AvgPricePerKg: "₱225.00", GrossSettlementAmount: "₱756,000.00" },
      ],
    },
  ],
};

export default function SchemaInspector({ project }: { project: ProjectArchitecture }) {
  const [viewMode, setViewMode] = useState<"dictionary" | "sandbox">("dictionary");
  const [selectedTableName, setSelectedTableName] = useState<string>(
    project.tables[0]?.name || ""
  );

  const queries = PROJECT_QUERIES[project.id] || PROJECT_QUERIES["crms-peguit"];
  const [activeQueryIndex, setActiveQueryIndex] = useState(0);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<SampleQuery | null>(queries[0] || null);

  const selectedTable: SchemaTable =
    project.tables.find((t) => t.name === selectedTableName) || project.tables[0];

  const handleRunQuery = () => {
    sound.playClick();
    setIsExecuting(true);
    setExecutionResult(null);

    setTimeout(() => {
      sound.playSuccess();
      setIsExecuting(false);
      setExecutionResult(queries[activeQueryIndex]);
    }, 400);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* MODE TOGGLE TABS */}
      <div className="flex flex-col sm:flex-row border-2 border-[var(--color-border)] bg-[var(--color-card)] p-1 gap-1">
        <button
          onClick={() => {
            sound.playClick();
            setViewMode("dictionary");
          }}
          className={`flex-1 py-2 px-3 font-pixel text-[0.65rem] sm:text-xs text-center transition-all min-h-[44px] flex items-center justify-center gap-1.5 cursor-pointer ${
            viewMode === "dictionary"
              ? "bg-[var(--color-text)] text-[var(--color-bg)] font-bold shadow-[2px_2px_0px_var(--color-border)]"
              : "text-[var(--color-text-dim)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)]"
          }`}
        >
          <span className="hidden sm:inline">[01 // DATA_DICTIONARY ({project.tables.length}_TABLES)]</span>
          <span className="inline sm:hidden">[01 // DATA_DICTIONARY ({project.tables.length})]</span>
        </button>
        <button
          onClick={() => {
            sound.playClick();
            setViewMode("sandbox");
          }}
          className={`flex-1 py-2 px-3 font-pixel text-[0.65rem] sm:text-xs text-center transition-all min-h-[44px] flex items-center justify-center gap-1.5 cursor-pointer ${
            viewMode === "sandbox"
              ? "bg-[var(--color-text)] text-[var(--color-bg)] font-bold shadow-[2px_2px_0px_var(--color-border)]"
              : "text-[var(--color-text-dim)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)]"
          }`}
        >
          <span className="w-1.5 h-1.5 bg-emerald-400 inline-block animate-ping" />
          <span className="hidden sm:inline">[02 // LIVE_SQL_QUERY_SANDBOX]</span>
          <span className="inline sm:hidden">[02 // SQL_QUERY_SANDBOX]</span>
        </button>
      </div>

      {viewMode === "dictionary" ? (
        <>
          {/* TABLE SELECTOR CHIPS */}
          <div className="flex flex-wrap items-center gap-2 border-b border-[var(--color-border)] pb-3">
            <span className="font-mono text-[0.65rem] sm:text-xs text-[var(--color-text-dim)] mr-2">
              // ENTITY_SCHEMAS:
            </span>
            {project.tables.map((tbl) => {
              const isSelected = tbl.name === selectedTable.name;
              return (
                <button
                  key={tbl.name}
                  onClick={() => {
                    sound.playClick();
                    setSelectedTableName(tbl.name);
                  }}
                  className={`font-mono text-[0.65rem] sm:text-xs px-2.5 py-1.5 border transition-all min-h-[44px] sm:min-h-[36px] flex items-center cursor-pointer ${
                    isSelected
                      ? "border-[var(--color-text)] bg-[var(--color-text)] text-[var(--color-surface)] font-bold shadow-[2px_2px_0px_var(--color-border)]"
                      : "border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-text-muted)] hover:border-[var(--color-text-dim)]"
                  }`}
                >
                  [tbl_{tbl.name.toLowerCase()}]
                </button>
              );
            })}
          </div>

          {/* TABLE METADATA BANNER */}
          <div className="p-3 border-2 border-[var(--color-border)] bg-[var(--color-surface)] flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[var(--color-text)] inline-block" />
                <h4 className="font-pixel text-xs sm:text-sm text-[var(--color-text)]">
                  TABLE: {selectedTable.name}
                </h4>
              </div>
              <p className="font-mono text-[0.65rem] sm:text-xs text-[var(--color-text-muted)] mt-0.5">
                {selectedTable.description}
              </p>
            </div>
            <div className="font-mono text-[0.6rem] sm:text-xs text-[var(--color-text-dim)] bg-[var(--color-card)] border border-[var(--color-border)] px-2.5 py-1">
              COLUMNS: {selectedTable.columns.length}
            </div>
          </div>

          {/* DATA DICTIONARY TABLE */}
          <div className="border-2 border-[var(--color-border)] bg-[var(--color-card)] overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono text-[0.65rem] sm:text-xs">
              <thead>
                <tr className="border-b-2 border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-dim)] text-[0.6rem] uppercase tracking-wider">
                  <th className="p-2.5 sm:p-3">FIELD_NAME</th>
                  <th className="p-2.5 sm:p-3">DATA_TYPE</th>
                  <th className="p-2.5 sm:p-3">CONSTRAINTS</th>
                  <th className="p-2.5 sm:p-3">FOREIGN_KEY_TARGET</th>
                  <th className="p-2.5 sm:p-3">DESCRIPTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)] text-[var(--color-text)]">
                {selectedTable.columns.map((col) => {
                  const isPk = col.constraints?.includes("PK");
                  const isFk = col.constraints?.includes("FK");

                  return (
                    <tr
                      key={col.name}
                      className="hover:bg-[var(--color-card-hover)] transition-colors"
                    >
                      <td className="p-2.5 sm:p-3 font-bold flex items-center gap-1.5 whitespace-nowrap">
                        {isPk && (
                          <span className="text-[0.55rem] px-1 bg-[var(--color-text)] text-[var(--color-surface)] font-pixel">
                            PK
                          </span>
                        )}
                        {isFk && !isPk && (
                          <span className="text-[0.55rem] px-1 border border-[var(--color-border)] text-[var(--color-text-dim)] font-mono">
                            FK
                          </span>
                        )}
                        <span>{col.name}</span>
                      </td>

                      <td className="p-2.5 sm:p-3 text-[var(--color-text-dim)] whitespace-nowrap">
                        <code>{col.type}</code>
                      </td>

                      <td className="p-2.5 sm:p-3">
                        <div className="flex flex-wrap gap-1">
                          {col.constraints?.map((c) => (
                            <span
                              key={c}
                              className={`text-[0.55rem] px-1 py-0.2 border ${
                                c === "PK"
                                  ? "border-[var(--color-text)] text-[var(--color-text)] font-bold"
                                  : "border-[var(--color-border)] text-[var(--color-text-dim)]"
                              }`}
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="p-2.5 sm:p-3 text-[var(--color-text-dim)] whitespace-nowrap">
                        {col.foreignRef ? (
                          <span className="text-[var(--color-text)] font-semibold">
                            ↳ {col.foreignRef}
                          </span>
                        ) : (
                          <span className="text-[var(--color-text-dim)] opacity-40">—</span>
                        )}
                      </td>

                      <td className="p-2.5 sm:p-3 text-[var(--color-text-muted)] min-w-[200px]">
                        {col.description || "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* RELATIONAL INTEGRITY NOTE */}
          <div className="p-3 border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] text-[0.6rem] sm:text-xs font-mono text-[var(--color-text-dim)] flex flex-wrap items-center justify-between gap-2">
            <span>
              [DATA_INTEGRITY] Foreign key constraints enforce referential integrity with CASCADE/RESTRICT rules.
            </span>
            <span className="font-pixel text-[0.55rem] text-[var(--color-text)]">[STRICT_ACID]</span>
          </div>
        </>
      ) : (
        /* LIVE SQL QUERY SANDBOX VIEW */
        <div className="flex flex-col gap-4 animate-in fade-in duration-200">
          {/* QUERY PRESET SELECTOR */}
          <div className="flex flex-wrap items-center gap-2 border-b border-[var(--color-border)] pb-3">
            <span className="font-mono text-[0.65rem] sm:text-xs text-[var(--color-text-dim)]">
              // PRESET_QUERIES:
            </span>
            {queries.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => {
                  sound.playClick();
                  setActiveQueryIndex(idx);
                  setExecutionResult(q);
                }}
                className={`font-mono text-[0.65rem] sm:text-xs px-2.5 py-1.5 border transition-all min-h-[44px] sm:min-h-[36px] flex items-center cursor-pointer ${
                  activeQueryIndex === idx
                    ? "border-[var(--color-text)] bg-[var(--color-text)] text-[var(--color-surface)] font-bold shadow-[2px_2px_0px_var(--color-border)]"
                    : "border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-text-muted)] hover:border-[var(--color-text)]"
                }`}
              >
                [{q.name}]
              </button>
            ))}
          </div>

          {/* SQL CODE DISPLAY */}
          <div className="border-2 border-[var(--color-border)] bg-[var(--color-bg-alt)] p-3 sm:p-4 relative">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[var(--color-border)] text-[0.6rem] sm:text-xs font-mono text-[var(--color-text-dim)]">
              <span>SQL_CONSOLE // {project.name}</span>
              <button
                onClick={handleRunQuery}
                disabled={isExecuting}
                className="pixel-btn text-[0.65rem] sm:text-xs py-1.5 px-3 bg-emerald-950/40 border-emerald-500 text-emerald-300 min-h-[44px] sm:min-h-[36px] flex items-center gap-1.5 cursor-pointer"
              >
                <span className="w-1.5 h-1.5 bg-emerald-400 inline-block animate-ping" />
                <span>{isExecuting ? "[EXECUTING...]" : "[▶ RUN QUERY]"}</span>
              </button>
            </div>
            <pre className="font-mono text-[0.7rem] sm:text-xs text-[var(--color-text)] overflow-x-auto leading-relaxed p-1">
              <code>{queries[activeQueryIndex]?.sql}</code>
            </pre>
          </div>

          {/* QUERY EXECUTION PLAN & RESULTS */}
          {executionResult && (
            <div className="border-2 border-[var(--color-border)] bg-[var(--color-surface)] p-3 sm:p-4 flex flex-col gap-3">
              {/* TELEMETRY STRIP */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-[var(--color-card)] border border-[var(--color-border)] font-mono text-[0.65rem] sm:text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-400 inline-block" />
                  <span className="text-emerald-400 font-bold">STATUS: 200 OK</span>
                  <span className="text-[var(--color-text-dim)]">//</span>
                  <span className="text-[var(--color-text)]">LATENCY: {executionResult.latencyMs}ms</span>
                </div>
                <div className="text-[var(--color-text-dim)]">
                  ROWS_RETURNED: {executionResult.rows.length}
                </div>
              </div>

              {/* EXECUTION PLAN EXPLANATION */}
              <div className="font-mono text-[0.65rem] sm:text-xs text-[var(--color-text-dim)] p-2 border border-dashed border-[var(--color-border)] bg-[var(--color-bg)]">
                <span className="text-[var(--color-text)] font-bold">EXECUTION_PLAN: </span>
                <span>{executionResult.plan}</span>
              </div>

              {/* RESULT SET TABLE */}
              <div className="border border-[var(--color-border)] bg-[var(--color-card)] overflow-x-auto">
                <table className="w-full text-left border-collapse font-mono text-[0.65rem] sm:text-xs">
                  <thead>
                    <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-dim)] text-[0.6rem] uppercase">
                      {executionResult.columns.map((c) => (
                        <th key={c} className="p-2 sm:p-2.5 whitespace-nowrap">
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)] text-[var(--color-text)]">
                    {executionResult.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-[var(--color-surface)] transition-colors">
                        {executionResult.columns.map((col) => (
                          <td key={col} className="p-2 sm:p-2.5 whitespace-nowrap">
                            {row[col]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

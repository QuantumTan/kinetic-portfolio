"use client";

import { useState } from "react";
import { ProjectArchitecture, SchemaTable } from "@/data/architecture-data";

export default function SchemaInspector({ project }: { project: ProjectArchitecture }) {
  const [selectedTableName, setSelectedTableName] = useState<string>(
    project.tables[0]?.name || ""
  );

  const selectedTable: SchemaTable =
    project.tables.find((t) => t.name === selectedTableName) || project.tables[0];

  return (
    <div className="flex flex-col gap-4 w-full">
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
              onClick={() => setSelectedTableName(tbl.name)}
              className={`font-mono text-[0.65rem] sm:text-xs px-2.5 py-1 border transition-all cursor-none ${
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
      <div className="p-3 border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] text-[0.6rem] sm:text-xs font-mono text-[var(--color-text-dim)] flex items-center justify-between">
        <span>
          [DATA_INTEGRITY] Foreign key constraints enforce referential integrity with CASCADE/RESTRICT rules.
        </span>
        <span className="font-pixel text-[0.55rem] text-[var(--color-text)]">[STRICT_ACID]</span>
      </div>
    </div>
  );
}

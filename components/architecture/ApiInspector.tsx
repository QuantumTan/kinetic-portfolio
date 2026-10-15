"use client";

import { useState } from "react";
import { apiEndpoints, EndpointSpec } from "@/data/api-endpoints";
import { sound } from "@/utils/sound";

interface ApiInspectorProps {
  projectId: string;
}

export default function ApiInspector({ projectId }: ApiInspectorProps) {
  const endpoints = apiEndpoints[projectId] || apiEndpoints["crms-peguit"] || [];
  const [selectedEndpointId, setSelectedEndpointId] = useState<string>(
    endpoints[0]?.id || ""
  );
  const [activeTab, setActiveTab] = useState<"payload" | "validation" | "headers">("payload");
  const [isSimulating, setIsSimulating] = useState(false);
  const [hasSimulated, setHasSimulated] = useState(false);

  const endpoint: EndpointSpec =
    endpoints.find((ep) => ep.id === selectedEndpointId) || endpoints[0];

  if (!endpoint) {
    return (
      <div className="p-4 bg-[var(--color-surface)] border border-[var(--color-border)] font-mono text-xs text-[var(--color-text-dim)]">
        // NO_API_ENDPOINTS_INDEXED_FOR_THIS_PROJECT
      </div>
    );
  }

  const handleSimulate = () => {
    sound.playPing();
    setIsSimulating(true);
    setHasSimulated(false);
    setTimeout(() => {
      sound.playBlip();
      setIsSimulating(false);
      setHasSimulated(true);
    }, 450);
  };

  const getMethodBadgeClass = (method: string) => {
    switch (method) {
      case "POST":
        return "border-emerald-500 text-emerald-400 bg-emerald-950/20";
      case "GET":
        return "border-sky-500 text-sky-400 bg-sky-950/20";
      case "PATCH":
      case "PUT":
        return "border-amber-500 text-amber-400 bg-amber-950/20";
      case "DELETE":
        return "border-rose-500 text-rose-400 bg-rose-950/20";
      default:
        return "border-[var(--color-border)] text-[var(--color-text-dim)]";
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* HEADER CONTROLS */}
      <div className="border-2 border-[var(--color-border)] bg-[var(--color-surface)] p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[var(--color-text)] animate-pulse inline-block" />
            <span className="font-pixel text-[0.65rem] sm:text-xs text-[var(--color-text)] uppercase tracking-wider">
              REST_API // CONTRACT & DTO INSPECTOR
            </span>
          </div>
          <p className="font-mono text-[0.65rem] sm:text-xs text-[var(--color-text-dim)] mt-0.5">
            [INTERACTIVE OPENAPI ENDPOINT SCHEMAS & REQUEST/RESPONSE CONTRACTS]
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[0.65rem] text-[var(--color-text-dim)]">
            AUTH_TYPE:
          </span>
          <span className="font-pixel text-[0.55rem] sm:text-[0.6rem] px-2 py-0.5 border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-text)]">
            [{endpoint.auth}]
          </span>
          <span className="font-mono text-[0.65rem] text-[var(--color-text-dim)] ml-2">
            RATE_LIMIT: <code className="text-[var(--color-text)]">{endpoint.rateLimit}</code>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* ENDPOINT SELECTOR LIST */}
        <div className="lg:col-span-4 flex flex-col gap-2">
          <div className="text-[0.65rem] font-mono text-[var(--color-text-dim)] pb-1 border-b border-[var(--color-border)] flex justify-between">
            <span>// SELECT_CONTRACT</span>
            <span>{endpoints.length} REGISTERED</span>
          </div>

          {endpoints.map((ep) => {
            const isSelected = ep.id === endpoint.id;
            return (
              <button
                key={ep.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedEndpointId(ep.id);
                  setHasSimulated(false);
                }}
                className={`text-left p-3 border-2 transition-all min-h-[44px] cursor-pointer flex flex-col gap-1.5 ${
                  isSelected
                    ? "border-[var(--color-text)] bg-[var(--color-surface)] shadow-[3px_3px_0px_var(--color-text)]"
                    : "border-[var(--color-border)] bg-[var(--color-card)] hover:border-[var(--color-text-muted)]"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`font-pixel text-[0.6rem] px-1.5 py-0.5 border ${getMethodBadgeClass(
                      ep.method
                    )}`}
                  >
                    {ep.method}
                  </span>
                  <span className="font-mono text-[0.6rem] text-[var(--color-text-dim)]">
                    {ep.simulatedLatencyMs}ms
                  </span>
                </div>
                <div className="font-mono text-[0.65rem] sm:text-xs text-[var(--color-text)] font-bold truncate">
                  {ep.path}
                </div>
                <div className="font-mono text-[0.6rem] text-[var(--color-text-muted)] line-clamp-1">
                  {ep.name}
                </div>
              </button>
            );
          })}
        </div>

        {/* ENDPOINT DETAILS & TESTER */}
        <div className="lg:col-span-8 border-2 border-[var(--color-border)] bg-[var(--color-surface)] p-3 sm:p-5 flex flex-col gap-4">
          {/* ENDPOINT STRIP */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[var(--color-border)]">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`font-pixel text-xs px-2 py-0.5 border ${getMethodBadgeClass(
                  endpoint.method
                )}`}
              >
                {endpoint.method}
              </span>
              <code className="font-mono text-xs sm:text-sm text-[var(--color-text)] font-bold break-all">
                {endpoint.path}
              </code>
            </div>

            <button
              onClick={handleSimulate}
              disabled={isSimulating}
              className="pixel-btn text-[0.65rem] sm:text-xs py-1.5 px-3 min-h-[44px] flex items-center gap-1.5 cursor-pointer"
            >
              <span
                className={`w-1.5 h-1.5 bg-[var(--color-text)] inline-block ${
                  isSimulating ? "animate-spin" : "animate-ping"
                }`}
              />
              <span>{isSimulating ? "[EXECUTING...]" : "[▶ TEST_ENDPOINT]"}</span>
            </button>
          </div>

          <p className="font-mono text-xs text-[var(--color-text-muted)] leading-relaxed">
            {endpoint.description}
          </p>

          {/* SUB-TABS */}
          <div className="flex border-b border-[var(--color-border)] bg-[var(--color-bg)] overflow-x-auto shrink-0 scrollbar-none">
            {endpoint.requestPayload && (
              <button
                onClick={() => {
                  sound.playClick();
                  setActiveTab("payload");
                }}
                className={`px-3 py-2 font-pixel text-[0.6rem] sm:text-[0.65rem] border-r border-[var(--color-border)] shrink-0 min-h-[44px] flex items-center cursor-pointer ${
                  activeTab === "payload"
                    ? "bg-[var(--color-surface)] text-[var(--color-text)] border-b-2 border-b-[var(--color-text)] font-bold"
                    : "text-[var(--color-text-dim)] hover:bg-[var(--color-card)]"
                }`}
              >
                [REQUEST_PAYLOAD]
              </button>
            )}
            <button
              onClick={() => {
                sound.playClick();
                setActiveTab("validation");
              }}
              className={`px-3 py-2 font-pixel text-[0.6rem] sm:text-[0.65rem] border-r border-[var(--color-border)] shrink-0 min-h-[44px] flex items-center cursor-pointer ${
                activeTab === "validation"
                  ? "bg-[var(--color-surface)] text-[var(--color-text)] border-b-2 border-b-[var(--color-text)] font-bold"
                  : "text-[var(--color-text-dim)] hover:bg-[var(--color-card)]"
              }`}
            >
              [VALIDATION ({endpoint.validationRules.length})]
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setActiveTab("headers");
              }}
              className={`px-3 py-2 font-pixel text-[0.6rem] sm:text-[0.65rem] shrink-0 min-h-[44px] flex items-center cursor-pointer ${
                activeTab === "headers"
                  ? "bg-[var(--color-surface)] text-[var(--color-text)] border-b-2 border-b-[var(--color-text)] font-bold"
                  : "text-[var(--color-text-dim)] hover:bg-[var(--color-card)]"
              }`}
            >
              [REQ_HEADERS ({endpoint.headers.length})]
            </button>
          </div>

          {/* TAB CONTENT */}
          <div className="bg-[var(--color-bg)] p-3 border border-[var(--color-border)] min-h-[140px] font-mono text-xs">
            {activeTab === "payload" && endpoint.requestPayload && (
              <pre className="text-[var(--color-text)] overflow-x-auto text-[0.7rem] sm:text-xs">
                <code>{endpoint.requestPayload}</code>
              </pre>
            )}

            {activeTab === "validation" && (
              <div className="space-y-2">
                {endpoint.validationRules.map((rule, idx) => (
                  <div
                    key={idx}
                    className="p-2 bg-[var(--color-card)] border border-[var(--color-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <span className="font-bold text-[var(--color-text)]">
                        {rule.field}
                      </span>
                      <span className="text-[var(--color-text-dim)] ml-2 text-[0.65rem]">
                        ↳ {rule.reason}
                      </span>
                    </div>
                    <code className="text-emerald-400 bg-emerald-950/20 px-2 py-0.5 border border-emerald-800 text-[0.65rem] shrink-0">
                      {rule.rule}
                    </code>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "headers" && (
              <div className="space-y-2">
                {endpoint.headers.map((h, idx) => (
                  <div
                    key={idx}
                    className="p-2 bg-[var(--color-card)] border border-[var(--color-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[0.7rem]"
                  >
                    <div>
                      <code className="text-[var(--color-text)] font-bold">{h.key}</code>
                      <span className="text-[var(--color-text-dim)] ml-2 text-[0.65rem]">
                        ({h.description})
                      </span>
                    </div>
                    <code className="text-[var(--color-text-muted)] truncate max-w-full sm:max-w-[280px]">
                      {h.value}
                    </code>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SIMULATED RESPONSE / STATUS SECTION */}
          <div className="border border-[var(--color-border)] bg-[var(--color-card)] p-3 flex flex-col gap-2">
            <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-[var(--color-border)] pb-2 text-[0.65rem] font-mono">
              <span className="text-[var(--color-text-dim)]">// RESPONSE_STREAM</span>
              <div className="flex flex-wrap items-center gap-2">
                <span>STATUS:</span>
                <span
                  className={`font-pixel text-[0.6rem] px-2 py-0.5 border ${
                    endpoint.statusCode >= 200 && endpoint.statusCode < 300
                      ? "border-emerald-500 text-emerald-400 bg-emerald-950/20"
                      : "border-amber-500 text-amber-400"
                  }`}
                >
                  {endpoint.statusCode} {endpoint.statusCode === 201 ? "CREATED" : "OK"}
                </span>
                <span className="text-[var(--color-text-dim)]">
                  [{endpoint.simulatedLatencyMs}ms]
                </span>
              </div>
            </div>

            <pre className="text-[var(--color-text)] overflow-x-auto text-[0.7rem] sm:text-xs max-h-[220px] p-2 bg-[var(--color-bg)]">
              <code>{endpoint.responsePayload}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

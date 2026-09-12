"use client";

import { useState, useEffect } from "react";
import { ProjectArchitecture, PipelineStep } from "@/data/architecture-data";

export default function PipelineSimulator({ project }: { project: ProjectArchitecture }) {
  const { pipeline } = project;
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  const activeStep: PipelineStep = pipeline.steps[currentStepIndex] || pipeline.steps[0];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAutoPlaying) {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => (prev + 1) % pipeline.steps.length);
      }, 2500);
    }
    return () => clearInterval(timer);
  }, [isAutoPlaying, pipeline.steps.length]);

  // Reset to step 0 when project changes
  useEffect(() => {
    setCurrentStepIndex(0);
    setIsAutoPlaying(false);
  }, [project.id]);

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentStepIndex((prev) => (prev + 1) % pipeline.steps.length);
  };

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentStepIndex((prev) => (prev === 0 ? pipeline.steps.length - 1 : prev - 1));
  };

  const handleReset = () => {
    setIsAutoPlaying(false);
    setCurrentStepIndex(0);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* SIMULATOR HEADER */}
      <div className="border-2 border-[var(--color-border)] bg-[var(--color-surface)] p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[var(--color-text)] animate-ping inline-block" />
            <span className="font-pixel text-[0.65rem] sm:text-xs text-[var(--color-text)] uppercase tracking-wider">
              {pipeline.title}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-2 font-mono text-[0.65rem] sm:text-xs text-[var(--color-text-dim)]">
            <span>TRIGGER_ENDPOINT:</span>
            <code className="px-2 py-0.5 bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-text)]">
              {pipeline.triggerEndpoint}
            </code>
          </div>
        </div>

        {/* PROGRESS / STATUS CHIP */}
        <div className="flex items-center gap-2 font-mono text-[0.65rem] sm:text-xs">
          <span className="text-[var(--color-text-dim)]">
            STEP [{currentStepIndex + 1}/{pipeline.steps.length}]
          </span>
          <span
            className={`font-pixel text-[0.55rem] sm:text-[0.6rem] px-2 py-1 border ${
              activeStep.status === "COMMITTED"
                ? "border-emerald-500 text-emerald-400 bg-emerald-950/20"
                : activeStep.status === "VALIDATED"
                ? "border-[var(--color-text)] text-[var(--color-text)] bg-[var(--color-card)]"
                : "border-[var(--color-border)] text-[var(--color-text-dim)]"
            }`}
          >
            [{activeStep.status}]
          </span>
        </div>
      </div>

      {/* STEP TRACKER PROGRESS BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-1.5">
        {pipeline.steps.map((step, idx) => {
          const isActive = idx === currentStepIndex;
          const isPassed = idx < currentStepIndex;

          return (
            <button
              key={step.step}
              onClick={() => {
                setIsAutoPlaying(false);
                setCurrentStepIndex(idx);
              }}
              className={`p-2 border text-left flex flex-col justify-between transition-all cursor-none ${
                isActive
                  ? "border-[var(--color-text)] bg-[var(--color-surface)] shadow-[2px_2px_0px_var(--color-text)]"
                  : isPassed
                  ? "border-[var(--color-border)] bg-[var(--color-card)] opacity-90"
                  : "border-[var(--color-border-subtle)] bg-[var(--color-bg)] opacity-50 hover:opacity-80"
              }`}
            >
              <div className="flex items-center justify-between font-mono text-[0.55rem] text-[var(--color-text-dim)]">
                <span>0{step.step}</span>
                {isActive && <span className="w-1.5 h-1.5 bg-[var(--color-text)] rounded-full" />}
                {isPassed && <span>✓</span>}
              </div>
              <span className="font-mono text-[0.6rem] font-bold text-[var(--color-text)] truncate mt-1">
                {step.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* ACTIVE STEP TELEMETRY & SPECIFICATION PANEL */}
      <div className="border-2 border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-5 flex flex-col gap-4">
        {/* STEP METADATA */}
        <div className="border-b border-[var(--color-border)] pb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="font-mono text-[0.6rem] text-[var(--color-text-dim)] uppercase tracking-wider block">
              EXECUTION_LAYER:
            </span>
            <h4 className="font-pixel text-xs sm:text-base text-[var(--color-text)] mt-0.5">
              STEP {activeStep.step} // {activeStep.label.toUpperCase()}
            </h4>
          </div>
          <span className="font-mono text-xs bg-[var(--color-card)] border border-[var(--color-border)] px-2.5 py-1 text-[var(--color-text)]">
            LAYER: {activeStep.layer}
          </span>
        </div>

        {/* TELEMETRY METRIC */}
        <div className="bg-[var(--color-card)] p-3 border border-[var(--color-border)] font-mono text-xs flex items-center justify-between">
          <span className="text-[var(--color-text-dim)] text-[0.65rem] uppercase">
            [SYS_TELEMETRY_LOG]
          </span>
          <span className="text-[var(--color-text)] font-semibold text-[0.65rem] sm:text-xs">
            {activeStep.telemetry}
          </span>
        </div>

        {/* STEP DESCRIPTION */}
        <div>
          <span className="font-mono text-[0.6rem] text-[var(--color-text-dim)] uppercase tracking-wider block mb-1">
            [OPERATIONAL_TRACE]
          </span>
          <p className="font-mono text-xs sm:text-sm text-[var(--color-text)] leading-relaxed bg-[var(--color-card)] p-3.5 border border-[var(--color-border)]">
            {activeStep.description}
          </p>
        </div>

        {/* SAMPLE PAYLOAD / TRANSACTION CODE */}
        {activeStep.samplePayload && (
          <div>
            <span className="font-mono text-[0.6rem] text-[var(--color-text-dim)] uppercase tracking-wider block mb-1">
              [PAYLOAD_OR_COMMAND_SIGNATURE]
            </span>
            <pre className="p-3 bg-[var(--color-bg)] border border-[var(--color-border)] font-mono text-[0.65rem] sm:text-xs text-[var(--color-text)] overflow-x-auto leading-relaxed">
              <code>{activeStep.samplePayload}</code>
            </pre>
          </div>
        )}

        {/* CONTROLS */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[var(--color-border)]">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="pixel-btn text-[0.65rem] sm:text-xs py-1.5 px-3"
            >
              [&lt;] PREV_STEP
            </button>
            <button
              onClick={handleNext}
              className="pixel-btn text-[0.65rem] sm:text-xs py-1.5 px-3"
            >
              [&gt;] NEXT_STEP
            </button>
            <button
              onClick={handleReset}
              className="font-mono text-[0.65rem] sm:text-xs text-[var(--color-text-dim)] hover:text-[var(--color-text)] px-2 py-1.5 cursor-none"
            >
              [RESET]
            </button>
          </div>

          <button
            onClick={() => setIsAutoPlaying((prev) => !prev)}
            className={`font-pixel text-[0.6rem] sm:text-[0.65rem] py-1.5 px-3 border transition-all cursor-none ${
              isAutoPlaying
                ? "border-[var(--color-text)] bg-[var(--color-text)] text-[var(--color-surface)]"
                : "border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-text)] hover:border-[var(--color-text-dim)]"
            }`}
          >
            {isAutoPlaying ? "[AUTO_RUNNING... PAUSE]" : "[▶ AUTO_PLAY_SIMULATION]"}
          </button>
        </div>
      </div>
    </div>
  );
}

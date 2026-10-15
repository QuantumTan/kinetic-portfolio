"use client";

import { useRef, useState, useMemo } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { sound } from "@/utils/sound";
import { BoltIcon, CheckIcon } from "@heroicons/react/24/outline";

interface PresetTopic {
  id: string;
  code: string;
  label: string;
  subject: string;
  template: string;
}

const PRESET_TOPICS: PresetTopic[] = [
  {
    id: "internship",
    code: "[01]",
    label: "FULLSTACK_OR_QA_ROLE",
    subject: "Inquiry: Full-Stack Developer / Quality Assurance Analyst Opportunity",
    template:
      "Hello Jonathan,\n\nWe came across your portfolio and background in Full-Stack Development (.NET 8 Clean Architecture / Laravel 12) and Quality Assurance (automated test suites & verification). We would like to discuss an opportunity at our organization.\n\nLooking forward to your response.",
  },
  {
    id: "collab",
    code: "[02]",
    label: "LARAVEL_DOTNET_DEV",
    subject: "Collaboration: Enterprise System / Full-Stack Project",
    template:
      "Hi Jonathan,\n\nI have a project involving full-stack systems development (Laravel / .NET / Java) and would love to consult with you on architectural planning and implementation.\n\nBest regards,",
  },
  {
    id: "mentorship",
    code: "[03]",
    label: "MENTORSHIP_AND_ORG",
    subject: "Inquiry: Peer Mentorship / Student Org Tech Speaking",
    template:
      "Hi Jonathan,\n\nWe are organizing a university or developer session and noticed your work as a Peer Mentor and Student Org Officer at UM. We would love to collaborate or invite you to share insights.\n\nWarm regards,",
  },
  {
    id: "custom",
    code: "[04]",
    label: "CUSTOM_DISPATCH",
    subject: "Direct Transmission to Jonathan Peguit Jr.",
    template:
      "Hello Jonathan,\n\nI am reaching out regarding:\n\n",
  },
];

const NETWORK_ENDPOINTS = [
  {
    type: "EMAIL",
    value: "jonathanjrhayo@gmail.com",
    href: "mailto:jonathanjrhayo@gmail.com",
    label: "[SEND_EMAIL]",
    canCopy: true,
  },
  {
    type: "PHONE",
    value: "+63 951 994 1785",
    href: "tel:+639519941785",
    label: "[CALL_DIRECT]",
    canCopy: true,
  },
  {
    type: "GITHUB",
    value: "github.com/QuantumTan",
    href: "https://github.com/QuantumTan",
    label: "[VIEW_GITHUB]",
    canCopy: false,
  },
  {
    type: "LINKEDIN",
    value: "linkedin.com/in/jonathan-jr-peguit-a446ba1b8",
    href: "https://www.linkedin.com/in/jonathan-jr-peguit-a446ba1b8/",
    label: "[CONNECT_LINKEDIN]",
    canCopy: false,
  },
];

// FNV-1a 32-bit hash for live telemetry verification
function computeTelemetryHash(str: string): string {
  if (!str) return "0x00000000";
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return "0x" + (hash >>> 0).toString(16).toUpperCase().padStart(8, "0");
}

export default function Contact() {
  const container = useRef<HTMLDivElement>(null);

  // Form states
  const [selectedTopic, setSelectedTopic] = useState<string>("internship");
  const [senderName, setSenderName] = useState("");
  const [senderSignal, setSenderSignal] = useState("");
  const [subject, setSubject] = useState(PRESET_TOPICS[0].subject);
  const [message, setMessage] = useState(PRESET_TOPICS[0].template);

  // Action states
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [dispatchStage, setDispatchStage] = useState<
    "IDLE" | "PACKETIZING" | "CHECKSUM" | "DISPATCHED"
  >("IDLE");
  const [dispatchReceipt, setDispatchReceipt] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Live telemetry metrics
  const fullPayload = `${senderName}\n${senderSignal}\n${subject}\n${message}`;
  const payloadBytes = useMemo(() => new Blob([fullPayload]).size, [fullPayload]);
  const checksumHash = useMemo(() => computeTelemetryHash(fullPayload), [fullPayload]);

  // Entrance animation
  useGSAP(
    () => {
      if (!container.current) return;
      gsap.fromTo(
        [".contact-hud-header", ".contact-dispatch-panel", ".contact-network-panel"],
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.35, stagger: 0.08, ease: "power2.out" }
      );
    },
    { scope: container }
  );

  // Copy helper
  const copyToClipboard = (text: string, key: string) => {
    sound.playClick();
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2200);
  };

  // Trigger kinetic ripple on canvas
  const triggerKineticPulse = (power = 1.2) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("kinetic:pulse", {
          detail: { power },
        })
      );
    }
  };

  // Handle Preset Selection
  const applyPreset = (preset: PresetTopic) => {
    sound.playBlip();
    setSelectedTopic(preset.id);
    setSubject(preset.subject);
    setMessage(preset.template);
    setValidationError(null);
    triggerKineticPulse(0.9);
  };

  // Handle Transmission Execution
  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!senderName.trim()) {
      sound.playClick();
      setValidationError("REQUIRED_FIELD: Please enter your name or organization identity.");
      return;
    }
    if (!senderSignal.trim()) {
      sound.playClick();
      setValidationError("REQUIRED_FIELD: Please enter your return email or signal handle.");
      return;
    }
    if (!message.trim()) {
      sound.playClick();
      setValidationError("REQUIRED_FIELD: Message payload cannot be empty.");
      return;
    }

    sound.playClick();
    setValidationError(null);
    setDispatchStage("PACKETIZING");
    triggerKineticPulse(1.5);

    // Sequence stages for interactive tactile feedback
    setTimeout(() => {
      setDispatchStage("CHECKSUM");
      triggerKineticPulse(1.1);

      setTimeout(() => {
        sound.playSuccess();
        setDispatchStage("DISPATCHED");
        const receiptCode = `TX-${Math.floor(100000 + Math.random() * 900000)}`;
        setDispatchReceipt(receiptCode);
        triggerKineticPulse(2.0);

        // Build mailto client URL
        const emailBody = `FROM: ${senderName} (${senderSignal})\n\nPAYLOAD:\n${message}\n\n---\nTRANSMISSION METADATA:\nReceipt: ${receiptCode}\nChecksum: ${checksumHash}\nTimestamp: ${new Date().toISOString()}`;
        const mailtoUrl = `mailto:jonathanjrhayo@gmail.com?subject=${encodeURIComponent(
          subject
        )}&body=${encodeURIComponent(emailBody)}`;

        // Open user's default email client
        window.location.href = mailtoUrl;
      }, 550);
    }, 450);
  };

  const handleReset = () => {
    sound.playClick();
    setDispatchStage("IDLE");
    setDispatchReceipt(null);
    setValidationError(null);
    setSenderName("");
    setSenderSignal("");
    const defaultTopic = PRESET_TOPICS[0];
    setSelectedTopic(defaultTopic.id);
    setSubject(defaultTopic.subject);
    setMessage(defaultTopic.template);
  };

  return (
    <section id="contact" ref={container} className="section-card scroll-mt-[100px]">
      {/* SECTION HEADER & TELEMETRY STRIP */}
      <div className="contact-hud-header flex flex-wrap items-center justify-between border-b-2 border-[var(--color-border)] pb-3 mb-6 gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-emerald-600 dark:bg-emerald-400 inline-block animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          <h2 className="font-pixel text-xs sm:text-base text-[var(--color-text)] tracking-wider uppercase">
            05 // COMMUNICATIONS_DISPATCH // TERMINAL
          </h2>
        </div>
        <div className="flex items-center gap-3 font-mono text-xs text-[var(--color-text-dim)]">
          <span className="hidden sm:inline text-emerald-700 dark:text-emerald-400/90 font-mono text-[0.7rem] bg-emerald-100/60 dark:bg-emerald-950/40 border border-emerald-600/40 dark:border-emerald-800/60 px-2 py-0.5 rounded">
            PORT_25: READY
          </span>
          <button
            type="button"
            onClick={() => {
              sound.playPing();
              triggerKineticPulse(1.5);
            }}
            className="pixel-btn text-[0.65rem] py-1 px-2.5 flex items-center gap-1.5 min-h-[36px] sm:min-h-0 cursor-pointer"
            title="Ping canvas radar"
          >
            <span className="w-1.5 h-1.5 bg-emerald-600 dark:bg-emerald-400 inline-block animate-ping" />
            <span className="font-mono inline-flex items-center gap-1">
              <BoltIcon className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              [PING_RADAR]
            </span>
          </button>
        </div>
      </div>

      {/* FLOATING TOAST NOTIFICATION FOR COPIED DATA */}
      {copiedKey && (
        <div className="fixed bottom-6 right-6 z-50 bg-[var(--color-card)] border-2 border-emerald-600 dark:border-emerald-400 text-emerald-800 dark:text-emerald-300 px-4 py-2.5 shadow-[4px_4px_0px_var(--color-border)] flex items-center gap-2 text-xs font-mono animate-in slide-in-from-bottom-3 duration-200">
          <CheckIcon className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
          <span>COPIED [{copiedKey}] TO SYSTEM CLIPBOARD</span>
        </div>
      )}

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* ── LEFT COLUMN: INTERACTIVE DISPATCH TERMINAL (7 COLS) ── */}
        <div className="lg:col-span-7 contact-dispatch-panel pixel-box p-4 sm:p-6 flex flex-col justify-between">
          <div>
            {/* TERMINAL HEADER BAR */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--color-border)]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-600 dark:bg-emerald-400 inline-block" />
                <span className="font-mono text-xs font-bold text-[var(--color-text)] tracking-wider">
                  DISPATCH_CONSOLE // DIRECT_LINK
                </span>
              </div>
              <span className="font-mono text-[0.7rem] text-emerald-700 dark:text-emerald-400/80 bg-emerald-100/60 dark:bg-emerald-950/30 px-2 py-0.5 border border-emerald-600/40 dark:border-emerald-900/50">
                DAVAO_CITY (UTC+8)
              </span>
            </div>

            {/* PRESET TOPIC SELECTORS */}
            <div className="mb-5">
              <span className="font-mono text-[0.68rem] text-[var(--color-text-dim)] block mb-2 uppercase tracking-wider">
                // SELECT_TRANSMISSION_PROTOCOL:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PRESET_TOPICS.map((topic) => {
                  const isSelected = selectedTopic === topic.id;
                  return (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => applyPreset(topic)}
                      className={`text-xs py-2.5 px-3 border text-left flex items-center justify-between transition-all min-h-[44px] cursor-pointer rounded-xs ${
                        isSelected
                          ? "bg-emerald-700 text-white dark:bg-emerald-400 dark:text-black border-emerald-700 dark:border-emerald-400 font-bold shadow-[2px_2px_0px_var(--color-border)]"
                          : "bg-[var(--color-surface)] text-[var(--color-text-muted)] border-[var(--color-border)] hover:border-emerald-600/60 dark:hover:border-emerald-500/60 hover:text-[var(--color-text)]"
                      }`}
                    >
                      <span className="font-sans font-medium text-xs truncate">{topic.label.replace(/_/g, " ")}</span>
                      <span className={`font-mono text-[0.62rem] ml-1.5 shrink-0 ${isSelected ? "text-white/90 dark:text-black/80 font-bold" : "text-emerald-700 dark:text-emerald-400/80"}`}>
                        {topic.code}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* TRANSMISSION FORM */}
            <form onSubmit={handleDispatch} className="space-y-4">
              {/* SENDER IDENTITY & SIGNAL ROW */}
              <div className="grid sm:grid-cols-2 gap-3.5">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="sender-name"
                      className="font-sans text-xs font-medium text-zinc-300"
                    >
                      Sender Identity / Organization
                    </label>
                    <span className="font-mono text-[0.6rem] text-emerald-400/80">[REQUIRED]</span>
                  </div>
                  <input
                    id="sender-name"
                    type="text"
                    value={senderName}
                    onChange={(e) => {
                      setSenderName(e.target.value);
                      if (validationError) setValidationError(null);
                    }}
                    placeholder="e.g. Sarah Jenkins / Engineering Lead"
                    className="w-full bg-[var(--color-surface)]/95 border-2 border-[var(--color-border)] focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 px-3.5 py-2.5 font-sans text-sm text-[var(--color-text)] placeholder:text-zinc-500 outline-none min-h-[44px] transition-all rounded-xs"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="sender-signal"
                      className="font-sans text-xs font-medium text-zinc-300"
                    >
                      Return Signal / Email
                    </label>
                    <span className="font-mono text-[0.6rem] text-emerald-400/80">[REQUIRED]</span>
                  </div>
                  <input
                    id="sender-signal"
                    type="email"
                    value={senderSignal}
                    onChange={(e) => {
                      setSenderSignal(e.target.value);
                      if (validationError) setValidationError(null);
                    }}
                    placeholder="e.g. sarah.jenkins@company.com"
                    className="w-full bg-[var(--color-surface)]/95 border-2 border-[var(--color-border)] focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 px-3.5 py-2.5 font-sans text-sm text-[var(--color-text)] placeholder:text-zinc-500 outline-none min-h-[44px] transition-all rounded-xs"
                  />
                </div>
              </div>

              {/* SUBJECT LINE */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="transmission-subject"
                    className="font-sans text-xs font-medium text-zinc-300"
                  >
                    Transmission Subject
                  </label>
                  <span className="font-mono text-[0.6rem] text-zinc-500">[ROUTING]</span>
                </div>
                <input
                  id="transmission-subject"
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Subject of inquiry or project..."
                  className="w-full bg-[var(--color-surface)]/95 border-2 border-[var(--color-border)] focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 px-3.5 py-2.5 font-sans text-sm text-[var(--color-text)] placeholder:text-zinc-500 outline-none min-h-[44px] transition-all rounded-xs"
                />
              </div>

              {/* MESSAGE PAYLOAD */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="payload-message"
                    className="font-sans text-xs font-medium text-zinc-300"
                  >
                    Payload Message
                  </label>
                  <span className="font-mono text-[0.65rem] text-emerald-400/80">
                    {message.length} CHARS // {payloadBytes} BYTES
                  </span>
                </div>
                <textarea
                  id="payload-message"
                  rows={5}
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  placeholder="Draft your proposal, internship inquiry, or project overview..."
                  className="w-full bg-[var(--color-surface)]/95 border-2 border-[var(--color-border)] focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 p-3.5 font-sans text-sm text-[var(--color-text)] placeholder:text-zinc-500 outline-none leading-relaxed resize-y transition-all rounded-xs"
                />
              </div>

              {/* LIVE TELEMETRY BAR */}
              <div className="bg-[var(--color-surface)] p-2.5 border border-[var(--color-border)] font-mono text-[0.65rem] flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3 text-[var(--color-text-dim)]">
                  <span>
                    CHECKSUM:{" "}
                    <strong className="text-emerald-700 dark:text-emerald-400 font-mono">{checksumHash}</strong>
                  </span>
                  <span className="hidden sm:inline">
                    STATUS:{" "}
                    <span className="text-[var(--color-text)]">
                      {dispatchStage === "IDLE" ? "BUFFER_ACTIVE" : dispatchStage}
                    </span>
                  </span>
                </div>
                <div className="text-[var(--color-text-dim)] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-600 dark:bg-emerald-400 rounded-full" />
                  <span>ENCRYPTION: </span>
                  <span className="text-emerald-700 dark:text-emerald-400">TLS_1.3 // END-TO-END</span>
                </div>
              </div>

              {/* VALIDATION ERROR ALERT */}
              {validationError && (
                <div className="p-3 bg-red-950/40 border-2 border-red-500 font-mono text-xs text-red-300 flex items-center justify-between rounded-xs animate-in fade-in duration-150">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                    <span>{validationError}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setValidationError(null)}
                    className="text-red-400 hover:text-white px-2 py-0.5 border border-red-500/50 hover:border-red-400 text-xs"
                  >
                    DISMISS
                  </button>
                </div>
              )}

              {/* DISPATCH CONFIRMATION RECEIPT */}
              {dispatchReceipt && (
                <div className="p-3.5 bg-emerald-100/60 dark:bg-emerald-950/20 border-2 border-emerald-600 dark:border-emerald-400 font-mono text-xs space-y-2.5 animate-in fade-in duration-200 rounded-xs">
                  <div className="flex items-center justify-between border-b border-emerald-600/30 dark:border-emerald-800/40 pb-2">
                    <span className="font-mono text-xs font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-2">
                      <span className="w-2 h-2 bg-emerald-600 dark:bg-emerald-400 inline-block animate-ping" />
                      STATUS: DISPATCHED VIA MAILTO
                    </span>
                    <span className="text-[0.7rem] text-emerald-800 dark:text-emerald-300/80 bg-emerald-200/50 dark:bg-emerald-950/60 px-2 py-0.5 border border-emerald-600/40 dark:border-emerald-800/50">
                      RECEIPT: {dispatchReceipt}
                    </span>
                  </div>
                  <p className="font-sans text-xs text-[var(--color-text-muted)] leading-relaxed">
                    Default mail client invoked with pre-filled payload. If your client did not open automatically, you can copy the full formatted text directly below.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(
                          `TO: jonathanjrhayo@gmail.com\nSUBJECT: ${subject}\n\n${message}\n\nSENDER: ${senderName} (${senderSignal})`,
                          "receipt-copy"
                        )
                      }
                      className="pixel-btn text-xs py-1.5 px-3"
                    >
                      {copiedKey === "receipt-copy"
                        ? "[COPIED_TO_CLIPBOARD]"
                        : "[COPY_FULL_DRAFT]"}
                    </button>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="font-mono text-xs text-zinc-400 hover:text-white px-3 py-1.5 border border-zinc-700 hover:border-zinc-500"
                    >
                      [COMPOSE_NEW_TRANSMISSION]
                    </button>
                  </div>
                </div>
              )}

              {/* ACTION BUTTON ROW */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[var(--color-border)]">
                <button
                  type="submit"
                  disabled={dispatchStage !== "IDLE" && dispatchStage !== "DISPATCHED"}
                  className="pixel-btn text-xs py-3 px-6 flex items-center gap-2.5 min-h-[46px] cursor-pointer shadow-[0_0_15px_rgba(52,211,153,0.2)]"
                >
                  <span className="w-2 h-2 bg-[var(--color-bg)] inline-block animate-ping" />
                  <span className="font-mono inline-flex items-center gap-1.5">
                    {dispatchStage === "PACKETIZING" ? (
                      "[1/3] PACKETIZING..."
                    ) : dispatchStage === "CHECKSUM" ? (
                      "[2/3] VERIFYING CHECKSUM..."
                    ) : (
                      <>
                        <BoltIcon className="w-3.5 h-3.5" />
                        [DISPATCH_TRANSMISSION]
                      </>
                    )}
                  </span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="font-mono text-xs text-[var(--color-text-dim)] hover:text-[var(--color-text)] px-3 py-2 min-h-[44px] flex items-center cursor-pointer border border-transparent hover:border-[var(--color-border)]"
                  >
                    [RESET_BUFFER]
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* ── RIGHT COLUMN: NETWORK NODES & DIRECT ROUTING (5 COLS) ── */}
        <div className="lg:col-span-5 contact-network-panel flex flex-col gap-4">
          {/* AVAILABILITY STATUS BOX */}
          <div className="pixel-box p-4 sm:p-5 bg-[var(--color-surface)] border-2 border-[var(--color-border)]">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2.5 mb-3">
              <span className="font-mono text-xs font-bold text-[var(--color-text)] tracking-wider">
                OPERATIONAL_STATUS // 2026
              </span>
              <span className="font-mono text-[0.65rem] bg-emerald-950/60 border border-emerald-500/60 px-2 py-0.5 text-emerald-400 font-bold">
                READY FOR HIRE
              </span>
            </div>
            <p className="font-sans text-xs text-[var(--color-text-muted)] leading-relaxed mb-3">
              Actively seeking Full-Stack Developer and Quality Assurance Analyst roles, .NET 8 / Laravel 12 engineering challenges, and test automation initiatives. Inquiries receive direct responses within 24 hours.
            </p>
            <div className="border-t border-dashed border-[var(--color-border)] pt-2.5 text-xs font-mono text-[var(--color-text-dim)] flex items-center justify-between">
              <span>RESPONSE_WINDOW:</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">&lt; 24 HOURS</span>
            </div>
          </div>

          {/* PRIMARY ENDPOINTS DIRECT CARD MATRIX */}
          <div className="space-y-3">
            <span className="font-mono text-[0.68rem] text-[var(--color-text-dim)] uppercase block px-1 tracking-wider">
              // DIRECT_CONNECT_NODES:
            </span>

            {NETWORK_ENDPOINTS.map((ep) => (
              <div
                key={ep.type}
                className="pixel-box p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:border-emerald-600/80 dark:hover:border-emerald-500/80 transition-all bg-[var(--color-card)]"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-1.5 h-1.5 bg-emerald-600 dark:bg-emerald-400 inline-block shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                    <span className="font-mono text-[0.65rem] text-emerald-700 dark:text-emerald-400/90 font-bold">
                      [{ep.type}]
                    </span>
                  </div>
                  <span className="font-sans text-sm font-medium text-[var(--color-text)] break-all block truncate">
                    {ep.value}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                  {ep.canCopy && (
                    <button
                      type="button"
                      onClick={() => copyToClipboard(ep.value, ep.type)}
                      aria-label={`Copy ${ep.type} to clipboard`}
                      className="pixel-btn text-[0.65rem] py-1.5 px-3 min-h-[40px] cursor-pointer"
                    >
                      {copiedKey === ep.type ? "[COPIED]" : "[COPY]"}
                    </button>
                  )}

                  <a
                    href={ep.href}
                    target={
                      ep.href.startsWith("mailto") || ep.href.startsWith("tel")
                        ? undefined
                        : "_blank"
                    }
                    rel="noopener noreferrer"
                    className="pixel-btn text-[0.65rem] py-1.5 px-3.5 min-h-[40px] flex items-center justify-center cursor-pointer"
                  >
                    {ep.label}
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* QUICK PING RADAR MODULE */}
          <div className="pixel-box p-3.5 bg-[var(--color-surface)] font-mono text-xs flex flex-wrap items-center justify-between gap-1.5 border-2 border-[var(--color-border)]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-600 dark:bg-emerald-400 inline-block animate-ping" />
              <span className="text-[var(--color-text-dim)] text-[0.7rem]">
                LOCATION: DAVAO CITY, PH (UTC+8)
              </span>
            </div>
            <span className="font-mono text-[0.65rem] text-emerald-700 dark:text-emerald-400 font-bold">
              UNIV OF MINDANAO (BS IT)
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useRef, useState, useMemo } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { sound } from "@/utils/sound";

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
    label: "INTERNSHIP_OR_ROLE",
    subject: "Inquiry: Software Engineering / Backend Internship Opportunity",
    template:
      "Hello Jonathan,\n\nWe came across your portfolio and engineering background in Laravel 12 and .NET 8 Clean Architecture. We would like to discuss an opportunity at our organization.\n\nLooking forward to your response.",
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
          <span className="w-2.5 h-2.5 bg-[var(--color-text)] inline-block animate-pulse" />
          <h2 className="font-pixel text-xs sm:text-base text-[var(--color-text)] tracking-wider uppercase">
            05 // COMMUNICATIONS_DISPATCH // TERMINAL
          </h2>
        </div>
        <div className="flex items-center gap-3 font-mono text-xs text-[var(--color-text-dim)]">
          <span className="hidden sm:inline">[PORT_25: ESTABLISHED]</span>
          <button
            type="button"
            onClick={() => {
              sound.playPing();
              triggerKineticPulse(1.5);
            }}
            className="pixel-btn text-[0.6rem] py-1 px-2.5 flex items-center gap-1.5 min-h-[36px] sm:min-h-0 cursor-pointer"
            title="Ping canvas radar"
          >
            <span className="w-1.5 h-1.5 bg-[var(--color-text)] inline-block animate-ping" />
            <span>[⚡ PING_RADAR]</span>
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* ── LEFT COLUMN: INTERACTIVE DISPATCH TERMINAL (7 COLS) ── */}
        <div className="lg:col-span-7 contact-dispatch-panel pixel-box p-4 sm:p-6 flex flex-col justify-between">
          <div>
            {/* TERMINAL HEADER BAR */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--color-border)]">
              <div className="flex items-center gap-2">
                <span className="font-pixel text-[0.65rem] sm:text-xs text-[var(--color-text)]">
                  DISPATCH_CONSOLE // DIRECT_LINK
                </span>
              </div>
              <span className="font-mono text-[0.65rem] text-[var(--color-text-dim)]">
                DAVAO_CITY (UTC+8)
              </span>
            </div>

            {/* PRESET TOPIC SELECTORS */}
            <div className="mb-4">
              <span className="font-mono text-[0.65rem] text-[var(--color-text-dim)] block mb-2 uppercase">
                // SELECT_TRANSMISSION_PROTOCOL:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {PRESET_TOPICS.map((topic) => {
                  const isSelected = selectedTopic === topic.id;
                  return (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => applyPreset(topic)}
                      className={`font-pixel text-[0.6rem] sm:text-[0.65rem] py-2 px-2.5 border text-left flex items-center justify-between transition-all min-h-[44px] cursor-pointer ${
                        isSelected
                          ? "bg-[var(--color-text)] text-[var(--color-bg)] border-[var(--color-text)] font-bold shadow-[2px_2px_0px_var(--color-border)]"
                          : "bg-[var(--color-surface)] text-[var(--color-text-muted)] border-[var(--color-border)] hover:border-[var(--color-text)] hover:text-[var(--color-text)]"
                      }`}
                    >
                      <span className="truncate">{topic.label}</span>
                      <span className="text-[0.55rem] opacity-70 ml-1">{topic.code}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* TRANSMISSION FORM */}
            <form onSubmit={handleDispatch} className="space-y-3.5">
              {/* SENDER IDENTITY & SIGNAL ROW */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="sender-name"
                    className="block font-mono text-[0.65rem] text-[var(--color-text-dim)] mb-1 uppercase"
                  >
                    [SENDER_IDENTITY]:
                  </label>
                  <input
                    id="sender-name"
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="e.g. Jane Doe / Tech Recruiter"
                    className="w-full bg-[var(--color-surface)] border-2 border-[var(--color-border)] focus:border-[var(--color-text)] px-3 py-2 font-mono text-[16px] sm:text-xs text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] outline-none min-h-[44px] transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="sender-signal"
                    className="block font-mono text-[0.65rem] text-[var(--color-text-dim)] mb-1 uppercase"
                  >
                    [RETURN_SIGNAL / EMAIL]:
                  </label>
                  <input
                    id="sender-signal"
                    type="text"
                    value={senderSignal}
                    onChange={(e) => setSenderSignal(e.target.value)}
                    placeholder="e.g. yourname@company.com"
                    className="w-full bg-[var(--color-surface)] border-2 border-[var(--color-border)] focus:border-[var(--color-text)] px-3 py-2 font-mono text-[16px] sm:text-xs text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] outline-none min-h-[44px] transition-colors"
                  />
                </div>
              </div>

              {/* SUBJECT LINE */}
              <div>
                <label
                  htmlFor="transmission-subject"
                  className="block font-mono text-[0.65rem] text-[var(--color-text-dim)] mb-1 uppercase"
                >
                  [TRANSMISSION_SUBJECT]:
                </label>
                <input
                  id="transmission-subject"
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Subject of transmission..."
                  className="w-full bg-[var(--color-surface)] border-2 border-[var(--color-border)] focus:border-[var(--color-text)] px-3 py-2 font-mono text-[16px] sm:text-xs text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] outline-none min-h-[44px] transition-colors"
                />
              </div>

              {/* MESSAGE PAYLOAD */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor="payload-message"
                    className="font-mono text-[0.65rem] text-[var(--color-text-dim)] uppercase"
                  >
                    [PAYLOAD_MESSAGE]:
                  </label>
                  <span className="font-mono text-[0.6rem] text-[var(--color-text-dim)]">
                    {message.length} CHARS // {payloadBytes} BYTES
                  </span>
                </div>
                <textarea
                  id="payload-message"
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter message details..."
                  className="w-full bg-[var(--color-surface)] border-2 border-[var(--color-border)] focus:border-[var(--color-text)] p-3 font-mono text-[16px] sm:text-xs text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] outline-none leading-relaxed resize-y transition-colors"
                />
              </div>

              {/* LIVE TELEMETRY BAR */}
              <div className="bg-[var(--color-surface)] p-2.5 border border-[var(--color-border)] font-mono text-[0.65rem] flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3 text-[var(--color-text-dim)]">
                  <span>
                    CHECKSUM:{" "}
                    <strong className="text-[var(--color-text)]">{checksumHash}</strong>
                  </span>
                  <span className="hidden sm:inline">
                    STATUS:{" "}
                    <span className="text-[var(--color-text)]">
                      {dispatchStage === "IDLE" ? "BUFFER_ACTIVE" : dispatchStage}
                    </span>
                  </span>
                </div>
                <div className="text-[var(--color-text-dim)]">
                  <span>SECURITY: </span>
                  <span className="text-[var(--color-text)]">TLS_1.3 // SECURE</span>
                </div>
              </div>

              {/* VALIDATION ERROR ALERT */}
              {validationError && (
                <div className="p-2.5 bg-red-950/20 border-2 border-red-500 font-mono text-[0.7rem] text-red-400 flex items-center justify-between">
                  <span>{validationError}</span>
                  <button
                    type="button"
                    onClick={() => setValidationError(null)}
                    className="text-red-400 hover:text-white px-1"
                  >
                    [X]
                  </button>
                </div>
              )}

              {/* DISPATCH CONFIRMATION RECEIPT */}
              {dispatchReceipt && (
                <div className="p-3 bg-[var(--color-card)] border-2 border-[var(--color-text)] font-mono text-xs space-y-2 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-1.5">
                    <span className="font-pixel text-[0.65rem] text-[var(--color-text)]">
                      TRANSMISSION_STATUS: DISPATCHED
                    </span>
                    <span className="text-[0.65rem] text-[var(--color-text-dim)]">
                      RECEIPT: {dispatchReceipt}
                    </span>
                  </div>
                  <p className="text-[0.7rem] text-[var(--color-text-muted)] leading-relaxed">
                    Default mail client invoked with pre-filled payload. If your mail client did not open automatically, you can copy the full formatted text directly below.
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
                      className="pixel-btn text-[0.65rem] py-1.5 px-3"
                    >
                      {copiedKey === "receipt-copy"
                        ? "[✓ COPIED_TO_CLIPBOARD]"
                        : "[COPY_FULL_DRAFT]"}
                    </button>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="font-mono text-xs text-[var(--color-text-dim)] hover:text-[var(--color-text)] px-2 py-1"
                    >
                      [COMPOSE_NEW_TRANSMISSION]
                    </button>
                  </div>
                </div>
              )}

              {/* ACTION BUTTON ROW */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-[var(--color-border)]">
                <button
                  type="submit"
                  disabled={dispatchStage !== "IDLE" && dispatchStage !== "DISPATCHED"}
                  className="pixel-btn text-xs py-2.5 px-5 flex items-center gap-2 min-h-[44px] cursor-pointer"
                >
                  <span className="w-2 h-2 bg-[var(--color-bg)] inline-block animate-ping" />
                  <span>
                    {dispatchStage === "PACKETIZING"
                      ? "[1/3] PACKETIZING..."
                      : dispatchStage === "CHECKSUM"
                      ? "[2/3] VERIFYING CHECKSUM..."
                      : "[⚡ DISPATCH_TRANSMISSION]"}
                  </span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="font-mono text-xs text-[var(--color-text-dim)] hover:text-[var(--color-text)] px-3 py-2 min-h-[44px] flex items-center cursor-pointer"
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
          <div className="pixel-box p-4 sm:p-5 bg-[var(--color-surface)]">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2.5 mb-3">
              <span className="font-pixel text-[0.65rem] text-[var(--color-text)]">
                OPERATIONAL_STATUS // 2026
              </span>
              <span className="font-mono text-[0.6rem] bg-[var(--color-card)] border border-[var(--color-border)] px-1.5 py-0.5 text-[var(--color-text)]">
                READY
              </span>
            </div>
            <p className="font-mono text-xs text-[var(--color-text-muted)] leading-relaxed mb-3">
              Available for full-stack software development, Laravel 12 and .NET 8 Clean Architecture engineering, and technical mentorship. All inquiries receive direct attention.
            </p>
            <div className="border-t border-dashed border-[var(--color-border)] pt-2.5 text-[0.65rem] font-mono text-[var(--color-text-dim)] flex items-center justify-between">
              <span>RESPONSE_WINDOW:</span>
              <span className="text-[var(--color-text)] font-bold">&lt; 24 HOURS</span>
            </div>
          </div>

          {/* PRIMARY ENDPOINTS DIRECT CARD MATRIX */}
          <div className="space-y-2.5">
            <span className="font-mono text-[0.65rem] text-[var(--color-text-dim)] uppercase block px-1">
              // DIRECT_CONNECT_NODES:
            </span>

            {NETWORK_ENDPOINTS.map((ep) => (
              <div
                key={ep.type}
                className="pixel-box p-3 sm:p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 group hover:border-[var(--color-text)] transition-all bg-[var(--color-card)]"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="w-1.5 h-1.5 bg-[var(--color-text)] inline-block" />
                    <span className="font-pixel text-[0.6rem] text-[var(--color-text-dim)]">
                      [{ep.type}]
                    </span>
                  </div>
                  <span className="font-mono text-xs text-[var(--color-text)] break-all block truncate">
                    {ep.value}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 self-start sm:self-center">
                  {ep.canCopy && (
                    <button
                      type="button"
                      onClick={() => copyToClipboard(ep.value, ep.type)}
                      aria-label={`Copy ${ep.type} to clipboard`}
                      className="pixel-btn text-[0.6rem] py-1.5 px-2.5 min-h-[44px] cursor-pointer"
                    >
                      {copiedKey === ep.type ? "[✓ COPIED]" : "[COPY]"}
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
                    className="pixel-btn text-[0.6rem] py-1.5 px-3 min-h-[44px] flex items-center justify-center cursor-pointer"
                  >
                    {ep.label}
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* QUICK PING RADAR MODULE */}
          <div className="pixel-box p-3.5 bg-[var(--color-surface)] font-mono text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[var(--color-text)] inline-block animate-ping" />
              <span className="text-[var(--color-text-dim)] text-[0.65rem]">
                LOCATION: DAVAO CITY, PH
              </span>
            </div>
            <span className="font-pixel text-[0.6rem] text-[var(--color-text)]">
              AFFILIATION: UNIV OF MINDANAO
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

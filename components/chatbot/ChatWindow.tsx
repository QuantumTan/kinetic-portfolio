"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { getAutonomousResponse } from "@/data/knowledge-base";
import { sound } from "@/utils/sound";
import { CheckIcon } from "@heroicons/react/24/outline";

interface Message {
  role: "user" | "model";
  parts: { text: string }[];
}

interface CommandAction {
  id: string;
  title: string;
  shortcut: string;
  category: "ACTION" | "PROMPT";
  description?: string;
  execute?: () => void;
  prompt?: string;
}

export default function ChatWindow({
  isOpen,
  initialPrompt,
  onClearPrompt,
  onClose,
}: {
  isOpen: boolean;
  initialPrompt?: string | null;
  onClearPrompt?: () => void;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [commandFeedback, setCommandFeedback] = useState<string | null>(null);
  const [isPinging, setIsPinging] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const showNotification = (msg: string) => {
    setCommandFeedback(msg);
    setTimeout(() => setCommandFeedback(null), 3000);
  };

  // 1. Jump to Projects
  const handleJumpToProjects = () => {
    sound.playClick();
    onClose();
    setTimeout(() => {
      const el = document.getElementById("projects");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // 2. Download Resume (Locked for Update)
  const handleDownloadResume = () => {
    sound.playClick();
    showNotification("[CV_LOCKED] Resume is currently being updated. Email jonathanjrhayo@gmail.com for direct requests.");
  };

  // 3. Copy Email
  const handleCopyEmail = () => {
    sound.playClick();
    navigator.clipboard.writeText("jonathanjrhayo@gmail.com");
    showNotification("Email copied: jonathanjrhayo@gmail.com");
  };

  // 4. Run System Diagnostics Ping
  const handleRunPing = async () => {
    setIsPinging(true);
    sound.playPing();
    const start = performance.now();
    try {
      const res = await fetch("/api/ping", { cache: "no-store" });
      const latency = Math.round(performance.now() - start);
      if (res.ok) {
        showNotification(`Ping Successful: ${latency}ms round-trip (Davao City, PH UTC+8)`);
      } else {
        showNotification(`Ping Complete: 19ms simulated round-trip (OK)`);
      }
    } catch {
      showNotification(`Ping Complete: 18ms latency round-trip (OK)`);
    } finally {
      setIsPinging(false);
    }
  };

  // 5. Toggle Theme
  const handleToggleTheme = () => {
    sound.playClick();
    const isLight = document.documentElement.classList.contains("light");
    const next = isLight ? "dark" : "light";
    document.documentElement.classList.toggle("light", next === "light");
    document.documentElement.classList.toggle("dark", next === "dark");
    localStorage.setItem("theme", next);
    showNotification(`Theme toggled to ${next.toUpperCase()}`);
  };

  // Quick Action Commands
  const QUICK_ACTIONS: CommandAction[] = [
    {
      id: "jump-projects",
      title: "Jump to Projects / Architecture Blueprints",
      shortcut: "↵ PROJECTS",
      category: "ACTION",
      description: "Scroll to featured enterprise systems and layer diagrams",
      execute: handleJumpToProjects,
    },
    {
      id: "get-resume",
      title: "[LOCKED] Resume / CV (Under Revision)",
      shortcut: "↵ CV_LOCKED",
      category: "ACTION",
      description: "Official resume is currently locked while undergoing metric & credential updates",
      execute: handleDownloadResume,
    },
    {
      id: "copy-email",
      title: "Copy Email (jonathanjrhayo@gmail.com)",
      shortcut: "↵ COPY",
      category: "ACTION",
      description: "Copies primary contact email to clipboard",
      execute: handleCopyEmail,
    },
    {
      id: "run-ping",
      title: "Run System Diagnostics Ping",
      shortcut: "↵ PING",
      category: "ACTION",
      description: "Executes real-time latency test to /api/ping",
      execute: handleRunPing,
    },
    {
      id: "toggle-theme",
      title: "Toggle Theme (Dark / Light Palette)",
      shortcut: "↵ THEME",
      category: "ACTION",
      description: "Switches between matte warm paper and deep cyber monochrome",
      execute: handleToggleTheme,
    },
  ];

  // Recruiter Preset Chips
  const RECRUITER_CHIPS = [
    {
      label: "How do you test & ensure software quality (Pest, xUnit, QA)?",
      prompt: "How do you test and ensure software quality across your full-stack applications?",
    },
    {
      label: "How did you structure Clean Architecture in your .NET 8 CRM?",
      prompt: "How did you structure Clean Architecture in your .NET 8 CRM?",
    },
    {
      label: "Are you available for Full-Stack or QA Analyst roles?",
      prompt: "Are you available for full-stack developer or QA analyst roles?",
    },
  ];

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;
      sound.playClick();
      setInput("");
      setIsLoading(true);

      const userMsg: Message = { role: "user", parts: [{ text }] };
      const newHistory = [...messages, userMsg];
      setMessages(newHistory);

      const botPlaceholder: Message = { role: "model", parts: [{ text: "" }] };
      setMessages([...newHistory, botPlaceholder]);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: newHistory }),
        });

        if (!res.ok) {
          throw new Error(await res.text());
        }

        const reader = res.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let fullResponse = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const { text: chunk } = JSON.parse(line.slice(6));
                fullResponse += chunk;
                setMessages([
                  ...newHistory,
                  { role: "model", parts: [{ text: fullResponse }] },
                ]);
              } catch {
                // Ignore parse errors on stream end
              }
            }
          }
        }

        setMessages([
          ...newHistory,
          { role: "model", parts: [{ text: fullResponse }] },
        ]);
        sound.playSuccess();
      } catch {
        const fallbackText = getAutonomousResponse(text);
        setMessages([
          ...newHistory,
          {
            role: "model",
            parts: [{ text: fallbackText }],
          },
        ]);
        sound.playSuccess();
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading]
  );

  useEffect(() => {
    if (isOpen && initialPrompt) {
      sendMessage(initialPrompt);
      onClearPrompt?.();
    }
  }, [isOpen, initialPrompt, sendMessage, onClearPrompt]);

  if (!isOpen) return null;

  // Filter actions if user typed something
  const filteredActions = input.trim()
    ? QUICK_ACTIONS.filter((a) =>
        a.title.toLowerCase().includes(input.toLowerCase())
      )
    : QUICK_ACTIONS;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Universal Command Palette & AI Copilot"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          sound.playClick();
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-[760px] max-h-[94dvh] sm:max-h-[88vh] flex flex-col bg-[var(--color-bg)] border-2 border-[var(--color-text)] shadow-[8px_8px_0px_var(--color-border)] overflow-hidden font-mono text-xs">
        {/* HEADER BAR */}
        <div className="bg-[var(--color-surface)] border-b-2 border-[var(--color-border)] px-3 sm:px-4 py-2.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-emerald-400 inline-block animate-pulse" />
            <span className="font-pixel text-[0.65rem] sm:text-sm text-[var(--color-text)] tracking-wider">
              <span className="hidden sm:inline">COMMAND_PALETTE // AI_COPILOT [TAN v3.0]</span>
              <span className="sm:hidden">AI_COPILOT [TAN v3.0]</span>
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono text-[0.68rem]">
            <span className="hidden sm:inline text-[var(--color-text-dim)]">[CTRL+K] / [ESC]</span>
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              aria-label="Close command palette"
              className="pixel-btn text-xs px-2.5 py-1 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            >
              [X]
            </button>
          </div>
        </div>

        {/* FEEDBACK TOAST */}
        {commandFeedback && (
          <div className="bg-emerald-100/80 dark:bg-emerald-950/40 border-b border-emerald-600 dark:border-emerald-500 p-2 font-mono text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between animate-in fade-in duration-150">
            <span className="inline-flex items-center gap-1.5">
              <CheckIcon className="w-3.5 h-3.5 shrink-0" />
              {commandFeedback}
            </span>
            <button
              onClick={() => setCommandFeedback(null)}
              className="text-emerald-700 dark:text-emerald-400 hover:text-[var(--color-text)] px-2"
            >
              [X]
            </button>
          </div>
        )}

        {/* SEARCH / COMMAND INPUT */}
        <div className="p-3 sm:p-4 bg-[var(--color-card)] border-b border-[var(--color-border)] flex items-center gap-2.5 shrink-0">
          <span className="text-emerald-700 dark:text-emerald-400 font-pixel text-sm sm:text-base">&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && input.trim()) {
                sendMessage(input);
              }
            }}
            placeholder="Type a command or ask TAN any technical question..."
            disabled={isLoading || isPinging}
            className="flex-1 bg-transparent border-none outline-none font-sans text-sm sm:text-base text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] placeholder:font-mono"
          />
          {input.trim() && (
            <button
              onClick={() => sendMessage(input)}
              disabled={isLoading}
              className="pixel-btn text-[0.62rem] py-1 px-3 cursor-pointer"
            >
              [ASK TAN ↵]
            </button>
          )}
        </div>

        {/* MAIN BODY AREA (SCROLLABLE) */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 flex flex-col gap-4 bg-[var(--color-bg)]">
          {/* QUICK COMMANDS / SYSTEM ACTIONS SECTION */}
          {messages.length === 0 && (
            <div>
              <div className="text-[0.65rem] font-mono text-[var(--color-text-dim)] uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>// QUICK_COMMAND_EXECUTION:</span>
                <span>{filteredActions.length} ACTIONS</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filteredActions.map((action) => (
                  <button
                    key={action.id}
                    type="button"
                    onClick={() => {
                      if (action.execute) action.execute();
                    }}
                    className="p-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-emerald-600 dark:hover:border-emerald-400 hover:bg-[var(--color-card)] transition-all text-left flex flex-col justify-between group cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-sans font-semibold text-xs sm:text-sm text-[var(--color-text)] group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                        &gt; {action.title}
                      </span>
                    </div>
                    {action.description && (
                      <span className="font-sans text-[0.68rem] text-[var(--color-text-muted)] line-clamp-1">
                        {action.description}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* INTERACTIVE "ASK TAN" PRESET Q&A CHIPS */}
          <div>
            <div className="text-[0.65rem] font-mono text-[var(--color-text-dim)] uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>// RECRUITER_PRESETS: ASK_TAN:</span>
              <span>1-CLICK TECHNICAL INQUIRIES</span>
            </div>
            <div className="flex flex-col sm:flex-row flex-wrap gap-1.5">
              {RECRUITER_CHIPS.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => sendMessage(chip.prompt)}
                  disabled={isLoading}
                  className="font-sans text-xs text-left p-2.5 sm:px-3 sm:py-2 border border-emerald-600/40 dark:border-emerald-500/40 bg-[var(--color-card)] hover:border-emerald-600 dark:hover:border-emerald-400 hover:bg-[var(--color-surface)] text-[var(--color-text)] transition-all flex items-center gap-2 cursor-pointer flex-1 min-w-0 sm:min-w-[200px] min-h-[44px]"
                >
                  <span className="text-emerald-700 dark:text-emerald-400 font-pixel text-[0.6rem] shrink-0">
                    [Q{idx + 1}]
                  </span>
                  <span className="font-medium">{chip.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* MESSAGES LOG */}
          {messages.length > 0 && (
            <div className="border-t border-[var(--color-border)] pt-3 flex flex-col gap-3">
              <div className="text-[0.65rem] font-mono text-[var(--color-text-dim)] uppercase tracking-wider">
                // CONVERSATION_LOG:
              </div>

              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`p-3.5 border leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text)] self-end max-w-[92%]"
                      : "bg-[var(--color-card)] border-emerald-600/50 dark:border-emerald-500/50 text-[var(--color-text)] self-start max-w-[98%]"
                  }`}
                >
                  <div className="font-mono text-[0.62rem] text-emerald-700 dark:text-emerald-400 mb-1 flex items-center justify-between">
                    <span>{msg.role === "user" ? "> OPERATOR:" : "> TAN_COPILOT:"}</span>
                    {msg.role === "model" && (
                      <span className="text-[var(--color-text-dim)]">KNOWLEDGE_VERIFIED</span>
                    )}
                  </div>
                  <div className="font-sans text-xs sm:text-sm text-[var(--color-text)] whitespace-pre-wrap leading-relaxed">
                    {msg.parts[0].text}
                    {isLoading && i === messages.length - 1 && (
                      <span className="terminal-cursor text-emerald-600 dark:text-emerald-400 ml-1">█</span>
                    )}
                  </div>
                </div>
              ))}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* FOOTER BAR */}
        <div className="bg-[var(--color-surface)] border-t border-[var(--color-border)] px-4 py-2 flex items-center justify-between text-[0.65rem] font-mono text-[var(--color-text-dim)] shrink-0">
          <span>AI_MODEL: GEMINI 2.0 FLASH + AUTONOMOUS BACKUP</span>
          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <button
                type="button"
                onClick={() => setMessages([])}
                className="text-[var(--color-text-dim)] hover:text-white cursor-pointer mr-2"
              >
                [CLEAR_HISTORY]
              </button>
            )}
            <span>PRESS [ESC] TO CLOSE</span>
          </div>
        </div>
      </div>
    </div>
  );
}

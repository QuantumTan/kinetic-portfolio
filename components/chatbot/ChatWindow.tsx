"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { getAutonomousResponse } from "@/data/knowledge-base";
import { sound } from "@/utils/sound";

interface Message {
  role: "user" | "model";
  parts: { text: string }[];
}

const QUICK_COMMANDS = [
  { cmd: "[⚡] RECRUITER_BRIEF_30s", prompt: "Generate a 30-second executive summary of Jonathan Peguit Jr. for tech recruiters and hiring managers." },
  { cmd: "[01] PROJECTS_OVERVIEW", prompt: "Summarize Jonathan's primary engineering projects." },
  { cmd: "[02] TECH_STACK_MATRIX", prompt: "What are Jonathan's core programming languages and frameworks?" },
  { cmd: "[03] GET_RESUME_URI", prompt: "Where can I view and download Jonathan's verified resume?" },
  { cmd: "[04] CONTACT_ENDPOINT", prompt: "How can I contact Jonathan directly for project inquiries?" },
];

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
  const [chipsHidden, setChipsHidden] = useState(false);
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
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;
      sound.playClick();
      setChipsHidden(true);
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

  return (
    <div
      id="chat-window"
      role="dialog"
      aria-label="TAN AI Copilot Interface"
      className="fixed bottom-16 left-2 right-2 sm:left-auto sm:right-6 sm:bottom-20 sm:w-[390px] h-[520px] max-h-[82dvh] bg-[var(--color-card)] border-2 border-[var(--color-border)] shadow-[6px_6px_0px_var(--color-border)] flex flex-col z-[9999] font-mono text-xs animate-in fade-in duration-200"
    >
      {/* TERMINAL HEADER */}
      <div className="flex items-center justify-between p-3 bg-[var(--color-surface)] border-b-2 border-[var(--color-border)] select-none shrink-0">
        <div className="flex items-center gap-2 font-pixel text-xs text-[var(--color-text)]">
          <span className="w-2 h-2 bg-[var(--color-text)] inline-block animate-pulse" />
          <span>TAN // COPILOT_AGENT_v2.7</span>
        </div>
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          aria-label="Close copilot"
          className="font-pixel text-xs text-[var(--color-text-dim)] hover:text-[var(--color-text)] px-2 py-1 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
        >
          [X]
        </button>
      </div>

      {/* MESSAGES LOG */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 flex flex-col gap-3 bg-[var(--color-bg)]">
        {/* WELCOME TERMINAL MESSAGE */}
        <div className="border border-[var(--color-border)] p-3 bg-[var(--color-surface)] text-[var(--color-text-muted)] leading-relaxed">
          <p className="font-pixel text-[0.65rem] text-[var(--color-text)] mb-1">
            &gt; SYSTEM_READY // TAN_COPILOT
          </p>
          <p className="text-[0.7rem] sm:text-xs">
            Autonomous portfolio knowledge dispatcher. Ask any query regarding Jonathan&apos;s systems development, technical stack, or background.
          </p>
        </div>

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-3 border leading-relaxed ${
              msg.role === "user"
                ? "bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text)] self-end max-w-[90%]"
                : "bg-[var(--color-card)] border-[var(--color-border)] text-[var(--color-text)] self-start max-w-[95%]"
            }`}
          >
            <div className="font-pixel text-[0.6rem] text-[var(--color-text-dim)] mb-1">
              {msg.role === "user" ? "> OPERATOR_PROMPT:" : "> TAN_RESPONSE:"}
            </div>
            <div className="text-[0.75rem] text-[var(--color-text)] whitespace-pre-wrap">
              {msg.parts[0].text}
              {isLoading && i === messages.length - 1 && (
                <span className="terminal-cursor text-[var(--color-text)] ml-1">█</span>
              )}
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* COMMAND QUICK CHIPS */}
      {!chipsHidden && (
        <div className="p-2 border-t border-[var(--color-border)] bg-[var(--color-surface)] flex flex-wrap gap-1.5 shrink-0 max-h-[110px] overflow-y-auto">
          {QUICK_COMMANDS.map(({ cmd, prompt }) => (
            <button
              key={cmd}
              onClick={() => {
                sound.playBlip();
                sendMessage(prompt);
              }}
              className="font-pixel text-[0.6rem] border border-[var(--color-border)] px-2.5 py-1.5 bg-[var(--color-bg)] text-[var(--color-text-muted)] hover:bg-[var(--color-invert-bg)] hover:text-[var(--color-invert-text)] hover:border-[var(--color-invert-bg)] transition-colors min-h-[36px] flex items-center cursor-pointer"
            >
              {cmd}
            </button>
          ))}
        </div>
      )}

      {/* INPUT COMMAND ROW */}
      <div className="p-2.5 sm:p-3 border-t-2 border-[var(--color-border)] bg-[var(--color-surface)] flex items-center gap-2 shrink-0">
        <span className="font-pixel text-xs text-[var(--color-text-dim)]">&gt;</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
          placeholder="Enter command or query..."
          disabled={isLoading}
          className="flex-1 bg-transparent border-none outline-none font-mono text-[16px] sm:text-xs text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] disabled:opacity-50 min-h-[44px]"
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={isLoading || !input.trim()}
          className="pixel-btn text-[0.65rem] py-1.5 px-3 disabled:opacity-30 min-h-[44px] flex items-center justify-center cursor-pointer"
        >
          [SEND]
        </button>
      </div>

      <div className="bg-[var(--color-bg)] py-1 text-center font-mono text-[0.6rem] text-[var(--color-text-dim)] border-t border-[var(--color-border)] shrink-0">
        TOGGLE: [CTRL+K] // ESC TO CLOSE
      </div>
    </div>
  );
}

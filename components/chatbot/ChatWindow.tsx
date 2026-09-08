"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface Message {
  role: "user" | "model";
  parts: { text: string }[];
}

const QUICK_COMMANDS = [
  { cmd: "[01] PROJECTS_OVERVIEW", prompt: "Summarize Jonathan's primary engineering projects." },
  { cmd: "[02] TECH_STACK_MATRIX", prompt: "What are Jonathan's core programming languages and frameworks?" },
  { cmd: "[03] GET_RESUME_URI", prompt: "Where can I view and download Jonathan's verified resume?" },
  { cmd: "[04] CONTACT_ENDPOINT", prompt: "How can I contact Jonathan directly for project inquiries?" },
];

export default function ChatWindow({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
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
      } catch {
        setMessages([
          ...newHistory,
          {
            role: "model",
            parts: [
              {
                text: "SYSTEM_ERR: Unable to dispatch query. Verify GEMINI_API_KEY in .env.local configuration.",
              },
            ],
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading]
  );

  if (!isOpen) return null;

  return (
    <div
      id="chat-window"
      role="dialog"
      aria-label="TAN AI Copilot Interface"
      className="fixed bottom-20 right-4 sm:right-6 w-[380px] max-w-[calc(100vw-32px)] h-[520px] max-h-[80vh] bg-[var(--color-card)] border-2 border-[var(--color-border)] shadow-[6px_6px_0px_var(--color-border)] flex flex-col z-[9999] font-mono text-xs"
    >
      {/* TERMINAL HEADER */}
      <div className="flex items-center justify-between p-3 bg-[var(--color-surface)] border-b-2 border-[var(--color-border)] select-none">
        <div className="flex items-center gap-2 font-pixel text-xs text-[var(--color-text)]">
          <span className="w-2 h-2 bg-[var(--color-text)] inline-block animate-pulse" />
          <span>TAN // COPILOT_AGENT_v2.4</span>
        </div>
        <button
          onClick={onClose}
          aria-label="Close copilot"
          className="font-pixel text-xs text-[var(--color-text-dim)] hover:text-[var(--color-text)] px-1 cursor-none"
        >
          [X]
        </button>
      </div>

      {/* MESSAGES LOG */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-[var(--color-bg)]">
        {/* WELCOME TERMINAL MESSAGE */}
        <div className="border border-[var(--color-border)] p-3 bg-[var(--color-surface)] text-[var(--color-text-muted)] leading-relaxed">
          <p className="font-pixel text-[0.65rem] text-[var(--color-text)] mb-1">
            &gt; SYSTEM_READY // TAN_COPILOT
          </p>
          <p>
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
        <div className="p-2 border-t border-[var(--color-border)] bg-[var(--color-surface)] flex flex-wrap gap-1.5">
          {QUICK_COMMANDS.map(({ cmd, prompt }) => (
            <button
              key={cmd}
              onClick={() => sendMessage(prompt)}
              className="font-pixel text-[0.6rem] border border-[var(--color-border)] px-2 py-1 bg-[var(--color-bg)] text-[var(--color-text-muted)] hover:bg-[var(--color-invert-bg)] hover:text-[var(--color-invert-text)] hover:border-[var(--color-invert-bg)] transition-colors cursor-none"
            >
              {cmd}
            </button>
          ))}
        </div>
      )}

      {/* INPUT COMMAND ROW */}
      <div className="p-3 border-t-2 border-[var(--color-border)] bg-[var(--color-surface)] flex items-center gap-2">
        <span className="font-pixel text-xs text-[var(--color-text-dim)]">&gt;</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
          placeholder="Enter command or query..."
          disabled={isLoading}
          className="flex-1 bg-transparent border-none outline-none font-mono text-xs text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] disabled:opacity-50"
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={isLoading || !input.trim()}
          className="pixel-btn text-[0.65rem] py-1 px-3 disabled:opacity-30 cursor-none"
        >
          [SEND]
        </button>
      </div>

      <div className="bg-[var(--color-bg)] py-1 text-center font-mono text-[0.6rem] text-[var(--color-text-dim)] border-t border-[var(--color-border)]">
        TOGGLE: [CTRL+K] // ESC TO CLOSE
      </div>
    </div>
  );
}

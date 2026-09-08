"use client";

import { useEffect, useState } from "react";
import ChatWindow from "./ChatWindow";

export default function ChatTrigger() {
  const [isOpen, setIsOpen] = useState(false);

  // Ctrl+K keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen]);

  return (
    <>
      {/* FLOATING TERMINAL COPILOT TRIGGER BUTTON */}
      <button
        id="chat-trigger"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Open TAN AI Copilot"
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9995] pixel-btn bg-[var(--color-surface)] text-[var(--color-text)] border-2 border-[var(--color-text)] shadow-[4px_4px_0px_var(--color-border)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 font-pixel text-[0.65rem] sm:text-xs py-1.5 sm:py-2 px-3 sm:px-4 flex items-center gap-2 cursor-none"
      >
        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[var(--color-text)] inline-block animate-ping" />
        <span>[AI_COPILOT // TAN]</span>
      </button>

      {/* CHAT WINDOW */}
      <ChatWindow isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

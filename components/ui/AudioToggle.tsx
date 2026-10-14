"use client";

import { useEffect, useState } from "react";
import { sound } from "@/utils/sound";

export default function AudioToggle() {
  const [enabled, setEnabled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setEnabled(sound.isEnabled());

    const onToggle = (e: Event) => {
      const customEvt = e as CustomEvent<{ enabled: boolean }>;
      setEnabled(customEvt.detail.enabled);
    };

    window.addEventListener("kinetic:sound-toggle", onToggle);
    return () => window.removeEventListener("kinetic:sound-toggle", onToggle);
  }, []);

  if (!mounted) {
    return (
      <div className="w-[84px] h-[30px] border border-[var(--color-border)] opacity-0" />
    );
  }

  const handleToggle = () => {
    const next = sound.toggle();
    setEnabled(next);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={enabled ? "Mute interactive audio feedback" : "Enable interactive audio feedback"}
      title={enabled ? "Audio: Active (Click to Mute)" : "Audio: Muted (Click to Enable 8-bit SFX)"}
      className={`font-pixel text-[0.6rem] sm:text-[0.65rem] px-2.5 py-1 sm:py-1.5 border transition-all inline-flex items-center gap-1.5 min-h-[36px] sm:min-h-[32px] select-none ${
        enabled
          ? "border-[var(--color-text)] bg-[var(--color-surface)] text-[var(--color-text)] shadow-[2px_2px_0px_var(--color-text)] font-bold"
          : "border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-text-dim)] hover:text-[var(--color-text)] hover:border-[var(--color-text-dim)]"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 inline-block ${
          enabled ? "bg-[var(--color-text)] animate-pulse" : "bg-[var(--color-text-dim)]"
        }`}
      />
      <span>{enabled ? "[SFX: ON]" : "[SFX: OFF]"}</span>
    </button>
  );
}

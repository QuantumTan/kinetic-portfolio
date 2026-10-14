"use client";

import { useEffect, useState } from "react";
import { sound } from "@/utils/sound";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const dark = stored !== "light";
    setIsDark(dark);
    document.documentElement.classList.toggle("light", !dark);
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  const toggle = () => {
    sound.playClick();
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("light", !next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle monochrome palette"
      className="pixel-btn font-pixel text-[0.65rem] px-2.5 sm:px-3 py-1 tracking-wider whitespace-nowrap shrink-0 min-h-[44px] flex items-center justify-center cursor-pointer"
    >
      [ {isDark ? "THEME: DARK" : "THEME: LIGHT"} ]
    </button>
  );
}

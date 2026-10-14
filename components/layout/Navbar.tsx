"use client";

import { useEffect, useState, useCallback } from "react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import AudioToggle from "@/components/ui/AudioToggle";
import { sound } from "@/utils/sound";

const NAV_ITEMS = [
  { id: "home", label: "HOME" },
  { id: "skills", label: "SKILLS" },
  { id: "projects", label: "PROJECTS" },
  { id: "certifications", label: "CERTS" },
  { id: "education", label: "EDU" },
  { id: "contact", label: "CONTACT" },
];

export default function Navbar() {
  const [active, setActive] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { threshold: 0.25 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const closeMenu = useCallback(() => {
    sound.playClick();
    setMobileMenuOpen(false);
  }, []);

  const toggleMenu = useCallback(() => {
    sound.playClick();
    setMobileMenuOpen((prev) => !prev);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-[9990] bg-[var(--color-bg)]/95 backdrop-blur-md border-b-2 border-[var(--color-border)] h-[64px] flex items-center">
      <div className="w-full max-w-[1200px] mx-auto flex items-center justify-between px-3 sm:px-6">
        {/* LOGO */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <span className="w-2 h-2 bg-[var(--color-text)] inline-block animate-pulse" />
          <a
            href="#home"
            onClick={closeMenu}
            className="font-pixel text-[0.65rem] sm:text-xs text-[var(--color-text)] tracking-wider hover:bg-[var(--color-invert-bg)] hover:text-[var(--color-invert-text)] px-1.5 py-1 transition-colors border border-transparent hover:border-[var(--color-border)] whitespace-nowrap min-h-[36px] inline-flex items-center"
          >
            JONATHAN_PEGUIT [DEV]
          </a>
        </div>

        {/* DESKTOP NAVIGATION LINKS */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2" aria-label="Main Navigation">
          {NAV_ITEMS.map(({ id, label }) => {
            const isActive = active === id;
            return (
              <a
                key={id}
                href={`#${id}`}
                onClick={() => sound.playClick()}
                className={`font-pixel text-[0.65rem] tracking-wider px-2 py-1.5 transition-all duration-100 whitespace-nowrap min-h-[36px] inline-flex items-center ${
                  isActive
                    ? "bg-[var(--color-text)] text-[var(--color-bg)] font-bold shadow-[2px_2px_0px_var(--color-border)]"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:underline"
                }`}
              >
                [{label}]
              </a>
            );
          })}
        </nav>

        {/* CONTROLS (THEME + AUDIO + MOBILE MENU) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <div className="hidden sm:block">
            <AudioToggle />
          </div>
          <ThemeToggle />

          {/* MOBILE HAMBURGER TOGGLE */}
          <button
            type="button"
            onClick={toggleMenu}
            aria-label="Toggle Navigation Menu"
            className="lg:hidden pixel-btn font-pixel text-[0.6rem] sm:text-[0.65rem] px-2.5 py-1.5 whitespace-nowrap min-h-[40px] flex items-center justify-center"
          >
            {mobileMenuOpen ? "[X_CLOSE]" : "[NAV_MENU]"}
          </button>
        </div>
      </div>

      {/* RESPONSIVE MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed top-[64px] left-0 right-0 bg-[var(--color-card)] border-b-2 border-[var(--color-border)] p-4 shadow-[0_8px_0px_var(--color-border)] z-[9995] max-h-[calc(100dvh-64px)] overflow-y-auto">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--color-border)]">
            <span className="font-pixel text-[0.65rem] text-[var(--color-text)]">
              NAVIGATION_MENU
            </span>
            <div className="flex items-center gap-2">
              <AudioToggle />
              <button
                type="button"
                onClick={closeMenu}
                className="font-pixel text-xs text-[var(--color-text-dim)] hover:text-[var(--color-text)] px-2 py-1 min-h-[36px] flex items-center"
              >
                [X]
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 font-pixel text-xs">
            {NAV_ITEMS.map(({ id, label }) => {
              const isActive = active === id;
              return (
                <a
                  key={id}
                  href={`#${id}`}
                  onClick={closeMenu}
                  className={`p-3 border min-h-[44px] flex items-center transition-colors ${
                    isActive
                      ? "bg-[var(--color-text)] text-[var(--color-bg)] font-bold border-[var(--color-text)]"
                      : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)]"
                  }`}
                >
                  &gt; [{label}]
                </a>
              );
            })}
            <a
              href="/assets/Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
              className="p-3 border-2 border-dashed border-[var(--color-text)] text-[var(--color-text)] text-center mt-1 min-h-[44px] flex items-center justify-center font-bold hover:bg-[var(--color-surface)]"
            >
              [+] DOWNLOAD_RESUME_PDF
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

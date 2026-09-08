"use client";

import { useEffect, useState, useCallback } from "react";
import ThemeToggle from "@/components/ui/ThemeToggle";

const NAV_ITEMS = [
  { id: "home", label: "00_HOME" },
  { id: "skills", label: "01_SKILLS" },
  { id: "projects", label: "02_PROJECTS" },
  { id: "certifications", label: "03_CERTS" },
  { id: "education", label: "04_EDU" },
  { id: "contact", label: "05_CONTACT" },
];

export default function Navbar() {
  const [active, setActive] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [timeStr, setTimeStr] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          timeZone: "Asia/Manila",
        }) + " UTC+8"
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

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
    setMobileMenuOpen(false);
  }, []);

  const toggleMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-[9990] bg-[var(--color-bg)]/95 backdrop-blur-sm border-b-2 border-[var(--color-border)]">
      <div className="w-full max-w-[1200px] mx-auto flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3">
        {/* LOGO */}
        <div className="flex items-center gap-3">
          <a
            href="#home"
            onClick={closeMenu}
            className="font-pixel text-[0.7rem] sm:text-xs text-[var(--color-text)] tracking-wider hover:bg-white hover:text-black px-1.5 py-0.5 transition-colors border border-transparent hover:border-black"
          >
            JONATHAN_PEGUIT [DEV_CORE]
          </a>
          {timeStr && (
            <span className="hidden xl:inline-block font-mono text-[0.65rem] text-[var(--color-text-dim)] border-l border-[var(--color-border)] pl-3">
              SYS_TIME: {timeStr}
            </span>
          )}
        </div>

        {/* DESKTOP NAVIGATION LINKS */}
        <nav className="hidden lg:flex items-center gap-3" aria-label="Main Navigation">
          {NAV_ITEMS.map(({ id, label }) => {
            const isActive = active === id;
            return (
              <a
                key={id}
                href={`#${id}`}
                className={`font-pixel text-[0.65rem] tracking-wider px-2 py-1 transition-all duration-100 ${
                  isActive
                    ? "bg-[var(--color-text)] text-[var(--color-bg)] font-bold shadow-[2px_2px_0px_#888]"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:underline"
                }`}
              >
                [{label}]
              </a>
            );
          })}
        </nav>

        {/* CONTROLS */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          {/* MOBILE HAMBURGER TOGGLE */}
          <button
            type="button"
            onClick={toggleMenu}
            aria-label="Toggle Navigation Menu"
            className="lg:hidden pixel-btn font-pixel text-[0.65rem] px-2.5 py-1"
          >
            {mobileMenuOpen ? "[X_CLOSE]" : "[NAV_MENU]"}
          </button>
        </div>
      </div>

      {/* RESPONSIVE MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[var(--color-card)] border-b-2 border-[var(--color-border)] p-4 shadow-[0_8px_0px_#000] relative z-[9995]">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-[var(--color-border)]">
            <span className="font-pixel text-[0.65rem] text-[var(--color-text)]">
              NAVIGATION_MENU
            </span>
            <button
              type="button"
              onClick={closeMenu}
              className="font-pixel text-xs text-[var(--color-text-dim)] hover:text-[var(--color-text)] px-1"
            >
              [X_CLOSE]
            </button>
          </div>

          <div className="flex flex-col gap-2 font-pixel text-xs">
            {NAV_ITEMS.map(({ id, label }) => {
              const isActive = active === id;
              return (
                <a
                  key={id}
                  href={`#${id}`}
                  onClick={closeMenu}
                  className={`p-2.5 border border-[var(--color-border)] ${
                    isActive
                      ? "bg-[var(--color-text)] text-[var(--color-bg)] font-bold"
                      : "text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)]"
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
              className="p-2.5 border border-dashed border-[var(--color-text)] text-[var(--color-text)] text-center mt-1"
            >
              [+] DOWNLOAD_RESUME_PDF
            </a>
          </div>
          {timeStr && (
            <div className="mt-3 pt-2 border-t border-[var(--color-border)] text-center font-mono text-[0.65rem] text-[var(--color-text-dim)]">
              MANILA_TIME: {timeStr}
            </div>
          )}
        </div>
      )}
    </header>
  );
}

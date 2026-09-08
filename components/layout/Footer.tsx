export default function Footer() {
  return (
    <footer className="border-t-2 border-[var(--color-border)] bg-[var(--color-bg)] py-8 px-6 mt-16 font-mono text-xs text-[var(--color-text-dim)]">
      <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="font-pixel text-[0.7rem] text-[var(--color-text)]">
            JONATHAN_PEGUIT_JR
          </span>{" "}
          // SYSTEMS_BUILD [2026]
        </div>

        <div className="flex items-center gap-6 font-mono text-[0.75rem]">
          <span className="text-[var(--color-text-muted)]">STATUS: ONLINE</span>
          <span className="text-[var(--color-text-muted)]">LOC: DAVAO_PH</span>
          <a
            href="https://github.com/QuantumTan"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--color-text)] underline cursor-none"
          >
            GITHUB // QUANTUMTAN
          </a>
        </div>
      </div>
    </footer>
  );
}

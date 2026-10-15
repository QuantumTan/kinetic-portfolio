"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { sound } from "@/utils/sound";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

const CERTS = [
  {
    title: "Information Technology Specialist: Java",
    issuer: "Certiport // Pearson VUE",
    code: "CERT-01",
    badgeLabel: "PEARSON_VUE_EXAM",
    description:
      "Official validation of Java core architecture, object-oriented design, control structures, data structures, and exception diagnostics.",
    link: "https://www.credly.com/badges/10b5deeb-b2e7-49e3-9604-f0bc0e1d22b7",
    verifiedVia: "CREDLY_REGISTRY",
  },
  {
    title: "Java (Basic) Assessment Certification",
    issuer: "HackerRank",
    code: "CERT-02",
    badgeLabel: "ALGORITHM_ASSESSMENT",
    description:
      "Timed algorithm execution, data structures, inheritance, interface implementation, and memory efficiency under strict testing conditions.",
    link: "https://www.hackerrank.com/certificates/170ede890f2c",
    verifiedVia: "HACKERRANK_ID",
  },
  {
    title: "CSS (Basic) Layout & Engine Certification",
    issuer: "HackerRank",
    code: "CERT-03",
    badgeLabel: "LAYOUT_ENGINE_ASSESSMENT",
    description:
      "CSS box modeling, cascading specificity rules, flexbox/grid layout systems, and responsive viewport formatting.",
    link: "https://www.hackerrank.com/certificates/a247020ee377",
    verifiedVia: "HACKERRANK_ID",
  },
  {
    title: "Java Masterclass Professional Certification",
    issuer: "Udemy",
    code: "CERT-04",
    badgeLabel: "CONCURRENCY_&_OOP",
    description:
      "Advanced Java engineering, thread concurrency mechanisms, collections framework, and clean object-oriented architecture patterns.",
    link: "https://www.udemy.com/",
    verifiedVia: "COURSE_PORTAL",
  },
];

export default function Certifications() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!container.current) return;
      gsap.fromTo(
        ".cert-ledger-item",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.35, stagger: 0.05, ease: "power2.out" }
      );
    },
    { scope: container }
  );

  return (
    <section id="certifications" ref={container} className="section-card scroll-mt-[100px] w-full h-full flex flex-col">
      {/* SECTION HEADER */}
      <div className="flex flex-wrap items-center justify-between border-b-2 border-[var(--color-border)] pb-3 mb-5 gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-emerald-600 dark:bg-emerald-400 inline-block animate-pulse" />
          <h2 className="font-pixel text-xs sm:text-base text-[var(--color-text)] tracking-wider uppercase">
            03 // VERIFIED_CREDENTIALS
          </h2>
        </div>
        <span className="font-mono text-xs text-[var(--color-text-dim)]">
          [TOTAL: {CERTS.length} // ALL VISIBLE]
        </span>
      </div>

      {/* CREDENTIALS LEDGER (100% VISIBLE, NO TRUNCATION) */}
      <div className="space-y-3.5 flex-1 flex flex-col justify-between">
        {CERTS.map((cert) => (
          <article
            key={cert.code}
            className="cert-ledger-item pixel-box p-3.5 sm:p-4 bg-[var(--color-card)] border border-[var(--color-border)] hover:border-emerald-600 dark:hover:border-emerald-400 transition-all flex flex-col justify-between group"
          >
            <div>
              {/* TOP STRIP */}
              <div className="flex items-center justify-between font-mono text-[0.65rem] text-[var(--color-text-dim)] mb-1.5 pb-1 border-b border-[var(--color-border)]">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">[{cert.code}]</span>
                  <span className="font-mono text-[0.62rem] text-[var(--color-text-dim)]">
                    // {cert.issuer}
                  </span>
                </div>
                <span className="font-mono text-[0.55rem] bg-[var(--color-surface)] border border-emerald-600/40 dark:border-[var(--color-border)] px-1.5 py-0.5 text-emerald-700 dark:text-emerald-400 font-bold">
                  [{cert.verifiedVia}]
                </span>
              </div>

              {/* CLEAN SANS TITLE */}
              <h3 className="font-sans font-bold text-sm sm:text-[0.95rem] text-[var(--color-text)] mb-1 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors leading-snug">
                {cert.title}
              </h3>

              {/* DESCRIPTION */}
              <p className="font-sans text-xs text-[var(--color-text-muted)] leading-relaxed mb-3">
                {cert.description}
              </p>
            </div>

            {/* ACTION */}
            <div className="pt-2 border-t border-[var(--color-border)] flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-[0.62rem] text-[var(--color-text-dim)]">
                REGISTRY: OFFICIAL_VERIFICATION
              </span>
              <a
                href={cert.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sound.playClick()}
                className="pixel-btn text-[0.62rem] py-1 px-3 min-h-[38px] flex items-center gap-1.5 cursor-pointer"
              >
                <span>[VERIFY_CREDENTIAL]</span>
                <ArrowTopRightOnSquareIcon className="w-3 h-3 text-[var(--color-primary)]" />
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

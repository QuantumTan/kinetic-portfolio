"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const CERTS = [
  {
    title: "Information Technology Specialist: Java",
    issuer: "CERTIPORT // PEARSON VUE",
    code: "CERT-01",
    description:
      "Validation of Java core architecture, object-oriented design, control structures, data structures, compilation, and exception diagnostics.",
    image: "/assets/certificates/certiport.jpg",
    link: "https://www.credly.com/badges/10b5deeb-b2e7-49e3-9604-f0bc0e1d22b7",
  },
  {
    title: "Java (Basic) Assessment Certification",
    issuer: "HACKERRANK",
    code: "CERT-02",
    description:
      "Algorithm execution, data structures, inheritance, interface implementation, and memory efficiency under timed constraints.",
    image: "/assets/certificates/hackerrank.jpg",
    link: "https://www.hackerrank.com/certificates/170ede890f2c",
  },
  {
    title: "CSS (Basic) Layout & Engine Certification",
    issuer: "HACKERRANK",
    code: "CERT-03",
    description:
      "CSS box modeling, cascading specificity, flexbox/grid layout systems, and responsive viewport formatting.",
    image: "/assets/certificates/css-hackerrank.png",
    link: "https://www.hackerrank.com/certificates/a247020ee377",
  },
  {
    title: "Java Masterclass Professional Certification",
    issuer: "UDEMY",
    code: "CERT-04",
    description:
      "Advanced Java engineering, concurrency mechanisms, collections framework, and clean object-oriented architecture patterns.",
    image: "/assets/certificates/certiport.jpg",
    link: "https://www.udemy.com/",
  },
];

const INITIAL_VISIBLE_COUNT = 2;

export default function Certifications() {
  const container = useRef<HTMLDivElement>(null);
  const [showAll, setShowAll] = useState(false);

  const visibleCerts = showAll ? CERTS : CERTS.slice(0, INITIAL_VISIBLE_COUNT);

  useGSAP(
    () => {
      if (!container.current) return;
      gsap.fromTo(
        ".cert-card-item",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.35, stagger: 0.06, ease: "power2.out" }
      );
    },
    { scope: container, dependencies: [showAll] }
  );

  return (
    <section id="certifications" ref={container} className="section-card">
      <div className="flex flex-wrap items-center justify-between border-b-2 border-[var(--color-border)] pb-3 mb-6 gap-2">
        <h2 className="font-pixel text-xs sm:text-base text-[var(--color-text)] tracking-wider uppercase">
          03 // VERIFIED_CREDENTIALS
        </h2>
        <span className="font-mono text-xs text-[var(--color-text-dim)]">
          [SHOWING: {visibleCerts.length}/{CERTS.length}]
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-4 sm:gap-6 items-stretch">
        {visibleCerts.map((cert) => (
          <article
            key={cert.code}
            className="cert-card-item pixel-box p-4 sm:p-5 flex flex-col justify-between group hover:border-[var(--color-text)] transition-all h-full"
          >
            <div>
              {/* IMAGE THUMBNAIL */}
              <div className="relative aspect-[16/10] w-full border-2 border-[var(--color-border)] mb-3 overflow-hidden bg-[var(--color-surface)] group-hover:border-[var(--color-text)] transition-colors">
                <Image
                  src={cert.image}
                  alt={cert.title}
                  fill
                  className="object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-300"
                />
              </div>

              {/* DETAILS */}
              <div className="flex items-center justify-between font-mono text-[0.65rem] sm:text-xs text-[var(--color-text-dim)] mb-1 pb-1 border-b border-[var(--color-border)]">
                <span className="font-bold">{cert.code}</span>
                <span className="font-pixel text-[0.55rem] sm:text-[0.6rem] text-[var(--color-text)]">
                  [{cert.issuer}]
                </span>
              </div>
              <h3 className="font-pixel text-[0.7rem] sm:text-xs text-[var(--color-text)] mt-2 mb-1.5">
                {cert.title}
              </h3>
              <p className="font-mono text-[0.65rem] sm:text-xs text-[var(--color-text-muted)] leading-relaxed">
                {cert.description}
              </p>
            </div>

            <div className="pt-3 mt-4 border-t border-[var(--color-border)]">
              <a
                href={cert.link}
                target="_blank"
                rel="noopener noreferrer"
                className="pixel-btn w-full text-center text-[0.6rem] sm:text-[0.65rem] py-2 block"
              >
                [&gt;] VERIFY_CREDENTIAL
              </a>
            </div>
          </article>
        ))}
      </div>

      {/* SEE MORE TOGGLE */}
      {CERTS.length > INITIAL_VISIBLE_COUNT && (
        <div className="mt-8 pt-4 border-t border-dashed border-[var(--color-border)] flex justify-center">
          <button
            onClick={() => setShowAll((prev) => !prev)}
            className="pixel-btn text-xs px-6 py-2.5 transition-all"
          >
            {showAll
              ? "[-] COLLAPSE_CREDENTIALS"
              : `[+] VIEW_ALL_CREDENTIALS (+${CERTS.length - INITIAL_VISIBLE_COUNT}_MORE)`}
          </button>
        </div>
      )}
    </section>
  );
}

"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const ENDPOINTS = [
  {
    type: "EMAIL",
    value: "jonathanjrhayo@gmail.com",
    href: "mailto:jonathanjrhayo@gmail.com",
    label: "[SEND_TRANSMISSION]",
  },
  {
    type: "PHONE",
    value: "+63 951 994 1785",
    href: "tel:+639519941785",
    label: "[CALL_DIRECT]",
  },
  {
    type: "GITHUB",
    value: "github.com/QuantumTan",
    href: "https://github.com/QuantumTan",
    label: "[VISIT_PROFILE]",
  },
  {
    type: "LINKEDIN",
    value: "linkedin.com/in/jonathan-jr-peguit-a446ba1b8",
    href: "https://www.linkedin.com/in/jonathan-jr-peguit-a446ba1b8/",
    label: "[CONNECT_NETWORK]",
  },
];

export default function Contact() {
  const container = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText("jonathanjrhayo@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useGSAP(
    () => {
      if (!container.current) return;
      gsap.fromTo(
        ".contact-entry-box",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.35, stagger: 0.06, ease: "power2.out" }
      );
    },
    { scope: container }
  );

  return (
    <section id="contact" ref={container} className="section-card">
      <div className="flex flex-wrap items-center justify-between border-b-2 border-[var(--color-border)] pb-3 mb-6 gap-2">
        <h2 className="font-pixel text-xs sm:text-base text-[var(--color-text)] tracking-wider uppercase">
          05 // COMMUNICATIONS_DISPATCH
        </h2>
        <span className="font-mono text-xs text-[var(--color-text-dim)]">
          [PORT_25: OPEN]
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-5 sm:gap-6">
        {/* TRANSMISSION DESK */}
        <div className="pixel-box p-4 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="font-pixel text-xs text-[var(--color-text)] mb-2 sm:mb-3">
              // DIRECT_CONTACT_INTERFACE
            </div>
            <p className="font-mono text-xs text-[var(--color-text-muted)] leading-relaxed mb-4 sm:mb-6">
              Available for enterprise backend roles (.NET / Laravel), full-stack development, and software engineering internships. Inquiries receive prompt response.
            </p>
          </div>

          <div className="space-y-2.5 sm:space-y-3 pt-3 sm:pt-4 border-t border-[var(--color-border)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[var(--color-surface)] p-2.5 sm:p-3 border border-[var(--color-border)] text-xs font-mono">
              <span className="text-[var(--color-text)] break-all">jonathanjrhayo@gmail.com</span>
              <button
                type="button"
                onClick={copyEmail}
                className="pixel-btn text-[0.6rem] py-1 px-2 shrink-0"
              >
                {copied ? "[COPIED!]" : "[COPY_EMAIL]"}
              </button>
            </div>
            <a
              href="mailto:jonathanjrhayo@gmail.com"
              className="pixel-btn w-full text-center text-[0.65rem] sm:text-xs block"
            >
              [&gt;] INITIATE_EMAIL_CLIENT
            </a>
          </div>
        </div>

        {/* NETWORK NODES */}
        <div className="grid gap-2.5 sm:gap-3">
          {ENDPOINTS.map((ep) => (
            <div
              key={ep.type}
              className="contact-entry-box pixel-box p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 group hover:border-[var(--color-text)] transition-all"
            >
              <div>
                <span className="font-pixel text-[0.6rem] text-[var(--color-text-dim)] block">
                  [{ep.type}]
                </span>
                <span className="font-mono text-xs text-[var(--color-text)] break-all">
                  {ep.value}
                </span>
              </div>
              <a
                href={ep.href}
                target={ep.href.startsWith("mailto") || ep.href.startsWith("tel") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="pixel-btn text-[0.6rem] py-1.5 px-3 self-start sm:self-center"
              >
                {ep.label}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

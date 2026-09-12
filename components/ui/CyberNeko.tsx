"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";

type NekoState = "WALK" | "SIT" | "SLEEP" | "ALERT" | "PURR";
type Edge = "TOP" | "RIGHT" | "BOTTOM" | "LEFT";

const SPEECH_QUOTES = [
  "[^._.^] *PURR* DAEMON ONLINE",
  "[SYS] REPO_WATCHDOG PATROLLING",
  "[=^o.o^=] MEOW // ZERO ERRORS",
  "[NEKO] CLEAN_ARCH IS PURRFECT",
  "[ᓚᘏᗢ] 9 LIVES // 100% UPTIME",
  "[SYS] PETTING DETECTED: +10 HP",
  "[TIP] PRESS [CTRL+K] FOR TAN",
  "[^._.^] NO FLUFF, JUST PIXELS",
];

const CAT_OFFSET = 24; // Pixel cat size allowance

export default function CyberNeko() {
  const [mounted, setMounted] = useState(false);
  const [nekoMode, setNekoMode] = useState<"ACTIVE" | "SLEEP" | "HIDDEN">("ACTIVE");
  const [state, setState] = useState<NekoState>("WALK");
  const [edge, setEdge] = useState<Edge>("TOP");
  const [pos, setPos] = useState({ x: 40, y: -24 });
  const [walkFrame, setWalkFrame] = useState(0);
  const [speech, setSpeech] = useState<string | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [speechPos, setSpeechPos] = useState({ top: -38, left: -40 });
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);

  const activeTargetRef = useRef<HTMLElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const progressRef = useRef<number>(40); // distance in px along perimeter
  const edgeRef = useRef<Edge>("TOP");
  const stateRef = useRef<NekoState>("WALK");
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const speechTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mousePosRef = useRef({ x: -1000, y: -1000 });

  // Sync state ref
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    edgeRef.current = edge;
  }, [edge]);

  // Load saved preference from localStorage
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("cyber-neko-mode");
    if (saved === "ACTIVE" || saved === "SLEEP" || saved === "HIDDEN") {
      setNekoMode(saved);
      if (saved === "SLEEP") setState("SLEEP");
    }
  }, []);

  const changeMode = (newMode: "ACTIVE" | "SLEEP" | "HIDDEN") => {
    setNekoMode(newMode);
    localStorage.setItem("cyber-neko-mode", newMode);
    if (newMode === "SLEEP") {
      setState("SLEEP");
    } else if (newMode === "ACTIVE") {
      setState("WALK");
      resetIdleTimer();
    }
  };

  // Find active visible section-card
  const updateTargetCard = useCallback(() => {
    const cards = Array.from(
      document.querySelectorAll<HTMLElement>(".section-card, #home")
    );
    if (cards.length === 0) return;

    // Pick card closest to viewport center or top
    let bestCard: HTMLElement = cards[0];
    let minDistance = Infinity;
    const viewportCenter = window.innerHeight / 2;

    for (const card of cards) {
      const rect = card.getBoundingClientRect();
      // Check if card is on screen
      if (rect.bottom > 80 && rect.top < window.innerHeight - 80) {
        const cardCenter = rect.top + rect.height / 2;
        const dist = Math.abs(cardCenter - viewportCenter);
        if (dist < minDistance) {
          minDistance = dist;
          bestCard = card;
        }
      }
    }

    if (bestCard && activeTargetRef.current !== bestCard) {
      activeTargetRef.current = bestCard;
      setTargetElement(bestCard);
      // When changing cards, place Neko at top border
      edgeRef.current = "TOP";
      setEdge("TOP");
      progressRef.current = Math.min(60, bestCard.offsetWidth - 50);
    } else if (bestCard && !targetElement) {
      setTargetElement(bestCard);
    }
  }, [targetElement]);

  // Idle and Wakeup Handlers
  const resetIdleTimer = useCallback(() => {
    if (nekoMode !== "ACTIVE") return;

    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);

    if (stateRef.current === "SLEEP") {
      setState("ALERT");
      setTimeout(() => {
        if (stateRef.current === "ALERT") setState("WALK");
      }, 900);
    }

    idleTimerRef.current = setTimeout(() => {
      if (nekoMode === "ACTIVE") {
        setState("SLEEP");
      }
    }, 11000);
  }, [nekoMode]);

  // Mouse Move listener for proximity & idle detection
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
      resetIdleTimer();
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", updateTargetCard, { passive: true });
    window.addEventListener("resize", updateTargetCard, { passive: true });
    updateTargetCard();
    const retryTimer = setTimeout(updateTargetCard, 400);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", updateTargetCard);
      window.removeEventListener("resize", updateTargetCard);
      clearTimeout(retryTimer);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [updateTargetCard, resetIdleTimer]);

  // Click interaction (Pet / Purr)
  const handlePet = (e: React.MouseEvent) => {
    e.stopPropagation();
    setState("PURR");

    // Random quote
    const randomQuote = SPEECH_QUOTES[Math.floor(Math.random() * SPEECH_QUOTES.length)];
    setSpeech(randomQuote);

    if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
    speechTimeoutRef.current = setTimeout(() => {
      setSpeech(null);
      if (nekoMode === "ACTIVE") setState("WALK");
    }, 2800);
  };

  // Main Border Crawling Animation Loop
  useEffect(() => {
    if (!mounted || nekoMode === "HIDDEN") return;

    let lastTime = performance.now();
    let frameStepTimer = 0;

    const loop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      const target = activeTargetRef.current;
      if (target && nekoMode === "ACTIVE" && (stateRef.current === "WALK" || stateRef.current === "ALERT")) {
        const width = target.offsetWidth;
        const height = target.offsetHeight;

        // Calculate Cat Screen Position for Cursor Proximity Check
        const targetRect = target.getBoundingClientRect();
        const currentEdge = edgeRef.current;
        let catScreenX = targetRect.left;
        let catScreenY = targetRect.top;

        if (currentEdge === "TOP") {
          catScreenX += progressRef.current;
          catScreenY += -12;
        } else if (currentEdge === "RIGHT") {
          catScreenX += width + 12;
          catScreenY += progressRef.current;
        } else if (currentEdge === "BOTTOM") {
          catScreenX += width - progressRef.current;
          catScreenY += height + 12;
        } else if (currentEdge === "LEFT") {
          catScreenX += -12;
          catScreenY += height - progressRef.current;
        }

        const distToMouse = Math.hypot(
          catScreenX - mousePosRef.current.x,
          catScreenY - mousePosRef.current.y
        );

        // Proximity behavior: alert/peer when cursor approaches
        if (distToMouse < 65) {
          if (stateRef.current !== "ALERT") setState("ALERT");
        } else if (distToMouse >= 65 && stateRef.current === "ALERT") {
          setState("WALK");
        }

        // Crawling speed (pixels per second)
        const speed = stateRef.current === "ALERT" ? 18 : 38;

        if (stateRef.current === "WALK") {
          progressRef.current += speed * dt;

          // Leg stride animation timing
          frameStepTimer += dt;
          if (frameStepTimer > 0.14) {
            setWalkFrame((prev) => (prev === 0 ? 1 : 0));
            frameStepTimer = 0;
          }

          // Edge Transitions
          if (currentEdge === "TOP") {
            if (progressRef.current >= width - CAT_OFFSET) {
              edgeRef.current = "RIGHT";
              setEdge("RIGHT");
              progressRef.current = 0;
            }
          } else if (currentEdge === "RIGHT") {
            if (progressRef.current >= height - CAT_OFFSET) {
              edgeRef.current = "BOTTOM";
              setEdge("BOTTOM");
              progressRef.current = 0;
            }
          } else if (currentEdge === "BOTTOM") {
            if (progressRef.current >= width - CAT_OFFSET) {
              edgeRef.current = "LEFT";
              setEdge("LEFT");
              progressRef.current = 0;
            }
          } else if (currentEdge === "LEFT") {
            if (progressRef.current >= height - CAT_OFFSET) {
              edgeRef.current = "TOP";
              setEdge("TOP");
              progressRef.current = 0;
            }
          }
        }

        // Calculate Position on Border (Relative to target element)
        let renderX = 0;
        let renderY = 0;

        switch (edgeRef.current) {
          case "TOP":
            renderX = progressRef.current;
            renderY = -23; // sits with paws directly on the 2px border
            setIsFlipped(false);
            setSpeechPos({ top: -38, left: -40 });
            break;
          case "RIGHT":
            renderX = width - 3; // clings to right border
            renderY = progressRef.current;
            setIsFlipped(false);
            setSpeechPos({ top: -20, left: -140 });
            break;
          case "BOTTOM":
            renderX = width - CAT_OFFSET - progressRef.current;
            renderY = height - 3; // clings to bottom border
            setIsFlipped(true);
            setSpeechPos({ top: 28, left: -40 });
            break;
          case "LEFT":
            renderX = -23; // clings to left border
            renderY = height - CAT_OFFSET - progressRef.current;
            setIsFlipped(true);
            setSpeechPos({ top: -20, left: 30 });
            break;
        }

        setPos({ x: renderX, y: renderY });
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [mounted, nekoMode]);

  if (!mounted || nekoMode === "HIDDEN") {
    return (
      <div className="fixed bottom-4 left-4 z-[9990]">
        <button
          onClick={() => changeMode("ACTIVE")}
          className="pixel-btn text-[0.6rem] py-1 px-2.5 bg-[var(--color-surface)] opacity-70 hover:opacity-100"
          title="Wake Cyber-Neko"
        >
          [🐾 WAKE_NEKO]
        </button>
      </div>
    );
  }

  // Rotation style depending on current border edge
  let rotationDeg = 0;
  if (edge === "RIGHT") rotationDeg = 90;
  if (edge === "BOTTOM") rotationDeg = 180;
  if (edge === "LEFT") rotationDeg = 270;

  const portalTarget = targetElement || activeTargetRef.current;

  return (
    <>
      {/* ATTACHED SPRITE CONTAINER */}
      {portalTarget &&
        createPortal(
          <div
            style={{
              position: "absolute",
              top: 0,
            left: 0,
            transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
            zIndex: 9980,
            pointerEvents: "auto",
            transition: state === "ALERT" ? "transform 0.1s ease" : "none",
          }}
          className="select-none cursor-pointer"
          onClick={handlePet}
          title="Cyber-Neko (Click to pet)"
        >
          {/* SPEECH BALLOON */}
          {speech && (
            <div
              style={{
                position: "absolute",
                top: `${speechPos.top}px`,
                left: `${speechPos.left}px`,
                whiteSpace: "nowrap",
                transform: `rotate(${-rotationDeg}deg)`, // Keep text right-side up
              }}
              className="bg-[var(--color-bg)] border border-[var(--color-text)] px-2 py-0.5 font-pixel text-[0.55rem] text-[var(--color-text)] shadow-[2px_2px_0px_var(--color-border)] animate-in fade-in zoom-in-90 duration-150 z-50 pointer-events-none"
            >
              {speech}
            </div>
          )}

          {/* SLEEP ZZZ INDICATOR */}
          {state === "SLEEP" && (
            <div
              style={{
                position: "absolute",
                top: -18,
                left: 14,
                transform: `rotate(${-rotationDeg}deg)`,
              }}
              className="font-pixel text-[0.6rem] text-[var(--color-text-dim)] animate-pulse"
            >
              z Z z
            </div>
          )}

          {/* ALERT (!) INDICATOR */}
          {state === "ALERT" && (
            <div
              style={{
                position: "absolute",
                top: -16,
                left: 8,
                transform: `rotate(${-rotationDeg}deg)`,
              }}
              className="font-pixel text-[0.65rem] text-[var(--color-text)] animate-bounce font-bold"
            >
              (!)
            </div>
          )}

          {/* PIXEL CAT SVG SPRITE */}
          <div
            style={{
              transform: `rotate(${rotationDeg}deg) ${isFlipped ? "scaleX(-1)" : ""}`,
              transformOrigin: "center center",
              transition: "transform 0.15s ease",
            }}
            className="w-[26px] h-[26px] drop-shadow-[1px_1px_0px_rgba(0,0,0,0.8)]"
          >
            <svg
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full text-[var(--color-text)]"
              style={{ shapeRendering: "crispEdges" }}
            >
              {/* BODY SPRITE: SITTING / SLEEPING */}
              {state === "SLEEP" ? (
                // Curled Sleep Pose
                <>
                  <rect x="2" y="8" width="12" height="6" fill="currentColor" />
                  <rect x="1" y="9" width="1" height="4" fill="currentColor" />
                  <rect x="14" y="9" width="1" height="4" fill="currentColor" />
                  {/* Closed Eyes */}
                  <rect x="5" y="10" width="2" height="1" fill="var(--color-bg)" />
                  <rect x="9" y="10" width="2" height="1" fill="var(--color-bg)" />
                  {/* Tiny Ears */}
                  <rect x="3" y="7" width="2" height="2" fill="currentColor" />
                  <rect x="11" y="7" width="2" height="2" fill="currentColor" />
                </>
              ) : state === "SIT" ? (
                // Sitting Pose
                <>
                  {/* Head */}
                  <rect x="4" y="2" width="8" height="6" fill="currentColor" />
                  {/* Ears */}
                  <rect x="3" y="1" width="2" height="2" fill="currentColor" />
                  <rect x="11" y="1" width="2" height="2" fill="currentColor" />
                  {/* Inner Ears */}
                  <rect x="4" y="2" width="1" height="1" fill="var(--color-bg)" />
                  <rect x="11" y="2" width="1" height="1" fill="var(--color-bg)" />
                  {/* Eyes */}
                  <rect x="5" y="4" width="1" height="2" fill="var(--color-bg)" />
                  <rect x="10" y="4" width="1" height="2" fill="var(--color-bg)" />
                  {/* Nose */}
                  <rect x="7" y="6" width="2" height="1" fill="var(--color-bg)" />
                  {/* Body */}
                  <rect x="5" y="8" width="6" height="6" fill="currentColor" />
                  {/* Front Paws */}
                  <rect x="4" y="14" width="2" height="2" fill="currentColor" />
                  <rect x="10" y="14" width="2" height="2" fill="currentColor" />
                  {/* Tail wrapped */}
                  <rect x="11" y="11" width="3" height="2" fill="currentColor" />
                  <rect x="13" y="9" width="2" height="2" fill="currentColor" />
                </>
              ) : (
                // WALKING / ALERT / PURR POSE
                <>
                  {/* Head */}
                  <rect x="9" y="2" width="6" height="5" fill="currentColor" />
                  {/* Ears */}
                  <rect x="9" y="0" width="2" height="2" fill="currentColor" />
                  <rect x="13" y="0" width="2" height="2" fill="currentColor" />
                  {/* Inner Ear */}
                  <rect x="10" y="1" width="1" height="1" fill="var(--color-bg)" />
                  {/* Eyes */}
                  {state === "PURR" ? (
                    // Happy purr eyes ^ ^
                    <>
                      <rect x="11" y="3" width="1" height="1" fill="var(--color-bg)" />
                      <rect x="14" y="3" width="1" height="1" fill="var(--color-bg)" />
                    </>
                  ) : (
                    // Normal open eyes
                    <>
                      <rect x="11" y="3" width="1" height="2" fill="var(--color-bg)" />
                      <rect x="14" y="3" width="1" height="2" fill="var(--color-bg)" />
                    </>
                  )}
                  {/* Nose / Whiskers */}
                  <rect x="15" y="5" width="1" height="1" fill="var(--color-bg)" />
                  {/* Torso */}
                  <rect x="3" y="6" width="9" height="5" fill="currentColor" />
                  {/* Legs (Alternating Walk Cycle) */}
                  {walkFrame === 0 ? (
                    <>
                      {/* Front Leg Forward */}
                      <rect x="10" y="11" width="2" height="4" fill="currentColor" />
                      <rect x="11" y="14" width="2" height="1" fill="currentColor" />
                      {/* Back Leg Back */}
                      <rect x="3" y="11" width="2" height="4" fill="currentColor" />
                      <rect x="2" y="14" width="2" height="1" fill="currentColor" />
                      {/* Tail high */}
                      <rect x="1" y="4" width="2" height="4" fill="currentColor" />
                      <rect x="0" y="2" width="2" height="2" fill="currentColor" />
                    </>
                  ) : (
                    <>
                      {/* Front Leg Back */}
                      <rect x="8" y="11" width="2" height="4" fill="currentColor" />
                      <rect x="7" y="14" width="2" height="1" fill="currentColor" />
                      {/* Back Leg Forward */}
                      <rect x="5" y="11" width="2" height="4" fill="currentColor" />
                      <rect x="6" y="14" width="2" height="1" fill="currentColor" />
                      {/* Tail medium */}
                      <rect x="1" y="5" width="2" height="4" fill="currentColor" />
                      <rect x="0" y="4" width="2" height="2" fill="currentColor" />
                    </>
                  )}
                </>
              )}
            </svg>
          </div>
        </div>,
        portalTarget
      )}

      {/* DISCREET HUD CONTROL (BOTTOM-LEFT) */}
      <div className="fixed bottom-4 left-4 z-[9990] flex items-center gap-1 font-mono text-[0.6rem] bg-[var(--color-surface)] border border-[var(--color-border)] px-2 py-1 shadow-[2px_2px_0px_var(--color-border)]">
        <span className="font-pixel text-[0.55rem] text-[var(--color-text)]">
          NEKO_V1:
        </span>
        <button
          onClick={() => changeMode(nekoMode === "ACTIVE" ? "SLEEP" : "ACTIVE")}
          className="text-[var(--color-text-dim)] hover:text-[var(--color-text)] px-1"
          title="Toggle Active/Sleep"
        >
          [{nekoMode === "ACTIVE" ? "🐾 ON" : "💤 SLEEP"}]
        </button>
        <button
          onClick={() => changeMode("HIDDEN")}
          className="text-[var(--color-text-dim)] hover:text-[var(--color-text)] px-0.5"
          title="Hide Cyber-Neko"
        >
          [✕]
        </button>
      </div>
    </>
  );
}

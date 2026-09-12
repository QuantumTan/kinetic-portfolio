"use client";

import { useEffect, useState } from "react";
import CustomCursor from "@/components/ui/CustomCursor";
import KineticPixelBackground from "@/components/ui/KineticPixelBackground";
import PixelLoader from "@/components/ui/PixelLoader";
import CyberNeko from "@/components/ui/CyberNeko";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <KineticPixelBackground />
      {mounted && <CustomCursor />}
      {mounted && <CyberNeko />}
      {loading && <PixelLoader onComplete={() => setLoading(false)} />}
      <div
        className={`relative z-[1] w-full min-h-screen flex flex-col items-center transition-opacity duration-500 ${
          loading ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        {children}
      </div>
    </>
  );
}

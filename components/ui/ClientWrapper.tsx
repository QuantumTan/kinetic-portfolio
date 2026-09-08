"use client";

import { useEffect, useState } from "react";
import CustomCursor from "@/components/ui/CustomCursor";
import KineticPixelBackground from "@/components/ui/KineticPixelBackground";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <KineticPixelBackground />
      {mounted && <CustomCursor />}
      <div className="relative z-[1] w-full min-h-screen flex flex-col items-center">{children}</div>
    </>
  );
}

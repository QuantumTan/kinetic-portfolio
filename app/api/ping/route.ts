import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    status: "ONLINE",
    node: "QUANTUM_CORE // DVO-01",
    region: "Davao City, PH (UTC+8)",
    timestamp: new Date().toISOString(),
    epoch: Date.now(),
  });
}

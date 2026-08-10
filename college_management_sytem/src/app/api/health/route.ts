import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "online",
    message: "Node.js API Route Server is connected & functioning properly!",
    server: "Next.js / Node.js Backend API Route",
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    nodeVersion: process.version,
    memoryUsageMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
  });
}

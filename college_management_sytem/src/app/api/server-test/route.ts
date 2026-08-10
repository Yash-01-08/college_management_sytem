import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const echoParam = searchParams.get("echo") || "default-echo-payload";

  return NextResponse.json({
    success: true,
    message: "GET test request processed successfully by Node.js backend server!",
    echo: echoParam,
    serverDiagnostics: {
      status: "Healthy",
      environment: process.env.NODE_ENV || "development",
      uptime: `${Math.floor(process.uptime())}s`,
      memory: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`,
      nodeVersion: process.version,
    },
    timestamp: new Date().toISOString(),
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    return NextResponse.json({
      success: true,
      message: "POST test payload received and validated by Node.js backend server!",
      receivedPayload: body,
      serverDiagnostics: {
        status: "Healthy",
        environment: process.env.NODE_ENV || "development",
        uptime: `${Math.floor(process.uptime())}s`,
        memory: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`,
        nodeVersion: process.version,
      },
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to parse JSON request body" },
      { status: 400 }
    );
  }
}

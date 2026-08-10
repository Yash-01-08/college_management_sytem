import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId") || "user-student-1";
  const notifications = db.getNotifications(userId);
  return NextResponse.json({ notifications });
}

export async function PUT(req: Request) {
  try {
    const { id } = await req.json();
    const notif = db.markNotificationRead(id);
    return NextResponse.json({ message: "Notification marked read", notification: notif });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

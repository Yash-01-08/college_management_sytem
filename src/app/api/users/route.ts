import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const role = searchParams.get("role");
  let users = db.getUsers();
  if (role) {
    users = users.filter((u) => u.role === role);
  }
  return NextResponse.json({ users });
}

export async function PUT(req: Request) {
  try {
    const { id, updates } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }
    const updated = db.updateUser(id, updates);
    if (!updated) {
      return NextResponse.json({ error: "User not found" }, { status: 444 });
    }
    return NextResponse.json({ message: "User updated successfully", user: updated });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateOTP } from "@/lib/auth";
import { UserRole } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const { name, email, password, role, department } = await req.json();
    if (!email || !password || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existing = db.getUserByEmail(email);
    if (existing) {
      return NextResponse.json({ error: "User already exists with this email" }, { status: 400 });
    }

    const newUser = db.addUser({
      id: `user-${Date.now()}`,
      name,
      email,
      role: (role as UserRole) || "STUDENT",
      department: department || "Computer Science",
      verified: false,
      createdAt: new Date().toISOString(),
    });

    const otp = generateOTP();

    return NextResponse.json({
      message: "Registration initiated. Verification OTP sent to email.",
      user: newUser,
      otp, // Provided for easy demo testing
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

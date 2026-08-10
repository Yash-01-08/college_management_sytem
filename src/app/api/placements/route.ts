import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get("studentId");
  const placements = db.getPlacements();
  const applications = db.getPlacementApps(studentId || undefined);
  return NextResponse.json({ placements, applications });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === "CREATE_PLACEMENT") {
      const { companyName, jobRole, ctc, location, eligibility, deadline, description, requirements } = body;
      const notice = db.createPlacement({
        id: `place-${Date.now()}`,
        companyName,
        jobRole,
        ctc,
        location,
        eligibility,
        deadline,
        description,
        requirements: requirements || [],
        postedAt: new Date().toISOString(),
        appliedCount: 0,
      });
      return NextResponse.json({ message: "Placement posting created", placement: notice });
    }

    if (action === "APPLY") {
      const { placementId, companyName, jobRole, studentId, studentName, studentEmail, resumeUrl } = body;
      const app = db.applyPlacement({
        id: `app-${Date.now()}`,
        placementId,
        companyName,
        jobRole,
        studentId,
        studentName,
        studentEmail,
        resumeUrl: resumeUrl || "https://example.com/resumes/default.pdf",
        appliedAt: new Date().toISOString(),
        status: "APPLIED",
      });
      return NextResponse.json({ message: "Application submitted successfully!", application: app });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

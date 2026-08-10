import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const assignmentId = searchParams.get("assignmentId");
  const studentId = searchParams.get("studentId");
  const assignments = db.getAssignments();
  const submissions = db.getSubmissions(assignmentId || undefined, studentId || undefined);
  return NextResponse.json({ assignments, submissions });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === "CREATE_ASSIGNMENT") {
      const { title, description, subject, subjectCode, facultyId, facultyName, deadline, totalMarks, rubrics } = body;
      const assignment = db.createAssignment({
        id: `assign-${Date.now()}`,
        title,
        description,
        subject,
        subjectCode,
        facultyId,
        facultyName,
        deadline,
        totalMarks: Number(totalMarks) || 100,
        rubrics: rubrics || ["Correctness", "Documentation"],
        createdAt: new Date().toISOString(),
      });
      return NextResponse.json({ message: "Assignment published", assignment });
    }

    if (action === "SUBMIT_SOLUTION") {
      const { assignmentId, assignmentTitle, studentId, studentName, rollNumber, solutionText, gitHubUrl, fileUrl } = body;
      const submission = db.submitAssignment({
        id: `sub-${Date.now()}`,
        assignmentId,
        assignmentTitle,
        studentId,
        studentName,
        rollNumber,
        solutionText,
        gitHubUrl,
        fileUrl,
        submissionDate: new Date().toISOString(),
        status: "SUBMITTED",
        plagiarismScore: Math.floor(Math.random() * 5),
      });
      return NextResponse.json({ message: "Solution submitted successfully", submission });
    }

    if (action === "GRADE_SUBMISSION") {
      const { submissionId, marks, feedback } = body;
      const graded = db.gradeSubmission(submissionId, Number(marks), feedback);
      return NextResponse.json({ message: "Submission graded", submission: graded });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

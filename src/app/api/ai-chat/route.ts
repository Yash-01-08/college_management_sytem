import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    if (!message) {
      return NextResponse.json({ error: "Message prompt required" }, { status: 400 });
    }

    const query = message.toLowerCase();
    let reply = "Campus AI Assistant: I can help you with class schedules, attendance policies, placement eligibility, library timings, and event registrations!";

    if (query.includes("attendance") || query.includes("absent") || query.includes("qr")) {
      reply = "Attendance Policy: Minimum 75% attendance is required per subject to sit for final semester examinations. Faculty launch a unique 30-minute QR code session during class which you can scan using the Attendance page scanner.";
    } else if (query.includes("placement") || query.includes("job") || query.includes("google") || query.includes("salary") || query.includes("ctc")) {
      reply = "Placement Cell Info: Top recruiters this season include Google Cloud (₹28.5 LPA), Microsoft (₹26 LPA), and Amazon. Minimum eligibility is 7.5 CGPA with 0 active backlogs. Upload your latest resume under the Placement section.";
    } else if (query.includes("hackathon") || query.includes("event") || query.includes("ticket")) {
      reply = "Events & Clubs: DevFusion 4.O Hackathon final showcase is scheduled for Aug 20 at the Main Auditorium. You can register on the Events page and immediately download your verified QR Pass ticket!";
    } else if (query.includes("assignment") || query.includes("deadline") || query.includes("submit")) {
      reply = "Assignment Hub: You can submit solutions as PDF, ZIP files, or GitHub repository links. Submissions past the deadline will automatically be flagged with a 'LATE' badge for faculty review.";
    } else if (query.includes("library") || query.includes("time") || query.includes("wifi") || query.includes("map")) {
      reply = "Campus Amenities: Central Library is open 24/7 during exam season with high-speed 1Gbps Wi-Fi. Tech Block B holds labs 1-6 and Innovation Hub.";
    }

    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

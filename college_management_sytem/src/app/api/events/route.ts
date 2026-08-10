import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get("studentId");
  const events = db.getEvents();
  const registrations = db.getEventRegistrations(studentId || undefined);
  return NextResponse.json({ events, registrations });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === "CREATE_EVENT") {
      const { title, description, category, banner, venue, date, time, registrationDeadline, capacity, organizer, speakers } = body;
      const eventItem = db.createEvent({
        id: `evt-${Date.now()}`,
        title,
        description,
        category: category || "TECHNICAL",
        banner: banner || "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
        venue,
        date,
        time,
        registrationDeadline,
        capacity: Number(capacity) || 100,
        registeredCount: 0,
        organizer: organizer || "Event Coordinator",
        speakers: speakers || [],
        active: true,
      });
      return NextResponse.json({ message: "Event created successfully", event: eventItem });
    }

    if (action === "REGISTER_EVENT") {
      const { eventId, eventTitle, studentId, studentName } = body;
      const ticketQrCode = `TICKET-${eventId}-${studentId.slice(-4)}-${Date.now()}`;
      const reg = db.registerEvent({
        id: `reg-${Date.now()}`,
        eventId,
        eventTitle,
        studentId,
        studentName,
        registeredAt: new Date().toISOString(),
        ticketQrCode,
        status: "CONFIRMED",
      });
      return NextResponse.json({ message: "Registered for event! Download your QR Pass ticket.", registration: reg });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

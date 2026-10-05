import { NextRequest, NextResponse } from "next/server";
import { getMeetings, createMeeting } from "@/lib/services/meetings";

export async function GET(req: NextRequest) {
  try {
    const status = req.nextUrl.searchParams.get("status") || undefined;
    const meetings = await getMeetings(status);
    return NextResponse.json({ success: true, data: meetings });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.meeting_type_id || !body.meeting_date || !body.title) {
      return NextResponse.json(
        { success: false, error: "meeting_type_id, meeting_date and title are required" },
        { status: 400 }
      );
    }
    const meetingId = await createMeeting(body);
    return NextResponse.json({ success: true, data: { id: meetingId } }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

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

    // Batch creation mode (for Monthly Sundays Generator)
    if (Array.isArray(body.meetings)) {
      const createdIds: string[] = [];
      for (const m of body.meetings) {
        if (m.meeting_type_id && m.meeting_date && m.title) {
          const id = await createMeeting(m);
          createdIds.push(id);
        }
      }
      return NextResponse.json(
        { success: true, data: { ids: createdIds, count: createdIds.length } },
        { status: 201 }
      );
    }

    if (!body.meeting_type_id || !body.meeting_date || !body.title) {
      return NextResponse.json(
        {
          success: false,
          error: "meeting_type_id, meeting_date and title are required",
        },
        { status: 400 }
      );
    }
    const meetingId = await createMeeting(body);
    return NextResponse.json(
      { success: true, data: { id: meetingId } },
      { status: 201 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

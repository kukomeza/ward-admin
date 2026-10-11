import { NextRequest, NextResponse } from "next/server";
import {
  getMeetingAttendance,
  recordMeetingAttendance,
  updateAttendanceFamily,
  removeAttendanceFamily,
} from "@/lib/services/attendance";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const summary = await getMeetingAttendance(id);
    return NextResponse.json({ success: true, data: summary });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const summary = await recordMeetingAttendance(id, {
      familyId: body.family_id,
      familyName: body.family_name,
      attendeesCount: Number(body.attendees_count ?? 1),
      notes: body.notes ?? null,
    });

    return NextResponse.json({ success: true, data: summary }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 400 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    if (!body.family_id) {
      return NextResponse.json(
        { success: false, error: "family_id es requerido" },
        { status: 400 }
      );
    }

    await updateAttendanceFamily(body.family_id, {
      name: body.name,
      default_count: body.default_count,
    });

    const summary = await getMeetingAttendance(id);
    return NextResponse.json({ success: true, data: summary });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const familyId = req.nextUrl.searchParams.get("familyId");

    if (!familyId) {
      return NextResponse.json(
        { success: false, error: "familyId es requerido" },
        { status: 400 }
      );
    }

    await removeAttendanceFamily(familyId, id);
    const summary = await getMeetingAttendance(id);
    return NextResponse.json({ success: true, data: summary });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}


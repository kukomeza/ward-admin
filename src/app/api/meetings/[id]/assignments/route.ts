import { NextRequest, NextResponse } from "next/server";
import { assignPersonToTask, removeTaskAssignment } from "@/lib/services/meetings";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    if (!body.person_id || !body.task_type_id) {
      return NextResponse.json(
        { success: false, error: "person_id and task_type_id are required" },
        { status: 400 }
      );
    }

    const assignmentId = await assignPersonToTask({
      meetingId: id,
      meetingItemId: body.meeting_item_id || null,
      personId: body.person_id,
      taskTypeId: body.task_type_id,
      override3MonthAlert: !!body.override_3month_alert,
      notes: body.notes,
    });

    return NextResponse.json({ success: true, data: { id: assignmentId } }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest
) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const assignmentId = searchParams.get("assignmentId");
    if (!assignmentId) {
      return NextResponse.json(
        { success: false, error: "assignmentId query param is required" },
        { status: 400 }
      );
    }
    await removeTaskAssignment(assignmentId);
    return NextResponse.json({ success: true, message: "Assignment removed" });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getCandidatesForTask } from "@/lib/services/rotations";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const taskTypeId = searchParams.get("taskTypeId");
    const meetingDate = searchParams.get("meetingDate") || new Date().toISOString().split("T")[0];
    const excludeMeetingId = searchParams.get("excludeMeetingId") || undefined;

    if (!taskTypeId) {
      return NextResponse.json(
        { success: false, error: "taskTypeId query parameter is required" },
        { status: 400 }
      );
    }

    const candidates = await getCandidatesForTask(taskTypeId, meetingDate, excludeMeetingId);
    return NextResponse.json({ success: true, data: candidates });
  } catch (error: unknown) {
    console.error("GET /api/rotations/candidates error:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

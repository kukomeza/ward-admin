import { NextRequest, NextResponse } from "next/server";
import { checkRotationRule } from "@/lib/services/rotations";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const personId = searchParams.get("personId");
    const taskTypeId = searchParams.get("taskTypeId");
    const meetingDate = searchParams.get("meetingDate") || new Date().toISOString().split("T")[0];
    const excludeMeetingId = searchParams.get("excludeMeetingId") || undefined;

    if (!personId || !taskTypeId) {
      return NextResponse.json(
        { success: false, error: "personId and taskTypeId query parameters are required" },
        { status: 400 }
      );
    }

    const audit = await checkRotationRule(personId, taskTypeId, meetingDate, excludeMeetingId);
    return NextResponse.json({ success: true, data: audit });
  } catch (error: unknown) {
    console.error("GET /api/rotations/audit error:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

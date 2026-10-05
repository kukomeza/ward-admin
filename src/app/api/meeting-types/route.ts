import { NextRequest, NextResponse } from "next/server";
import { getMeetingTypes, createMeetingType } from "@/lib/services/meetings";

export async function GET(req: NextRequest) {
  try {
    const activeOnly = req.nextUrl.searchParams.get("activeOnly") !== "false";
    const types = await getMeetingTypes(activeOnly);
    return NextResponse.json({ success: true, data: types });
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
    if (!body.name) {
      return NextResponse.json(
        { success: false, error: "Meeting type name is required" },
        { status: 400 }
      );
    }
    const type = await createMeetingType(body);
    return NextResponse.json({ success: true, data: type }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getTaskTypes, createTaskType } from "@/lib/services/tasks";

export async function GET(req: NextRequest) {
  try {
    const activeOnly = req.nextUrl.searchParams.get("activeOnly") !== "false";
    const tasks = await getTaskTypes(activeOnly);
    return NextResponse.json({ success: true, data: tasks });
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
        { success: false, error: "Task name is required" },
        { status: 400 }
      );
    }
    const task = await createTaskType(body);
    return NextResponse.json({ success: true, data: task }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

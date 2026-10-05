import { NextRequest, NextResponse } from "next/server";
import { toggleVisitorNoteRead } from "@/lib/services/meetings";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; noteId: string }> }
) {
  try {
    const { noteId } = await params;
    const body = await req.json();
    await toggleVisitorNoteRead(noteId, !!body.is_read);
    return NextResponse.json({ success: true, message: "Visitor note status updated" });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

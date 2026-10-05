import { NextRequest, NextResponse } from "next/server";
import { addVisitorNote, deleteVisitorNote } from "@/lib/services/meetings";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    if (!body.visitor_name) {
      return NextResponse.json(
        { success: false, error: "visitor_name is required" },
        { status: 400 }
      );
    }

    const noteId = await addVisitorNote(id, body.visitor_name, body.visitor_title);
    return NextResponse.json({ success: true, data: { id: noteId } }, { status: 201 });
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
    const noteId = searchParams.get("noteId");
    if (!noteId) {
      return NextResponse.json(
        { success: false, error: "noteId query param is required" },
        { status: 400 }
      );
    }
    await deleteVisitorNote(noteId);
    return NextResponse.json({ success: true, message: "Visitor note removed" });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

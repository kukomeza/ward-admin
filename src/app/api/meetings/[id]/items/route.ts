import { NextRequest, NextResponse } from "next/server";
import { addMeetingItem, reorderMeetingItems } from "@/lib/services/meetings";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    if (!body.title || !body.item_type) {
      return NextResponse.json(
        { success: false, error: "title and item_type are required" },
        { status: 400 }
      );
    }
    const itemId = await addMeetingItem(id, body);
    return NextResponse.json({ success: true, data: { id: itemId } }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
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
    if (!Array.isArray(body.orderedIds)) {
      return NextResponse.json(
        { success: false, error: "orderedIds array is required" },
        { status: 400 }
      );
    }
    await reorderMeetingItems(id, body.orderedIds);
    return NextResponse.json({ success: true, message: "Items reordered" });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

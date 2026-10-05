import { NextRequest, NextResponse } from "next/server";
import { updateMeetingItem, deleteMeetingItem } from "@/lib/services/meetings";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  try {
    const { itemId } = await params;
    const body = await req.json();
    await updateMeetingItem(itemId, body);
    return NextResponse.json({ success: true, message: "Item updated" });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  try {
    const { itemId } = await params;
    await deleteMeetingItem(itemId);
    return NextResponse.json({ success: true, message: "Item deleted" });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

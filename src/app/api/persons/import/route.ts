import { NextRequest, NextResponse } from "next/server";
import { importPersonsBulk } from "@/lib/services/persons";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const persons = body.persons;
    const updateExisting = body.updateExisting !== false;

    if (!Array.isArray(persons) || persons.length === 0) {
      return NextResponse.json(
        { success: false, error: "El listado de personas no puede estar vacío" },
        { status: 400 }
      );
    }

    const result = await importPersonsBulk(persons, updateExisting);
    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (error: unknown) {
    console.error("POST /api/persons/import error:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

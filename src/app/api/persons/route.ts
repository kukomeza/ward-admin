import { NextRequest, NextResponse } from "next/server";
import { getPersons, createPerson } from "@/lib/services/persons";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const search = searchParams.get("search") || undefined;
    const activeOnly = searchParams.get("activeOnly") !== "false";

    const persons = await getPersons(search, activeOnly);
    return NextResponse.json({ success: true, data: persons });
  } catch (error: unknown) {
    console.error("GET /api/persons error:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.first_name || !body.last_name) {
      return NextResponse.json(
        { success: false, error: "first_name and last_name are required" },
        { status: 400 }
      );
    }

    const person = await createPerson(body);
    return NextResponse.json({ success: true, data: person }, { status: 201 });
  } catch (error: unknown) {
    console.error("POST /api/persons error:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

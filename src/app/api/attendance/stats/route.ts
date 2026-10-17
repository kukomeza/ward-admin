import { NextResponse } from "next/server";
import { getAttendanceAnalytics } from "@/lib/services/attendance";

export async function GET() {
  try {
    const data = await getAttendanceAnalytics();
    return NextResponse.json({
      success: true,
      data,
    });
  } catch (err: unknown) {
    console.error("Error fetching attendance analytics:", err);
    return NextResponse.json(
      {
        success: false,
        error:
          err instanceof Error
            ? err.message
            : "Error obteniendo estadísticas de asistencia",
      },
      { status: 500 }
    );
  }
}


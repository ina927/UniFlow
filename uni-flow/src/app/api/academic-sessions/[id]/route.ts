import { NextResponse } from "next/server";

// ✅ Correct stub with explicit context typing
export async function GET(
  req: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  // Temporary placeholder for Release 0
  return NextResponse.json({
    ok: true,
    message: `Academic session ${id} (stubbed for build)`,
  });
}
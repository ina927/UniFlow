import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  // Temporary stub so the build succeeds
  return NextResponse.json({ message: `Academic session ${id} placeholder` });
}
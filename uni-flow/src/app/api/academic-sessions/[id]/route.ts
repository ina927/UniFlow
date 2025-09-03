import { NextResponse } from "next/server";

// ✅ Correct signature
export async function GET(
  req: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  // Placeholder logic just to make build pass
  return NextResponse.json({ message: `Academic session ${id}` });
}
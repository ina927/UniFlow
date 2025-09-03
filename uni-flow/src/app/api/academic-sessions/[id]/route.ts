import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  // Placeholder response for now
  return NextResponse.json({ message: `Session ${id} details placeholder` });
}
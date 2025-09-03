// R0 stub – ok to ship
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  return NextResponse.json({ ok: true, id, message: "stub GET" });
}

export async function PUT(
  req: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  const data = await req.json().catch(() => null);
  return NextResponse.json({ ok: true, id, updated: data });
}

export async function DELETE(
  _req: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  return NextResponse.json({ ok: true, id, deleted: true });
}
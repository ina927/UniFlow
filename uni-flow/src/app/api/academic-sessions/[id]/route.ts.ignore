// R0 stub for dynamic route: /api/academic-sessions/[id]
import { NextRequest, NextResponse } from "next/server";

type Ctx = { params: { id: string } };

export async function GET(_req: NextRequest, context: Ctx) {
  const { id } = context.params;
  return NextResponse.json({ ok: true, id, message: "stub GET" });
}

export async function PUT(req: NextRequest, context: Ctx) {
  const { id } = context.params;
  const data = await req.json().catch(() => null);
  return NextResponse.json({ ok: true, id, updated: data });
}

export async function DELETE(_req: NextRequest, context: Ctx) {
  const { id } = context.params;
  return NextResponse.json({ ok: true, id, deleted: true });
}
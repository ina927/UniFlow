// R0 stub for collection route: /api/academic-sessions
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ ok: true, items: [] });
}

export async function POST(req: NextRequest) {
  const data = await req.json().catch(() => null);
  return NextResponse.json({ ok: true, created: data }, { status: 201 });
}
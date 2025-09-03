import { NextRequest, NextResponse } from "next/server";

// Ensure this route is always dynamic (no static analysis trying to pre-evaluate)
export const dynamic = "force-dynamic";

const hasDB = !!process.env.MONGODB_URI;

// GET /api/user  – collection route (no 2nd arg!)
export async function GET(_req: NextRequest) {
  // If there is no DB config (e.g., CI), return a harmless stub
  if (!hasDB) {
    return NextResponse.json({ ok: true, users: [] }, { status: 200 });
  }

  // Lazy-load DB code so it doesn't run at module import time
  const { getUsers } = await import("@/entities");
  try {
    const users = await getUsers();
    return NextResponse.json(users, { status: 200 });
  } catch (e) {
    console.error("Error fetching users:", e);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
});

// POST /api/user – create user
export async function POST(req: NextRequest) {
  if (!hasDB) {
    return NextResponse.json(
      { ok: false, message: "Database not configured" },
      { status: 503 }
    );
  }

  const body = await req.json();

  // Lazy import to avoid touching DB at build time
  const { createUser } = await import("@/entities");
  try {
    const user = await createUser({
      ...body,
      hash: body?.password,
      dob: body?.dob ? new Date(body.dob) : undefined,
    });
    return NextResponse.json(user, { status: 201 });
  } catch (e) {
    console.error("Error creating user:", e);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
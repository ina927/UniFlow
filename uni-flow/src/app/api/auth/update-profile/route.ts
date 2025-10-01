import { NextRequest, NextResponse } from "next/server";
import { updateUser } from "@/features/auth/users";
import { verify } from "@/features/auth/jwt";

export async function PUT(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const claims = token ? verify(token) : null;
  if (!claims) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { name, password } = await req.json();
  const user = await updateUser(claims.email, { name, password });
  if (!user) {
    const res = NextResponse.json({ error: "session expired, please sign in again" }, { status: 401 });
    res.cookies.set("token", "", { httpOnly: true, maxAge: 0, path: "/" });
    return res;
  }
  return NextResponse.json({ user });
}

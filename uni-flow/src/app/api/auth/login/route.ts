import { NextRequest, NextResponse } from "next/server";
import { verifyUser } from "@/app/lib/users";
import { sign } from "@/app/lib/jwt";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !password) return NextResponse.json({ error: "email & password required" }, { status: 400 });

  const user = await verifyUser(email, password);
  if (!user) return NextResponse.json({ error: "invalid credentials" }, { status: 401 });

  const token = sign({ sub: user.id, email: user.email });
  const res = NextResponse.json({ user });
  res.cookies.set("token", token, { httpOnly: true, sameSite: "lax", path: "/" });
  return res;
}
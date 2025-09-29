import { NextRequest, NextResponse } from "next/server";
import { verifyUser } from "@/app/lib/users";
import { sign } from "@/app/lib/jwt";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "email & password required" }, { status: 400 });
    }

    const user = await verifyUser(email, password);
    if (!user) {
      return NextResponse.json({ error: "invalid credentials" }, { status: 401 });
    }

    const token = sign({ sub: user.id, email: user.email });
    const res = NextResponse.json({ user });
    res.cookies.set("token", token, { httpOnly: true, sameSite: "lax", path: "/" });
    return res;
  } catch (err) {
    console.error("Login failed", err);
    const message = err instanceof Error ? err.message : "unexpected error";
    return NextResponse.json({ error: `login failed: ${message}` }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/app/lib/users";
import { sign } from "@/app/lib/jwt";


export async function POST(req: NextRequest) {
  const { email, password, name } = await req.json();
  if (!email || !password) return NextResponse.json({ error: "email & password required" }, { status: 400 });
  try {
    const user = await createUser(email, password, name);
    const token = sign({ sub: user.id, email: user.email });
    const res = NextResponse.json({ user });
    res.cookies.set("token", token, { httpOnly: true, sameSite: "lax", path: "/" });
    return res;
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "registration failed" }, { status: 400 });
  }
}
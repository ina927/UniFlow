import { NextRequest, NextResponse } from "next/server";
import { verify } from "@/entities/auth/lib/jwt";
import { getByEmail } from "@/entities/auth/lib/users";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const claims = token ? verify(token) : null;
  if (!claims) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const user = await getByEmail(claims.email);
  if (!user) {
    const res = NextResponse.json({ error: "session expired" }, { status: 401 });
    res.cookies.set("token", "", { httpOnly: true, maxAge: 0, path: "/" });
    return res;
  }
  return NextResponse.json({ user });
}

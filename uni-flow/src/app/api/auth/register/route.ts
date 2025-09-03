import { NextRequest, NextResponse } from "next/server";
<<<<<<< HEAD

type RegisterBody = {
  name?: string;
  email: string;
  password: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as RegisterBody;
    const { name, email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // TODO: Replace with your actual user creation logic (DB call, hashing, etc.)
    const user = { id: "temp-id", name: name ?? "", email };

    return NextResponse.json(
      { message: "User registered successfully", user },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
=======
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
>>>>>>> 457c526 (feat(auth): add F101 user authentication prototype and stub unfinished APIs)
  }
}
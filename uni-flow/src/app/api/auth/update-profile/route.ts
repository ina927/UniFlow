import { NextRequest, NextResponse } from "next/server";
import { updateUser } from "@/entities/auth/users";
import { sign, verify } from "@/entities/auth/jwt";

type UpdateProfileBody = {
  name?: string;
  password?: string;
  email?: string;
  dob?: string | null;
};

export async function PUT(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const claims = token ? verify(token) : null;
  if (!claims) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  try {
    const body = (await req.json()) as UpdateProfileBody;
    const { name, password, email, dob } = body;
    const normalizedEmail = email !== undefined ? email.trim() : undefined;

    if (normalizedEmail !== undefined) {
      if (normalizedEmail.length === 0 || !normalizedEmail.includes("@")) {
        return NextResponse.json(
          { error: "Please provide a valid email address" },
          { status: 400 }
        );
      }
    }

    let normalizedDob: string | null | undefined = undefined;
    if (dob !== undefined) {
      if (dob === null) {
        normalizedDob = null;
      } else {
        const trimmedDob = dob.trim();
        if (trimmedDob.length === 0) {
          normalizedDob = null;
        } else {
          const parsed = new Date(trimmedDob);
          if (Number.isNaN(parsed.getTime())) {
            return NextResponse.json(
              { error: "Please provide a valid date of birth" },
              { status: 400 }
            );
          }
          normalizedDob = trimmedDob;
        }
      }
    }

    const updatedUser = await updateUser(claims.email, {
      name,
      password,
      email: normalizedEmail,
      dob: normalizedDob,
    });

    if (!updatedUser) {
      const res = NextResponse.json(
        { error: "session expired, please sign in again" },
        { status: 401 }
      );
      res.cookies.set("token", "", { httpOnly: true, maxAge: 0, path: "/" });
      return res;
    }

    const res = NextResponse.json({ user: updatedUser });
    if (updatedUser.email !== claims.email) {
      const newToken = sign({ sub: updatedUser.id, email: updatedUser.email });
      res.cookies.set("token", newToken, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
      });
    }

    return res;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update profile";
    const status = message === "Email already registered" ? 409 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { createUser as createPublicUser } from "@/entities/auth/users";

type RegisterBody = {
  name?: string;
  email: string;
  password: string;
  dob?: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as RegisterBody;
    const { name, email, password, dob } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (!email.includes("@")) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    const createdUser = await createPublicUser(email, password, name, dob);

    return NextResponse.json({
      status: true,
      statusCode: 201,
      message: "User registered successfully", 
      data: {
        data: createdUser,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Email already registered") {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }

    console.error("Error registering user:", error);
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import bcryptjs from "bcryptjs";

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

    const hash = bcryptjs.hashSync(password, 10);

    // TODO: Replace with your actual user creation logic (DB call, hashing, etc.)
    const user = { id: "temp-id", name: name ?? "", email };
    const createdUser = await prisma.user.create({
      data: {
        name: name ?? "",
        email,
        hash, // In real app, hash the password before storing
      },
    });

    // return NextResponse.json(
    //   { message: "User registered successfully", createdUser },
    //   { status: 201 }
    // );
    return NextResponse.json({
      status: true,
      statusCode: 201,
      message: "User registered successfully", 
      data: {
        data: createdUser,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
}

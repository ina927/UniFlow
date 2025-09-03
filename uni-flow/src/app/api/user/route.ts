import { NextRequest, NextResponse } from "next/server";
import { getUsers, createUser } from "@/entities";
import { CreateUserDto } from "@/entities/users/dto/create-user.dto";

// Collection route: /api/user
// Note: No 2nd "context" argument for collection routes.
export async function GET(_req: NextRequest) {
  try {
    const users = await getUsers();
    return NextResponse.json(users, { status: 200 });
  } catch (e) {
    console.error("Error fetching users:", e);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const user = await createUser({
      ...body,
      hash: body.password,
      dob: new Date(body.dob),
    } as CreateUserDto);

    return NextResponse.json(user, { status: 201 });
  } catch (e: unknown) {
    console.error("Error creating user:", e);

    if (typeof e === "object" && e !== null && (e as any).name === "DuplicateEmailError") {
      return NextResponse.json((e as any).message ?? "Duplicate email", { status: 409 });
    }

    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}

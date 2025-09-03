import { NextRequest, NextResponse } from "next/server";
import { getUsers, createUser } from "@/entities";
import { CreateUserDto } from "@/entities/users/dto/create-user.dto";

// Narrowing helpers to avoid `any`
function isRecord(val: unknown): val is Record<string, unknown> {
  return typeof val === "object" && val !== null;
}

// Collection route: /api/user
// Note: No 2nd "context" argument for collection routes.
export async function GET(_req: NextRequest) {
  try {
    const users = await getUsers();
    return NextResponse.json(users, { status: 200 });
  } catch (e: unknown) {
    // Log safely without assuming shape
    console.error("Error fetching users:", e);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<CreateUserDto> & {
      password?: string;
      dob?: string | Date;
    };

    const user = await createUser({
      ...body,
      // map expected fields if needed
      hash: body.password,
      dob: body.dob ? new Date(body.dob) : undefined,
    } as CreateUserDto);

    return NextResponse.json(user, { status: 201 });
  } catch (e: unknown) {
    console.error("Error creating user:", e);

    // DuplicateEmailError shape-safe check without `any`
    if (isRecord(e) && e["name"] === "DuplicateEmailError") {
      const message =
        isRecord(e) && typeof e["message"] === "string"
          ? (e["message"] as string)
          : "Duplicate email";
      return NextResponse.json(message, { status: 409 });
    }

    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}

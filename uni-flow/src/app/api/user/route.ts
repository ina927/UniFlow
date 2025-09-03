import { NextRequest, NextResponse } from "next/server";
import { withDB } from "@/shared";
import { getUsers, createUser } from "@/entities";
import { CreateUserDto } from "@/entities/users/dto/create-user.dto";

export const GET = withDB(async (req: NextRequest) => {
  try {
    const users = await getUsers();
    
    return {
      status: 200,
      data: users,
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    return {
      status: 500,
      data: "Internal Server Error",
    };
  }
});

export const POST = withDB(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const user = await createUser({
      ...body,
      hash: body.password,
      dob: new Date(body.dob),
    } as CreateUserDto);

    return {
      status: 201,
      data: user,
    };
  } catch (error) {
    console.error('Error creating user:', error);
    
    if (error instanceof Error && error.name === 'DuplicateEmailError') {
      return {
        status: 409,
        data: error.message,
      };
    }
    
    return {
      status: 500,
      data: "Internal Server Error",
    };
  }
});

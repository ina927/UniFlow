import { NextRequest } from "next/server";

import { withDB } from "@/shared";
import { getInstructors, createInstructor } from "@/entities/academics/services";
import { CreateInstructorDto } from "@/entities";

export const GET = withDB(async (req: NextRequest) => {
  try {
    const userId: string = req.headers.get('user-id') as string;

    if (!userId) {
      return {
        status: false,
        statusCode: 400,
        message: "User ID is required",
      };
    }

    const subjectId = req.nextUrl.searchParams.get('subject-id') as string;

    if (!subjectId) {
      return {
        status: false,
        statusCode: 400,
        message: "Subject ID is required",
      };
    }
    
    const instructors = await getInstructors({ subjectId });

    if (instructors.data.length === 0) {
      return {
        status: false,
        statusCode: 404,
        message: "Instructors not found",
      };
    }
    
    return {
      status: true,
      statusCode: 200,
      message: "Instructors fetched successfully",
      data: instructors,
    };
  } catch (error) {
    console.error('Error fetching instructors:', error);
    return {
      status: false,
      statusCode: 500,
      message: "Internal Server Error",
    };
  }
});

export const POST = withDB(async (req: NextRequest) => {
  try {
    const userId: string = req.headers.get('user-id') as string;

    if (!userId) {
      return {
        status: false,
        statusCode: 400,
        message: "User ID is required",
      };
    }

    const body: CreateInstructorDto = await req.json();
    const instructor = await createInstructor({ dto: body });

    return {
      status: true,
      statusCode: 201,
      message: "Instructor created successfully",
      data: instructor,
    };
  } catch (error) {
    console.error('Error creating instructor:', error);

    return {
      status: false,
      statusCode: 500,
      message: "Internal Server Error",
    };
  }
});

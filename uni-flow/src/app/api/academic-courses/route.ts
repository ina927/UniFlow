import { NextRequest } from "next/server";

import { createAcademicCourse, CreateAcademicCourseDto, getAcademicCourses } from "@/entities/academics";
import { withDB } from "@/shared";

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

    const academicCourses = await getAcademicCourses({ userId });

    if (academicCourses.data.length === 0) {
      return {
        status: false,
        statusCode: 404,
        message: "Academic courses not found",
      };
    }
    
    return {
      status: true,
      statusCode: 200,
      message: "Academic courses fetched successfully",
      data: academicCourses,
    };
  } catch (error) {
    console.error('Error fetching academic courses:', error);
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

    const body: CreateAcademicCourseDto = await req.json();

    const academicCourse = await createAcademicCourse({ userId, dto: body });

    if (!academicCourse.data) {
      return {
        status: false,
        statusCode: 400,
        message: "Academic course creation failed",
      };
    }

    return {
      status: true,
      statusCode: 201,
      message: "Academic course created successfully",
      data: academicCourse,
    };
  } catch (error) {
    console.error('Error creating academic course:', error);
    return {
      status: false,
      statusCode: error instanceof Error ? error.cause as number ?? 500 : 500,
      message: "Internal Server Error",
    };
  }
});

import { NextRequest } from "next/server";
import { withDB } from "@/shared";
import { getTerms, createTerm } from "@/entities/academics/services";

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

    const academicCourseId = req.nextUrl.searchParams.get('academic-course-id');

    if (!academicCourseId) {
      return {
        status: false,
        statusCode: 400,
        message: "Academic course ID is required",
      };
    }

    const terms = await getTerms({ academicCourseId: academicCourseId as string });

    if (terms.data.length === 0) {
      return {
        status: false,
        statusCode: 404,
        message: "Terms not found",
      };
    }
    
    return {
      status: true,
      statusCode: 200,
      message: "Terms fetched successfully",
      data: terms,
    };
  } catch (error) {
    console.error('Error fetching terms:', error);
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

    const academicCourseId = req.headers.get('academic-course-id');

    if (!academicCourseId) {
      return {
        status: false,
        statusCode: 400,
        message: "Academic course ID is required",
      };
    }
    
    const body = await req.json();
    const term = await createTerm({ academicCourseId: academicCourseId as string, createTermDto: body });

    return {
      status: true,
      statusCode: 201,
      message: "Term created successfully",
      data: term,
    };
  } catch (error) {
    console.error('Error creating term:', error);
    return {
      status: false,
      statusCode: 500,
      message: "Internal Server Error",
    };
  }
});

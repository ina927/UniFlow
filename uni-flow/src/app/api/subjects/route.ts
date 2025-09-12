import { NextRequest } from "next/server";

import { withDB } from "@/shared";
import { getSubjects, createSubject } from "@/entities/academics/services";

export const GET = withDB(async (req: NextRequest) => {
  try {
    const academicCourseId = req.headers.get('academic-course-id');

    if (!academicCourseId) {
      return {
        status: false,
        statusCode: 400,
        message: "Academic course ID is required",
      };
    }

    const termId = req.nextUrl.searchParams.get('term-id');

    const subjects = await getSubjects({ academicCourseId: academicCourseId as string, termId: termId as string });

    if (subjects.data.length === 0) {
      return {
        status: false,
        statusCode: 404,
        message: "Subjects not found",
      };
    }
    
    return {
      status: true,
      statusCode: 200,
      message: "Subjects fetched successfully",
      data: subjects,
    };
  } catch (error) {
    console.error('Error fetching subjects:', error);
    return {
      status: false,
      statusCode: 500,
      message: "Internal Server Error",
    };
  }
});

export const POST = withDB(async (req: NextRequest) => {
  try {
    const termId = req.headers.get('term-id');

    if (!termId) {
      return {
        status: false,
        statusCode: 400,
        message: "Term ID is required",
      };
    }
    
    const body = await req.json();
    const subject = await createSubject({ termId: termId as string, dto: body });

    return {
      status: true,
      statusCode: 201,
      message: "Subject created successfully",
      data: subject,
    };
  } catch (error) {
    console.error('Error creating subject:', error);
    return {
      status: false,
      statusCode: 500,
      message: "Internal Server Error",
    };
  }
});

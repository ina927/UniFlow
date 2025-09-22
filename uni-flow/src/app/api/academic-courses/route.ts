import { NextRequest } from "next/server";

import { createAcademicCourse, getAcademicCourses } from "@/entities/academics";
import { createSuccess, getSuccess, missingError, ResponseDto, serverError, withDB } from "@/shared";

export const GET = withDB(async (req: NextRequest) => {
  try {
    const userId: string = req.headers.get('user-id') as string;

    if (!userId) {
      return missingError("User ID");
    }

    const academicCourses = await getAcademicCourses({ userId });
    
    return getSuccess(academicCourses, "Academic courses");
  } catch (error) {
    return serverError(error as ResponseDto);
  }
});

export const POST = withDB(async (req: NextRequest) => {
  try {
    const userId: string = req.headers.get('user-id') as string;
    const body = await req.json();
    const academicCourse = await createAcademicCourse({ userId, dto: body });

    return createSuccess(academicCourse, "Academic course");
  } catch (error) {
    return serverError(error as ResponseDto);
  }
});

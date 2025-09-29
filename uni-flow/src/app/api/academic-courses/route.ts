import { NextRequest } from "next/server";

import { createAcademicCourse, getAcademicCourses } from "@/entities/academics";
import { createSuccess, getSuccess, missingError, controller } from "@/shared";

export const GET = controller(async (req: NextRequest) => {
  const userId = req.headers.get('user-id');

  if (!userId) {
    return missingError("User ID");
  }

  const academicCourses = await getAcademicCourses({ userId });

  return getSuccess(academicCourses, "Academic courses");
});

export const POST = controller(async (req: NextRequest) => {
  const userId = req.headers.get('user-id');

    if (!userId) {
      return missingError("User ID");
    }

  const body = await req.json();
  const academicCourse = await createAcademicCourse({ userId, dto: body });

  return createSuccess(academicCourse, "Academic course");
});

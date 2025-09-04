import { NextRequest } from "next/server";

import { createAcademicCourse, getAcademicCourses } from "@/entities/academics";
import { withDB } from "@/shared";

export const GET = withDB(async (req: NextRequest) => {
  try {
    const academicCourses = await getAcademicCourses();
    
    return {
      status: 200,
      data: academicCourses,
    };
  } catch (error) {
    console.error('Error fetching academic courses:', error);
    return {
      status: 500,
      data: "Internal Server Error",
    };
  }
});

export const POST = withDB(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const academicCourse = await createAcademicCourse(body);

    return {
      status: 201,
      data: academicCourse,
    };
  } catch (error) {
    console.error('Error creating academic course:', error);
    return {
      status: 500,
      data: "Internal Server Error",
    };
  }
});

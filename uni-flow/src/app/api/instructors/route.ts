import { NextRequest } from "next/server";

import { controller, createSuccess, getSuccess, missingError, notFoundError } from "@/shared";
import { getInstructors, createInstructor } from "@/entities/academics/services";
import { CreateInstructorDto } from "@/entities";

export const GET = controller(async (req: NextRequest) => {
  const userId: string = req.headers.get('user-id') as string;

  if (!userId) {
    return missingError("User ID");
  }

  const subjectId = req.nextUrl.searchParams.get('subject-id') as string;

  if (!subjectId) {
    return missingError("Subject ID");
  }
  
  const instructors = await getInstructors({ subjectId });

  if (instructors.data.length === 0) {
    return notFoundError("Instructor");
  }
  
  return getSuccess(instructors, "Instructor");
});

export const POST = controller(async (req: NextRequest) => {
  const userId: string = req.headers.get('user-id') as string;

  if (!userId) {
    return missingError("User ID");
  }

  const body: CreateInstructorDto = await req.json();
  const instructor = await createInstructor({ dto: body });

  return createSuccess(instructor, "Instructor");
});

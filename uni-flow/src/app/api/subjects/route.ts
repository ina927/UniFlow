import { NextRequest } from "next/server";

import { controller, createSuccess, getSuccess, missingError, notFoundError } from "@/shared";
import { getSubjects, createSubject } from "@/entities/academics/services";

export const GET = controller(async (req: NextRequest) => {
  const academicCourseId = req.headers.get('academic-course-id');

  if (!academicCourseId) {
    return missingError("Academic course ID");
  }

  const termId = req.nextUrl.searchParams.get('term-id');

  const subjects = await getSubjects({ academicCourseId: academicCourseId as string, termId: termId as string });

  if (subjects.data.length === 0) {
    return notFoundError("Subjects");
  }
  
  return getSuccess(subjects, "Subjects");
});

export const POST = controller(async (req: NextRequest) => {
  const termId = req.headers.get('term-id');

  if (!termId) {
    return missingError("Term ID");
  }
  
  const body = await req.json();
  const subject = await createSubject({ termId: termId as string, dto: body });

  return createSuccess(subject, "Subject");
});

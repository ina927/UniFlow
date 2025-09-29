import { NextRequest } from "next/server";
import { controller, createSuccess, getSuccess, missingError, notFoundError } from "@/shared";
import { getTerms, createTerm } from "@/entities/academics/services";

export const GET = controller(async (req: NextRequest) => {
  const userId: string = req.headers.get('user-id') as string;

  if (!userId) {
    return missingError("User ID");
  }

  const academicCourseId = req.nextUrl.searchParams.get('academic-course-id');

  if (!academicCourseId) {
    return missingError("Academic course ID");
  }

  const terms = await getTerms({ academicCourseId: academicCourseId as string });

  if (terms.data.length === 0) {
    return notFoundError("Terms");
  }
  
  return getSuccess(terms, "Terms");
});

export const POST = controller(async (req: NextRequest) => {
  const userId: string = req.headers.get('user-id') as string;

  if (!userId) {
    return missingError("User ID");
  }

  const academicCourseId = req.headers.get('academic-course-id');

  if (!academicCourseId) {
    return missingError("Academic course ID");
  }
  
  const body = await req.json();
  const term = await createTerm({ academicCourseId: academicCourseId as string, createTermDto: body });

  return createSuccess(term, "Term");
});

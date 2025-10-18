import { NextRequest } from "next/server";
import { controller, createSuccess, getSuccess, missingError, notFoundError } from "@/shared";
import { getTerms, createTerm } from "@/entities/academics/services";
import { CreateTermDto } from "@/entities/academics/dto";

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

  if (!body.title) {
    return missingError("Title");
  }

  if (!body.academicYear) {
    return missingError("Academic year");
  }

  if (!body.startDate) {
    return missingError("Start date");
  }

  if (!body.endDate) {
    return missingError("End date");
  }

  const academicYear = Number(body.academicYear);
  const startDate = new Date(body.startDate);
  const endDate = new Date(body.endDate);

  const createTermDto: CreateTermDto = {
    title: body.title,
    academicYear,
    startDate,
    endDate
  };

  const term = await createTerm({ 
    academicCourseId: academicCourseId as string, 
    createTermDto 
  });

  return createSuccess(term, "Term");
});

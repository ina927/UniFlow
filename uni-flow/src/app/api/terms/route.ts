import { NextRequest } from "next/server";
import { withDB } from "@/shared";
import { getTerms, createTerm } from "@/entities/academics/services";

export const GET = withDB(async (req: NextRequest) => {
  try {
    const academicCourseId = req.nextUrl.searchParams.get('academicCourseId');
    const terms = await getTerms(academicCourseId as string);
    
    return {
      status: 200,
      data: terms,
    };
  } catch (error) {
    console.error('Error fetching terms:', error);
    return {
      status: 500,
      data: "Internal Server Error",
    };
  }
});

export const POST = withDB(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const term = await createTerm(body);

    return {
      status: 201,
      data: term,
    };
  } catch (error) {
    console.error('Error creating term:', error);
    return {
      status: 500,
      data: "Internal Server Error",
    };
  }
});

import { NextRequest } from "next/server";

import { ResponseDto, withDB } from "@/shared/api";
import { UpdateAcademicCourseDto } from "@/entities";
import { deleteAcademicCourse, getAcademicCourse, updateAcademicCourse } from "@/entities/academics/services";
import { deleteSuccess, getSuccess, missingError, notFoundError, serverError, updateSuccess } from "@/shared";

export const GET = withDB(async (req: NextRequest) => {
  try {
    const userId: string = req.headers.get('user-id') as string;

    if (!userId) {
      return missingError("User ID");
    }

    const academicCourseId = req.nextUrl.href.split('/').pop();

    if (!academicCourseId) {
      return missingError("Academic course ID");
    }

    const academicCourse = await getAcademicCourse({ id: academicCourseId });

    if (!academicCourse.data) {
      return notFoundError("Academic course");
    }
    
    return getSuccess(academicCourse, "Academic course");
  } catch (error) {
    return serverError(error as ResponseDto);
  }
});

export const PATCH = withDB(async (req: NextRequest) => {
  try {
    const userId: string = req.headers.get('user-id') as string;

    if (!userId) {
      return missingError("User ID");
    }

    const academicCourseId = req.nextUrl.href.split('/').pop();

    if (!academicCourseId) {
      return missingError("Academic course ID");
    }

    const body: UpdateAcademicCourseDto = await req.json();
    const academicCourse = await updateAcademicCourse({ id: academicCourseId, dto: body });

    return updateSuccess(academicCourse, "Academic course");
  } catch (error) {
    return serverError(error as ResponseDto);
  }
});

export const DELETE = withDB(async (req: NextRequest) => {
  try {
    const userId: string = req.headers.get('user-id') as string;

    if (!userId) {
      return missingError("User ID");
    }
    
    const academicCourseId = req.nextUrl.href.split('/').pop();

    if (!academicCourseId) {
      return missingError("Academic course ID");
    }

    const deletedAcademicCourse = await deleteAcademicCourse({ id: academicCourseId });  

    return deleteSuccess(deletedAcademicCourse.data, "Academic course");
  } catch (error) {
    return serverError(error as ResponseDto);
  }
});

import { NextRequest } from "next/server";

import { withDB } from "@/shared/api";
import { UpdateAcademicCourseDto } from "@/entities";
import { deleteAcademicCourse, getAcademicCourse, updateAcademicCourse } from "@/entities/academics/services";

export const GET = withDB(async (req: NextRequest) => {
  try {
    const userId: string = req.headers.get('user-id') as string;

    if (!userId) {
      return {
        status: false,
        statusCode: 400,
        message: "User ID is required",
      };
    }

    const academicCourseId = req.nextUrl.href.split('/').pop();

    if (!academicCourseId) {
      return {
        status: false,
        statusCode: 400,
        message: "Academic course ID is required",
      };
    }

    const academicCourse = await getAcademicCourse({ id: academicCourseId });
    
    return {
      status: true,
      statusCode: 200,
      message: "Academic course fetched successfully",
      data: academicCourse,
    };
  } catch (error) {
    console.error('Error fetching academic course:', error);
    return {
      status: false,
      statusCode: 500,
      message: "Internal Server Error",
    };
  }
});

export const PATCH = withDB(async (req: NextRequest) => {
  try {
    const userId: string = req.headers.get('user-id') as string;

    if (!userId) {
      return {
        status: false,
        statusCode: 400,
        message: "User ID is required",
      };
    }

    const academicCourseId = req.nextUrl.href.split('/').pop();

    if (!academicCourseId) {
      return {
        status: false,
        statusCode: 400,
        message: "Academic course ID is required",
      };
    }

    const body: UpdateAcademicCourseDto = await req.json();
    const academicCourse = await updateAcademicCourse({ id: academicCourseId, dto: body });

    return {
      status: true,
      statusCode: 200,
      message: "Academic course updated successfully",
      data: academicCourse,
    };
  } catch (error) {
    console.error('Error updating academic course:', error);
    return {
      status: false,
      statusCode: 500,
      message: "Internal Server Error",
    };
  }
});

export const DELETE = withDB(async (req: NextRequest) => {
  try {
    const userId: string = req.headers.get('user-id') as string;

    if (!userId) {
      return {
        status: false,
        statusCode: 400,
        message: "User ID is required",
      };
    }
    
    const academicCourseId = req.nextUrl.href.split('/').pop();

    if (!academicCourseId) {
      return {
        status: false,
        statusCode: 400,
        message: "Academic course ID is required",
      };
    }

    const deletedAcademicCourseId = await deleteAcademicCourse({ id: academicCourseId });  

    return {
      status: true,
      statusCode: 200,
      message: "Academic course deleted successfully",
      data: deletedAcademicCourseId,
    };
  } catch (error) {
    console.error('Error deleting academic course:', error);
    return {
      status: false,
      statusCode: 500,
      message: "Internal Server Error",
    };
  }
});

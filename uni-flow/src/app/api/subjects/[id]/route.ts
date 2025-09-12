import { NextRequest } from "next/server";

import { withDB } from "@/shared/api";
import { UpdateSubjectDto } from "@/entities";
import { deleteSubject, getSubject, updateSubject } from "@/entities/academics/services";

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

    const subjectId = req.nextUrl.href.split('/').pop();

    if (!subjectId) {
      return {
        status: false,
        statusCode: 400,
        message: "Subject ID is required",
      };
    }

    const subject = await getSubject({ id: subjectId });
    
    return {
      status: true,
      statusCode: 200,
      message: "Subject fetched successfully",
      data: subject,
    };
  } catch (error) {
    console.error('Error fetching subject:', error);
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

    const subjectId = req.nextUrl.href.split('/').pop();

    if (!subjectId) {
      return {
        status: false,
        statusCode: 400,
        message: "Subject ID is required",
      };
    }

    const body: UpdateSubjectDto = await req.json();
    const subject = await updateSubject({ id: subjectId, dto: body });

    return {
      status: true,
      statusCode: 200,
      message: "Subject updated successfully",
      data: subject,
    };
  } catch (error) {
    console.error('Error updating subject:', error);
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
    
    const subjectId = req.nextUrl.href.split('/').pop();

    if (!subjectId) {
      return {
        status: false,
        statusCode: 400,
        message: "Subject ID is required",
      };
    }

    const deletedSubjectId = await deleteSubject({ id: subjectId });  

    return {
      status: true,
      statusCode: 200,
      message: "Subject deleted successfully",
      data: deletedSubjectId,
    };
  } catch (error) {
    console.error('Error deleting subject:', error);
    return {
      status: false,
      statusCode: 500,
      message: "Internal Server Error",
    };
  }
});

import { NextRequest } from "next/server";

import { withDB } from "@/shared/api";
import { UpdateInstructorDto } from "@/entities";
import { deleteInstructor, getInstructor, updateInstructor } from "@/entities/academics/services";

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
    
    const instructorId = req.nextUrl.href.split('/').pop();

    if (!instructorId) {
      return {
        status: false,
        statusCode: 400,
        message: "Instructor ID is required",
      };
    }

    const instructor = await getInstructor({ id: instructorId });
    
    return {
      status: true,
      statusCode: 200,
      message: "Instructor fetched successfully",
      data: instructor,
    };
  } catch (error) {
    console.error('Error fetching instructor:', error);
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

    const instructorId = req.nextUrl.href.split('/').pop();

    if (!instructorId) {
      return {
        status: false,
        statusCode: 400,
        message: "Instructor ID is required",
      };
    }

    const body: UpdateInstructorDto = await req.json();
    const instructor = await updateInstructor({ id: instructorId, dto: body });

    return {
      status: true,
      statusCode: 200,
      message: "Instructor updated successfully",
      data: instructor,
    };
  } catch (error) {
    console.error('Error updating instructor:', error);
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
    
    const instructorId = req.nextUrl.href.split('/').pop();

    if (!instructorId) {
      return {
        status: false,
        statusCode: 400,
        message: "Instructor ID is required",
      };
    }

    const deletedInstructorId = await deleteInstructor({ id: instructorId });  

    return {
      status: true,
      statusCode: 200,
      message: "Instructor deleted successfully",
      data: deletedInstructorId,
    };
  } catch (error) {
    console.error('Error deleting instructor:', error);
    return {
      status: false,
      statusCode: 500,
      message: "Internal Server Error",
    };
  }
});

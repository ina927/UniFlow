import { NextRequest } from "next/server";

import { withDB } from "@/shared/api";
import { UpdateTermDto } from "@/entities";
import { deleteTerm, getTerm, updateTerm } from "@/entities/academics/services";

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
    
    const termId = req.nextUrl.href.split('/').pop();

    if (!termId) {
      return {
        status: false,
        statusCode: 400,
        message: "Term ID is required",
      };
    }

    const term = await getTerm({ id: termId });
    
    return {
      status: true,
      statusCode: 200,
      message: "Term fetched successfully",
      data: term,
    };
  } catch (error) {
    console.error('Error fetching term:', error);
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

    const termId = req.nextUrl.href.split('/').pop();

    if (!termId) {
      return {
        status: false,
        statusCode: 400,
        message: "Term ID is required",
      };
    }

    const body: UpdateTermDto = await req.json();
    const term = await updateTerm({ id: termId, dto: body });

    return {
      status: true,
      statusCode: 200,
      message: "Term updated successfully",
      data: term,
    };
  } catch (error) {
    console.error('Error updating term:', error);
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
    
    const termId = req.nextUrl.href.split('/').pop();

    if (!termId) {
      return {
        status: false,
        statusCode: 400,
        message: "Term ID is required",
      };
    }

    const deletedTermId = await deleteTerm({ id: termId });  

    return {
      status: true,
      statusCode: 200,
      message: "Term deleted successfully",
      data: deletedTermId,
    };
  } catch (error) {
    console.error('Error deleting term:', error);
    return {
      status: false,
      statusCode: 500,
      message: "Internal Server Error",
    };
  }
});

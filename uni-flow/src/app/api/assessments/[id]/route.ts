// src/app/api/assessments/[id]/route.ts
import { NextRequest } from "next/server";
import { withDB } from "@/shared/api/middlewares/with-db";
import { ApiParams } from "@/shared/api/models";
import {
  getAssessment,
  updateAssessment,
  deleteAssessment,
} from "@/entities/assessments/services/assessment.service";

async function getId(ctx?: ApiParams): Promise<string | undefined> {
  const p = ctx?.params;
  const obj = p ? await p : undefined;
  return obj?.id;
}

/**
 * GET /api/assessments/[id]
 * Returns a single assessment by id.
 */
export const GET = withDB(async (_req: NextRequest, ctx?: ApiParams) => {
  try {
    const id = await getId(ctx);
    if (!id) {
      return {
        status: false,
        statusCode: 400,
        message: "id is required",
      };
    }

    const data = await getAssessment(id);
    if (!data) {
      return {
        status: false,
        statusCode: 404,
        message: "Assessment not found",
      };
    }

    return {
      status: true,
      statusCode: 200,
      message: "Assessment fetched successfully",
      data,
    };
  } catch (error) {
    console.error("Error fetching assessment:", error);
    return {
      status: false,
      statusCode: 500,
      message: "Internal Server Error",
    };
  }
});

/**
 * PATCH /api/assessments/[id]
 * Body: Partial<UpdateAssessmentDto>
 * Updates an existing assessment.
 */
export const PATCH = withDB(async (req: NextRequest, ctx?: ApiParams) => {
  try {
    const id = await getId(ctx);
    if (!id) {
      return {
        status: false,
        statusCode: 400,
        message: "id is required",
      };
    }

    const dto = await req.json();
    if (!dto || typeof dto !== "object") {
      return {
        status: false,
        statusCode: 400,
        message: "Invalid body",
      };
    }

    const data = await updateAssessment({ id, dto });

    return {
      status: true,
      statusCode: 200,
      message: "Assessment updated successfully",
      data,
    };
  } catch (error) {
    console.error("Error updating assessment:", error);
    return {
      status: false,
      statusCode: 500,
      message: "Internal Server Error",
    };
  }
});

/**
 * DELETE /api/assessments/[id]
 * Deletes an assessment by id.
 */
export const DELETE = withDB(async (_req: NextRequest, ctx?: ApiParams) => {
  try {
    const id = await getId(ctx);
    if (!id) {
      return {
        status: false,
        statusCode: 400,
        message: "id is required",
      };
    }

    const data = await deleteAssessment(id);

    return {
      status: true,
      statusCode: 200,
      message: "Assessment deleted successfully",
      data,
    };
  } catch (error) {
    console.error("Error deleting assessment:", error);
    return {
      status: false,
      statusCode: 500,
      message: "Internal Server Error",
    };
  }
});

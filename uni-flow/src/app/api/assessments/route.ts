import { NextRequest } from "next/server";
import { withDB } from "@/shared"; // same pattern as academic-courses route
import { listAssessments, createAssessment } from "@/entities/assessments/services/assessment.service";
import { CreateAssessmentDto } from "@/entities/assessments";

/**
 * GET /api/assessments?subjectId=...
 * Returns the list of assessments for a given subject.
 */
export const GET = withDB(async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const subjectId = searchParams.get("subjectId");
    if (!subjectId) {
      return {
        status: false,
        statusCode: 400,
        message: "subjectId is required",
      };
    }

    const data = await listAssessments({ subjectId });

    return {
      status: true,
      statusCode: 200,
      message: "Assessments fetched successfully",
      data,
    };
  } catch (error) {
    console.error("Error fetching assessments:", error);
    return {
      status: false,
      statusCode: 500,
      message: "Internal Server Error",
    };
  }
});

/**
 * POST /api/assessments
 * Body: CreateAssessmentDto
 * Creates a new assessment for a subject.
 */
export const POST = withDB(async (req: NextRequest) => {
  try {
    const body = (await req.json()) as CreateAssessmentDto;

    // Minimal validation (Prisma requires dueDate, and we need core fields)
    if (!body?.subjectId || !body?.title || !body?.type) {
      return {
        status: false,
        statusCode: 400,
        message: "subjectId, title and type are required",
      };
    }
    if (body.dueDate == null) {
      return {
        status: false,
        statusCode: 400,
        message: "dueDate is required",
      };
    }
    if (typeof body.weight !== "number" || typeof body.maxScore !== "number") {
      return {
        status: false,
        statusCode: 400,
        message: "weight and maxScore must be numbers",
      };
    }

    const created = await createAssessment({ dto: body });

    return {
      status: true,
      statusCode: 201,
      message: "Assessment created successfully",
      data: created,
    };
  } catch (error) {
    console.error("Error creating assessment:", error);
    return {
      status: false,
      statusCode: 500,
      message: "Internal Server Error",
    };
  }
});

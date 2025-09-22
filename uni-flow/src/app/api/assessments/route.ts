import { NextRequest } from "next/server";
import { createSuccess, getSuccess, missingError, notFoundError, ResponseDto, serverError, withDB } from "@/shared"; // same pattern as academic-courses route
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
      return missingError("subjectId");
    }

    const data = await listAssessments({ subjectId });

    if (data.length === 0) {
      return notFoundError("Assessments");
    }

    return getSuccess(data, "Assessments");
  } catch (error) {
    return serverError(error as ResponseDto);
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
      return missingError("subjectId | title | type");
    }

    if (body.dueDate == null) {
      return missingError("dueDate");
    }

    if (typeof body.weight !== "number" || typeof body.maxScore !== "number") {
      return missingError("weight | maxScore");
    }

    const created = await createAssessment({ dto: body });

    return createSuccess(created, "Assessment");
  } catch (error) {
    return serverError(error as ResponseDto);
  }
});

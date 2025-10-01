import { NextRequest } from "next/server";
import { missingError, ResponseDto, serverError, updateSuccess, controller } from "@/shared";
import { enterScore } from "@/entities/assessments/services/assessment.service";
import type { EnterScoreDto } from "@/entities/assessments";

/**
 * PATCH /api/assessments/score
 * Updates or clears the score for a specific assessment.
 */
export const PATCH = controller(async (req: NextRequest) => {
  try {
    const body = (await req.json()) as EnterScoreDto & { score: number | null };

    if (!body?.assessmentId) {
      return missingError("assessmentId");
    }

    // score can be a number or null (to clear score)
    if (body.score !== null && typeof body.score !== "number") {
      return missingError("score");
    }

    const updated = await enterScore({ dto: body });

    return updateSuccess(updated, "Score");
  } catch (error) {
    return serverError(error as ResponseDto);
  }
});

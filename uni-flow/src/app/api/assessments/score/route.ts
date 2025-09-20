import { NextRequest } from "next/server";
import { withDB } from "@/shared";
import { enterScore } from "@/entities/assessments/services/assessment.service";
import type { EnterScoreDto } from "@/entities/assessments";

/**
 * PATCH /api/assessments/score
 * Updates or clears the score for a specific assessment.
 */
export const PATCH = withDB(async (req: NextRequest) => {
  try {
    const body = (await req.json()) as EnterScoreDto & { score: number | null };

    if (!body?.assessmentId) {
      return {
        status: false,
        statusCode: 400,
        message: "assessmentId is required",
      };
    }

    // score can be a number or null (to clear score)
    if (body.score !== null && typeof body.score !== "number") {
      return {
        status: false,
        statusCode: 400,
        message: "score must be a number or null",
      };
    }

    const updated = await enterScore({ dto: body });

    return {
      status: true,
      statusCode: 200,
      message: "Score updated successfully",
      data: updated,
    };
  } catch (error) {
    console.error("Error updating score:", error);
    return {
      status: false,
      statusCode: 500,
      message: "Internal Server Error",
    };
  }
});

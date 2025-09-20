import { NextRequest } from "next/server";
import { withDB } from "@/shared/api";
import { getSubjectDetailById } from "@/entities/academics/services/subject.service";

export const GET = withDB(async (req: NextRequest) => {
  try {
    const userId = req.headers.get("user-id") as string;
    if (!userId) {
      return { status: false, statusCode: 400, message: "User ID is required" };
    }

    // IMPORTANT: for /api/subjects/:id/detail, the id is the second-last segment
    const segments = req.nextUrl.pathname.split("/");
    const subjectId = segments.slice(-2)[0];

    if (!subjectId) {
      return { status: false, statusCode: 400, message: "Subject ID is required" };
    }

    const subject = await getSubjectDetailById(subjectId);
    if (!subject) {
      return { status: false, statusCode: 404, message: "Subject not found" };
    }

    return {
      status: true,
      statusCode: 200,
      message: "Subject detail fetched successfully",
      data: subject,
    };
  } catch (error) {
    console.error("Error fetching subject detail:", error);
    return { status: false, statusCode: 500, message: "Internal Server Error" };
  }
});

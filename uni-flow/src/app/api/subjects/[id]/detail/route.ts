import { NextRequest } from "next/server";
import { controller } from "@/shared/api";
import { getSubjectDetailById } from "@/entities/academics/services/subject.service";
import { getSuccess, missingError } from "@/shared";

export const GET = controller(async (req: NextRequest) => {
  const userId = req.headers.get("user-id") as string;
  if (!userId) {
    return missingError("User ID");
  }

  // IMPORTANT: for /api/subjects/:id/detail, the id is the second-last segment
  const segments = req.nextUrl.pathname.split("/");
  const subjectId = segments.slice(-2)[0];

  if (!subjectId) {
    return missingError("Subject ID");
  }

  const subject = await getSubjectDetailById(subjectId);
  if (!subject) {
    return missingError("Subject not found");
  }

  return getSuccess(subject, "Subject detail");
});

import { useQuery } from "@tanstack/react-query";
import { getSubjectDetail } from "../apis/subject.api";
import type { SubjectDetail } from "@/entities";

export function useSubjectDetailQuery(subjectId: string) {
  return useQuery<SubjectDetail | null>({
    queryKey: ["subject-detail", subjectId],
    enabled: !!subjectId,
    queryFn: () => getSubjectDetail(subjectId),
    initialData: null,
  });
}
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAssessments, createAssessmentApi, enterScoreApi } from "../apis/assessment.api";
import type { Assessment } from "@/entities/assessments";
import { EnterScoreDto, CreateAssessmentDto } from "@/entities/assessments";

export function useAssessmentsQuery(subjectId: string) {
  return useQuery<Assessment[]>({
    queryKey: ["assessments", subjectId],
    enabled: !!subjectId,
    queryFn: async () => {
      const list = await getAssessments(subjectId);
      return list ?? [];
    },
    initialData: [],
  });
}

export function useCreateAssessment(subjectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateAssessmentDto) => createAssessmentApi(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["assessments", subjectId] }),
  });
}

export function useEnterScore(subjectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: EnterScoreDto & { score: number | null }) => enterScoreApi(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["assessments", subjectId] }),
  });
}

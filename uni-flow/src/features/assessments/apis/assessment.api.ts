import { apiClient } from "@/shared/api";
import type { Assessment, EnterScoreDto, CreateAssessmentDto } from "@/entities/assessments";

export const getAssessments = async (subjectId: string): Promise<Assessment[]> => {
  const res = await apiClient.get(`/api/assessments?subjectId=${subjectId}`);
  const data = res?.data?.data as Assessment[] | undefined;
  return Array.isArray(data) ? data : [];
};

export const createAssessmentApi = async (dto: CreateAssessmentDto) => {
  const res = await apiClient.post("/api/assessments", dto);
  return res.data.data as Assessment;
};

export const enterScoreApi = async (dto: { assessmentId: string; score: number | null }) => {
  const res = await apiClient.patch("/api/assessments/score", dto);
  return res.data.data as Assessment;
};
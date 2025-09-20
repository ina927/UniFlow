import { apiClient } from "@/shared/api";
import type { Assessment, CreateAssessmentDto, UpdateAssessmentDto } from "@/entities/assessments";

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

export const getAssessment = async (id: string): Promise<Assessment | null> => {
  const res = await apiClient.get(`/api/assessments/${id}`);
  return res?.data?.data ?? null;
};

export const updateAssessmentApi = async (id: string, dto: CreateAssessmentDto): Promise<Assessment> => {
  const res = await apiClient.patch(`/api/assessments/${id}`, dto);
  return res.data.data as Assessment;
};

export const deleteAssessmentApi = async (id: string): Promise<{ id: string }> => {
  const res = await apiClient.delete(`/api/assessments/${id}`);
  return res.data.data as { id: string };
};
import { apiClient } from "@/shared/api";
import type { Assessment } from "@/entities/assessments/entities";
import type { CreateAssessmentDto, UpdateAssessmentDto } from "@/entities/assessments/dto";
import { ASSESSMENTS_API, SCORE_API } from "../const";

export const getAssessments = async (subjectId: string): Promise<Assessment[]> => {
  const res = await apiClient.get(`${ASSESSMENTS_API}?subjectId=${subjectId}`);
  console.log(res);
  const data = res?.data as Assessment[] | undefined;
  return Array.isArray(data) ? data : [];
};

export const createAssessmentApi = async (dto: CreateAssessmentDto) => {
  const res = await apiClient.post(`${ASSESSMENTS_API}`, dto);
  return res.data as Assessment;
};

export const enterScoreApi = async (dto: { assessmentId: string; score: number | null }) => {
  const res = await apiClient.patch(`${SCORE_API}`, dto);
  return res.data as Assessment;
};

export const getAssessment = async (id: string): Promise<Assessment | null> => {
  const res = await apiClient.get(`${ASSESSMENTS_API}/${id}`);
  return res?.data ?? null;
};

export const updateAssessmentApi = async (id: string, dto: UpdateAssessmentDto): Promise<Assessment> => {
  const res = await apiClient.patch(`${ASSESSMENTS_API}/${id}`, dto);
  return res.data as Assessment;
};

export const deleteAssessmentApi = async (id: string): Promise<{ id: string }> => {
  const res = await apiClient.delete(`${ASSESSMENTS_API}/${id}`);
  return res.data as { id: string };
};

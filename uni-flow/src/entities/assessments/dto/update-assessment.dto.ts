import type { AssessmentType } from "../enums/AssessmentType";

export interface UpdateAssessmentDto {
  title?: string;
  type?: AssessmentType;
  weight?: number;
  maxScore?: number;
  dueDate?: string;
  score?: number | null;
  gradedDate?: string;
  description?: string;
}
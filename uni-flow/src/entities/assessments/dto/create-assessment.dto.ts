import type { AssessmentType } from "../enums/AssessmentType";

export interface CreateAssessmentDto {
  subjectId: string;
  title: string;
  type: AssessmentType;
  weight: number;
  maxScore: number;
  dueDate?: string;
  description?: string;
}
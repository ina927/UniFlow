import type { AssessmentType } from "../enums/AssessmentType";

export type UpdateAssessmentDto = Partial<{
  title: string;
  type: AssessmentType;
  weight: number;
  maxScore: number;
  dueDate: string;
  description: string;
}>;
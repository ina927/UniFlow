export type CreateSubjectDto = {
  termId: string;
  title: string;
  code: string;
  credits: number;
  coordinatorId?: string;
  labTutorId?: string;
  goalGrade?: number;
  actualGrade?: number;
};

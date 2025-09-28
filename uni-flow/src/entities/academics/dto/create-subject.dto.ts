export type CreateSubjectDto = {
  termId: string;
  title: string;
  code: string;
  credits: number;
  coordinatorName?: string;
  coordinatorEmail?: string;
  labTutorName?: string;
  labTutorEmail?: string;
  goalGrade?: number;
  actualGrade?: number;
};

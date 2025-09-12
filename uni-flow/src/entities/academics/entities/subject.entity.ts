export interface SubjectEntity {
  id: string;
  termId: string;
  title: string;
  code: string;
  credits: number;
  coordinatorId?: string | null;
  labTutorId?: string | null;
  goalGrade?: number | null;
  actualGrade?: number | null;
  createdAt: Date;
  updatedAt: Date;
  version: number;
}

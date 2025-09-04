export interface SubjectEntity {
  id: number;
  termId: number;
  title: string;
  code: string;
  credits: number;
  coordinatorId?: number;
  labTutorId?: number;
  goalGrade?: number;
  actualGrade?: number;
}

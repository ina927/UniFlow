import type { AssessmentType } from "../enums/AssessmentType";

export interface Assessment {
  id: string;                
  subjectId: string;          
  title: string;
  type: AssessmentType;               
  weight: number;             
  dueDate?: string;          
  maxScore: number;           
  score?: number | null;     
  gradedDate?: string;        
  description?: string;
}

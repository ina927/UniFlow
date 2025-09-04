import { Subject } from "@/shared";
import { SubjectEntity } from "../entities/subject.entity";

export const getSubjects = async (selectedTermId: string): Promise<{ data: SubjectEntity[] }> => {
  if (!selectedTermId) {
    return { data: [] };
  }
  
  const subjects = await Subject.find({ termId: selectedTermId });
  return { data: subjects };
};

import { Term } from "@/shared";
import { TermEntity } from "../entities/term.entity";

export const getTerms = async (academicCourseId: string): Promise<{ data: TermEntity[] }> => {
  if (!academicCourseId) {
    return { data: [] };
  }
  
  const terms = await Term.find({ academicCourseId });
  return { data: terms };
};

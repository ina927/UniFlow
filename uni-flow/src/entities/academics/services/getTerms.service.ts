import { Term } from "@/shared";

export const getTerms = async (academicCourseId: string) => {
  const terms = await Term.find({ academicCourseId });
  return terms;
};

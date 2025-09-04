import { Subject } from "@/shared";

export const getSubjects = async (selectedTermId: string) => {
  const subjects = await Subject.find({ termId: selectedTermId });
  return subjects;
};

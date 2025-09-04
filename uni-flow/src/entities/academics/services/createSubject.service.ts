import { CreateSubjectDto } from "../dto/create-subject.dto";
import { Subject } from "@/shared/models";

export const createSubject = async (subject: CreateSubjectDto) => {
  const newSubject = await Subject.create(subject);
  return newSubject;
};

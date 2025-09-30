import { Term } from "@/shared/generated/prisma";

export type SubjectRow = {
  id: string;
  title: string;
  code: string;
  credits: number;
  term: Term;
};

import { TermEntity } from "@/entities";

export type SubjectRow = {
  id: string;
  title: string;
  code: string;
  credits: number;
  term: TermEntity;
};

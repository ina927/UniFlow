import { CreateTermDto } from "../dto/create-term.dto";
import { Term } from "@/shared";

export const createTerm = async (term: CreateTermDto) => {
  const newTerm = await Term.create(term);
  return newTerm;
};
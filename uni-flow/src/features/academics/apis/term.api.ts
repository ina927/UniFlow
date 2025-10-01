import { TERMS_API } from "../const";
import { apiClient } from "@/shared/api";
import { CreateTermDto, UpdateTermDto } from "@/entities";

export const getTerms = async (academicCourseId: string) => {
    return await apiClient.get(`${TERMS_API}?academic-course-id=${academicCourseId}`).then(res => res.data);
};

export const getTerm = async (termId: string) => {
    return await apiClient.get(`${TERMS_API}/${termId}`).then(res => res.data);
};

export const createTerm = async (term: CreateTermDto) => {
    return await apiClient.post(TERMS_API, term).then(res => res.data);
};
    
export const updateTerm = async (termId: string, term: UpdateTermDto) => {
    return await apiClient.patch(`${TERMS_API}/${termId}`, term).then(res => res.data);
};

export const deleteTerm = async (termId: string) => {
    return await apiClient.delete(`${TERMS_API}/${termId}`).then(res => res.data);
};

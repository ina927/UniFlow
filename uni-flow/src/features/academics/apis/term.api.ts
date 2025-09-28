import { TERMS_URL } from "../const";
import { apiClient } from "@/shared/api";

export const getTerms = async (academicCourseId: string) => {
    return await apiClient.get(`${TERMS_URL}?academic-course-id=${academicCourseId}`).then(res => res.data);
};

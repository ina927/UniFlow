import { TERMS_API } from "../const";
import { apiClient } from "@/shared/api";

export const getTerms = async (academicCourseId: string) => {
    return await apiClient.get(`${TERMS_API}?academic-course-id=${academicCourseId}`).then(res => res.data);
};

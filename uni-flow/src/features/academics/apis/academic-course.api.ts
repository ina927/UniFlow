import { ACADEMIC_COURSES_URL } from "../const/url";
import { apiClient } from "@/shared/api";

export const getAcademicCourses = () => {
    return apiClient.get(ACADEMIC_COURSES_URL).then(res => res.data);
};
    
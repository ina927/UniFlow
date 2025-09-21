import { ACADEMIC_COURSES_API } from "../const/api";
import { apiClient } from "@/shared/api";

export const getAcademicCourses = async () => {
    return await apiClient.get(ACADEMIC_COURSES_API).then(res => res.data);
};

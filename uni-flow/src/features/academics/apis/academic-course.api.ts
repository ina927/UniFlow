import { ACADEMIC_COURSES_API } from "../const/api";
import { apiClient } from "@/shared/api";

export const getAcademicCourses = () => {
    return apiClient.get(ACADEMIC_COURSES_API).then(res => res.data);
};
    
export const getAcademicCourse = (id: string) => {
    return apiClient.get(`${ACADEMIC_COURSES_API}/${id}`).then(res => res.data);
};

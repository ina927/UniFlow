import { ACADEMIC_COURSES_API } from "../const/api";
import { apiClient } from "@/shared/api";
import { getUserIdFromStorage } from "@/shared/lib/safe-storage";

export const getAcademicCourses = () => {
    return apiClient.get(`/api${ACADEMIC_COURSES_API}`, {
        headers: {
            "user-id": getUserIdFromStorage(),
        }
    }).then(res => res.data);
};
    
export const getAcademicCourse = (id: string) => {
    return apiClient.get(`/api${ACADEMIC_COURSES_API}/${id}`, {
        headers: {
            "user-id": getUserIdFromStorage(),
        }
    }).then(res => res.data);
};

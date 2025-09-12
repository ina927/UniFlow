import { SUBJECTS_URL } from "../const";
import { apiClient } from "@/shared/api";

export const getSubjects = async (academicCourseId: string, termId?: string) => {
    return await apiClient.get(`${SUBJECTS_URL}&term-id=${termId}`, { headers: { "academic-course-id": academicCourseId } }).then(res => res.data);
};

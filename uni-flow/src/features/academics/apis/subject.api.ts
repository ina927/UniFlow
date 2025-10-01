import { SUBJECTS_API } from "../const";
import { apiClient } from "@/shared/api";
import type { SubjectDetail } from "@/entities";

export const getSubjects = async (academicCourseId: string, termId?: string) => {
    return await apiClient.get(`${SUBJECTS_API}&term-id=${termId}`, { headers: { "academic-course-id": academicCourseId } }).then(res => res.data);
};

export const getSubjectDetail = async (subjectId: string): Promise<SubjectDetail | null> => {
    const res = await apiClient.get(`${SUBJECTS_API}/${subjectId}/detail`, {
        headers: { "user-id": "dev-user-1" },
    });
    const dto = res?.data;
    return dto?.data ?? null;
};
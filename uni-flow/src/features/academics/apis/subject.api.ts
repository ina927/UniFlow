import { Grade } from "@/entities/assessments/enums";
import { SUBJECTS_API } from "../const";
import { apiClient } from "@/shared/api";
import { SubjectDetail } from "@/entities/academics/entities";

export const getSubjects = async (academicCourseId: string, termId?: string) => {
    return await apiClient.get(`${SUBJECTS_API}?term-id=${termId ? termId : ""}`, { headers: { "academic-course-id": academicCourseId } }).then(res => res.data);
};

export const getSubject = async (id: string) => {
    return await apiClient.get(`${SUBJECTS_API}/${id}`).then(res => res.data);
};


export const getSubjectDetail = async (subjectId: string): Promise<SubjectDetail | null> => {
    const res = await apiClient.get(`${SUBJECTS_API}/${subjectId}/detail`, {
        headers: { "user-id": "dev-user-1" },
    });
    const dto = res?.data;
    return dto?.data ?? null;
};

export const updateSubjectGoalGrade = async (subjectId: string, goalGrade: number) => {
    const res = await apiClient.patch(`${SUBJECTS_API}/${subjectId}`, { goalGrade }, {
        headers: { "user-id": "dev-user-1" },
    });
    const dto = res?.data;
    return dto?.data ?? null;
};

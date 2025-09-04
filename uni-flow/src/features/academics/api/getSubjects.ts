import { SUBJECTS_URL } from "../const";

export const getSubjects = async (selectedCourse: string) => {
    return await fetch(`${SUBJECTS_URL}?courseId=${selectedCourse}`).then(res => res.json());
};

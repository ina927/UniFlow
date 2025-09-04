import { TERMS_URL } from "../const";

export const getTerms = async (academicCourseId: string) => {
    return await fetch(`${TERMS_URL}?academicCourseId=${academicCourseId}`).then(res => res.json());
};

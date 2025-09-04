import { ACADEMIC_COURSES_URL } from "../const/url";

export const getAcademicCourses = async () => {
    return await fetch(ACADEMIC_COURSES_URL).then(res => res.json());
};


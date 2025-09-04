import { SUBJECTS_URL } from "../const";

export const getSubjects = async (termId: string) => {
    return await fetch(`${SUBJECTS_URL}?termId=${termId}`).then(res => res.json());
};

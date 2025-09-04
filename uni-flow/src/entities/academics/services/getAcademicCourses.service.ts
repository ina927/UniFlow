import { AcademicCourse } from "@/shared";

export const getAcademicCourses = async () => {
  const academicCourses = await AcademicCourse.find();
  return academicCourses;
};

import { AcademicCourse } from "@/shared/models";
import { CreateAcademicCourseDto } from "../dto/create-academic-course.dto";

export const createAcademicCourse = async (academicCourse: CreateAcademicCourseDto) => {
  const newAcademicCourse = await AcademicCourse.create(academicCourse);
  return newAcademicCourse;
};

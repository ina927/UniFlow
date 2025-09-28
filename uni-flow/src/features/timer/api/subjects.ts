export async function fetchSubjectsForUser(userId: string) {
  // 1. Get academic courses for user
  const academicCoursesRes = await fetch("/api/academic-courses", {
    headers: { "user-id": userId }
  });
  const academicCoursesData = await academicCoursesRes.json();
  const academicCourses = academicCoursesData.data?.data || [];

  // 2. Get subjects for each academic course
  const allSubjects: any[] = [];
  for (const course of academicCourses) {
    const subjectsRes = await fetch("/api/subjects", {
      headers: { "academic-course-id": course.id }
    });
    const subjectsData = await subjectsRes.json();
    if (subjectsData.data?.data) {
      allSubjects.push(...subjectsData.data.data);
    }
  }
  return allSubjects;
}
import { useEffect, useState } from 'react';

import { useAcademicStore, useAuthStore } from '@/shared/stores';

export const useSubjects = () => {
  const [subjects, setSubjects] = useState<{ id: string; title: string }[]>([]);

  const { userId } = useAuthStore();
  const { academicCourseId } = useAcademicStore();

  // Fetch subjects from the backend
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch('/api/subjects', {
          headers: {
            'user-id': userId || '',
            'academic-course-id': academicCourseId || '',
          },
        });
        const data = await response.json();

        console.log('Fetched Subjects:', data); // Debugging log

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch subjects');
        }

        setSubjects(data.data); // Assuming `data.data` contains the list of subjects
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    };

    fetchSubjects();
  }, [userId, academicCourseId]);

  return { subjects };
};

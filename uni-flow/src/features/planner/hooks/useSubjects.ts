import { useEffect, useState } from 'react';

import { useAcademicStore, useUserId } from '@/shared/stores';

export const useSubjects = () => {
  const [subjects, setSubjects] = useState<{ id: string; title: string }[]>([]);

  const userId = useUserId();
  const { academicCourseId } = useAcademicStore();
  // Fetch subjects from the backend
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        if (userId) {
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

          setSubjects(data.data);
        }
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    };

    fetchSubjects();
  }, [userId, academicCourseId]);

  return { subjects };
};

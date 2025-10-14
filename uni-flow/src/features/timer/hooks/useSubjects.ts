import { useState, useEffect } from "react";

export const useSubjects = () => {
  const [subjects, setSubjects] = useState<{ id: string; title: string }[]>([]);

  // Fetch subjects from the backend
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch("/api/subjects", {
          headers: {
            "user-id": "83482f49-8367-48d1-93f0-e98f01010f0f", // Replace with the actual user ID
          },
        });
        const data = await response.json();

        console.log("Fetched Subjects:", data); // Debugging log

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch subjects");
        }

        setSubjects(data.data); // Assuming `data.data` contains the list of subjects
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };

    fetchSubjects();
  }, []);



  return { subjects };
};
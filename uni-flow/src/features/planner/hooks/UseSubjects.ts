// Library
import { useState, useEffect } from "react";
import { useUserId } from "@/shared";

export const useSubjects = () => {
  const [subjects, setSubjects] = useState<{ id: string; title: string }[]>([]);

  const userId = useUserId();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        if (userId){
            const response = await fetch("/api/subjects", {
                headers: {
                  "user-id": userId,
                },
              });
              const data = await response.json();
      
              console.log("Fetched Subjects:", data); // Debugging log
      
              if (!response.ok) {
                throw new Error(data.message || "Failed to fetch subjects");
              }
      
              setSubjects(data.data.data);
        }} catch (error) {
            console.error("Error fetching subjects:", error);
        }
    };

    fetchSubjects();
  }, []);
  
  return { subjects };
};
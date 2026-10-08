import { useEffect, useState } from "react";
import apiClient from "../api/client";
import { studentProfile as mockStudentProfile } from "../data/mockStudent";

// Set VITE_USE_MOCKS=false once Harsh's GET /students/:id is live.
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== "false";

export default function useStudentProfile(studentId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        if (USE_MOCKS) {
          await new Promise((resolve) => setTimeout(resolve, 250));
          if (!cancelled) setData(mockStudentProfile);
        } else {
          const response = await apiClient.get(`/students/${studentId}`);
          if (!cancelled) setData(response.data);
        }
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [studentId]);

  return { data, loading, error };
}

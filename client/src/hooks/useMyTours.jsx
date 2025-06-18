import { useState, useEffect } from "react";
import { fetchAllTours } from "@/utils/fakeMyTours.js"; // Adjust path as needed

export const useMyTours = () => {
  const [tours, setTours] = useState({
    upcoming: [],
    completed: [],
    cancelled: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getTours = async () => {
      try {
        setLoading(true);
        const data = await fetchAllTours();
        setTours(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    getTours();
  }, []);

  return { tours, loading, error };
};
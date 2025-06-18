import { useState, useEffect } from 'react';
import { regions as initialRegions, popularTours as initialPopularTours } from '@/utils/fakeHomePage.js';

/**
 * Custom hook to manage home page data (regions and popular tours).
 * In a real application, this would handle API calls, loading states, and errors.
 */
export const useHomeData = () => {
  const [regions, setRegions] = useState([]);
  const [popularTours, setPopularTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Simulate an API call delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // In a real application, you would fetch data here:
        // const fetchedRegions = await api.get('/regions');
        // const fetchedPopularTours = await api.get('/popular-tours');

        setRegions(initialRegions); // Using hardcoded data for now
        setPopularTours(initialPopularTours); // Using hardcoded data for now
      } catch (err) {
        setError("Failed to load data."); // Set a user-friendly error message
        console.error("Error fetching home data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this effect runs once on mount

  return { regions, popularTours, loading, error };
};
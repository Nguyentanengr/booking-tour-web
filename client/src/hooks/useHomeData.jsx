import { useState, useEffect } from 'react';
import { regions as initialRegions, popularTours as initialPopularTours } from '@/utils/fakeHomePage.js';
import {provinceService} from "@/services/provinceService"; 
import {tourService} from "@/services/tourService"; 


export const useHomeData = () => {
  const [regions, setRegions] = useState([]);
  const [popularTours, setPopularTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await provinceService.getProvincesByRegion();
        // const popularTours = await tourService.getPopularTours();
        setRegions(initialRegions); 
        setPopularTours(initialPopularTours); 
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
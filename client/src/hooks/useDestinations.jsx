import { useState, useEffect } from "react";
import { provinceService } from "@/services/provinceService"; // Import service

export default function useDestinations() {
  const [regions, setRegions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getDestinations = async () => {
      try {
        setIsLoading(true);
        const data = await provinceService.getProvincesByRegion();
        setRegions(data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    getDestinations();
  }, []); // [] đảm bảo chỉ chạy một lần khi component mount

  return { regions, isLoading, error };
}
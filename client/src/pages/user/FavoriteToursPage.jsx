import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Đảm bảo bạn đang sử dụng react-router-dom
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";

import { fetchFavoriteTours } from "@/utils/fakeFavoriteTours.js"; // Import hàm giả lập API
import { TourCard } from "@/components/favorite-tours/TourCard"; // Import component TourCard đã tách
import { EmptyFavorites } from "@/components/favorite-tours/EmptyFavorites"; // Import component EmptyFavorites

export default function FavoriteToursPage() {
  const [favoriteTours, setFavoriteTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getFavoriteTours = async () => {
      try {
        setLoading(true);
        const data = await fetchFavoriteTours();
        setFavoriteTours(data);
      } catch (err) {
        setError("Không thể tải danh sách tour yêu thích.");
        console.error("Error fetching favorite tours:", err);
      } finally {
        setLoading(false);
      }
    };

    getFavoriteTours();
  }, []);

  if (loading) {
    return (
      <div className="container py-8 text-center ">
        <p className="text-lg text-gray-600">Đang tải các tour yêu thích...</p>
        {/* Bạn có thể thêm một spinner loading ở đây */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8 text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container py-8 w-[1400px] mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Heart className="h-6 w-6 text-red-500" />
        <h1 className="text-2xl font-bold">Tour yêu thích</h1>
        <Badge variant="secondary">{favoriteTours.length} tour</Badge>
      </div>

      {favoriteTours.length === 0 ? (
        <EmptyFavorites />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteTours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      )}
    </div>
  );
}
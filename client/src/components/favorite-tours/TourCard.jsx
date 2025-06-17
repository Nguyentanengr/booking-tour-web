// components/TourCard.jsx
import {Link} from "react-router-dom"; // Đảm bảo bạn đang sử dụng react-router-dom
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Star, MapPin, Clock, Plane } from "lucide-react";

export function TourCard({ tour }) {
  // Hàm xử lý khi click nút yêu thích (bạn có thể thêm logic ở đây)
  const handleToggleFavorite = (e) => {
    e.stopPropagation(); // Ngăn chặn sự kiện click lan ra thẻ cha (Link)
    console.log(`Toggle favorite for tour ${tour.id}`);
    // Thêm logic cập nhật trạng thái yêu thích ở đây (gọi API, cập nhật state toàn cục, v.v.)
  };

  return (
    <div key={tour.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="relative h-[200px]">
        {/* Sử dụng thẻ img thông thường */}
        <img
          src={tour.image || "https://via.placeholder.com/400x300?text=No+Image"}
          alt={tour.name}
          className="object-cover w-full h-full"
          loading="lazy" // Thêm lazy loading cho ảnh
        />
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {tour.isPromoted && <Badge className="bg-red-500 text-white">Tiết kiệm</Badge>}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 bg-white/80 hover:bg-white rounded-full"
          onClick={handleToggleFavorite} // Thêm onClick handler
        >
          <Heart className="h-5 w-5 fill-red-500 text-red-500" />
        </Button>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{tour.name}</h3>
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin size={14} />
            <span>
              {tour.startingProvince} → {tour.destinationProvince}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock size={14} />
            <span>{tour.duration}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Plane size={14} />
            <span>{tour.transportation}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={
                    i < Math.floor(tour.averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                  }
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">({tour.averageRating})</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Giá từ</p>
            <div className="flex flex-col">
              {tour.discountedPrice ? (
                <>
                  <p className="text-lg font-bold text-red-600">{tour.discountedPrice.toLocaleString()} đ</p>
                  <p className="text-sm text-gray-500 line-through">{tour.price.toLocaleString()} đ</p>
                </>
              ) : (
                <p className="text-lg font-bold text-red-600">{tour.price.toLocaleString()} đ</p>
              )}
            </div>
          </div>
          <Link to={`/tours/${tour.id}`}> {/* Sử dụng 'to' prop cho react-router-dom */}
            <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
              Xem chi tiết
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
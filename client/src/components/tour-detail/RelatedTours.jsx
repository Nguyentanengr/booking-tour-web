// components/RelatedTours.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Plane, Star, Heart } from "lucide-react";

export default function RelatedTours({ tours }) {
  return (
    <div className="mt-16 space-y-6">
      <h2 className="text-3xl font-bold text-center">Tour liên quan</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tours.map((tour) => (
          <div
            key={tour.id}
            className="bg-white rounded-lg shadow-md border overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative h-[200px]">
              <img src={tour.image} alt={tour.name} className="object-cover w-full h-full" />
              {tour.originalPrice && (
                <div className="absolute top-3 left-3">
                  <Badge className="bg-red-500 text-white">
                    Giảm {Math.round(((tour.originalPrice - tour.price) / tour.originalPrice) * 100)}%
                  </Badge>
                </div>
              )}
              <div className="absolute top-3 right-3">
                <Button variant="ghost" size="icon" className="bg-white/80 hover:bg-white">
                  <Heart size={16} className="text-gray-600" />
                </Button>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <h3 className="font-semibold text-lg line-clamp-2">{tour.name}</h3>

              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{tour.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Plane size={14} />
                  <span>{tour.transportation}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-sm text-gray-600">
                <MapPin size={14} />
                <span>Khởi hành từ {tour.departure}</span>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-gray-600">Điểm nổi bật:</div>
                <div className="flex flex-wrap gap-1">
                  {tour.highlights.map((highlight, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {highlight}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < Math.floor(tour.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium">{tour.rating}</span>
                <span className="text-sm text-gray-500">({tour.reviewCount} đánh giá)</span>
              </div>

              <div className="border-t pt-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Giá từ</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xl font-bold text-red-600">{tour.price.toLocaleString()} đ</p>
                      {tour.originalPrice && (
                        <p className="text-sm text-gray-500 line-through">{tour.originalPrice.toLocaleString()} đ</p>
                      )}
                    </div>
                  </div>
                  <Link to={`/chi-tiet-tour/1`}>
                    <Button variant="outline" size="sm">
                      Xem chi tiết
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <Link to="/danh-sach-tour">
          <Button variant="outline" size="lg">
            Xem tất cả tour
          </Button>
        </Link>
      </div>
    </div>
  );
}
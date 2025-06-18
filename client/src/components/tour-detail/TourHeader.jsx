// components/TourHeader.jsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Plane, Star, Heart, Share2 } from "lucide-react";

export default function TourHeader({ tourDetail, isFavorite, setIsFavorite }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">

      </div>
      <h1 className="text-3xl font-bold">{tourDetail.name}</h1>
      <div className="flex items-center gap-6 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <MapPin size={16} />
          <span>
            {tourDetail.startingProvince} → {tourDetail.destinationProvince}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Clock size={16} />
          <span>{tourDetail.duration}</span>
        </div>
        <div className="flex items-center gap-1">
          <Plane size={16} />
          <span>{tourDetail.transportation}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={
                  i < Math.floor(tourDetail.averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                }
              />
            ))}
          </div>
          <span>({tourDetail.reviewCount} đánh giá)</span>
        </div>
      </div>
    </div>
  );
}
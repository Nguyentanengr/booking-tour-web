import { Link } from "react-router-dom"; // Import Link từ react-router-dom
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ChevronDown, Heart } from "lucide-react"

export function TourCard({ tour, isFavorite, onToggleFavorite }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
      <div className="grid grid-cols-1 md:grid-cols-3">
        <div className="relative h-[250px] md:h-full">
          {/* Thay Image bằng img, quản lý kích thước bằng CSS */}
          <img
            src={tour.image || "/placeholder.svg"}
            alt={tour.name}
            className="object-cover w-full h-full" // Thêm w-full h-full để img lấp đầy container
          />
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {tour.isPromoted && <Badge className="bg-red-500 text-white">Tiết kiệm</Badge>}
            {tour.isBestseller && <Badge className="bg-orange-500 text-white">Bestseller</Badge>}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 bg-white/80 hover:bg-white rounded-full"
            onClick={() => onToggleFavorite(tour.id)}
          >
            <Heart size={18} className={isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"} />
          </Button>
        </div>
        <div className="col-span-2 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <h3 className="font-semibold text-lg mb-3">{tour.name}</h3>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium">Mã tour:</span>
                  <span>{tour.tourCode}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium">Khởi hành:</span>
                  <span className="text-blue-600">{tour.startingProvince}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium">Thời gian:</span>
                  <span>{tour.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium">Phương tiện:</span>
                  <span>{tour.transportation}</span>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-sm font-medium mb-2">Ngày khởi hành:</p>
                <div className="flex flex-wrap gap-2">
                  {tour.departureDates.slice(0, 4).map((date, i) => (
                    <Badge key={i} variant="outline" className="text-red-500 border-red-500">
                      {date}
                    </Badge>
                  ))}
                  {tour.departureDates.length > 4 && (
                    <Button variant="ghost" size="sm" className="text-xs h-6 px-2">
                      <ChevronDown size={14} className="mr-1" />+{tour.departureDates.length - 4} ngày
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < Math.floor(tour.averageRating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">({tour.averageRating})</span>
              </div>
            </div>
            <div className="lg:border-l lg:pl-4 flex flex-col justify-between">
              <div>
                <p className="text-sm text-gray-600">Giá từ:</p>
                <div className="flex flex-col">
                  {tour.discountedPrice ? (
                    <>
                      <p className="text-2xl font-bold text-red-600">
                        {tour.discountedPrice.toLocaleString()} đ
                      </p>
                      <p className="text-sm text-gray-500 line-through">
                        {tour.price.toLocaleString()} đ
                      </p>
                    </>
                  ) : (
                    <p className="text-2xl font-bold text-red-600">{tour.price.toLocaleString()} đ</p>
                  )}
                </div>
              </div>
              {/* Thay Link từ next/link bằng Link từ react-router-dom */}
              <Link to={`/tours/${tour.id}`}>
                <Button className="w-full mt-4 bg-blue-600 text-white hover:bg-blue-700">Xem chi tiết</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
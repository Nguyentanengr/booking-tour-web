import React from "react";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

import { Badge } from "@/components/ui/badge";

const getStatusBadge = (status) => {
  switch (status) {
    case "confirmed":
      return <Badge className="bg-green-500">Đã xác nhận</Badge>;
    case "completed":
      return <Badge className="bg-blue-500">Đã hoàn thành</Badge>;
    case "cancelled":
      return <Badge variant="destructive">Đã hủy</Badge>;
    case "pending":
      return <Badge variant="secondary">Chờ xác nhận</Badge>;
    default:
      return <Badge variant="secondary">Unknown</Badge>;
  }
};

const TourCard = ({ tour, type }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-4">
        <div className="relative h-[200px] md:h-full">
          <img
            src={tour.image || "/placeholder.svg"}
            alt={tour.name}
            className="object-cover w-full h-full" // Use Tailwind classes for fill
          />
        </div>
        <div className="col-span-3 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-lg">{tour.name}</h3>
                {getStatusBadge(tour.status)}
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <span className="font-medium">Mã tour:</span>
                  <span>{tour.tourCode}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <span className="font-medium">Thời gian:</span>
                  <span>{tour.duration}</span>
                </div>

                {type === "cancelled" ? (
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <span className="font-medium">Ngày hủy:</span>
                    <span>{format(tour.cancelDate, "dd/MM/yyyy", { locale: vi })}</span>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <span className="font-medium">Ngày đi:</span>
                      <span>{format(tour.departureDate, "dd/MM/yyyy", { locale: vi })}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <span className="font-medium">Ngày về:</span>
                      <span>{format(tour.returnDate, "dd/MM/yyyy", { locale: vi })}</span>
                    </div>
                  </>
                )}

                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <span className="font-medium">Số người:</span>
                  <span>{tour.passengers} người</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <span className="font-medium">Phương tiện:</span>
                  <span>{tour.transportation}</span>
                </div>
                {type === "cancelled" && (
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <span className="font-medium">Lý do:</span>
                    <span>Thay đổi lịch trình</span> {/* This was hardcoded */}
                  </div>
                )}
              </div>

              {type === "completed" && tour.rating && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Đánh giá của bạn:</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < tour.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="lg:border-l lg:pl-4 flex flex-col justify-between">
              <div>
                <p className="text-sm text-gray-600">Giá tour:</p>
                <p className="text-xl font-bold text-red-600">{tour.price.toLocaleString()} đ</p>
                {type === "cancelled" && tour.refundAmount && (
                  <>
                    <p className="text-sm text-gray-600 mt-2">Hoàn tiền:</p>
                    <p className="text-lg font-bold text-green-600">
                      {tour.refundAmount.toLocaleString()} đ (80%)
                    </p>
                  </>
                )}
              </div>
              <div className="flex flex-col gap-2 mt-4">
                {type === "upcoming" && (
                  <>
                    <Button variant="destructive" size="sm">
                      Hủy đặt tour
                    </Button>
                    <Button variant="outline" size="sm">
                      Xem chi tiết
                    </Button>
                  </>
                )}
                {type === "completed" && (
                  <>
                    <Button variant="outline" size="sm">
                      Đánh giá
                    </Button>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-800">
                      Đặt lại
                    </Button>
                  </>
                )}
                {type === "cancelled" && (
                  <>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-800">
                      Đặt lại
                    </Button>
                    <Button variant="outline" size="sm">
                      Chi tiết hoàn tiền
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourCard;
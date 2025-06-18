// components/BookingSidebar.jsx
import React from "react";
import {Link} from "react-router-dom";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export default function BookingSidebar({ tourDetail, selectedDeparture, scrollToDepartureTable }) {
  return (
    <div className="lg:col-span-1">
      <div className="sticky top-24 bg-white rounded-lg border shadow-lg p-6 space-y-4">
        {!selectedDeparture ? (
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold">Chọn ngày khởi hành</h3>
            <p className="text-sm text-gray-600">Vui lòng chọn ngày khởi hành để xem giá và đặt tour</p>
            <Button onClick={scrollToDepartureTable} className="w-full">
              Chọn ngày khởi hành
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Thông tin đặt tour</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Mã tour:</span>
                <span className="font-medium">{tourDetail.tourCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phương tiện:</span>
                <span className="font-medium">{tourDetail.transportation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Khởi hành:</span>
                <span className="font-medium">{tourDetail.startingProvince}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Điểm đến:</span>
                <span className="font-medium">{tourDetail.destinationProvince}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Thời gian:</span>
                <span className="font-medium">{tourDetail.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ngày đi:</span>
                <span className="font-medium">
                  {format(selectedDeparture.departureDate, "dd/MM/yyyy", { locale: vi })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ngày về:</span>
                <span className="font-medium">
                  {format(selectedDeparture.returnDate, "dd/MM/yyyy", { locale: vi })}
                </span>
              </div>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Giá tour:</span>
                <div className="text-right">
                  <div className="text-xl font-bold text-red-600">
                    {(selectedDeparture.discountedPrice || selectedDeparture.prices.adult).toLocaleString()} đ
                  </div>
                  {selectedDeparture.discountedPrice && (
                    <div className="text-sm text-gray-500 line-through">
                      {selectedDeparture.prices.adult.toLocaleString()} đ
                    </div>
                  )}
                </div>
              </div>
              <Link to={`/dat-tour`}>
                <Button className="w-full bg-blue-600 text-white hover:bg-blue-700" size="lg">
                  Đặt tour ngay
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
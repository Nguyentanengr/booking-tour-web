import React from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function PopularTours({ popularTours }) {
  return (
    <section className="bg-gray-50 py-12 w-[1400px] mx-auto">
      <div className="container">
        <h2 className="text-2xl font-bold text-center mb-8">Tour phổ biến</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularTours.map((tour) => (
            <div key={tour.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-[200px]">
                <img src={tour.image || "/placeholder.svg"} alt={tour.name} fill className="object-cover" />
                <div className="absolute top-4 left-4 flex gap-2">
                  {tour.discountedPrice && (
                    <div className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">Tiết kiệm</div>
                  )}
                  {tour.isBestseller && (
                    <div className="bg-orange-500 text-white text-xs font-medium px-2 py-1 rounded">Bestseller</div>
                  )}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{tour.name}</h3>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                  <div>
                    <span className="font-medium">Mã tour:</span> {tour.tourCode}
                  </div>
                  <div>
                    <span className="font-medium">Khởi hành:</span> {tour.startingProvince}
                  </div>
                  <div>
                    <span className="font-medium">Thời gian:</span> {tour.duration}
                  </div>
                  <div>
                    <span className="font-medium">Phương tiện:</span> {tour.transportation}
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Ngày khởi hành:</p>
                  <div className="flex flex-wrap gap-1">
                    {tour.departureDates.map((date, index) => (
                      <span key={index} className="text-xs border border-red-500 text-red-500 rounded px-2 py-1">
                        {date}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Giá từ</p>
                    <div className="flex items-center gap-2">
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
                  <Link to={`/tours/${tour.id}`}>
                    <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                      Xem chi tiết
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <Link to="/tours">
            <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
              Xem tất cả tour
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
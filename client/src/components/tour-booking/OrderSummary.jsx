import React from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export function OrderSummary({
  tourInfo,
  passengerCounts,
  additionalServices,
  serviceQuantities,
  getPassengerPrice,
  calculateTotal,
  isFormValid,
  handleSubmitBooking,
  loading,
}) {
  if (!tourInfo) return null; // Don't render if tourInfo is not loaded

  const totalPassengers = passengerCounts.adult + passengerCounts.child + passengerCounts.senior;
  const hasGroupDiscount = totalPassengers >= 10; // Example discount condition

  return (
    <div className="sticky top-24 bg-white rounded-lg border shadow-lg p-6 space-y-4">
      <h3 className="text-xl font-semibold">Tóm tắt đơn hàng</h3>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Mã tour:</span>
          <span className="font-medium">{tourInfo.tourCode}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Ngày đi:</span>
          <span className="font-medium">{format(tourInfo.departureDate, "dd/MM/yyyy", { locale: vi })}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Ngày về:</span>
          <span className="font-medium">{format(tourInfo.returnDate, "dd/MM/yyyy", { locale: vi })}</span>
        </div>
      </div>

      <Separator />

      {/* Passenger Summary */}
      <div className="space-y-2">
        <h4 className="font-medium">Hành khách</h4>
        {passengerCounts.adult > 0 && (
          <div className="flex justify-between text-sm">
            <span>{passengerCounts.adult} Người lớn</span>
            <span>{(passengerCounts.adult * getPassengerPrice("adult")).toLocaleString()} đ</span>
          </div>
        )}
        {passengerCounts.child > 0 && (
          <div className="flex justify-between text-sm">
            <span>{passengerCounts.child} Trẻ em</span>
            <span>{(passengerCounts.child * getPassengerPrice("child")).toLocaleString()} đ</span>
          </div>
        )}
        {passengerCounts.senior > 0 && (
          <div className="flex justify-between text-sm">
            <span>{passengerCounts.senior} Người cao tuổi</span>
            <span>{(passengerCounts.senior * getPassengerPrice("senior")).toLocaleString()} đ</span>
          </div>
        )}
      </div>

      {/* Services Summary */}
      {Object.entries(serviceQuantities).some(([_, quantity]) => quantity > 0) && (
        <>
          <Separator />
          <div className="space-y-2">
            <h4 className="font-medium">Dịch vụ bổ sung</h4>
            {Object.entries(serviceQuantities).map(([serviceId, quantity]) => {
              if (quantity === 0) return null;
              const service = additionalServices.find((s) => s.id === Number.parseInt(serviceId));
              if (!service) return null;
              return (
                <div key={serviceId} className="flex justify-between text-sm">
                  <span>
                    {quantity} {service.name}
                  </span>
                  <span>{(service.price * quantity).toLocaleString()} đ</span>
                </div>
              );
            })}
          </div>
        </>
      )}

      <Separator />

      {/* Discount */}
      {hasGroupDiscount && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-green-600">
            <span>Giảm giá nhóm (10+ người)</span>
            <span>-10%</span>
          </div>
        </div>
      )}

      {/* Total */}
      <div className="border-t pt-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">Tổng cộng:</span>
          <div className="text-right">
            <div className="text-xl font-bold text-red-600">
              {calculateTotal().toLocaleString()} đ
            </div>
            {hasGroupDiscount && (
              <div className="text-sm text-gray-500 line-through">{(calculateTotal() / 0.9).toLocaleString()} đ</div>
            )}
          </div>
        </div>
      </div>

      <Button
        className="w-full bg-blue-600 text-white hover:bg-blue-700"
        size="lg"
        onClick={handleSubmitBooking}
        disabled={!isFormValid() || loading}
      >
        {loading ? "Đang xử lý..." : "Tiến hành thanh toán"}
      </Button>
    </div>
  );
}
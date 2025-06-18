// src/components/PaymentSummary.jsx
import React from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export function PaymentSummary({ bookingData, handleProcessPayment, isProcessing, isPaymentFormValid }) {
  if (!bookingData) return null; // Don't render if bookingData is not loaded

  return (
    <div className="sticky top-24 bg-white rounded-lg border shadow-lg p-6 space-y-4">
      <h3 className="text-xl font-semibold">Tóm tắt đơn hàng</h3>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Mã tour:</span>
          <span className="font-medium">{bookingData.tourCode}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Ngày đi:</span>
          <span className="font-medium">{format(bookingData.departureDate, "dd/MM/yyyy", { locale: vi })}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Ngày về:</span>
          <span className="font-medium">{format(bookingData.returnDate, "dd/MM/yyyy", { locale: vi })}</span>
        </div>
      </div>

      <Separator />

      {/* Passengers */}
      <div className="space-y-2">
        <h4 className="font-medium">Hành khách</h4>
        {bookingData.passengers.map((passenger, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span>{passenger.name}</span>
            <span>{passenger.type}</span>
          </div>
        ))}
      </div>

      {/* Additional Services */}
      {bookingData.additionalServices.length > 0 && (
        <>
          <Separator />
          <div className="space-y-2">
            <h4 className="font-medium">Dịch vụ bổ sung</h4>
            {bookingData.additionalServices.map((service, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>
                  {service.quantity} {service.name}
                </span>
                <span>{(service.price * service.quantity).toLocaleString()} đ</span>
              </div>
            ))}
          </div>
        </>
      )}

      <Separator />

      {/* Pricing */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Tạm tính:</span>
          <span>{bookingData.totalPrice.toLocaleString()} đ</span>
        </div>
        {bookingData.discount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Giảm giá:</span>
            <span>-{bookingData.discount.toLocaleString()} đ</span>
          </div>
        )}
      </div>

      <Separator />

      {/* Total */}
      <div className="flex justify-between items-center">
        <span className="text-lg font-semibold">Tổng cộng:</span>
        <span className="text-xl font-bold text-red-600">{bookingData.finalPrice.toLocaleString()} đ</span>
      </div>

      <Button className="w-full bg-blue-600 text-white hover:bg-blue-700" 
      size="lg" onClick={handleProcessPayment} 
      disabled={isProcessing || !isPaymentFormValid()}>
        {isProcessing ? "Đang xử lý..." : "Thanh toán ngay"}
      </Button>

      <div className="text-xs text-gray-500 text-center">
        Bằng việc thanh toán, bạn đồng ý với{" "}
        <a href="#" className="text-blue-600 hover:underline">
          điều khoản và điều kiện
        </a>{" "}
        của chúng tôi.
      </div>
    </div>
  );
}
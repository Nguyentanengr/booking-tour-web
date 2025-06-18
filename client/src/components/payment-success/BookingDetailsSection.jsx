// src/components/BookingDetailsSection.jsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Download } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export function BookingDetailsSection({ bookingConfirmation }) {
  return (
    <div className="bg-white rounded-lg border shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Chi tiết đặt tour</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Tải voucher
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Mã đặt tour:</span>
            <span className="font-medium">{bookingConfirmation.bookingId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Mã tour:</span>
            <span className="font-medium">{bookingConfirmation.tourCode}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Trạng thái:</span>
            <span className="font-medium text-green-600">{bookingConfirmation.status}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Ngày đặt:</span>
            <span className="font-medium">
              {format(bookingConfirmation.bookingDate, "dd/MM/yyyy HH:mm", { locale: vi })}
            </span>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Ngày khởi hành:</span>
            <span className="font-medium">
              {format(bookingConfirmation.departureDate, "dd/MM/yyyy", { locale: vi })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Ngày về:</span>
            <span className="font-medium">
              {format(bookingConfirmation.returnDate, "dd/MM/yyyy", { locale: vi })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Thanh toán:</span>
            <span className="font-medium">{bookingConfirmation.paymentMethod}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Trạng thái thanh toán:</span>
            <span className="font-medium text-green-600">{bookingConfirmation.paymentStatus}</span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">{bookingConfirmation.tourName}</h3>
      </div>
      <Separator className="my-6" />
    </div>
  );
}
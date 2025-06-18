// src/components/SuccessHeader.jsx
import React from "react";
import { CheckCircle } from "lucide-react";

export function SuccessHeader() {
  return (
    <div className="text-center mb-8">
      <div className="flex justify-center mb-4">
        <CheckCircle className="h-16 w-16 text-green-500" />
      </div>
      <h1 className="text-3xl font-bold text-green-600 mb-2">Đặt tour thành công!</h1>
      <p className="text-gray-600">
        Cảm ơn bạn đã đặt tour. Chúng tôi đã gửi email xác nhận đến địa chỉ email của bạn.
      </p>
    </div>
  );
}
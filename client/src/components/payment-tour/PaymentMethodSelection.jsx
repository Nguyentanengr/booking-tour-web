// src/components/PaymentMethodSelection.jsx
import React from "react";
import { CreditCard } from "lucide-react";

export function PaymentMethodSelection({ paymentMethod, setPaymentMethod }) {
  // Currently, only credit card is supported, so selection is simplified
  return (
    <div className="bg-white rounded-lg border p-6">
      <h2 className="text-xl font-semibold mb-4">Phương thức thanh toán</h2>
      <div className="flex items-center space-x-3 p-4 border rounded-lg bg-blue-50 border-blue-200">
        <CreditCard className="h-6 w-6 text-blue-600" />
        <div className="flex-1">
          <p className="font-medium">Thẻ tín dụng/Ghi nợ</p>
          <p className="text-sm text-gray-600">Visa, Mastercard, JCB - Thanh toán an toàn và bảo mật</p>
        </div>
        {/* No radio button needed if only one method is displayed */}
      </div>
    </div>
  );
}
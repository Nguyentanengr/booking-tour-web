// PaymentPage.jsx
import React from "react";
import { usePayment } from "@/hooks/usePayment";
import { PaymentMethodSelection } from "@/components/payment-tour/PaymentMethodSelection";
import { CardDetailsForm } from "@/components/payment-tour/CardDetailsForm";
import { PaymentSummary } from "@/components/payment-tour/PaymentSummary";

export default function PaymentPage() {
  const {
    bookingData,
    loading,
    error,
    paymentMethod,
    setPaymentMethod,
    cardInfo,
    handleCardInfoChange,
    formatCardNumber,
    formatExpiryDate,
    isProcessing,
    handleProcessPayment,
    isPaymentFormValid,
  } = usePayment(); // Có thể truyền bookingId nếu cần fetch data theo ID thực tế

  if (loading) {
    return <div className="container py-8 text-center">Đang tải thông tin đặt tour...</div>;
  }

  if (error) {
    return <div className="container py-8 text-center text-red-600">Lỗi: {error}</div>;
  }

  return (
    <div className="container py-8 w-[1400px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment Form */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-2xl font-bold mb-2">Thanh toán</h1>
            <p className="text-gray-600">Hoàn tất đặt tour của bạn</p>
          </div>

          <PaymentMethodSelection
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
          />

          <CardDetailsForm
            cardInfo={cardInfo}
            handleCardInfoChange={handleCardInfoChange}
            formatCardNumber={formatCardNumber}
            formatExpiryDate={formatExpiryDate}
          />
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <PaymentSummary
            bookingData={bookingData}
            handleProcessPayment={handleProcessPayment}
            isProcessing={isProcessing}
            isPaymentFormValid={isPaymentFormValid}
          />
        </div>
      </div>
    </div>
  );
}
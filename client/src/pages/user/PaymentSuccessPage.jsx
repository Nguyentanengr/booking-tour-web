import React from "react";
import { usePaymentSuccess } from "@/hooks/usePaymentSuccess";
import { SuccessHeader } from "@/components/payment-success/SuccessHeader";
import { BookingDetailsSection } from "@/components/payment-success/BookingDetailsSection";
import { PassengerInformationSection } from "@/components/payment-success/PassengerInformationSection";
import { AdditionalServicesSummary } from "@/components/payment-success/AdditionalServicesSummary";
import { TotalAmountSummary } from "@/components/payment-success/TotalAmountSummary";
import { ContactNotice } from "@/components/payment-success/ContactNotice";
import { ActionButtons } from "@/components/payment-success/ActionButtons";


export default function PaymentSuccessPage() {
  // Trong ứng dụng thực tế, bạn có thể lấy bookingId từ URL params, ví dụ với react-router-dom:
  // const { bookingId } = useParams();
  const { confirmationData, loading, error } = usePaymentSuccess("BK2024060001"); // Giả lập bookingId

  if (loading) {
    return <div className="container py-8 text-center">Đang tải thông tin xác nhận...</div>;
  }

  if (error) {
    return <div className="container py-8 text-center text-red-600">Lỗi: {error}</div>;
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <SuccessHeader />

        <BookingDetailsSection bookingConfirmation={confirmationData} />

        {/* Thông tin hành khách và dịch vụ bổ sung được bao quanh bởi một div bọc để gọn gàng hơn */}
        <div className="bg-white rounded-lg border shadow-sm p-6 mb-6">
            <PassengerInformationSection passengers={confirmationData.passengers} />
            <AdditionalServicesSummary additionalServices={confirmationData.additionalServices} />
            <TotalAmountSummary totalPrice={confirmationData.totalPrice} />
        </div>

        <ContactNotice />

        <ActionButtons />
      </div>
    </div>
  );
}
// src/hooks/usePayment.js
import { useState, useEffect, useCallback } from "react";
import { fetchBookingDetails, processPayment } from "@/utils/fakePaymentTour.js";

export const usePayment = (bookingId) => {
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const loadBookingData = async () => {
      try {
        // Trong thực tế, bookingId sẽ được lấy từ URL params hoặc context
        // Ở đây, tôi giả lập bookingId là một giá trị có sẵn.
        // Bạn có thể truyền bookingId từ component cha hoặc đọc từ URL nếu dùng react-router-dom
        const data = await fetchBookingDetails(bookingId || "mock-booking-id");
        setBookingData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadBookingData();
  }, [bookingId]);

  const handleCardInfoChange = useCallback((field, value) => {
    setCardInfo((prevInfo) => ({ ...prevInfo, [field]: value }));
  }, []);

  const formatCardNumber = useCallback((value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  }, []);

  const formatExpiryDate = useCallback((value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  }, []);

  const isPaymentFormValid = useCallback(() => {
    if (paymentMethod === "credit_card") {
      return (
        cardInfo.cardNumber.replace(/\s/g, "").length >= 16 && // Basic check for 16 digits
        cardInfo.expiryDate.length === 5 && // MM/YY
        cardInfo.cvv.length >= 3 && // 3 or 4 digits
        cardInfo.cardholderName.trim() !== ""
      );
    }
    // Add validation for other payment methods if any
    return true;
  }, [paymentMethod, cardInfo]);

  const handleProcessPayment = async () => {
    if (!isPaymentFormValid()) {
      alert("Vui lòng điền đầy đủ và chính xác thông tin thanh toán.");
      return;
    }

    setIsProcessing(true);
    try {
      const response = await processPayment({
        bookingId: bookingData.tourCode, // Sử dụng tourCode làm bookingId giả lập
        paymentMethod,
        cardInfo,
        amount: bookingData.finalPrice,
      });
      alert(response.message);
      // Giả lập chuyển hướng sau khi thanh toán thành công
      // Trong ứng dụng React, bạn có thể dùng navigate của react-router-dom
      window.location.href = "/payment/success"; // Chuyển hướng đơn giản
    } catch (err) {
      alert(err.message);
      setIsProcessing(false); // Only stop processing if there's an error
    }
  };

  return {
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
  };
};
import { useState, useEffect } from "react";
import { fetchBookingConfirmation } from "../utils/fakePaymentSuccess";

export const usePaymentSuccess = (bookingId) => {
  const [confirmationData, setConfirmationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadConfirmationData = async () => {
      try {
        // Trong thực tế, bookingId có thể được lấy từ URL params hoặc context
        const data = await fetchBookingConfirmation(bookingId || "mock-booking-id");
        setConfirmationData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadConfirmationData();
  }, [bookingId]);

  return { confirmationData, loading, error };
};
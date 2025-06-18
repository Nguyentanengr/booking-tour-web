const mockBookingData = {
  tourCode: "NNSGN221",
  tourName: "Singapore - Malaysia (1 đêm tại Singapore)",
  departureDate: new Date(2024, 5, 15),
  returnDate: new Date(2024, 5, 19),
  passengers: [
    { name: "Nguyễn Văn A", type: "Người lớn" },
    { name: "Nguyễn Thị B", type: "Người lớn" },
  ],
  additionalServices: [{ name: "Bảo hiểm mở rộng", quantity: 2, price: 200000 }],
  totalPrice: 27380000,
  discount: 2738000,
  finalPrice: 24642000,
};

export const fetchBookingDetails = (bookingId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Trong thực tế, bạn sẽ dùng bookingId để fetch dữ liệu cụ thể
      // Ở đây, chúng ta chỉ trả về mock data chung
      if (bookingId) {
        resolve(mockBookingData);
      } else {
        reject(new Error("Không tìm thấy thông tin đặt tour."));
      }
    }, 500); // Simulate network delay
  });
};

export const processPayment = (paymentDetails) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (
        paymentDetails.cardInfo &&
        paymentDetails.cardInfo.cardNumber &&
        paymentDetails.cardInfo.expiryDate &&
        paymentDetails.cardInfo.cvv
      ) {
        // Giả lập logic thành công/thất bại
        if (Math.random() > 0.1) { // 90% success rate
          resolve({ success: true, message: "Thanh toán thành công!", transactionId: "TRX" + Date.now() });
        } else {
          reject({ success: false, message: "Thanh toán thất bại, vui lòng kiểm tra lại thông tin thẻ." });
        }
      } else {
        reject({ success: false, message: "Vui lòng điền đầy đủ thông tin thanh toán." });
      }
    }, 2000); // Simulate network delay for payment processing
  });
};
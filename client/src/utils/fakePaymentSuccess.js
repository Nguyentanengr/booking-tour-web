const mockBookingConfirmation = {
  bookingId: "BK2024060001", //
  tourCode: "NNSGN221", //
  tourName: "Singapore - Malaysia (1 đêm tại Singapore)", //
  departureDate: new Date(2024, 5, 15), //
  returnDate: new Date(2024, 5, 19), //
  status: "Đã xác nhận", //
  passengers: [ //
    {
      name: "Nguyễn Văn A", //
      dateOfBirth: new Date(1990, 0, 15), //
      gender: "Nam", //
      phoneNumber: "0912345678", //
      type: "Người lớn", //
    },
    {
      name: "Nguyễn Thị B", //
      dateOfBirth: new Date(1992, 5, 20), //
      gender: "Nữ", //
      phoneNumber: "0987654321", //
      type: "Người lớn", //
    },
  ],
  additionalServices: [{ name: "Bảo hiểm mở rộng", quantity: 2, price: 200000 }], //
  totalPrice: 24642000, //
  paymentMethod: "Thẻ tín dụng", //
  paymentStatus: "Thành công", //
  bookingDate: new Date(), //
};

export const fetchBookingConfirmation = (bookingId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Trong thực tế, bạn sẽ dùng bookingId để fetch dữ liệu cụ thể từ server.
      // Ở đây, chúng ta chỉ trả về mock data chung.
      if (bookingId) {
        resolve(mockBookingConfirmation);
      } else {
        reject(new Error("Không tìm thấy thông tin xác nhận đặt tour."));
      }
    }, 500); // Simulate network delay
  });
};
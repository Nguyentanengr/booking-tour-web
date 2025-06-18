// src/api/mockApi.js
const mockTourInfo = {
  id: 1,
  name: "Singapore - Malaysia (1 đêm tại Singapore)",
  tourCode: "NNSGN221",
  departureDate: new Date(2024, 5, 15),
  returnDate: new Date(2024, 5, 19),
  duration: "5N4Đ",
  price: 14590000,
  discountedPrice: 13590000,
};

const mockAdditionalServices = [
  { id: 1, name: "Bảo hiểm mở rộng", price: 200000 },
  { id: 2, name: "Phòng đơn", price: 1500000 },
  { id: 3, name: "Nâng cấp khách sạn 5 sao", price: 2000000 },
  { id: 4, name: "Tour tùy chọn Sentosa", price: 800000 },
];

export const fetchTourDetails = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockTourInfo);
    }, 500); // Simulate network delay
  });
};

export const fetchAdditionalServices = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockAdditionalServices);
    }, 300); // Simulate network delay
  });
};

export const submitBooking = (bookingData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.1) { // 90% success rate
        resolve({ success: true, message: "Đặt tour thành công!", bookingId: "BOOK" + Date.now() });
      } else {
        reject({ success: false, message: "Đặt tour thất bại, vui lòng thử lại!" });
      }
    }, 1000); // Simulate network delay for submission
  });
};
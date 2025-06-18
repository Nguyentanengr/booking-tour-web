// data.js
const tourDetail = {
  id: 1,
  name: "Singapore - Malaysia (1 đêm tại Singapore)",
  tourCode: "NNSGN221",
  startingProvince: "TP. Hồ Chí Minh",
  destinationProvince: "Singapore",
  duration: "5N4Đ",
  transportation: "Máy bay",
  averageRating: 4.5,
  reviewCount: 128,
  images: [
    "https://dulichsaigon.edu.vn/wp-content/uploads/2024/01/tim-hieu-dinh-nghia-du-lich-va-cac-loai-hinh-du-lich.jpg",
    "https://dulichsaigon.edu.vn/wp-content/uploads/2024/01/tim-hieu-dinh-nghia-du-lich-va-cac-loai-hinh-du-lich.jpg", // Replaced placeholder.svg
    "https://dulichsaigon.edu.vn/wp-content/uploads/2024/01/tim-hieu-dinh-nghia-du-lich-va-cac-loai-hinh-du-lich.jpg", // Replaced placeholder.svg
    "https://dulichsaigon.edu.vn/wp-content/uploads/2024/01/tim-hieu-dinh-nghia-du-lich-va-cac-loai-hinh-du-lich.jpg", // Replaced placeholder.svg
    "https://dulichsaigon.edu.vn/wp-content/uploads/2024/01/tim-hieu-dinh-nghia-du-lich-va-cac-loai-hinh-du-lich.jpg", // Replaced placeholder.svg
  ],
  description:
    "Khám phá Singapore hiện đại và Malaysia đa văn hóa trong chuyến du lịch 5 ngày 4 đêm đầy thú vị. Trải nghiệm những điểm tham quan nổi tiếng, ẩm thực đặc sắc và văn hóa độc đáo của hai quốc gia Đông Nam Á.",
  services: [
    "Vé máy bay khứ hồi",
    "Khách sạn 4 sao",
    "Ăn sáng hàng ngày",
    "Hướng dẫn viên tiếng Việt",
    "Xe đưa đón sân bay",
    "Bảo hiểm du lịch",
  ],
  itinerary: [
    {
      order: 1,
      title: "Ngày 1: TP.HCM - Singapore",
      description:
        "Khởi hành từ sân bay Tân Sơn Nhất. Đến Singapore, tham quan Gardens by the Bay, Marina Bay Sands. Nghỉ đêm tại Singapore.",
    },
    {
      order: 2,
      title: "Ngày 2: Singapore - Kuala Lumpur",
      description:
        "Tham quan Sentosa Island, Universal Studios. Chiều di chuyển đến Kuala Lumpur bằng xe bus. Nghỉ đêm tại Kuala Lumpur.",
    },
    {
      order: 3,
      title: "Ngày 3: Kuala Lumpur City Tour",
      description:
        "Tham quan tháp đôi Petronas, Batu Caves, chợ Central Market. Thưởng thức ẩm thực đường phố Malaysia.",
    },
    {
      order: 4,
      title: "Ngày 4: Kuala Lumpur - Singapore",
      description: "Mua sắm tại Bukit Bintang. Chiều trở lại Singapore. Tự do khám phá Orchard Road.",
    },
    {
      order: 5,
      title: "Ngày 5: Singapore - TP.HCM",
      description: "Tham quan Chinatown, Little India. Ra sân bay về TP.HCM. Kết thúc chuyến du lịch.",
    },
  ],
  policies: {
    transportation: "Vé máy bay khứ hồi hạng phổ thông. Xe bus đời mới có điều hòa cho các chuyến di chuyển nội địa.",
    cancellation:
      "Hủy tour trước 30 ngày: không mất phí. Hủy tour từ 15-29 ngày: mất 50% phí tour. Hủy tour dưới 15 ngày: mất 100% phí tour.",
    booking:
      "Đặt cọc tối thiểu 30% giá tour. Thanh toán đầy đủ trước ngày khởi hành 7 ngày. Cần có hộ chiếu còn hạn ít nhất 6 tháng.",
    refund: "Hoàn tiền trong vòng 7-10 ngày làm việc sau khi hủy tour. Phí hoàn tiền 2% tổng giá trị tour.",
  },
  additionalServices: [
    { name: "Bảo hiểm mở rộng", price: 200000 },
    { name: "Phòng đơn", price: 1500000 },
    { name: "Nâng cấp khách sạn 5 sao", price: 2000000 },
    { name: "Tour tùy chọn Sentosa", price: 800000 },
  ],
};

const departures = [
  {
    id: 1,
    departureDate: new Date(2024, 5, 15),
    returnDate: new Date(2024, 5, 19),
    prices: {
      adult: 14590000,
      child: 12590000,
      senior: 13590000,
    },
    availableSlots: 12,
    discountedPrice: null,
  },
  {
    id: 2,
    departureDate: new Date(2024, 5, 22),
    returnDate: new Date(2024, 5, 26),
    prices: {
      adult: 14590000,
      child: 12590000,
      senior: 13590000,
    },
    availableSlots: 8,
    discountedPrice: 13590000,
  },
  {
    id: 3,
    departureDate: new Date(2024, 5, 29),
    returnDate: new Date(2024, 6, 3),
    prices: {
      adult: 14590000,
      child: 12590000,
      senior: 13590000,
    },
    availableSlots: 15,
    discountedPrice: null,
  },
];

const reviews = [
  {
    name: "Nguyễn Văn A",
    rating: 5,
    date: "15/05/2024",
    comment:
      "Tour rất tuyệt vời! Hướng dẫn viên nhiệt tình, lịch trình hợp lý. Khách sạn sạch sẽ, ăn uống ngon. Sẽ quay lại với gia đình.",
    images: ["https://dulichsaigon.edu.vn/wp-content/uploads/2024/01/tim-hieu-dinh-nghia-du-lich-va-cac-loai-hinh-du-lich.jpg"], // Replaced placeholder.svg
  },
  {
    name: "Trần Thị B",
    rating: 4,
    date: "10/05/2024",
    comment:
      "Chuyến đi khá ổn, cảnh đẹp, dịch vụ tốt. Chỉ có điều thời gian hơi gấp gáp một chút. Nhưng nhìn chung rất hài lòng.",
    images: ["https://dulichsaigon.edu.vn/wp-content/uploads/2024/01/tim-hieu-dinh-nghia-du-lich-va-cac-loai-hinh-du-lich.jpg"], // Replaced placeholder.svg
  },
  {
    name: "Lê Văn C",
    rating: 5,
    date: "05/05/2024",
    comment:
      "Lần đầu đi tour nước ngoài, rất ấn tượng với Singapore và Malaysia. Cảm ơn đội ngũ đã tổ chức chuyến đi tuyệt vời!",
    images: [],
  },
];

const relatedTours = [
  {
    id: 2,
    name: "Thailand - Bangkok - Pattaya",
    image: "https://dulichsaigon.edu.vn/wp-content/uploads/2024/01/tim-hieu-dinh-nghia-du-lich-va-cac-loai-hinh-du-lich.jpg", // Replaced placeholder.svg
    duration: "4N3Đ",
    price: 8590000,
    originalPrice: 9590000,
    rating: 4.3,
    reviewCount: 89,
    departure: "TP. Hồ Chí Minh",
    transportation: "Máy bay",
    highlights: ["Chùa Vàng", "Floating Market", "Pattaya Beach"],
  },
  {
    id: 3,
    name: "Malaysia - Kuala Lumpur - Genting",
    image: "https://dulichsaigon.edu.vn/wp-content/uploads/2024/01/tim-hieu-dinh-nghia-du-lich-va-cac-loai-hinh-du-lich.jpg", // Replaced placeholder.svg
    duration: "3N2Đ",
    price: 6590000,
    originalPrice: null,
    rating: 4.6,
    reviewCount: 156,
    departure: "TP. Hồ Chí Minh",
    transportation: "Máy bay",
    highlights: ["Petronas Towers", "Batu Caves", "Genting Highland"],
  },
  {
    id: 4,
    name: "Singapore - Gardens by the Bay",
    image: "https://dulichsaigon.edu.vn/wp-content/uploads/2024/01/tim-hieu-dinh-nghia-du-lich-va-cac-loai-hinh-du-lich.jpg", // Replaced placeholder.svg
    duration: "3N2Đ",
    price: 12590000,
    originalPrice: 13590000,
    rating: 4.8,
    reviewCount: 203,
    departure: "TP. Hồ Chí Minh",
    transportation: "Máy bay",
    highlights: ["Marina Bay Sands", "Universal Studios", "Sentosa"],
  },
];


const simulateDelay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchTourDetail = async (id) => {
  await simulateDelay(500); // Simulate network delay
  if (id === '1') { // Assuming the tour ID is '1' for the mock data
    return { success: true, data: tourDetail };
  }
  return { success: false, error: 'Tour not found' };
};

export const fetchDepartures = async (tourId) => {
  await simulateDelay(300); // Simulate network delay
  if (tourId === '1') {
    return { success: true, data: departures };
  }
  return { success: false, error: 'Departures not found for this tour' };
};

export const fetchReviews = async (tourId) => {
  await simulateDelay(400); // Simulate network delay
  if (tourId === '1') {
    return { success: true, data: reviews };
  }
  return { success: false, error: 'Reviews not found for this tour' };
};

export const fetchRelatedTours = async () => {
  await simulateDelay(600); // Simulate network delay
  return { success: true, data: relatedTours };
};
// api.js
const mockFavoriteTours = [
  {
    id: 1,
    name: "Singapore - Malaysia (1 đêm tại Singapore)",
    tourCode: "NNSGN221",
    startingProvince: "TP. Hồ Chí Minh",
    destinationProvince: "Singapore",
    duration: "5N4Đ",
    transportation: "Máy bay",
    price: 14590000,
    discountedPrice: 13590000,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-JyMLp4VKADq8h1bWbBc4I8lVn3G1YP.png",
    averageRating: 4.5,
    departureDates: ["28/05", "03/06", "04/06", "10/06"],
    isPromoted: true,
  },
  {
    id: 2,
    name: "Phú Quốc - Thiên đường biển đảo",
    tourCode: "PQ002",
    startingProvince: "TP. Hồ Chí Minh",
    destinationProvince: "Phú Quốc",
    duration: "4N3Đ",
    transportation: "Máy bay",
    price: 6590000,
    discountedPrice: 5590000,
    image: "https://via.placeholder.com/400x300?text=Phu+Quoc", // Changed placeholder
    averageRating: 4.8,
    departureDates: ["01/06", "08/06", "15/06", "22/06"],
    isPromoted: false,
  },
  {
    id: 3,
    name: "Đà Lạt - Thành phố ngàn hoa",
    tourCode: "DL003",
    startingProvince: "TP. Hồ Chí Minh",
    destinationProvince: "Đà Lạt",
    duration: "3N2Đ",
    transportation: "Xe khách",
    price: 2590000,
    discountedPrice: null,
    image: "https://via.placeholder.com/400x300?text=Da+Lat", // Changed placeholder
    averageRating: 4.3,
    departureDates: ["30/05", "06/06", "13/06", "20/06"],
    isPromoted: false,
  },
  // Bạn có thể thêm các tour khác ở đây để thử nghiệm
  // Ví dụ: Để thử trạng thái rỗng, hãy đặt mảng này thành []
];

// Giả lập cuộc gọi API để lấy danh sách tour yêu thích
export const fetchFavoriteTours = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Để thử trạng thái rỗng, bạn có thể thay đổi dòng này:
      // resolve([]);
      resolve(mockFavoriteTours);
    }, 500); // Giả lập độ trễ mạng 500ms
  });
};
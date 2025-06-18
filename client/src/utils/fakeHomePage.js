export const regions = [
  {
    id: "mien-bac",
    name: "Miền Bắc",
    provinces: [
      {
        id: "ha-noi",
        name: "Hà Nội",
        image: "https://dulichsaigon.edu.vn/wp-content/uploads/2024/01/tim-hieu-dinh-nghia-du-lich-va-cac-loai-hinh-du-lich.jpg",
        description: "Thủ đô ngàn năm văn hiến với nhiều di tích lịch sử, văn hóa và ẩm thực đặc sắc.",
      },
      {
        id: "ha-long",
        name: "Hạ Long",
        image: "https://dulichsaigon.edu.vn/wp-content/uploads/2024/01/tim-hieu-dinh-nghia-du-lich-va-cac-loai-hinh-du-lich.jpg",
        description: "Vịnh biển với hàng nghìn hòn đảo đá vôi tạo nên cảnh quan thiên nhiên kỳ vĩ.",
      },
      {
        id: "sa-pa",
        name: "Sa Pa",
        image: "https://dulichsaigon.edu.vn/wp-content/uploads/2024/01/tim-hieu-dinh-nghia-du-lich-va-cac-loai-hinh-du-lich.jpg",
        description:
          "Thị trấn trong mây với ruộng bậc thang, văn hóa dân tộc đa dạng và khung cảnh thiên nhiên tuyệt đẹp.",
      },
      
    ],
  },
  {
    id: "mien-trung",
    name: "Miền Trung",
    provinces: [
      {
        id: "da-nang",
        name: "Đà Nẵng",
        image: "https://dulichsaigon.edu.vn/wp-content/uploads/2024/01/tim-hieu-dinh-nghia-du-lich-va-cac-loai-hinh-du-lich.jpg",
        description: "Thành phố biển xinh đẹp với cầu Rồng, bán đảo Sơn Trà và bãi biển Mỹ Khê nổi tiếng.",
      },
      {
        id: "hue",
        name: "Huế",
        image: "https://dulichsaigon.edu.vn/wp-content/uploads/2024/01/tim-hieu-dinh-nghia-du-lich-va-cac-loai-hinh-du-lich.jpg",
        description: "Cố đô với hệ thống di tích lịch sử, văn hóa phong phú và ẩm thực cung đình độc đáo.",
      },
      {
        id: "hoi-an",
        name: "Hội An",
        image: "https://dulichsaigon.edu.vn/wp-content/uploads/2024/01/tim-hieu-dinh-nghia-du-lich-va-cac-loai-hinh-du-lich.jpg",
        description: "Phố cổ yên bình với kiến trúc độc đáo, đèn lồng rực rỡ và không khí truyền thống đặc sắc.",
      },
    ],
  },
  {
    id: "mien-nam",
    name: "Miền Nam",
    provinces: [
      {
        id: "ho-chi-minh",
        name: "TP. Hồ Chí Minh",
        image: "https://dulichsaigon.edu.vn/wp-content/uploads/2024/01/tim-hieu-dinh-nghia-du-lich-va-cac-loai-hinh-du-lich.jpg",
        description: "Thành phố năng động nhất Việt Nam với nhiều điểm tham quan lịch sử, văn hóa và ẩm thực đa dạng.",
      },
      {
        id: "vung-tau",
        name: "Bà Rịa - Vũng Tàu",
        image: "https://dulichsaigon.edu.vn/wp-content/uploads/2024/01/tim-hieu-dinh-nghia-du-lich-va-cac-loai-hinh-du-lich.jpg",
        description: "Thành phố biển với bãi cát trắng mịn, nước biển trong xanh và nhiều điểm tham quan hấp dẫn.",
      },
      {
        id: "phu-quoc",
        name: "Phú Quốc",
        image: "https://dulichsaigon.edu.vn/wp-content/uploads/2024/01/tim-hieu-dinh-nghia-du-lich-va-cac-loai-hinh-du-lich.jpg",
        description: "Đảo ngọc với bãi biển tuyệt đẹp, rừng nguyên sinh và ẩm thực hải sản phong phú.",
      },
    ],
  },
];

export const popularTours = [
  {
    id: 1,
    name: "Đà Lạt - Thành phố ngàn hoa",
    tourCode: "DL001",
    startingProvince: "TP. Hồ Chí Minh",
    destinationProvince: "Đà Lạt",
    duration: "3N2Đ",
    transportation: "Xe khách",
    price: 2590000,
    discountedPrice: null,
    image: "https://dulichsaigon.edu.vn/wp-content/uploads/2024/01/tim-hieu-dinh-nghia-du-lich-va-cac-loai-hinh-du-lich.jpg",
    isBestseller: true,
    departureDates: ["28/05", "03/06", "04/06", "10/06"],
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
    image: "https://dulichsaigon.edu.vn/wp-content/uploads/2024/01/tim-hieu-dinh-nghia-du-lich-va-cac-loai-hinh-du-lich.jpg",
    isBestseller: false,
    departureDates: ["01/06", "08/06", "15/06", "22/06"],
  },
  {
    id: 3,
    name: "Hạ Long - Kỳ quan thiên nhiên thế giới",
    tourCode: "HL003",
    startingProvince: "Hà Nội",
    destinationProvince: "Hạ Long",
    duration: "2N1Đ",
    transportation: "Xe khách",
    price: 1890000,
    discountedPrice: null,
    image: "https://dulichsaigon.edu.vn/wp-content/uploads/2024/01/tim-hieu-dinh-nghia-du-lich-va-cac-loai-hinh-du-lich.jpg",
    isBestseller: true,
    departureDates: ["30/05", "06/06", "13/06", "20/06"],
  },
];
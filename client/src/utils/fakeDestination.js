// Mock data (thay thế bằng dữ liệu từ API thực tế sau này)
const mockRegions = [
  {
    id: "mien-bac",
    name: "Miền Bắc",
    provinces: [
      { id: "ha-noi", name: "Hà Nội" },
      { id: "ha-long", name: "Hạ Long" },
      { id: "sa-pa", name: "Sa Pa" },
      { id: "ninh-binh", name: "Ninh Bình" },
      { id: "ha-giang", name: "Hà Giang" },
      { id: "cao-bang", name: "Cao Bằng" },
    ],
  },
  {
    id: "mien-trung",
    name: "Miền Trung",
    provinces: [
      { id: "da-nang", name: "Đà Nẵng" },
      { id: "hue", name: "Huế" },
      { id: "hoi-an", name: "Hội An" },
      { id: "nha-trang", name: "Nha Trang" },
      { id: "quy-nhon", name: "Quy Nhon" },
      { id: "phu-yen", name: "Phú Yên" },
    ],
  },
  {
    id: "mien-nam",
    name: "Miền Nam",
    provinces: [
      { id: "ho-chi-minh", name: "TP. Hồ Chí Minh" },
      { id: "vung-tau", name: "Vũng Tàu" },
      { id: "phu-quoc", name: "Phú Quốc" },
      { id: "can-tho", name: "Cần Thơ" },
      { id: "dong-nai", name: "Đồng Nai" },
      { id: "tay-ninh", name: "Tây Ninh" },
    ],
  },
];

export const fetchDestinations = async () => {
  // Trong môi trường thực tế, bạn sẽ thay thế bằng lệnh gọi API thực sự, ví dụ:
  // const response = await fetch('/api/destinations');
  // const data = await response.json();
  // return data;

  // Mô phỏng độ trễ mạng
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockRegions);
    }, 700); // Giả lập độ trễ 700ms
  });
};
// Dữ liệu này mô phỏng các chỉ số chính bạn nhận được từ Google Analytics
export const mockGAStats = {
  totalUsers: {
    current: 12450,
    previous: 11800,
  },
  newUsers: {
    current: 9870,
    previous: 9500,
  },
  sessions: {
    current: 25600,
    previous: 24000,
  },
  bounceRate: {
    current: 45.6, // Tỷ lệ thoát hiện tại (%), thấp hơn là tốt hơn
    previous: 48.2, // Tỷ lệ thoát trước đó
  },
};

// Dữ liệu mô phỏng sự tăng trưởng người dùng theo thời gian (ví dụ: theo tháng)
export const mockUserGrowthData = [
  { period: "Tháng 1", users: 8500, newUsers: 6500 },
  { period: "Tháng 2", users: 9200, newUsers: 7200 },
  { period: "Tháng 3", users: 11500, newUsers: 8900 },
  { period: "Tháng 4", users: 10800, newUsers: 8500 },
  { period: "Tháng 5", users: 12450, newUsers: 9870 },
  { period: "Tháng 6", users: 11900, newUsers: 9300 },
];

// Dữ liệu mô phỏng nguồn truy cập của người dùng
export const mockTrafficSourceData = [
    { source: "Tìm kiếm tự nhiên (Google)", users: 7470, percentage: 60.0 },
    { source: "Mạng xã hội (Facebook, Instagram)", users: 2490, percentage: 20.0 },
    { source: "Truy cập trực tiếp", users: 1867, percentage: 15.0 },
    { source: "Giới thiệu (Referral)", users: 623, percentage: 5.0 },
];

// Dữ liệu mô phỏng các trang được truy cập nhiều nhất
export const mockTopPagesData = [
    { path: "/", name: "Trang chủ", views: 28900 },
    { path: "/tours/ha-long-bay", name: "Tour Vịnh Hạ Long", views: 15200 },
    { path: "/tours/phu-quoc-5n4d", name: "Tour Phú Quốc 5N4Đ", views: 12100 },
    { path: "/khuyen-mai", name: "Trang khuyến mãi", views: 9800 },
    { path: "/lien-he", name: "Trang liên hệ", views: 7650 },
];

// Dữ liệu mô phỏng phân tích theo khu vực địa lý
export const mockLocationData = [
    { city: "Hồ Chí Minh", users: 4855, percentage: 39.0 },
    { city: "Hà Nội", users: 3610, percentage: 29.0 },
    { city: "Đà Nẵng", users: 1245, percentage: 10.0 },
    { city: "Khác", users: 2740, percentage: 22.0 },
];


// Dữ liệu khách hàng hàng đầu (từ database nội bộ)
export const mockTopCustomers = [
    { id: "CUS001", name: "Nguyễn Văn A", totalSpent: 75000000, totalBookings: 5, joinDate: "2024-01-15" },
    { id: "CUS002", name: "Trần Thị B", totalSpent: 62500000, totalBookings: 3, joinDate: "2023-11-20" },
    { id: "CUS003", name: "Lê Văn C", totalSpent: 58000000, totalBookings: 8, joinDate: "2024-03-10" },
    { id: "CUS004", name: "Phạm Thị D", totalSpent: 45000000, totalBookings: 2, joinDate: "2024-02-28" },
]
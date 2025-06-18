export const mockStats = {
  totalTours: 45,
  activeTours: 38,
  totalDepartures: 156,
  upcomingDepartures: 23,
  totalBookings: 1247,
  pendingBookings: 15,
  totalRevenue: 2850000000,
  monthlyRevenue: 450000000,
  totalCustomers: 892,
  newCustomers: 67,
};

export const mockRecentBookings = [
  {
    id: "BK001",
    customerName: "Nguyễn Văn A",
    tourName: "Hà Nội - Hạ Long 3N2Đ",
    departureDate: "2025-06-15",
    status: "confirmed",
    amount: 6400000,
  },
  {
    id: "BK002",
    customerName: "Trần Thị B",
    tourName: "Hồ Chí Minh - Phú Quốc 5N4Đ",
    departureDate: "2025-07-01",
    status: "pending",
    amount: 17600000,
  },
  {
    id: "BK003",
    customerName: "Lê Văn C",
    tourName: "Hà Nội - Đà Nẵng 4N3Đ",
    departureDate: "2025-06-20",
    status: "confirmed",
    amount: 13600000,
  },
  {
    id: "BK004",
    customerName: "Phạm Thị D",
    tourName: "Hà Nội - Hạ Long 3N2Đ",
    departureDate: "2025-06-25",
    status: "cancelled",
    amount: 6400000,
  },
];

export const mockPopularTours = [
  {
    id: "t1",
    name: "Hà Nội - Hạ Long 3N2Đ",
    bookings: 156,
    revenue: 499200000,
    rating: 4.8,
  },
  {
    id: "t2",
    name: "Hồ Chí Minh - Phú Quốc 5N4Đ",
    bookings: 89,
    revenue: 783200000,
    rating: 4.9,
  },
  {
    id: "t3",
    name: "Hà Nội - Đà Nẵng 4N3Đ",
    bookings: 134,
    revenue: 910400000,
    rating: 4.7,
  },
  {
    id: "t4",
    name: "Đà Nẵng - Hội An 2N1Đ",
    bookings: 78,
    revenue: 234000000,
    rating: 4.6,
  },
];

export const mockMonthlyData = [
  { month: "T1", revenue: 380000000, bookings: 95 },
  { month: "T2", revenue: 420000000, bookings: 105 },
  { month: "T3", revenue: 450000000, bookings: 112 },
  { month: "T4", revenue: 380000000, bookings: 98 },
  { month: "T5", revenue: 520000000, bookings: 128 },
  { month: "T6", revenue: 450000000, bookings: 115 },
];
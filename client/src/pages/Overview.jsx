// Overview.jsx
"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MapIcon,
  CalendarIcon,
  UserIcon,
  CreditCardIcon,
  TrendingUpIcon,
  EyeIcon,
  StarIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Import các async thunks từ slice
import {
  fetchOverviewStats,
  fetchMonthlyRevenue,
  fetchPopularTours,
  fetchRecentBookings,
} from "../redux/slices/overviewSlice";
import { toast } from "sonner"; // Giả định bạn đã có sonner để hiển thị toast

export default function Overview() {
  const [timeRange, setTimeRange] = useState("30");
  const dispatch = useDispatch();

  // Lấy dữ liệu và trạng thái loading/error từ Redux store
  const {
    stats = {},
    monthlyData = [],
    popularTours = [],
    recentBookings = [],
    loadingStats,
    loadingMonthly,
    loadingTours,
    loadingBookings,
    errorStats,
    errorMonthly,
    errorTours,
    errorBookings,
  } = useSelector((state) => state.overview);

  useEffect(() => {
    // Dispatch tất cả các action khi timeRange thay đổi
    dispatch(fetchOverviewStats(timeRange));
    dispatch(fetchMonthlyRevenue(timeRange));
    dispatch(fetchPopularTours(timeRange));
    dispatch(fetchRecentBookings(timeRange));
  }, [dispatch, timeRange]);

  useEffect(() => {
    [errorStats, errorMonthly, errorTours, errorBookings].forEach((err, index) => {
      if (err) {
        toast.error(`Lỗi khi tải dữ liệu ${['thống kê', 'doanh thu', 'tour phổ biến', 'booking gần đây'][index]}`, {
          description: err.message || "Vui lòng thử lại sau.",
        });
      }
    });
  }, [errorStats, errorMonthly, errorTours, errorBookings]);

  const formatCurrency = (amount) => {
    // Ensure amount is a number before formatting
    if (typeof amount !== 'number') {
      amount = 0; // Default to 0 or handle as appropriate for your UI
    }
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge className="bg-green-100 hover:bg-green-300 text-black">
            Đã xác nhận
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 hover:bg-yellow-300 text-black">
            Chờ xác nhận
          </Badge>
        );
      case "cancelled":
        return <Badge className="bg-red-100 hover:bg-red-300 text-black">Đã hủy</Badge>;
      default:
        return <Badge variant="outline" className="text-black">{status}</Badge>;
    }
  };

  // It's good that you have a loading state. This will prevent rendering until data starts coming in.
  if (loadingStats || loadingMonthly || loadingTours || loadingBookings) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">Đang tải dữ liệu tổng quan...</p>
      </div>
    );
  }

  // Ensure monthlyData is a valid array for map operation (already handled with = [])
  const processedMonthlyData = monthlyData.map(item => ({
    ...item,
    month: `Tháng ${item.month}`,
    revenue: Number(item.revenue) || 0, // Ensure revenue is a number
  }));


  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b p-4 shadow-sm">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Tổng quan</h1>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Chọn khoảng thời gian" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 ngày qua</SelectItem>
                <SelectItem value="30">30 ngày qua</SelectItem>
                <SelectItem value="90">3 tháng qua</SelectItem>
                <SelectItem value="365">1 năm qua</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 space-y-6">
        {/* Thống kê tổng quan */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:shadow-lg transition-shadow duration-300 ease-in-out">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tổng số tour
              </CardTitle>
              <MapIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {/* Add optional chaining or provide default values for display */}
              <div className="text-2xl font-bold">{stats.totalTours ?? 0}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600 flex items-center">
                  <TrendingUpIcon className="h-3 w-3 mr-1" />
                  {stats.activeTours ?? 0} đang hoạt động
                </span>
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300 ease-in-out">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chuyến đi</CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalDepartures ?? 0}
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-blue-600 flex items-center">
                  <CalendarIcon className="h-3 w-3 mr-1" />
                  {stats.upcomingDepartures ?? 0} sắp tới
                </span>
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300 ease-in-out">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Booking</CardTitle>
              <UserIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBookings ?? 0}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-yellow-600 flex items-center">
                  <EyeIcon className="h-3 w-3 mr-1" />
                  {stats.pendingBookings ?? 0} chờ xử lý
                </span>
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300 ease-in-out">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Doanh thu</CardTitle>
              <CreditCardIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(stats.totalRevenue ?? 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600 flex items-center">
                  <TrendingUpIcon className="h-3 w-3 mr-1" />
                  +{
                    stats.totalRevenue > 0 && stats.monthlyRevenue !== undefined // Add monthlyRevenue check
                      ? ((stats.monthlyRevenue / stats.totalRevenue) * 100).toFixed(1)
                      : 0
                  }% tháng này
                </span>
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Biểu đồ doanh thu theo tháng */}
          <Card>
            <CardHeader>
              <CardTitle>Doanh thu theo tháng</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={processedMonthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `${(value / 1000000).toFixed(0)} tr`} />
                  <Tooltip
                    cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
                    formatter={(value) => formatCurrency(value)}
                    labelFormatter={(label) => `${label}`} // Do đã format "Tháng X" ở trên
                  />
                  <Bar dataKey="revenue" fill="#8884d8" name="Doanh thu" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 text-center text-sm text-muted-foreground">
                Dữ liệu doanh thu theo từng tháng.
              </div>
            </CardContent>
          </Card>

          {/* Tour phổ biến */}
          <Card>
            <CardHeader>
              <CardTitle>Tour phổ biến</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {popularTours.length > 0 ? (
                  popularTours.map((tour, index) => (
                    <div
                      key={tour.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-600">
                            #{index + 1}
                          </span>
                          <h4 className="font-medium text-sm">{tour.name}</h4>
                        </div>
                        <div className="flex items-center space-x-4 mt-1 pl-6">
                          <span className="text-xs text-muted-foreground">
                            {tour.bookings ?? 0} booking
                          </span>
                          <div className="flex items-center">
                            <StarIcon className="h-3 w-3 text-yellow-500 fill-current" />
                            <span className="text-xs text-muted-foreground ml-1">
                              {tour.rating ? tour.rating.toFixed(1) : 0}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {formatCurrency(tour.revenue ?? 0)}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground">Không có dữ liệu tour phổ biến.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booking gần đây */}
        <Card>
          <CardHeader>
            <CardTitle>Booking gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium   tracking-wider">
                      Mã booking
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium   tracking-wider">
                      Khách hàng
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium   tracking-wider">
                      Tour
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium   tracking-wider">
                      Ngày khởi hành
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium   tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium   tracking-wider">
                      Số tiền
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentBookings.length > 0 ? (
                    recentBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {booking.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {booking.customerName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {booking.tourName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(booking.departureDate).toLocaleDateString(
                            "vi-VN"
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(booking.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(booking.amount)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-sm text-muted-foreground">
                        Không có dữ liệu booking gần đây.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-center">
              <Button variant="outline">Xem tất cả booking</Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
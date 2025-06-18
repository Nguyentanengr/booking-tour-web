"use client";

import { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  MousePointerClick,
  TrendingUp,
  TrendingDown,
  MapPin,
  FileText,
  Crown,
  MoreVertical,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

// Import biểu đồ và dữ liệu giả lập
// LƯU Ý: Bạn cần cài đặt thư viện biểu đồ, ví dụ: recharts
// npm install recharts
import { UserGrowthChart, TrafficSourceDonutChart } from "../pages/charts/CustomerCharts"; // Component biểu đồ mới
import {
  mockGAStats,
  mockUserGrowthData,
  mockTrafficSourceData,
  mockTopPagesData,
  mockLocationData,
  mockTopCustomers,
} from "../utils/fakeCustomerAnalytics";

export default function CustomersAnalytics() {
  const [timeRange, setTimeRange] = useState("30");
  const [analyticsData, setAnalyticsData] = useState(mockGAStats);

  // TODO: Tích hợp API thật
  // useEffect(() => {
  //   console.log(`Đang lấy dữ liệu cho ${timeRange} ngày qua...`);
  //   // API Calls sẽ được đặt ở đây.
  //   // Dữ liệu lấy từ Google Analytics (free tier) thường bao gồm:
  //   // - users, newUsers, sessions, bounceRate
  //   // - user data by country/city
  //   // - pageviews by page path
  //   // - sessions by source/medium
  //   // Các truy vấn này đều cơ bản và không phức tạp.
  //   //
  //   // Dữ liệu từ hệ thống của bạn:
  //   // - Danh sách khách hàng và chi tiêu của họ.
  // }, [timeRange]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const renderChange = (current, previous, reverseColors = false) => {
    const change = previous === 0 ? 0 : ((current - previous) / previous) * 100;
    const isPositive = change >= 0;

    const positiveColor = reverseColors ? "text-red-500" : "text-emerald-500";
    const negativeColor = reverseColors ? "text-emerald-500" : "text-red-500";
    
    const color = isPositive ? positiveColor : negativeColor;
    const Icon = isPositive ? TrendingUp : TrendingDown;

    return (
      <span className={`flex items-center text-xs font-medium ${color}`}>
        <Icon className="h-4 w-4 mr-1" />
        {change.toFixed(1)}%
      </span>
    );
  };

  // ----- CÁC COMPONENT CON CHO GỌN GÀNG -----

  // Component cho các thẻ KPI ở cột phải
  const KpiCard = ({ title, value, icon: Icon, current, previous, reverseColors }) => (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline space-x-2">
            <p className="text-2xl font-bold">{value}</p>
            {renderChange(current, previous, reverseColors)}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 lg:p-6">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Phân tích Khách hàng</h1>
          <p className="text-muted-foreground mt-1">
            Tổng quan về hành vi và tăng trưởng người dùng.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-48 bg-white shadow-sm">
              <SelectValue placeholder="Chọn khoảng thời gian" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 ngày qua</SelectItem>
              <SelectItem value="30">30 ngày qua</SelectItem>
              <SelectItem value="90">90 ngày qua</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      <main className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* === CỘT CHÍNH (BÊN TRÁI) === */}
        <div className="xl:col-span-3 space-y-6">
          {/* Biểu đồ tăng trưởng người dùng */}
          <Card>
            <CardHeader>
              <CardTitle>Tăng trưởng người dùng</CardTitle>
              <CardDescription>
                Tổng số người dùng và người dùng mới trong khoảng thời gian đã chọn.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Component biểu đồ mới */}
              <div className="h-[300px] w-full">
                 <UserGrowthChart data={mockUserGrowthData} />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
             {/* Phân tích nguồn truy cập */}
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Nguồn truy cập</CardTitle>
                    <CardDescription>Phân bổ người dùng theo nguồn.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[250px] w-full">
                        <TrafficSourceDonutChart data={mockTrafficSourceData} />
                    </div>
                </CardContent>
            </Card>

            {/* Phân tích theo khu vực */}
            <Card className="lg:col-span-3">
                <CardHeader>
                    <CardTitle>Phân tích theo khu vực</CardTitle>
                    <CardDescription>Top 5 thành phố có nhiều người dùng nhất.</CardDescription>
                </CardHeader>
                <CardContent>
                   <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead><MapPin className="h-4 w-4 inline-block mr-2" />Thành phố</TableHead>
                        <TableHead className="text-right">Số người dùng</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockLocationData.slice(0, 5).map(loc => (
                        <TableRow key={loc.city}>
                          <TableCell className="font-medium">{loc.city}</TableCell>
                          <TableCell className="text-right font-semibold">{loc.users.toLocaleString()} <span className="text-xs text-muted-foreground">({loc.percentage}%)</span></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
            </Card>
          </div>

          {/* Khách hàng hàng đầu */}
          <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Khách hàng hàng đầu</CardTitle>
                        <CardDescription>Dựa trên tổng chi tiêu trong hệ thống.</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm">Xem tất cả <ArrowRight className="h-4 w-4 ml-2" /></Button>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead><Crown className="h-4 w-4 inline-block mr-2" />Khách hàng</TableHead>
                        <TableHead>Tổng chi tiêu</TableHead>
                        <TableHead>Tổng số booking</TableHead>
                        <TableHead>Ngày tham gia</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockTopCustomers.map(customer => (
                        <TableRow key={customer.id}>
                            <TableCell className="font-medium">{customer.name}</TableCell>
                            <TableCell className="font-semibold text-emerald-600">{formatCurrency(customer.totalSpent)}</TableCell>
                            <TableCell>{customer.totalBookings}</TableCell>
                            <TableCell>{new Date(customer.joinDate).toLocaleDateString("vi-VN")}</TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
          </Card>

        </div>

        {/* === CỘT PHỤ (BÊN PHẢI) === */}
        <div className="xl:col-span-1 space-y-6">
            {/* Thẻ KPI */}
            <div className="space-y-4">
                <KpiCard 
                    title="Tổng số người dùng" 
                    value={analyticsData.totalUsers.current.toLocaleString()} 
                    icon={Users}
                    current={analyticsData.totalUsers.current}
                    previous={analyticsData.totalUsers.previous}
                />
                <KpiCard 
                    title="Người dùng mới" 
                    value={analyticsData.newUsers.current.toLocaleString()} 
                    icon={UserPlus}
                    current={analyticsData.newUsers.current}
                    previous={analyticsData.newUsers.previous}
                />
                <KpiCard 
                    title="Số phiên" 
                    value={analyticsData.sessions.current.toLocaleString()} 
                    icon={MousePointerClick}
                    current={analyticsData.sessions.current}
                    previous={analyticsData.sessions.previous}
                />
                <KpiCard 
                    title="Tỷ lệ thoát" 
                    value={`${analyticsData.bounceRate.current}%`} 
                    icon={TrendingDown}
                    current={analyticsData.bounceRate.current}
                    previous={analyticsData.bounceRate.previous}
                    reverseColors={true}
                />
            </div>
            {/* Trang được truy cập nhiều nhất */}
            <Card>
                <CardHeader>
                    <CardTitle>Trang truy cập nhiều nhất</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                    {mockTopPagesData.map((page, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <div className="flex-1 overflow-hidden">
                                <p className="font-medium truncate text-sm">{page.name}</p>
                                <p className="text-xs text-muted-foreground truncate">{page.path}</p>
                            </div>
                            <p className="ml-4 font-semibold text-sm">{page.views.toLocaleString()}</p>
                        </div>
                    ))}
                    </div>
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const ViewBookingDialog = ({ open, onOpenChange, booking }) => {
  // Định dạng ngày
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Định dạng tiền tệ
  const formatCurrency = (amount) => {
    return amount.toLocaleString("vi-VN") + "đ";
  };

  // Lấy màu badge cho trạng thái
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "confirmed":
        return "success";
      case "pending":
        return "warning";
      case "cancelled":
        return "destructive";
      case "completed":
        return "default";
      default:
        return "outline";
    }
  };

  // Lấy tên trạng thái tiếng Việt
  const getStatusText = (status) => {
    switch (status) {
      case "confirmed":
        return "Đã xác nhận";
      case "pending":
        return "Chờ xác nhận";
      case "cancelled":
        return "Đã hủy";
      case "completed":
        return "Hoàn thành";
      default:
        return status;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Chi tiết Booking</DialogTitle>
        </DialogHeader>

        {booking && (
          <div className="space-y-6">
            {/* Thông tin booking */}
            <Card>
              <CardHeader>
                <CardTitle>Thông tin chung</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Booking ID</Label>
                  <p className="text-sm">{booking._id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Trạng thái</Label>
                  <div>
                    <Badge variant={getStatusBadgeVariant(booking.status)}>
                      {getStatusText(booking.status)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Tour</Label>
                  <p className="text-sm">{booking.tour_name || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Ngày khởi hành</Label>
                  <p className="text-sm">{formatDate(booking.departure_date) || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Tổng tiền</Label>
                  <p className="text-sm font-bold text-green-600">{formatCurrency(booking.total_price)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Ngày tạo</Label>
                  <p className="text-sm">{formatDate(booking.created_at)}</p>
                </div>
              </CardContent>
            </Card>

            {/* Thông tin khách hàng */}
            <Card>
              <CardHeader>
                <CardTitle>Thông tin khách hàng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={booking.user.avatar_url || "/placeholder.svg"}
                      alt={booking.user.name}
                    />
                    <AvatarFallback>
                      {booking.user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{booking.user.name}</p>
                    <p className="text-sm text-gray-500">ID: {booking.user.user_id}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Danh sách hành khách */}
            <Card>
              <CardHeader>
                <CardTitle>Danh sách hành khách ({booking.passengers.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {booking.passengers.map((passenger, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Họ tên</Label>
                          <p className="text-sm">{passenger.full_name}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Ngày sinh</Label>
                          <p className="text-sm">{formatDate(passenger.date_of_birth)}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Giới tính</Label>
                          <p className="text-sm">{passenger.gender}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Số điện thoại</Label>
                          <p className="text-sm">{passenger.phone_number}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Loại khách</Label>
                          <p className="text-sm">{passenger.type}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Giá</Label>
                          <p className="text-sm">{formatCurrency(passenger.price)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Dịch vụ bổ sung */}
            {booking.additional_services.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Dịch vụ bổ sung</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {booking.additional_services.map((service, index) => (
                      <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{service.name}</p>
                          <p className="text-sm text-gray-500">ID: {service.service_id}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {formatCurrency(service.price)} x {service.quantity}
                          </p>
                          <p className="text-sm text-gray-500">
                            Tổng: {formatCurrency(service.price * service.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewBookingDialog;
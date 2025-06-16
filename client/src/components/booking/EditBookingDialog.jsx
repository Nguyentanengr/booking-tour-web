import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { PlusIcon, TrashIcon } from "lucide-react";
import { mockTours, mockDepartures, mockServices } from "@/utils/fakeBookings2";

// Dữ liệu mock cho dịch vụ bổ sung


export default function EditBookingDialog({ open, onOpenChange, formData, handleFormChange, addPassenger, removePassenger, updatePassenger, addService, removeService, updateService, calculateTotal, handleAddBooking }) {
    const validateForm = () => {
        const errors = {};
        if (!formData.tour_id) errors.tour_id = "Tour là bắt buộc";
        if (!formData.departure_id) errors.departure_id = "Ngày khởi hành là bắt buộc";
        if (!formData.status) errors.status = "Trạng thái là bắt buộc";

        formData.passengers?.forEach((passenger, index) => {
            if (!passenger.full_name) errors[`passenger_name_${index}`] = "Họ tên là bắt buộc";
            if (!passenger.date_of_birth) errors[`passenger_dob_${index}`] = "Ngày sinh là bắt buộc";
            if (!passenger.gender) errors[`passenger_gender_${index}`] = "Giới tính là bắt buộc";
            if (passenger.price <= 0) errors[`passenger_price_${index}`] = "Giá phải lớn hơn 0";
            if (passenger.phone_number && !/^\d{10}$/.test(passenger.phone_number)) {
                errors[`passenger_phone_${index}`] = "Số điện thoại phải là 10 chữ số";
            }
        });

        formData.additional_services?.forEach((service, index) => {
            if (!service.name) errors[`service_name_${index}`] = "Tên dịch vụ là bắt buộc";
            if (service.price <= 0) errors[`service_price_${index}`] = "Giá phải lớn hơn 0";
            if (service.quantity <= 0) errors[`service_quantity_${index}`] = "Số lượng phải lớn hơn 0";
        });

        return errors;
    };

    const handleSubmit = () => {
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            alert(Object.values(errors).join("\n")); // Hiển thị tất cả lỗi
            return;
        }
        handleAddBooking();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="min-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Chỉnh sửa booking</DialogTitle>
                    <DialogDescription>Điền đầy đủ thông tin để cập nhật lại booking</DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Thông tin cơ bản */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="user_name">
                                Tên khách hàng <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="user_name"
                                value={formData.user?.name || ""}
                                onChange={(e) => handleFormChange("user", { ...formData.user, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="user_id">Số điện thoại <span className="text-red-500">*</span></Label> 
                            <Input
                                id="user_id"
                                value={formData.user?.phone_number || ""}
                                onChange={(e) => handleFormChange("user", { ...formData.user, phone_number: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tour_id">
                                Tour <span className="text-red-500">*</span>
                            </Label>
                            <Select value={formData.tour_id || ""} onValueChange={(value) => handleFormChange("tour_id", value)}>
                                <SelectTrigger className="min-w-[300px]" id="tour_id">
                                    <SelectValue placeholder="Chọn tour" />
                                </SelectTrigger>
                                <SelectContent>
                                    {mockTours.map((tour) => (
                                        <SelectItem key={tour._id} value={tour._id}>
                                            {tour.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="departure_id">
                                Ngày khởi hành <span className="text-red-500">*</span>
                            </Label>
                            <Select value={formData.departure_id || ""} onValueChange={(value) => handleFormChange("departure_id", value)}>
                                <SelectTrigger className="min-w-[300px]" id="departure_id">
                                    <SelectValue placeholder="Chọn ngày khởi hành" />
                                </SelectTrigger>
                                <SelectContent>
                                    {mockDepartures.map((departure) => (
                                        <SelectItem key={departure._id} value={departure._id}>
                                            {new Date(departure.departure_date).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })} - {new Date(departure.return_date).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status">
                                Trạng thái <span className="text-red-500">*</span>
                            </Label>
                            <Select value={formData.status || ""} onValueChange={(value) => handleFormChange("status", value)}>
                                <SelectTrigger className="min-w-[150px]" id="status">
                                    <SelectValue placeholder="Chọn trạng thái" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending_payment">Chờ thanh toán</SelectItem>
                                    <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                                    <SelectItem value="cancelled">Đã hủy</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Danh sách hành khách */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-lg font-semibold">Danh sách hành khách</Label>
                            <Button type="button" variant="outline" size="sm" onClick={addPassenger}>
                                <PlusIcon className="h-4 w-4 mr-2" /> Thêm hành khách
                            </Button>
                        </div>
                        {(formData.passengers || []).map((passenger, index) => (
                            <Card key={index} className="p-4 border rounded-lg">
                                <div className="flex items-center justify-between mb-4">
                                    <Label className="font-medium">Hành khách {index + 1}</Label>
                                    {(formData.passengers || []).length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removePassenger(index)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <TrashIcon className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor={`passenger_name_${index}`}>Họ tên <span className="text-red-500">*</span></Label>
                                        <Input
                                            id={`passenger_name_${index}`}
                                            value={passenger.full_name}
                                            onChange={(e) => updatePassenger(index, "full_name", e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor={`passenger_dob_${index}`}>Ngày sinh <span className="text-red-500">*</span></Label>
                                        <Input
                                            id={`passenger_dob_${index}`}
                                            type="date"
                                            value={passenger.date_of_birth}
                                            onChange={(e) => updatePassenger(index, "date_of_birth", e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor={`passenger_gender_${index}`}>Giới tính <span className="text-red-500">*</span></Label>
                                        <Select
                                            value={passenger.gender}
                                            onValueChange={(value) => updatePassenger(index, "gender", value)}
                                        >
                                            <SelectTrigger className="min-w-[183px]" id={`passenger_gender_${index}`}>
                                                <SelectValue placeholder="Chọn giới tính" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Male">Nam</SelectItem>
                                                <SelectItem value="Female">Nữ</SelectItem>
                                                <SelectItem value="Other">Khác</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor={`passenger_phone_${index}`}>Số điện thoại</Label>
                                        <Input
                                            id={`passenger_phone_${index}`}
                                            value={passenger.phone_number}
                                            onChange={(e) => updatePassenger(index, "phone_number", e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor={`passenger_type_${index}`}>Loại khách</Label>
                                        <Select
                                            value={passenger.type}
                                            onValueChange={(value) => updatePassenger(index, "type", value)}
                                        >
                                            <SelectTrigger className="min-w-[120px]" id={`passenger_type_${index}`}>
                                                <SelectValue placeholder="Chọn loại khách" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="adult">Người lớn</SelectItem>
                                                <SelectItem value="child">Trẻ em</SelectItem>
                                                <SelectItem value="infant">Em bé</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor={`passenger_price_${index}`}>Giá <span className="text-red-500">*</span></Label>
                                        <Input
                                            id={`passenger_price_${index}`}
                                            type="text"
                                            min="0"
                                            value={passenger.price.toLocaleString("vi-VN")}
                                            onChange={(e) => {
                                                const raw = e.target.value.replace(/\./g, ""); // loại bỏ dấu chấm
                                                const parsed = Number.parseInt(raw) || 0;
                                                updatePassenger(index, "price", parsed);
                                            }}
                                        />
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* Dịch vụ bổ sung */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-lg font-semibold">Dịch vụ bổ sung</Label>
                            <Button type="button" variant="outline" size="sm" onClick={addService}>
                                <PlusIcon className="h-4 w-4 mr-2" /> Thêm dịch vụ
                            </Button>
                        </div>
                        {(formData.additional_services || []).map((service, index) => (
                            <Card key={index} className="p-4 border rounded-lg">
                                <div className="flex items-center justify-between mb-4">
                                    <Label className="font-medium">Dịch vụ {index + 1}</Label>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeService(index)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="grid grid-cols-4 gap-4">
                                    <div className="col-span-2 space-y-2">
                                        <Label htmlFor={`service_name_${index}`}>Tên dịch vụ</Label>
                                        <Select
                                            value={service.name}
                                            onValueChange={(value) => updateService(index, "name", value)}
                                        >
                                            <SelectTrigger className="w-full" id={`service_name_${index}`}>
                                                <SelectValue placeholder="Chọn dịch vụ" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {mockServices.map((serviceOption) => (
                                                    <SelectItem key={serviceOption.service_id} value={serviceOption.name}>
                                                        {serviceOption.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="col-span-1 space-y-2">
                                        <Label htmlFor={`service_price_${index}`}>Giá</Label>
                                        <Input
                                            id={`service_price_${index}`}
                                            type="text"
                                            min="0"
                                            value={service.price.toLocaleString("vi-VN")}
                                            onChange={(e) => updateService(index, "price", Number.parseInt(e.target.value) || 0)}
                                            disabled
                                        />
                                    </div>

                                    <div className="col-span-1 space-y-2">
                                        <Label htmlFor={`service_quantity_${index}`}>Số lượng</Label>
                                        <Input
                                            id={`service_quantity_${index}`}
                                            type="number"
                                            min="1"
                                            value={service.quantity}
                                            onChange={(e) => updateService(index, "quantity", Number.parseInt(e.target.value) || 1)}
                                        />
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* Tổng tiền */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                            <Label className="text-lg font-semibold">Tổng tiền:</Label>
                            <span className="text-2xl font-bold text-green-600">{calculateTotal().toLocaleString("vi-VN")}đ</span>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Hủy
                    </Button>
                    <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
                        Cập nhật booking
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
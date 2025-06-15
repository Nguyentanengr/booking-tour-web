"use client";

import { useState, useEffect } from "react"; // Import useEffect
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CalendarDays, Check, Clock, Eye, Search, Trash2, X, Edit, MoreHorizontal, ScanSearch, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { mockDepartures } from "../utils/fakeDepartures";
import AddDepartureDialog from "@/components/departure/AddDepartureDialog";
import EditDepartureDialog from "@/components/departure/EditDepartureDialog";
import DeleteDepartureDialog from "@/components/departure/DeleteDepartureDialog";
import DetailDepartureDialog from "@/components/departure/DetailDepartureDialog";
import BookingListDialog from "@/components/departure/BookingListDialog";
import ConfirmStatusChangeDialog from "@/components/departure/ConfirmStatusChangeDialog";

// Simple toast component
const Toast = ({ message, type, onClose }) => {
    if (!message) return null;
    return (
        <div
            className={`fixed top-20 right-4 p-4 rounded-md shadow-lg text-white ${type === "success" ? "bg-green-600" : "bg-red-600"}`}
        >
            {message}
            <button className="ml-4" onClick={onClose}>
                ✕
            </button>
        </div>
    );
};

const Departure = () => {
    const [departures, setDepartures] = useState([]); // Khởi tạo mảng rỗng
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [dateFromFilter, setDateFromFilter] = useState("");
    const [dateToFilter, setDateToFilter] = useState("");
    const [sortBy, setSortBy] = useState("departure_date");
    const [sortOrder, setSortOrder] = useState("asc");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
    const [isBookingListDialogOpen, setIsBookingListDialogOpen] = useState(false);
    const [isConfirmStatusChangeOpen, setIsConfirmStatusChangeOpen] = useState(false);
    const [selectedDeparture, setSelectedDeparture] = useState(null);
    const [statusToChange, setStatusToChange] = useState(null);
    const [toast, setToast] = useState({ message: "", type: "" });

    // State cho phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const [departuresPerPage, setDeparturesPerPage] = useState(10); // Số chuyến đi mỗi trang, có thể thay đổi

    // Sử dụng useEffect để chỉ tải dữ liệu mockDepartures một lần khi component mount
    useEffect(() => {
        setDepartures(mockDepartures);
    }, []); // Dependency rỗng đảm bảo chỉ chạy một lần khi mount

    const status = {
        pending: { label: "Chờ xác nhận", color: "bg-yellow-100 text-yellow-800", icon: Clock },
        confirmed: { label: "Đã xác nhận", color: "bg-green-100 text-green-800", icon: Check },
        cancelled: { label: "Đã hủy", color: "bg-red-100 text-red-800", icon: X },
        completed: { label: "Đã hoàn thành", color: "bg-blue-100 text-blue-800", icon: CalendarDays },
    };

    const showToast = (message, type) => {
        setToast({ message, type });
        setTimeout(() => setToast({ message: "", type: "" }), 3000);
    };

    const filteredDepartures = departures
        .filter((departure) => {
            const matchesSearch =
                departure.tour_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                departure.tour_name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === "all" || departure.status === statusFilter;
            const matchesDateRange =
                (!dateFromFilter || new Date(departure.departure_date) >= new Date(dateFromFilter)) &&
                (!dateToFilter || new Date(departure.departure_date) <= new Date(dateToFilter));
            return matchesSearch && matchesStatus && matchesDateRange;
        })
        .sort((a, b) => {
            let comparison = 0;
            if (sortBy === "departure_id") {
                comparison = a._id.localeCompare(b._id);
            } else if (sortBy === "tour_code") {
                comparison = a.tour_code.localeCompare(b.tour_code);
            } else if (sortBy === "departure_date") {
                comparison = new Date(a.departure_date) - new Date(b.departure_date);
            }
            return sortOrder === "asc" ? comparison : -comparison;
        });

    // Logic phân trang
    const indexOfLastDeparture = currentPage * departuresPerPage;
    const indexOfFirstDeparture = indexOfLastDeparture - departuresPerPage;
    const currentDepartures = filteredDepartures.slice(indexOfFirstDeparture, indexOfLastDeparture);
    const totalPages = Math.ceil(filteredDepartures.length / departuresPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleAdd = (newDeparture) => {
        setDepartures((prev) => [...prev, newDeparture]);
        showToast("Thêm chuyến đi thành công!", "success");
    };

    const handleEdit = (updatedDeparture) => {
        setDepartures((prev) =>
            prev.map((dep) => (dep._id === updatedDeparture._id ? updatedDeparture : dep))
        );
        showToast("Cập nhật chuyến đi thành công!", "success");
    };

    const handleDelete = (departureId, reason, hasBookings) => {
        if (hasBookings) {
            setDepartures((prev) =>
                prev.map((dep) =>
                    dep._id === departureId ? { ...dep, status: "cancelled" } : dep
                )
            );
            showToast("Hủy chuyến đi thành công!", "success");
        } else {
            setDepartures((prev) => prev.filter((dep) => dep._id !== departureId));
            showToast("Xóa chuyến đi thành công!", "success");
        }
        // Sau khi xóa, kiểm tra lại trang hiện tại để tránh trang trống
        if (currentDepartures.length === 1 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleStatusChange = (departureId, newStatus) => {
        setSelectedDeparture(departures.find((dep) => dep._id === departureId));
        setStatusToChange(newStatus);
        setIsConfirmStatusChangeOpen(true);
    };

    const confirmStatusChange = (departureId, newStatus) => {
        setDepartures((prev) =>
            prev.map((dep) => (dep._id === departureId ? { ...dep, status: newStatus } : dep))
        );
        showToast(
            `Chuyến đi đã được ${newStatus === "confirmed" ? "xác nhận" : "hủy"} thành công!`,
            "success"
        );
    };

    const formatCurrency = (amount) =>
        new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

    const formatDate = (date) => format(date, "dd/MM/yyyy", { locale: vi });

    return (
        <div className="container mx-auto py-6 px-4">
            <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ message: "", type: "" })}
            />

            {/* Statistics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng chuyến đi</CardTitle>
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{departures.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Chờ xác nhận</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{departures.filter((d) => d.status === "pending").length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Đã xác nhận</CardTitle>
                        <Check className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{departures.filter((d) => d.status === "confirmed").length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Đã hoàn thành</CardTitle>
                        <CalendarDays className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{departures.filter((d) => d.status === "completed").length}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters and Add Button */}
            <div className="flex items-end gap-4 mb-4">
                <div className="grid gap-4 md:grid-cols-5 grid-cols-1 w-full">
                    <div className="space-y-2">
                        <Label htmlFor="search">Tìm kiếm</Label>
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="search"
                                placeholder="Mã tour, tên tour..."
                                className="pl-8 w-full max-w-xs"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="status">Trạng thái</Label>
                        <Select value={statusFilter} onValueChange={setStatusFilter} className="w-full max-w-xs">
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                                <SelectItem value="pending">Chờ xác nhận</SelectItem>
                                <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                                <SelectItem value="cancelled">Đã hủy</SelectItem>
                                <SelectItem value="completed">Đã hoàn thành</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="date_from">Từ ngày</Label>
                        <Input
                            id="date_from"
                            type="date"
                            value={dateFromFilter}
                            className="w-full max-w-xs"
                            onChange={(e) => setDateFromFilter(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="date_to">Đến ngày</Label>
                        <Input
                            id="date_to"
                            type="date"
                            value={dateToFilter}
                            className="w-full max-w-xs"
                            onChange={(e) => setDateToFilter(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="sort_by">Sắp xếp theo</Label>
                        <Select
                            value={`${sortBy}:${sortOrder}`}
                            onValueChange={(value) => {
                                const [by, order] = value.split(":");
                                setSortBy(by);
                                setSortOrder(order);
                            }}
                            className="w-full max-w-xs"
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="departure_id:asc">Mã chuyến đi (A-Z)</SelectItem>
                                <SelectItem value="departure_id:desc">Mã chuyến đi (Z-A)</SelectItem>
                                <SelectItem value="tour_code:asc">Mã tour (A-Z)</SelectItem>
                                <SelectItem value="tour_code:desc">Mã tour (Z-A)</SelectItem>
                                <SelectItem value="departure_date:asc">Ngày khởi hành (Cũ nhất)</SelectItem>
                                <SelectItem value="departure_date:desc">Ngày khởi hành (Mới nhất)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <AddDepartureDialog isOpen={isAddDialogOpen} setIsOpen={setIsAddDialogOpen} onAdd={handleAdd} />
            </div>

            {/* Table */}
            <div className="w-full overflow-x-auto rounded-lg border border-gray-200">
                <Table className="w-full">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Mã chuyến đi</TableHead>
                            <TableHead className="w-[200px]">Tour</TableHead>
                            <TableHead className="w-[120px]">Ngày khởi hành</TableHead>
                            <TableHead className="w-[120px]">Ngày về</TableHead>
                            <TableHead className="w-[120px]">Giá từ</TableHead>
                            <TableHead className="w-[120px]">Số lượng đặt</TableHead>
                            <TableHead className="w-[150px]">Trạng thái</TableHead>
                            <TableHead className="w-[120px] text-center">Hành động</TableHead>
                            <TableHead className="w-[120px] text-center">Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentDepartures.length > 0 ? (
                            currentDepartures.map((departure) => {
                                const Icon = status[departure.status]?.icon;
                                return (
                                    <TableRow key={departure._id}>
                                        <TableCell className="font-medium">{departure._id.slice(-8).toUpperCase()}</TableCell>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">{departure.tour_code}</div>
                                                <div className="text-sm text-muted-foreground">{departure.tour_name}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{formatDate(departure.departure_date)}</TableCell>
                                        <TableCell>{formatDate(departure.return_date)}</TableCell>
                                        <TableCell>{formatCurrency(departure.prices.adult)}</TableCell>
                                        <TableCell>
                                            <span className="font-medium">{departure.booked_slots}/{departure.available_slots}</span>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className={status[departure.status]?.color}>
                                                {Icon && <Icon className="mr-1 h-3 w-3" />}
                                                {status[departure.status]?.label}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex justify-center gap-2">
                                                {departure.status === "pending" && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleStatusChange(departure._id, "confirmed")}
                                                    >
                                                        <Check className="h-4 w-4 mr-1" />
                                                        Xác nhận
                                                    </Button>
                                                )}
                                                {departure.status !== "cancelled" && departure.status !== "completed" && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleStatusChange(departure._id, "cancelled")}
                                                    >
                                                        <X className="h-4 w-4 mr-1" />
                                                        Hủy
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Mở menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            setSelectedDeparture(departure);
                                                            setIsDetailDialogOpen(true);
                                                        }}
                                                    >
                                                        <ScanSearch className="mr-2 h-4 w-4" />
                                                        Xem chi tiết
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            setSelectedDeparture(departure);
                                                            setIsEditDialogOpen(true);
                                                        }}
                                                    >
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Chỉnh sửa
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            setSelectedDeparture(departure);
                                                            setIsBookingListDialogOpen(true);
                                                        }}
                                                    >
                                                        <Users className="mr-2 h-4 w-4" />
                                                        Xem danh sách đặt
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        className="text-red-600"
                                                        onClick={() => {
                                                            setSelectedDeparture(departure);
                                                            setIsDeleteDialogOpen(true);
                                                        }}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Xóa
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={9} className="text-center text-muted-foreground py-4">
                                    Không tìm thấy chuyến đi nào.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                    <div className="flex items-center justify-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                            className="h-6 w-6 cursor-pointer"
                        >
                            <ChevronLeft className="h-3 w-3" />
                        </Button>
                        <span className="px-2 border rounded bg-white text-gray-800">
                            {currentPage}
                        </span>
                        <Button
                            variant="outline"
                            size="icon"
                            disabled={currentPage === totalPages}
                            onClick={() => handlePageChange(currentPage + 1)}
                            className="h-6 w-6 cursor-pointer"
                        >
                            <ChevronRight className="h-3 w-3" />
                        </Button>
                    </div>
                </div>
            )}

            {/* Dialogs */}
            <EditDepartureDialog
                isOpen={isEditDialogOpen}
                setIsOpen={setIsEditDialogOpen}
                departure={selectedDeparture}
                onEdit={handleEdit}
            />
            <DeleteDepartureDialog
                isOpen={isDeleteDialogOpen}
                setIsOpen={setIsDeleteDialogOpen}
                departure={selectedDeparture}
                onDelete={handleDelete}
            />
            <DetailDepartureDialog
                isOpen={isDetailDialogOpen}
                setIsOpen={setIsDetailDialogOpen}
                departure={selectedDeparture}
            />
            <BookingListDialog
                isOpen={isBookingListDialogOpen}
                setIsOpen={setIsBookingListDialogOpen}
                departure={selectedDeparture}
            />
            <ConfirmStatusChangeDialog
                isOpen={isConfirmStatusChangeOpen}
                setIsOpen={setIsConfirmStatusChangeOpen}
                departureId={selectedDeparture?._id}
                newStatus={statusToChange}
                onConfirm={confirmStatusChange}
            />
        </div>
    );
};

export default Departure;
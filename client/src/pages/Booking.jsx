"use client";

import React, { useState, useEffect } from "react";
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon, MoreHorizontal, ScanSearch, Edit, X } from "lucide-react"; // Thêm MoreHorizontal
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"; // Thêm DropdownMenu từ Shadcn
import { mockTours, mockDepartures, mockBookings, mockServices } from "@/utils/fakeBookings2";
import AddBookingDialog from "../components/booking/AddBookingDialog";
import EditBookingDialog from "../components/booking/EditBookingDialog";
import DeleteBookingDialog from "../components/booking/DeleteBookingDialog";
import CancelBookingDialog from "../components/booking/CancelBookingDialog";
import ViewBookingDialog from "../components/booking/ViewBookingDialog";

export default function Booking() {
  // const { toast } = useToast();
  const [bookings, setBookings] = useState(mockBookings);
  const [filteredBookings, setFilteredBookings] = useState(mockBookings);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tourFilter, setTourFilter] = useState("all");
  const [sortCriterion, setSortCriterion] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [deleteReason, setDeleteReason] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 10;

  const [formData, setFormData] = useState({
    user: { user_id: "", name: "", phone_number: "" },
    tour_id: "",
    departure_id: "",
    passengers: [{ full_name: "", date_of_birth: "", gender: "", phone_number: "", type: "adult", price: 0 }],
    additional_services: [],
    total_price: 0,
    status: "pending_payment",
    booking_date: new Date().toISOString(),
  });

  useEffect(() => {
    let filtered = [...bookings];
    if (searchTerm) {
      filtered = filtered.filter((booking) =>
        booking.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getTourName(booking.tour_id).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter !== "all") filtered = filtered.filter((booking) => booking.status === statusFilter);
    if (tourFilter !== "all") filtered = filtered.filter((booking) => booking.tour_id === tourFilter);

    if (sortCriterion) {
      filtered.sort((a, b) => {
        let valA, valB;
        if (sortCriterion === "booking_id") { valA = a._id; valB = b._id; }
        else if (sortCriterion === "user_name") { valA = a.user.name; valB = b.user.name; }
        else if (sortCriterion === "tour_name") { valA = getTourName(a.tour_id); valB = getTourName(b.tour_id); }
        else if (sortCriterion === "booking_date") { valA = new Date(a.booking_date); valB = new Date(b.booking_date); }
        return sortOrder === "asc" ? (valA < valB ? -1 : valA > valB ? 1 : 0) : (valA > valB ? -1 : valA < valB ? 1 : 0);
      });
    }

    setFilteredBookings(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, tourFilter, sortCriterion, sortOrder, bookings]);

  const handleSort = (criterion) => {
    if (sortCriterion === criterion) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else { setSortCriterion(criterion); setSortOrder("asc"); }
  };

  const handleAddBooking = () => {
    const totalPrice = calculateTotal();
    const newBooking = { ...formData, _id: `b${Date.now()}`, total_price: totalPrice, booking_date: new Date().toISOString() };
    setBookings([...bookings, newBooking]);
    setShowAddModal(false);
    resetForm();
    // toast({ title: "Thành công", description: "Đã tạo booking mới thành công" });
  };

  const handleUpdateBooking = () => {
    if (!currentBooking) return;
    const totalPrice = calculateTotal();
    const updatedBookings = bookings.map((booking) => (booking._id === currentBooking._id ? { ...booking, ...formData, total_price: totalPrice } : booking));
    setBookings(updatedBookings);
    setShowEditModal(false);
    resetForm();
    // toast({ title: "Thành công", description: "Đã cập nhật booking thành công" });
  };

  const handleDeleteBooking = () => {
    if (!currentBooking) return;
    const updatedBookings = bookings.filter((booking) => booking._id !== currentBooking._id);
    setBookings(updatedBookings);
    setShowDeleteModal(false);
    setDeleteReason("");
    // toast({ title: "Thành công", description: "Đã xóa booking thành công" });
  };

  const handleCancelBooking = () => {
    if (!currentBooking) return;
    const updatedBooking = { ...currentBooking, status: "cancelled", deleted_at: new Date().toISOString() };
    const updatedBookings = bookings.map((booking) => (booking._id === currentBooking._id ? updatedBooking : booking));
    setBookings(updatedBookings);
    setShowCancelModal(false);
    setCancelReason("");
    // toast({ title: "Thành công", description: "Đã hủy booking thành công" });
  };

  const resetForm = () => setFormData({ user: { user_id: "", name: "" }, tour_id: "", departure_id: "", passengers: [{ full_name: "", date_of_birth: "", gender: "", phone_number: "", type: "adult", price: 0 }], additional_services: [], total_price: 0, status: "pending_payment", booking_date: new Date().toISOString() });

  const openEditModal = (booking) => { setCurrentBooking(booking); setFormData({ ...booking }); setShowEditModal(true); };
  const openViewModal = (booking) => { setCurrentBooking(booking); setShowViewModal(true); };
  const openDeleteModal = (booking) => { setCurrentBooking(booking); setShowDeleteModal(true); };
  const openCancelModal = (booking) => { setCurrentBooking(booking); setShowCancelModal(true); };

  const handleFormChange = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));
  const addPassenger = () => setFormData((prev) => ({ ...prev, passengers: [...(prev.passengers || []), { full_name: "", date_of_birth: "", gender: "", phone_number: "", type: "adult", price: 0 }] }));
  const removePassenger = (index) => setFormData((prev) => ({ ...prev, passengers: (prev.passengers || []).filter((_, i) => i !== index) }));
  const updatePassenger = (index, field, value) => setFormData((prev) => {
    const newPassengers = [...(prev.passengers || [])]; newPassengers[index] = { ...newPassengers[index], [field]: value };
    return { ...prev, passengers: newPassengers };
  });
  const addService = () => setFormData((prev) => ({ ...prev, additional_services: [...(prev.additional_services || []), { service_id: "", name: "", price: 0, quantity: 1 }] }));
  const removeService = (index) => setFormData((prev) => ({ ...prev, additional_services: (prev.additional_services || []).filter((_, i) => i !== index) }));

  const updateService = (index, field, value) => setFormData((prev) => {
    const newServices = [...(prev.additional_services || [])];
    newServices[index] = { ...newServices[index], [field]: value };

    // Nếu cập nhật tên dịch vụ, tự động lấy giá và service_id từ mockServices
    if (field === "name") {
      const selectedService = mockServices.find((service) => service.name === value);
      if (selectedService) {
        newServices[index].price = selectedService.price;
        newServices[index].service_id = selectedService.service_id;
      } else {
        newServices[index].price = 0; // Giá mặc định nếu không tìm thấy dịch vụ
        newServices[index].service_id = "";
      }
    }

    return { ...prev, additional_services: newServices };
  });

  const calculateTotal = () => {
    const passengerTotal = (formData.passengers || []).reduce((sum, p) => sum + (p.price || 0), 0);
    const serviceTotal = (formData.additional_services || []).reduce((sum, s) => sum + (s.price || 0) * (s.quantity || 1), 0);
    return passengerTotal + serviceTotal;
  };

  const getTourName = (tourId) => mockTours.find((t) => t._id === tourId)?.name || "N/A";
  const getTourCode = (tourId) => mockTours.find((t) => t._id === tourId)?.tour_code || "N/A";
  const getDepartureDate = (departureId) => mockDepartures.find((d) => d._id === departureId)?.departure_date || "N/A";
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
  const formatCurrency = (amount) => `${amount.toLocaleString("vi-VN")}đ`;

  const getStatusText = (status) => {
    switch (status) {
      case "pending_payment": return "Chờ thanh toán";
      case "confirmed": return "Đã xác nhận";
      case "cancelled": return "Đã hủy";
      default: return status;
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "confirmed": return "success";
      case "pending_payment": return "warning";
      case "cancelled": return "destructive";
      default: return "outline";
    }
  };

  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);

  const bookingStats = {
    total: bookings.length,
    pendingPayment: bookings.filter((b) => b.status === "pending_payment").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  };

  return (
    <div className="min-h-screen">
      <main className="container mx-auto p-6">

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng đặt chỗ</CardTitle>
              <PlusIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookingStats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chờ thanh toán</CardTitle>
              <PencilIcon className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookingStats.pendingPayment}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Đã xác nhận</CardTitle>
              <EyeIcon className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookingStats.confirmed}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Đã hủy</CardTitle>
              <TrashIcon className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookingStats.cancelled}</div>
            </CardContent>
          </Card>
        </div>

        {/* Thanh công cụ */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <EyeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input type="text" placeholder="Tìm kiếm theo tên, ID booking hoặc tour" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" aria-label="Tìm kiếm booking" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48" aria-label="Lọc theo trạng thái"><SelectValue placeholder="Trạng thái" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="pending_payment">Chờ thanh toán</SelectItem>
                <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                <SelectItem value="cancelled">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
            <Select value={tourFilter} onValueChange={setTourFilter}>
              <SelectTrigger className="w-full md:w-48" aria-label="Lọc theo tour"><SelectValue placeholder="Tour" /></SelectTrigger>
              <SelectContent>{mockTours.map((tour) => <SelectItem key={tour._id} value={tour._id}>{tour.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <Button onClick={() => setShowAddModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
            <PlusIcon className="h-4 w-4 mr-2" /> Tạo booking mới
          </Button>
        </div>

        {/* Bảng danh sách booking */}
        <div className="bg-white rounded-lg shadow-lg overflow-x-auto border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="">
              <tr>
                <th className="px-6 py-2 text-left font-medium tracking-wider cursor-pointer hover:bg-gray-100 transition duration-150" onClick={() => handleSort("booking_id")}>
                  Mã đặt chỗ {sortCriterion === "booking_id" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th className="px-6 py-2 text-left font-medium tracking-wider cursor-pointer hover:bg-gray-100 transition duration-150" onClick={() => handleSort("user_name")}>
                  Khách hàng {sortCriterion === "user_name" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th className="px-6 py-2 text-left font-medium tracking-wider cursor-pointer hover:bg-gray-100 transition duration-150 max-w-[120px]" onClick={() => handleSort("tour_name")}>
                  Tour {sortCriterion === "tour_name" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th className="px-6 py-2 text-left font-medium tracking-wider">Mã chuyến đi</th>
                <th className="px-6 py-2 text-left font-medium tracking-wider">Ngày khởi hành</th>
                <th className="px-6 py-2 text-left font-medium tracking-wider cursor-pointer hover:bg-gray-100 transition duration-150" onClick={() => handleSort("booking_date")}>
                  Ngày đặt {sortCriterion === "booking_date" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th className="px-6 py-2 text-left font-medium tracking-wider">Số khách</th>
                <th className="px-6 py-2 text-left font-medium tracking-wider">Tổng tiền</th>
                <th className="px-6 py-2 text-left font-medium tracking-wider">Trạng thái</th>
                <th className="px-6 py-2 text-right font-medium tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentBookings.length > 0 ? currentBookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-gray-50 transition duration-150">
                  <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{booking._id}</td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">{booking.user.name}</td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900" style={{ width: "150px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={getTourCode(booking.tour_id)}>
                    {getTourCode(booking.tour_id)}
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">{booking.departure_id}</td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">{formatDate(getDepartureDate(booking.departure_id))}</td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">{formatDate(booking.booking_date)}</td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">{booking.passengers.length} khách</td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">{formatCurrency(booking.total_price)}</td>
                  <td className="px-6 py-2 whitespace-nowrap">
                    <Badge variant={getStatusBadgeVariant(booking.status)}>{getStatusText(booking.status)}</Badge>
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-right text-sm font-medium">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openViewModal(booking)}>
                          <ScanSearch className="mr-2 h-4 w-4 text-gray-500" /> Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditModal(booking)}>
                          <Edit className="mr-2 h-4 w-4 text-gray-500" /> Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openDeleteModal(booking)}>
                          <TrashIcon className="mr-2 h-4 w-4 text-gray-500" /> Xóa
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openCancelModal(booking)}>
                          <X className="mr-2 h-4 w-4 text-gray-500" /> Hủy
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              )) : <tr><td colSpan={10} className="px-6 py-4 text-center text-sm text-gray-500">Không tìm thấy booking nào</td></tr>}
            </tbody>
          </table>
        </div>

        {/* Phân trang */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="icon"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
                className="h-6 w-6 cursor-pointer"
              >
                <ChevronLeftIcon className="h-3 w-3" />
              </Button>
              <span className="px-2 border rounded bg-white text-gray-800">{currentPage}</span>
              <Button
                variant="outline"
                size="icon"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
                className="h-6 w-6 cursor-pointer"
              >
                <ChevronRightIcon className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
        <AddBookingDialog open={showAddModal} onOpenChange={setShowAddModal} formData={formData} handleFormChange={handleFormChange} addPassenger={addPassenger} removePassenger={removePassenger} updatePassenger={updatePassenger} addService={addService} removeService={removeService} updateService={updateService} calculateTotal={calculateTotal} handleAddBooking={handleAddBooking} />
        <EditBookingDialog open={showEditModal} onOpenChange={setShowEditModal} formData={formData} handleFormChange={handleFormChange} addPassenger={addPassenger} removePassenger={removePassenger} updatePassenger={updatePassenger} addService={addService} removeService={removeService} updateSystem={updateService} calculateTotal={calculateTotal} handleUpdateBooking={handleUpdateBooking} />
        <DeleteBookingDialog open={showDeleteModal} onOpenChange={setShowDeleteModal} currentBooking={currentBooking} deleteReason={deleteReason} setDeleteReason={setDeleteReason} handleDeleteBooking={handleDeleteBooking} />
        <CancelBookingDialog open={showCancelModal} onOpenChange={setShowCancelModal} currentBooking={currentBooking} cancelReason={cancelReason} setCancelReason={setCancelReason} handleCancelBooking={handleCancelBooking} />
        <ViewBookingDialog open={showViewModal} onOpenChange={setShowViewModal} booking={currentBooking} />


        {/* <Toaster /> */}
      </main>
    </div>
  );
}
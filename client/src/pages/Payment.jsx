"use client";

import { useState, useEffect, useMemo } from "react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MicroscopeIcon as MagnifyingGlassIcon,
  CreditCardIcon,
  DollarSignIcon,
  TrendingUpIcon,
  TrendingDownIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPayments,
  fetchStats,
  setCurrentPayment,
  clearCurrentPayment,
  clearError,
} from "../redux/slices/paymentSlice";
import AddPaymentDialog from "../components/payment/AddPaymentDialog";
import EditPaymentDialog from "../components/payment/EditPaymentDialog";
import ViewPaymentDialog from "../components/payment/ViewPaymentDialog";
import DeletePaymentDialog from "../components/payment/DeletePaymentDialog";
import { toast } from "react-hot-toast";

export default function Payment() {
  const dispatch = useDispatch();
  const {
    payments = [],
    pagination = { currentPage: 1, totalPages: 1, totalItems: 0, limit: 10 },
    stats = {
      total_payment_count: 0,
      total_payment_amount: 0,
      total_refund_count: 0,
      total_refund_amount: 0,
      net_revenue: 0,
    },
    currentPayment,
    loading,
    error,
  } = useSelector((state) => state.payments);

  // Debug log to inspect payments
  useEffect(() => {
    console.log("Payments state:", payments);
    if (!Array.isArray(payments)) {
      console.error("Payments is not an array:", typeof payments, payments);
    }
  }, [payments]);

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear());
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [formData, setFormData] = useState({
    booking_id: "",
    cancellation_id: "",
    type: "payment",
    amount: 0,
    payment_method: "",
    transaction_id: "",
    status: "success",
  });

  useEffect(() => {
    dispatch(
      fetchPayments({
        search: searchTerm,
        type: typeFilter,
        status: statusFilter,
        method: methodFilter,
        year: yearFilter,
        page: pagination.currentPage,
        limit: pagination.limit,
      })
    );
    dispatch(fetchStats(yearFilter));
  }, [
    dispatch,
    searchTerm,
    typeFilter,
    statusFilter,
    methodFilter,
    yearFilter,
    pagination.currentPage,
  ]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const availableYears = useMemo(() => {
    // Ensure payments is an array before mapping
    const validPayments = Array.isArray(payments) ? payments : [];
    const years = new Set(
      validPayments.map((p) => new Date(p.created_at).getFullYear())
    );
    return Array.from(years).sort((a, b) => b - a);
  }, [payments]);

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const openEditModal = (payment) => {
    dispatch(setCurrentPayment(payment));
    setFormData({ ...payment });
    setShowEditModal(true);
  };

  const openViewModal = (payment) => {
    dispatch(setCurrentPayment(payment));
    setShowViewModal(true);
  };

  const openDeleteModal = (payment) => {
    dispatch(setCurrentPayment(payment));
    setShowDeleteModal(true);
  };

  const resetForm = () => {
    setFormData({
      booking_id: "",
      cancellation_id: "",
      type: "payment",
      amount: 0,
      payment_method: "",
      transaction_id: "",
      status: "success",
    });
    dispatch(clearCurrentPayment());
  };

  const getBookingInfo = (bookingId) => {
    if (!bookingId || !currentPayment?.booking_info) return null;
    return currentPayment.booking_info;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return (amount || 0).toLocaleString("vi-VN") + "đ";
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "success":
        return "success";
      case "pending":
        return "warning";
      case "failed":
        return "destructive";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "success":
        return "Thành công";
      case "pending":
        return "Đang chờ";
      case "failed":
        return "Thất bại";
      case "cancelled":
        return "Đã hủy";
      default:
        return status || "Không xác định";
    }
  };

  const getTypeText = (type) => {
    switch (type) {
      case "payment":
        return "Thanh toán";
      case "refund":
        return "Hoàn tiền";
      default:
        return type || "Không xác định";
    }
  };

  const getMethodText = (method) => {
    switch (method) {
      case "bank_transfer":
        return "Chuyển khoản";
      case "credit_card":
        return "Thẻ tín dụng";
      case "e_wallet":
        return "Ví điện tử";
      case "cash":
        return "Tiền mặt";
      default:
        return method || "Không xác định";
    }
  };

  // Ensure currentPayments is an array
  const currentPayments = Array.isArray(payments) ? payments : [];

  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto p-4">
        {loading && (
          <div className="flex justify-center items-center py-4">
            <p className="text-gray-600">Đang tải...</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng số thanh toán</CardTitle>
              <CreditCardIcon className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_count || 0}</div>
              <p className="text-xs text-muted-foreground">giao dịch</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng thanh toán</CardTitle>
              <TrendingUpIcon className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.total_payment_amount)}</div>
              <p className="text-xs text-muted-foreground">{stats.total_payment_count || 0} giao dịch</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng hoàn tiền</CardTitle>
              <TrendingDownIcon className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{formatCurrency(stats.total_refund_amount)}</div>
              <p className="text-xs text-muted-foreground">{stats.total_refund_count || 0} giao dịch</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Doanh thu ròng</CardTitle>
              <DollarSignIcon className="h-4 w-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-600">{formatCurrency(stats.net_revenue)}</div>
              <p className="text-xs text-muted-foreground">Thanh toán - Hoàn tiền</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto flex-wrap">
            <div className="relative w-full md:w-64">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Tìm kiếm theo ID hoặc khách hàng"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                aria-label="Tìm kiếm thanh toán"
              />
            </div>

            <Select
              value={String(yearFilter)}
              onValueChange={(value) => setYearFilter(Number(value))}
            >
              <SelectTrigger className="w-full md:w-40" aria-label="Lọc theo năm">
                <SelectValue placeholder="Chọn năm" />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map((year) => (
                  <SelectItem key={year} value={String(year)}>
                    Năm {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-40" aria-label="Lọc theo loại">
                <SelectValue placeholder="Loại giao dịch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại</SelectItem>
                <SelectItem value="payment">Thanh toán</SelectItem>
                <SelectItem value="refund">Hoàn tiền</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40" aria-label="Lọc theo trạng thái">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="success">Thành công</SelectItem>
                <SelectItem value="failed">Thất bại</SelectItem>
              </SelectContent>
            </Select>

            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className="w-full md:w-40" aria-label="Lọc theo phương thức">
                <SelectValue placeholder="Phương thức" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả phương thức</SelectItem>
                <SelectItem value="bank_transfer">Chuyển khoản</SelectItem>
                <SelectItem value="credit_card">Thẻ tín dụng</SelectItem>
                <SelectItem value="e_wallet">Ví điện tử</SelectItem>
                <SelectItem value="cash">Tiền mặt</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white mt-4 md:mt-0"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Tạo giao dịch mới
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-2 text-left text-sm font-medium tracking-wider">
                  ID Giao dịch
                </th>
                <th className="px-6 py-2 text-left text-sm font-medium tracking-wider">
                  Booking ID
                </th>
                <th className="px-6 py-2 text-left text-sm font-medium tracking-wider">
                  Khách hàng
                </th>
                <th className="px-6 py-2 text-left text-sm font-medium tracking-wider">
                  Loại
                </th>
                <th className="px-6 py-2 text-left text-sm font-medium tracking-wider">
                  Số tiền
                </th>
                <th className="px-6 py-2 text-left text-sm font-medium tracking-wider">
                  Phương thức
                </th>
                <th className="px-6 py-2 text-left text-sm font-medium tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-2 text-left text-sm font-medium tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-2 text-right text-sm font-medium tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentPayments.length > 0 ? (
                currentPayments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-gray-100">
                    <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                      {payment.transaction_id || "N/A"}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                      {payment.booking_id || "N/A"}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                      {payment.username || "N/A"}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap">
                      <Badge variant={payment.type === "payment" ? "default" : "outline"}>
                        {getTypeText(payment.type)}
                      </Badge>
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">
                      <span
                        className={
                          payment.type === "refund" ? "text-red-600" : "text-green-600"
                        }
                      >
                        {payment.type === "refund" ? "-" : "+"}
                        {formatCurrency(payment.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                      {getMethodText(payment.payment_method)}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap">
                      <Badge variant={getStatusBadgeVariant(payment.status)}>
                        {getStatusText(payment.status)}
                      </Badge>
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(payment.created_at)}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openViewModal(payment)}
                          className="text-green-600 hover:text-green-800 hover:bg-green-50"
                          aria-label="Xem chi tiết"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(payment)}
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          aria-label="Chỉnh sửa"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDeleteModal(payment)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                          aria-label="Xóa"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={9}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    Không tìm thấy giao dịch nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {pagination.totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <nav className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  dispatch(
                    fetchPayments({
                      search: searchTerm,
                      type: typeFilter,
                      status: statusFilter,
                      method: methodFilter,
                      year: yearFilter,
                      page: pagination.currentPage - 1,
                      limit: pagination.limit,
                    })
                  )
                }
                disabled={pagination.currentPage === 1}
              >
                Trước
              </Button>
              {Array.from(
                { length: pagination.totalPages },
                (_, i) => i + 1
              ).map((page) => (
                <Button
                  key={page}
                  variant={pagination.currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() =>
                    dispatch(
                      fetchPayments({
                        search: searchTerm,
                        type: typeFilter,
                        status: statusFilter,
                        method: methodFilter,
                        year: yearFilter,
                        page,
                        limit: pagination.limit,
                      })
                    )
                  }
                  className={pagination.currentPage === page ? "bg-blue-600" : ""}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  dispatch(
                    fetchPayments({
                      search: searchTerm,
                      type: typeFilter,
                      status: statusFilter,
                      method: methodFilter,
                      year: yearFilter,
                      page: pagination.currentPage + 1,
                      limit: pagination.limit,
                    })
                  )
                }
                disabled={pagination.currentPage === pagination.totalPages}
              >
                Sau
              </Button>
            </nav>
          </div>
        )}
      </main>

      <AddPaymentDialog
        open={showAddModal}
        onOpenChange={setShowAddModal}
        formData={formData}
        setFormData={setFormData}
        handleFormChange={handleFormChange}
        resetForm={resetForm}
      />
      <EditPaymentDialog
        open={showEditModal}
        onOpenChange={setShowEditModal}
        formData={formData}
        setFormData={setFormData}
        handleFormChange={handleFormChange}
        resetForm={resetForm}
      />
      <ViewPaymentDialog
        open={showViewModal}
        onOpenChange={setShowViewModal}
        currentPayment={currentPayment}
        getBookingInfo={getBookingInfo}
        formatDate={formatDate}
        formatCurrency={formatCurrency}
        getStatusBadgeVariant={getStatusBadgeVariant}
        getStatusText={getStatusText}
        getTypeText={getTypeText}
        getMethodText={getMethodText}
      />
      <DeletePaymentDialog
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        currentPayment={currentPayment}
      />
    </div>
  );
}
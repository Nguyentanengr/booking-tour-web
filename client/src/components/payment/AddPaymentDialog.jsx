import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useState, useRef } from "react";
import axios from 'axios';
import { useDispatch } from "react-redux";
import { createPayment } from "../../redux/slices/paymentSlice";
import { toast } from "react-hot-toast";

export default function AddPaymentDialog({
  open,
  onOpenChange,
  formData,
  setFormData,
  handleFormChange,
  resetForm,
}) {
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const [bookingIdSearchResults, setBookingIdSearchResults] = useState([]);
  const [bookingIdSearchQuery, setBookingIdSearchQuery] = useState("");
  const [isSearchingBookings, setIsSearchingBookings] = useState(false);
  const [selectedBookingDisplay, setSelectedBookingDisplay] = useState("");

  const debounceTimeoutRef = useRef(null);

  const formatAmount = (value) => {
    if (value === null || value === undefined || value === "") return "";
    const numberValue = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value;
    if (isNaN(numberValue)) return "";
    return numberValue.toLocaleString('en-US');
  };

  const handleAmountChange = (e) => {
    const input = e.target.value;
    const rawValue = input.replace(/,/g, '');

    handleFormChange("amount", parseFloat(rawValue) || 0);

    setFormData(prev => ({
      ...prev,
      displayAmount: rawValue === "" ? "" : formatAmount(rawValue)
    }));
    setErrors(prev => ({ ...prev, amount: "" }));
  };

  useEffect(() => {
    if (formData.amount !== undefined) {
      setFormData(prev => ({
        ...prev,
        displayAmount: formatAmount(formData.amount)
      }));
    }
  }, [formData.amount, setFormData]);

  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (bookingIdSearchQuery.length >= 3) {
      setIsSearchingBookings(true);
      debounceTimeoutRef.current = setTimeout(async () => {
        try {
          const response = await axios.get(`/api/v1/admin/bookings/search-id?query=${bookingIdSearchQuery}`);
          setBookingIdSearchResults(response.data.data);
          setIsSearchingBookings(false);
        } catch (error) {
          console.error("Lỗi khi tìm kiếm Booking ID:", error);
          setBookingIdSearchResults([]);
          setIsSearchingBookings(false);
        }
      }, 300);
    } else {
      setBookingIdSearchResults([]);
      setIsSearchingBookings(false);
    }
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [bookingIdSearchQuery]);

  useEffect(() => {
    if (formData.booking_id) {
      setSelectedBookingDisplay(formData.booking_id);
    } else {
      setSelectedBookingDisplay("");
    }
  }, [formData.booking_id]);

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.booking_id) {
      newErrors.booking_id = "Booking ID không được để trống.";
      isValid = false;
    }

    if (!formData.type) {
      newErrors.type = "Loại giao dịch không được để trống.";
      isValid = false;
    }

    const amountValue = parseFloat(String(formData.amount).replace(/,/g, ''));
    if (isNaN(amountValue) || amountValue < 1000) {
      newErrors.amount = "Số tiền phải tối thiểu 1.000.";
      isValid = false;
    }

    if (!formData.payment_method) {
      newErrors.payment_method = "Phương thức thanh toán không được để trống.";
      isValid = false;
    }

    if (formData.payment_method && formData.payment_method !== "cash") {
      if (!formData.transaction_id || formData.transaction_id.trim() === "") {
        newErrors.transaction_id = "Mã giao dịch là bắt buộc với phương thức này.";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        // Exclude displayAmount from the payload
        const { displayAmount, ...paymentData } = formData;
        await dispatch(createPayment(paymentData)).unwrap();
        toast.success("Tạo giao dịch thành công!");
        setErrors({});
        resetForm();
        onOpenChange(false);
      } catch (error) {
        toast.error(error || "Lỗi khi tạo giao dịch");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      onOpenChange(isOpen);
      if (!isOpen) {
        setErrors({});
        setBookingIdSearchQuery("");
        setBookingIdSearchResults([]);
        setSelectedBookingDisplay("");
        resetForm();
      }
    }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Tạo giao dịch mới</DialogTitle>
          <DialogDescription>Điền đầy đủ thông tin để tạo giao dịch thanh toán</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 relative">
            <Label htmlFor="booking_id_input">Booking ID <span className="text-red-500">*</span></Label>
            <Input
              id="booking_id_input"
              type="text"
              value={formData.booking_id ? selectedBookingDisplay : bookingIdSearchQuery}
              onChange={(e) => {
                setBookingIdSearchQuery(e.target.value);
                handleFormChange("booking_id", "");
                setErrors(prev => ({ ...prev, booking_id: "" }));
              }}
              placeholder="Nhập Booking ID để tìm kiếm"
              className={errors.booking_id ? "border-red-500" : ""}
            />
            {isSearchingBookings && bookingIdSearchQuery.length >= 3 && (
              <p className="text-sm text-gray-500 mt-1">Đang tìm kiếm...</p>
            )}
            {Array.isArray(bookingIdSearchResults) && bookingIdSearchResults.length > 0 && !formData.booking_id && (
              <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {bookingIdSearchResults.map((booking) => (
                  <div
                    key={booking._id}
                    className="p-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                      handleFormChange("booking_id", booking._id);
                      setBookingIdSearchResults([]);
                      setBookingIdSearchQuery("");
                      setErrors(prev => ({ ...prev, booking_id: "" }));
                    }}
                  >
                    {booking._id}
                  </div>
                ))}
              </div>
            )}
            {errors.booking_id && <p className="text-red-500 text-sm">{errors.booking_id}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Loại giao dịch <span className="text-red-500">*</span></Label>
            <Select
              value={formData.type || ""}
              onValueChange={(value) => {
                handleFormChange("type", value);
                setErrors(prev => ({ ...prev, type: "" }));
              }}
            >
              <SelectTrigger id="type" className={errors.type ? "border-red-500" : ""}>
                <SelectValue placeholder="Chọn loại giao dịch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="payment">Thanh toán</SelectItem>
                <SelectItem value="refund">Hoàn tiền</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && <p className="text-red-500 text-sm">{errors.type}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Số tiền <span className="text-red-500">*</span></Label>
            <Input
              id="amount"
              type="text"
              value={formData.displayAmount || ""}
              onChange={handleAmountChange}
              placeholder="VD: 1,000,000"
              className={errors.amount ? "border-red-500" : ""}
              required
            />
            {errors.amount && <p className="text-red-500 text-sm">{errors.amount}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment_method">Phương thức thanh toán <span className="text-red-500">*</span></Label>
            <Select
              value={formData.payment_method || ""}
              onValueChange={(value) => {
                handleFormChange("payment_method", value);
                setErrors(prev => ({ ...prev, payment_method: "", transaction_id: "" }));
              }}
            >
              <SelectTrigger id="payment_method" className={errors.payment_method ? "border-red-500" : ""}>
                <SelectValue placeholder="Chọn phương thức" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bank_transfer">Chuyển khoản</SelectItem>
                <SelectItem value="credit_card">Thẻ tín dụng</SelectItem>
                <SelectItem value="e_wallet">Ví điện tử</SelectItem>
                <SelectItem value="cash">Tiền mặt</SelectItem>
              </SelectContent>
            </Select>
            {errors.payment_method && <p className="text-red-500 text-sm">{errors.payment_method}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="transaction_id">
              Mã giao dịch
              {formData.payment_method && formData.payment_method !== "cash" && (
                <span className="text-red-500">*</span>
              )}
            </Label>
            <Input
              id="transaction_id"
              value={formData.transaction_id || ""}
              onChange={(e) => {
                handleFormChange("transaction_id", e.target.value);
                setErrors(prev => ({ ...prev, transaction_id: "" }));
              }}
              placeholder={
                formData.payment_method === "cash"
                  ? "Không bắt buộc với Tiền mặt"
                  : "Nhập mã giao dịch"
              }
              className={errors.transaction_id ? "border-red-500" : ""}
            />
            {errors.transaction_id && <p className="text-red-500 text-sm">{errors.transaction_id}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Trạng thái <span className="text-red-500">*</span></Label>
            <Select
              value={formData.status || ""}
              onValueChange={(value) => handleFormChange("status", value)}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="success">Thành công</SelectItem>
                <SelectItem value="failed">Thất bại</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
            Tạo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
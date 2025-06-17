import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useState, useRef } from "react"; // Thêm useRef
import axios from 'axios'; // Đảm bảo đã cài đặt axios

export default function EditPaymentDialog({
  open,
  onOpenChange,
  formData,
  setFormData,
  handleUpdatePayment,
  // mockBookings, // Không cần mockBookings nữa vì giờ ta tìm kiếm
  handleFormChange,
}) {
  const [errors, setErrors] = useState({});
  const [bookingIdSearchResults, setBookingIdSearchResults] = useState([]); // Chứa chỉ các _id
  const [bookingIdSearchQuery, setBookingIdSearchQuery] = useState(""); // Query người dùng nhập
  const [isSearchingBookings, setIsSearchingBookings] = useState(false);
  const [selectedBookingDisplay, setSelectedBookingDisplay] = useState(""); // Để hiển thị Booking ID đã chọn trong input

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
    if (open && formData.amount !== undefined) {
      setFormData(prev => ({
        ...prev,
        displayAmount: formatAmount(formData.amount)
      }));
    }
  }, [open, formData.amount, setFormData]);

  // Effect để tìm kiếm Booking ID khi người dùng gõ
  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (bookingIdSearchQuery.length >= 3) { // Bắt đầu tìm kiếm khi có ít nhất 3 ký tự
      setIsSearchingBookings(true);
      debounceTimeoutRef.current = setTimeout(async () => {
        try {
          const response = await axios.get(`/api/v1/bookings/search-id?query=${bookingIdSearchQuery}`);
          setBookingIdSearchResults(response.data.data); // response.data.data sẽ chứa mảng các { _id: "..." }
          setIsSearchingBookings(false);
        } catch (error) {
          console.error("Lỗi khi tìm kiếm Booking ID:", error);
          setBookingIdSearchResults([]);
          setIsSearchingBookings(false);
        }
      }, 300); // Debounce 300ms
    } else {
      setBookingIdSearchResults([]); // Xóa kết quả nếu query quá ngắn
      setIsSearchingBookings(false);
    }
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [bookingIdSearchQuery]);

  // Effect để hiển thị Booking ID đã chọn vào input và khởi tạo bookingIdSearchQuery
  useEffect(() => {
    if (open && formData.booking_id) {
      setSelectedBookingDisplay(formData.booking_id);
      setBookingIdSearchQuery(formData.booking_id); // Khởi tạo query tìm kiếm với booking_id hiện tại khi mở dialog
    } else if (!open) { // Khi dialog đóng
      setSelectedBookingDisplay("");
      setBookingIdSearchQuery(""); // Đặt lại query khi đóng dialog
    }
  }, [open, formData.booking_id]);


  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Validate Booking ID
    if (!formData.booking_id) {
      newErrors.booking_id = "Booking ID không được để trống.";
      isValid = false;
    }

    // Validate Loại giao dịch
    if (!formData.type) {
      newErrors.type = "Loại giao dịch không được để trống.";
      isValid = false;
    }

    // Validate Số tiền
    const amountValue = parseFloat(String(formData.amount).replace(/,/g, ''));
    if (isNaN(amountValue) || amountValue < 1000) {
      newErrors.amount = "Số tiền phải tối thiểu 1.000.";
      isValid = false;
    }

    // Validate Phương thức thanh toán
    if (!formData.payment_method) {
      newErrors.payment_method = "Phương thức thanh toán không được để trống.";
      isValid = false;
    }

    // Validate Mã giao dịch DỰA TRÊN PHƯƠNG THỨC THANH TOÁN
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
      await handleUpdatePayment(); // Sử dụng handleUpdatePayment thay vì handleAddPayment
      setErrors({});
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      onOpenChange(isOpen);
      if (!isOpen) {
        setErrors({});
        setBookingIdSearchQuery(""); // Xóa query khi đóng dialog
        setBookingIdSearchResults([]); // Xóa kết quả khi đóng dialog
        setSelectedBookingDisplay(""); // Xóa hiển thị khi đóng dialog
      }
    }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Chỉnh sửa giao dịch</DialogTitle>
          <DialogDescription>Cập nhật thông tin giao dịch thanh toán</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 relative">
            <Label htmlFor="edit_booking_id_input">Booking ID <span className="text-red-500">*</span></Label>
            <Input
              id="edit_booking_id_input"
              type="text"
              // Hiển thị ID đã chọn, hoặc query đang gõ nếu chưa chọn
              value={formData.booking_id ? selectedBookingDisplay : bookingIdSearchQuery}
              onChange={(e) => {
                setBookingIdSearchQuery(e.target.value);
                // Chỉ xóa booking_id khỏi formData nếu người dùng thực sự thay đổi query
                // Nếu người dùng chỉ click vào input mà không gõ gì, giữ nguyên booking_id
                if (e.target.value !== formData.booking_id) {
                    handleFormChange("booking_id", "");
                }
                setErrors(prev => ({ ...prev, booking_id: "" }));
              }}
              placeholder="Nhập Booking ID để tìm kiếm"
              className={errors.booking_id ? "border-red-500" : ""}
            />
            {isSearchingBookings && bookingIdSearchQuery.length >= 3 && (
                <p className="text-sm text-gray-500 mt-1">Đang tìm kiếm...</p>
            )}
            {/* Hiển thị danh sách kết quả tìm kiếm */}
            {Array.isArray(bookingIdSearchResults) && bookingIdSearchResults.length > 0 && !formData.booking_id && (
              <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {bookingIdSearchResults.map((booking) => (
                  <div
                    key={booking._id}
                    className="p-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                      handleFormChange("booking_id", booking._id); // Gán _id vào formData
                      setSelectedBookingDisplay(booking._id); // Hiển thị _id trong input
                      setBookingIdSearchResults([]); // Xóa danh sách gợi ý
                      setBookingIdSearchQuery(booking._id); // Giữ query là _id đã chọn để không re-trigger search ngay
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
            <Label htmlFor="edit_type">
              Loại giao dịch <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.type || ""} onValueChange={(value) => {
                handleFormChange("type", value);
                setErrors(prev => ({ ...prev, type: "" }));
              }}>
              <SelectTrigger id="edit_type" className={errors.type ? "border-red-500" : ""}>
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
            <Label htmlFor="edit_amount">
              Số tiền <span className="text-red-500">*</span>
            </Label>
            <Input
              id="edit_amount"
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
            <Label htmlFor="edit_payment_method">
              Phương thức thanh toán <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.payment_method || ""}
              onValueChange={(value) => {
                handleFormChange("payment_method", value);
                setErrors(prev => ({ ...prev, payment_method: "", transaction_id: "" })); // Xóa lỗi transaction_id khi đổi phương thức
              }}
            >
              <SelectTrigger id="edit_payment_method" className={errors.payment_method ? "border-red-500" : ""}>
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
            <Label htmlFor="edit_transaction_id">
              Mã giao dịch
              {formData.payment_method && formData.payment_method !== "cash" && (
                <span className="text-red-500">*</span>
              )}
            </Label>
            <Input
              id="edit_transaction_id"
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
            <Label htmlFor="edit_status">Trạng thái <span className="text-red-500">*</span></Label>
            <Select value={formData.status || ""} onValueChange={(value) => handleFormChange("status", value)}>
              <SelectTrigger id="edit_status">
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
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
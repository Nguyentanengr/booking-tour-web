import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useState } from "react";

export default function EditPaymentDialog({
  open,
  onOpenChange,
  formData,
  setFormData,
  handleUpdatePayment,
  mockBookings,
  handleFormChange,
}) {
  const [errors, setErrors] = useState({});

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
      await handleUpdatePayment();
      setErrors({}); 
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      onOpenChange(isOpen);
      if (!isOpen) {
        setErrors({});
      }
    }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Chỉnh sửa giao dịch</DialogTitle>
          <DialogDescription>Cập nhật thông tin giao dịch thanh toán</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="edit_booking_id">Booking ID <span className="text-red-500">*</span></Label>
            <Select
              value={formData.booking_id || ""}
              onValueChange={(value) => {
                handleFormChange("booking_id", value);
                setErrors(prev => ({ ...prev, booking_id: "" }));
              }}
            >
              <SelectTrigger id="edit_booking_id" className={errors.booking_id ? "border-red-500" : ""}>
                <SelectValue placeholder="Chọn booking" />
              </SelectTrigger>
              <SelectContent>
                {mockBookings.map((booking) => (
                  <SelectItem key={booking._id} value={booking._id}>
                    {booking._id} - {booking.user_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
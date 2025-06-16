import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function AddPaymentDialog({
  open,
  onOpenChange,
  formData,
  setFormData,
  handleAddPayment,
  mockBookings,
  handleFormChange,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Tạo giao dịch mới</DialogTitle>
          <DialogDescription>Điền đầy đủ thông tin để tạo giao dịch thanh toán</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="booking_id">Booking ID</Label>
            <Select
              value={formData.booking_id || ""}
              onValueChange={(value) => handleFormChange("booking_id", value)}
            >
              <SelectTrigger id="booking_id">
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">
              Loại giao dịch <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.type || ""} onValueChange={(value) => handleFormChange("type", value)}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Chọn loại giao dịch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="payment">Thanh toán</SelectItem>
                <SelectItem value="refund">Hoàn tiền</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">
              Số tiền <span className="text-red-500">*</span>
            </Label>
            <Input
              id="amount"
              type="number"
              min="0"
              value={formData.amount || 0}
              onChange={(e) => handleFormChange("amount", Number.parseInt(e.target.value))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment_method">
              Phương thức thanh toán <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.payment_method || ""}
              onValueChange={(value) => handleFormChange("payment_method", value)}
            >
              <SelectTrigger id="payment_method">
                <SelectValue placeholder="Chọn phương thức" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bank_transfer">Chuyển khoản</SelectItem>
                <SelectItem value="credit_card">Thẻ tín dụng</SelectItem>
                <SelectItem value="e_wallet">Ví điện tử</SelectItem>
                <SelectItem value="cash">Tiền mặt</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="transaction_id">
              Mã giao dịch <span className="text-red-500">*</span>
            </Label>
            <Input
              id="transaction_id"
              value={formData.transaction_id || ""}
              onChange={(e) => handleFormChange("transaction_id", e.target.value)}
              placeholder="VD: txn_123456"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Trạng thái</Label>
            <Select value={formData.status || ""} onValueChange={(value) => handleFormChange("status", value)}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Đang xử lý</SelectItem>
                <SelectItem value="success">Thành công</SelectItem>
                <SelectItem value="failed">Thất bại</SelectItem>
                <SelectItem value="cancelled">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="cancellation_id">Cancellation ID (cho hoàn tiền)</Label>
            <Input
              id="cancellation_id"
              value={formData.cancellation_id || ""}
              onChange={(e) => handleFormChange("cancellation_id", e.target.value)}
              placeholder="VD: c1"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleAddPayment} className="bg-blue-600 hover:bg-blue-700">
            Tạo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
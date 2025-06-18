import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

export default function ViewPaymentDialog({
  open,
  onOpenChange,
  currentPayment,
  getBookingInfo,
  formatDate,
  formatCurrency,
  getStatusBadgeVariant,
  getStatusText,
  getTypeText,
  getMethodText,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Chi tiết giao dịch</DialogTitle>
        </DialogHeader>

        {currentPayment && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin giao dịch</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">ID Giao dịch</Label>
                  <p className="text-sm">{currentPayment._id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Mã giao dịch</Label>
                  <p className="text-sm font-mono">{currentPayment.transaction_id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Loại giao dịch</Label>
                  <div>
                    <Badge variant={currentPayment.type === "payment" ? "default" : "outline"}>
                      {getTypeText(currentPayment.type)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Trạng thái</Label>
                  <div>
                    <Badge variant={getStatusBadgeVariant(currentPayment.status)}>
                      {getStatusText(currentPayment.status)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Số tiền</Label>
                  <p
                    className={`text-sm font-bold ${currentPayment.type === "refund" ? "text-red-600" : "text-green-600"}`}
                  >
                    {currentPayment.type === "refund" ? "-" : "+"}
                    {formatCurrency(currentPayment.amount)}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Phương thức thanh toán</Label>
                  <p className="text-sm">{getMethodText(currentPayment.payment_method)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Booking ID</Label>
                  <p className="text-sm">{currentPayment.booking_id || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Ngày tạo</Label>
                  <p className="text-sm">{formatDate(currentPayment.created_at)}</p>
                </div>
                {currentPayment.deleted_at && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Ngày xóa</Label>
                    <p className="text-sm">{formatDate(currentPayment.deleted_at)}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {currentPayment.booking_id && (
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin booking liên quan</CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const bookingInfo = getBookingInfo(currentPayment.booking_id);
                    return bookingInfo ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Khách hàng</Label>
                          <p className="text-sm">{bookingInfo.user_name}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Tour</Label>
                          <p className="text-sm">{bookingInfo.tour_name}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Tổng giá trị booking</Label>
                          <p className="text-sm">{formatCurrency(bookingInfo.total_price)}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">Không tìm thấy thông tin booking</p>
                    );
                  })()}
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
}
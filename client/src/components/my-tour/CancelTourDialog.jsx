import React, { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export function CancelTourDialog({ isOpen, onClose, tour, onConfirmCancel, isCancelling }) {
  const [cancelReason, setCancelReason] = useState("")
  const [acceptPolicy, setAcceptPolicy] = useState(false)

  const handleConfirm = () => {
    if (!cancelReason.trim() || !acceptPolicy) return
    onConfirmCancel(tour.id, cancelReason)
    setCancelReason("")
    setAcceptPolicy(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Hủy đặt tour</DialogTitle>
          <DialogDescription>
            Vui lòng cho chúng tôi biết lý do hủy tour để cải thiện dịch vụ
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="cancel-reason">Lý do hủy tour *</Label>
            <Textarea
              id="cancel-reason"
              placeholder="Nhập lý do hủy tour..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="mt-1"
            />
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 mb-2">Chính sách hoàn tiền</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Hủy trước 15 ngày: Hoàn 90% giá tour</li>
              <li>• Hủy trước 7-14 ngày: Hoàn 70% giá tour</li>
              <li>• Hủy trước 3-6 ngày: Hoàn 50% giá tour</li>
              <li>• Hủy trong 3 ngày: Không hoàn tiền</li>
            </ul>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="accept-policy"
              checked={acceptPolicy}
              onCheckedChange={(checked) => setAcceptPolicy(checked)}
            />
            <label htmlFor="accept-policy" className="text-sm">
              Tôi đã đọc và đồng ý với chính sách hủy tour
            </label>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Hủy bỏ
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirm}
              disabled={!cancelReason.trim() || !acceptPolicy || isCancelling}
            >
              {isCancelling ? "Đang xử lý..." : "Xác nhận hủy tour"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
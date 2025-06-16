import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function CancelBookingDialog({ open, onOpenChange, currentBooking, deleteReason, setDeleteReason, handleCancelBooking }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Hủy đặt chỗ</DialogTitle>
          <DialogDescription>Bạn có chắc chắn muốn hủy đặt chỗ này? Hành động này không thể hoàn tác.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="delete_reason">Lý do hủy</Label>
            <Textarea id="delete_reason" value={deleteReason} onChange={(e) => setDeleteReason(e.target.value)} placeholder="Nhập lý do xóa booking" rows={3} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
          <Button onClick={handleCancelBooking} variant="destructive">Hủy đặt chỗ</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
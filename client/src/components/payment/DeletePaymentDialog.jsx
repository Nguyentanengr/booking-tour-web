import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function DeletePaymentDialog({
  open,
  onOpenChange,
  handleDeletePayment,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Xóa giao dịch</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa giao dịch này? Hành động này không thể hoàn tác.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleDeletePayment} variant="destructive">
            Xóa giao dịch
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
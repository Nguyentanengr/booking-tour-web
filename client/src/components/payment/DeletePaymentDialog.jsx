import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useDispatch } from "react-redux";
import { deletePayment } from "../../redux/slices/paymentSlice";
import { toast } from "react-hot-toast";

export default function DeletePaymentDialog({
  open,
  onOpenChange,
  currentPayment,
}) {
  const dispatch = useDispatch();

  const handleDelete = async () => {
    if (!currentPayment) return;
    try {
      await dispatch(deletePayment(currentPayment._id)).unwrap();
      toast.success("Xóa giao dịch thành công!");
      onOpenChange(false);
    } catch (error) {
      toast.error(error || "Lỗi khi xóa giao dịch");
    }
  };

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
          <Button onClick={handleDelete} variant="destructive">
            Xóa giao dịch
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
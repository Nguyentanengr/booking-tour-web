import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ConfirmStatusChangeDialog = ({
  isOpen,
  setIsOpen,
  departureId,
  newStatus,
  onConfirm,
}) => {
  const handleConfirm = () => {
    onConfirm(departureId, newStatus);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xác nhận thay đổi trạng thái</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Bạn có chắc chắn muốn {newStatus === "confirmed" ? "xác nhận" : "hủy"} chuyến đi này? Hành động này không thể hoàn tác.
        </DialogDescription>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Hủy
          </Button>
          <Button
            className={newStatus === "confirmed" ? "bg-blue-700 hover:bg-blue-800 text-white cursor-pointer" : ""}
            variant={newStatus === "confirmed" ? "default" : "destructive"}
            onClick={handleConfirm}
          >
            {newStatus === "confirmed" ? "Xác nhận chuyến đi" : "Hủy chuyến đi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmStatusChangeDialog;
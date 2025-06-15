import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DeleteDepartureDialog = ({ isOpen, setIsOpen, departure, onDelete }) => {
  if (!departure) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const reason = e.target.reason.value;
    onDelete(departure._id, reason, departure.booked_slots > 0);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{departure.booked_slots > 0 ? "Hủy chuyến đi" : "Xóa chuyến đi"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="py-4">
            <p className="mb-4">
              Bạn có chắc muốn xóa chuyến đi{" "}
              <strong>{departure.tour_code}</strong>?
            </p>
            <div className="space-y-2">
              <Label htmlFor="reason">Lý do</Label>
              <Input name="reason" placeholder="Nhập lý do..." required />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" variant="destructive">
                Xóa chuyến đi
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDepartureDialog;
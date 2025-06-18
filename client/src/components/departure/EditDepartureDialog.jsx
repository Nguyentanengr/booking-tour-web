import { useState, useEffect } from "react"; // Import useState and useEffect
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const EditDepartureDialog = ({ isOpen, setIsOpen, departure, onEdit }) => {
  // Initialize formData with departure props or default values if departure is null/undefined
  const [formData, setFormData] = useState({
    tour: departure?.tour_id || "tour1",
    status: departure?.status || "pending",
    departure_date: departure?.departure_date ? new Date(departure.departure_date).toISOString().split("T")[0] : "",
    return_date: departure?.return_date ? new Date(departure.return_date).toISOString().split("T")[0] : "",
    expiration_date: departure?.expiration_date ? new Date(departure.expiration_date).toISOString().split("T")[0] : "",
    adult_price: departure?.prices?.adult || "",
    child_price: departure?.prices?.child || "",
    senior_price: departure?.prices?.senior || "",
    available_slots: departure?.available_slots || "",
  });
  const [errors, setErrors] = useState({});

  // Update formData when departure prop changes (e.g., when a different departure is selected for editing)
  useEffect(() => {
    if (departure) {
      setFormData({
        tour: departure.tour_id || "tour1",
        status: departure.status || "pending",
        departure_date: departure.departure_date ? new Date(departure.departure_date).toISOString().split("T")[0] : "",
        return_date: departure.return_date ? new Date(departure.return_date).toISOString().split("T")[0] : "",
        expiration_date: departure.expiration_date ? new Date(departure.expiration_date).toISOString().split("T")[0] : "",
        adult_price: departure.prices?.adult || "",
        child_price: departure.prices?.child || "",
        senior_price: departure.prices?.senior || "",
        available_slots: departure.available_slots || "",
      });
      setErrors({}); // Clear errors when a new departure is loaded
    }
  }, [departure]);


  if (!departure) return null; // Still good to keep this for initial render before useEffect runs

  const validateForm = (data = formData) => {
    const {
      departure_date,
      return_date,
      expiration_date,
      adult_price,
      child_price,
      senior_price,
      available_slots,
    } = data;

    const errors = {};

    if (!departure_date || !return_date || !expiration_date) {
      errors.dates = "Vui lòng nhập đầy đủ ngày khởi hành, ngày về và hạn đăng ký.";
    } else {
      const depDate = new Date(departure_date);
      const retDate = new Date(return_date);
      const expDate = new Date(expiration_date);

      if (retDate <= depDate) {
        errors.dates = "Ngày về phải sau ngày khởi hành.";
      } else if (expDate >= depDate || (depDate - expDate) / (1000 * 60 * 60 * 24) < 2) {
        errors.dates = "Hạn đăng ký phải trước ngày khởi hành ít nhất 2 ngày.";
      }
    }

    const prices = [adult_price, child_price, senior_price].map(Number);
    if (prices.some((p) => isNaN(p) || p < 100000)) {
      errors.prices = "Giá tối thiểu là 100.000.";
    }

    if (!available_slots || Number(available_slots) < 5) {
      errors.slots = "Số chỗ khả dụng tối thiểu là 5.";
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue;

    // Handle date inputs specifically to retain their format
    if (["departure_date", "return_date", "expiration_date"].includes(name)) {
      newValue = value;
    } else {
      // For price and slots, remove non-numeric characters for internal storage
      newValue = value.replace(/[^0-9]/g, "");
    }

    const newFormData = { ...formData, [name]: newValue };
    setFormData(newFormData);

    // Validate as user types to give immediate feedback
    const newErrors = { ...errors };
    const groupErrors = validateForm(newFormData);

    if (["departure_date", "return_date", "expiration_date"].includes(name)) {
      if (groupErrors.dates) newErrors.dates = groupErrors.dates;
      else delete newErrors.dates;
    } else if (["adult_price", "child_price", "senior_price"].includes(name)) {
      if (groupErrors.prices) newErrors.prices = groupErrors.prices;
      else delete newErrors.prices;
    } else if (name === "available_slots") {
      if (groupErrors.slots) newErrors.slots = groupErrors.slots;
      else delete newErrors.slots;
    }

    setErrors(newErrors);
  };

  const handleSelectChange = (name, value) => {
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const updatedDeparture = {
      ...departure,
      tour_id: formData.tour,
      tour_code: e.target.tour.selectedOptions[0].text.split(" - ")[0], // Assuming 'tour' select element is e.target.tour
      tour_name: e.target.tour.selectedOptions[0].text.split(" - ")[1], // Assuming 'tour' select element is e.target.tour
      expiration_date: new Date(formData.expiration_date),
      departure_date: new Date(formData.departure_date),
      return_date: new Date(formData.return_date),
      prices: {
        adult: Number(formData.adult_price) || 0,
        child: Number(formData.child_price) || 0,
        senior: Number(formData.senior_price) || 0,
      },
      available_slots: Number(formData.available_slots),
      status: formData.status, // Allow status to be updated
      // Assuming created_by, created_at, deleted_at, booked_slots remain unchanged or are handled elsewhere
    };

    onEdit(updatedDeparture);
    setIsOpen(false);
  };

  const formatCurrency = (value) => {
    if (!value) return "";
    return new Intl.NumberFormat("vi-VN", {
      style: "decimal",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa chuyến đi</DialogTitle>
          {/* <DialogDescription>Cập nhật thông tin chuyến đi.</DialogDescription> */}
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          {departure.booked_slots > 0 && (
            <p className="text-yellow-600 text-sm mb-4">
              Cập nhật có thể ảnh hưởng đến các đơn đặt.
            </p>
          )}
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-5 gap-4"> {/* Changed to grid-cols-5 to match AddDepartureDialog */}
              <div className="col-span-3 space-y-2"> {/* col-span-3 for Tour */}
                <Label htmlFor="tour">Tour</Label>
                <Select
                  name="tour"
                  value={formData.tour}
                  onValueChange={(value) => handleSelectChange("tour", value)} // Use handleSelectChange
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn tour" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tour1">HN-DN-001 - Hà Nội - Đà Nẵng</SelectItem>
                    <SelectItem value="tour2">HCM-PQ-002 - TP.HCM - Phú Quốc</SelectItem>
                  </SelectContent>
                </Select>
                {errors.tour && <p className="text-red-600 text-sm">{errors.tour}</p>}
              </div>
              <div className="col-span-2 space-y-2"> {/* col-span-2 for Trạng thái */}
                <Label htmlFor="status">Trạng thái</Label>
                <Select
                  name="status"
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange("status", value)} // Allow editing status
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Chờ xác nhận</SelectItem>
                    <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                    <SelectItem value="cancelled">Đã hủy</SelectItem>
                    <SelectItem value="completed">Đã hoàn thành</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="departure_date">Ngày khởi hành</Label>
                <Input
                  type="date"
                  name="departure_date"
                  value={formData.departure_date} // Use formData.departure_date
                  onChange={handleChange} // Use handleChange
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="return_date">Ngày về</Label>
                <Input
                  type="date"
                  name="return_date"
                  value={formData.return_date} // Use formData.return_date
                  onChange={handleChange} // Use handleChange
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiration_date">Hạn đăng ký</Label>
                <Input
                  type="date"
                  name="expiration_date"
                  value={formData.expiration_date} // Use formData.expiration_date
                  onChange={handleChange} // Use handleChange
                  required
                />
              </div>
            </div>
            {errors.dates && <p className="text-red-600 text-sm">{errors.dates}</p>}

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="adult_price">Giá người lớn</Label>
                <Input
                  type="text" // Change to type="text" for formatCurrency
                  name="adult_price"
                  value={formatCurrency(formData.adult_price)} // Use formatCurrency
                  onChange={handleChange} // Use handleChange
                  placeholder="0"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="child_price">Giá trẻ em</Label>
                <Input
                  type="text" // Change to type="text" for formatCurrency
                  name="child_price"
                  value={formatCurrency(formData.child_price)} // Use formatCurrency
                  onChange={handleChange} // Use handleChange
                  placeholder="0"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="senior_price">Giá người cao tuổi</Label>
                <Input
                  type="text" // Change to type="text" for formatCurrency
                  name="senior_price"
                  value={formatCurrency(formData.senior_price)} // Use formatCurrency
                  onChange={handleChange} // Use handleChange
                  placeholder="0"
                  required
                />
              </div>
            </div>
            {errors.prices && <p className="text-red-600 text-sm">{errors.prices}</p>}

            <div className="space-y-2">
              <Label htmlFor="available_slots">Số chỗ khả dụng</Label>
              <Input
                type="text" // Change to type="text" for formatCurrency
                name="available_slots"
                value={formatCurrency(formData.available_slots)} // Use formatCurrency
                onChange={handleChange} // Use handleChange
                placeholder="0"
                required
              />
            </div>
            {errors.slots && <p className="text-red-600 text-sm">{errors.slots}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Hủy
            </Button>
            <Button type="submit">Lưu thay đổi</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditDepartureDialog;
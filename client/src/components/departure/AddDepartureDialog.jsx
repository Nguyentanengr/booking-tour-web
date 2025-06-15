import { useState } from "react";
import { Plus } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AddDepartureDialog = ({ isOpen, setIsOpen, onAdd }) => {
    const [formData, setFormData] = useState({
        tour: "tour1",
        status: "pending",
        departure_date: "",
        return_date: "",
        expiration_date: "",
        adult_price: "",
        child_price: "",
        senior_price: "",
        available_slots: "",
    });
    const [errors, setErrors] = useState({});

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
        if (["departure_date", "return_date", "expiration_date"].includes(name)) {
            newValue = value;
        } else {
            newValue = value.replace(/[^0-9]/g, "");
        }

        const newFormData = { ...formData, [name]: newValue };
        setFormData(newFormData);

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

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const newDeparture = {
            _id: `674a1b2c3d4e5f678901${Math.floor(Math.random() * 10000)}`,
            tour_id: formData.tour,
            tour_code: e.target.tour.selectedOptions[0].text.split(" - ")[0],
            tour_name: e.target.tour.selectedOptions[0].text.split(" - ")[1],
            expiration_date: new Date(formData.expiration_date),
            departure_date: new Date(formData.departure_date),
            return_date: new Date(formData.return_date),
            prices: {
                adult: Number(formData.adult_price) || 0,
                child: Number(formData.child_price) || 0,
                senior: Number(formData.senior_price) || 0,
            },
            available_slots: Number(formData.available_slots),
            status: formData.status,
            created_by: {
                admin_id: "674a1b2c3d4e5f6789012350",
                name: "Admin",
            },
            created_at: new Date(),
            deleted_at: null,
            booked_slots: 0,
        };

        onAdd(newDeparture);
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
            <DialogTrigger asChild>
                <Button className="bg-blue-700 hover:bg-blue-800 text-white cursor-pointer">
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm chuyến đi
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Thêm chuyến đi mới</DialogTitle>
                    <DialogDescription>Tạo một chuyến đi mới cho tour</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-5 gap-4">
                            <div className="col-span-3 space-y-2">
                                <Label htmlFor="tour">Tour</Label>
                                <Select name="tour" value={formData.tour} onValueChange={(value) => setFormData((prev) => ({ ...prev, tour: value }))}>
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
                            <div className="col-span-2 space-y-2">
                                <Label htmlFor="status">Trạng thái</Label>
                                <Select name="status" value={formData.status} disabled>
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Chờ xác nhận</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>Ngày khởi hành</Label>
                                <Input type="date" name="departure_date" value={formData.departure_date} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label>Ngày về</Label>
                                <Input type="date" name="return_date" value={formData.return_date} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label>Hạn đăng ký</Label>
                                <Input type="date" name="expiration_date" value={formData.expiration_date} onChange={handleChange} />
                            </div>
                        </div>
                        {errors.dates && <p className="text-red-600 text-sm">{errors.dates}</p>}

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>Giá người lớn</Label>
                                <Input type="text" name="adult_price" value={formatCurrency(formData.adult_price)} onChange={handleChange} placeholder="0" />
                            </div>
                            <div className="space-y-2">
                                <Label>Giá trẻ em</Label>
                                <Input type="text" name="child_price" value={formatCurrency(formData.child_price)} onChange={handleChange} placeholder="0" />
                            </div>
                            <div className="space-y-2">
                                <Label>Giá người cao tuổi</Label>
                                <Input type="text" name="senior_price" value={formatCurrency(formData.senior_price)} onChange={handleChange} placeholder="0" />
                            </div>
                        </div>
                        {errors.prices && <p className="text-red-600 text-sm">{errors.prices}</p>}

                        <div className="space-y-2">
                            <Label>Số chỗ khả dụng</Label>
                            <Input type="text" name="available_slots" value={formatCurrency(formData.available_slots)} onChange={handleChange} placeholder="0" />
                        </div>
                        {errors.slots && <p className="text-red-600 text-sm">{errors.slots}</p>}
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Hủy</Button>
                        <Button className="bg-blue-700 hover:bg-blue-800 text-white cursor-pointer" type="submit">Tạo chuyến đi</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddDepartureDialog;

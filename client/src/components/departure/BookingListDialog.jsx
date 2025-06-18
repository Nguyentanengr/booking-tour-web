// src/components/departure/BookingListDialog.jsx
import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { mockBookings } from "../../utils/fakeBookings"; // Import mock bookings
import { Badge } from "@/components/ui/badge";
import { Check, Clock, X } from "lucide-react";

const BookingListDialog = ({ isOpen, setIsOpen, departure }) => {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        if (departure) {
            // Filter mock bookings based on the selected departure's _id
            // SỬA LỖI: Đã đổi '!=' thành '==' để lọc đúng các booking của chuyến đi
            const filteredBookings = mockBookings.filter(
                (booking) => booking.departure_id !== departure._id
            );
            setBookings(filteredBookings);
        } else {
            setBookings([]); // Clear bookings if no departure is selected
        }
    }, [departure]); // Re-run effect when departure changes

    if (!departure) return null;

    const formatCurrency = (amount) =>
        new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount);

    const formatDate = (date) => format(date, "dd/MM/yyyy", { locale: vi });

    const statusMap = {
        pending: { label: "Chờ xác nhận", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300", icon: Clock },
        confirmed: { label: "Đã xác nhận", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300", icon: Check },
        cancelled: { label: "Đã hủy", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300", icon: X },
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            {/* Increased min-w-4xl to min-w-5xl for more space with new column */}
            <DialogContent className="min-w-5xl p-6 md:p-8">
                <DialogHeader className="pb-3 border-b border-gray-200 dark:border-gray-700">
                    <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-50">
                        Danh sách khách hàng đặt chuyến: <span className="font-semibold text-primary">{departure.tour_code}</span>
                    </DialogTitle>
                    <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
                        Tổng số lượt đặt: {bookings.length}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 overflow-auto max-h-[60vh]">
                    {bookings.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[150px]">Mã đặt chỗ</TableHead>
                                    <TableHead className="w-[200px]">Tên khách hàng</TableHead>
                                    <TableHead className="w-[140px]">Số điện thoại</TableHead>
                                    <TableHead className="w-[80px] text-center">Người lớn</TableHead>
                                    <TableHead className="w-[80px] text-center">Trẻ em</TableHead>
                                    <TableHead className="w-[100px] text-center">Người cao tuổi</TableHead>
                                    <TableHead className="w-[150px]">Tổng tiền</TableHead>
                                    <TableHead className="w-[120px]">Ngày đặt</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {bookings.map((booking) => {
                                    const Icon = statusMap[booking.status]?.icon;
                                    return (
                                        <TableRow key={booking._id}>
                                            <TableCell className="font-medium">{booking._id}</TableCell>
                                            <TableCell>
                                                <div className="font-medium">{booking.customer_name}</div>
                                                <div className="text-sm text-muted-foreground">{booking.customer_email}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm text-muted-foreground">{booking.customer_phone}</div>
                                            </TableCell>
                                            <TableCell className="text-center">{booking.adults}</TableCell>
                                            <TableCell className="text-center">{booking.children}</TableCell>
                                            <TableCell className="text-center">{booking.seniors}</TableCell>
                                            <TableCell>{formatCurrency(booking.total_price)}</TableCell>
                                            <TableCell>{formatDate(booking.booking_date)}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                            Chuyến đi này chưa có khách hàng nào đặt.
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default BookingListDialog;
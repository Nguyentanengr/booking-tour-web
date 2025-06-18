import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarDays, Check, Clock, X } from "lucide-react";

const DetailDepartureDialog = ({ isOpen, setIsOpen, departure }) => {
  if (!departure) return null;

  const statusMap = {
    pending: {
      label: "Chờ xác nhận",
      color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      icon: Clock,
    },
    confirmed: {
      label: "Đã xác nhận",
      color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      icon: Check,
    },
    cancelled: {
      label: "Đã hủy",
      color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      icon: X,
    },
    completed: {
      label: "Đã hoàn thành",
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      icon: CalendarDays,
    },
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  const formatDate = (date) => format(date, "dd/MM/yyyy", { locale: vi });

  const status = statusMap[departure.status];
  const StatusIcon = status?.icon || Clock;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md md:max-w-lg lg:max-w-xl p-6 md:p-8">
        <DialogHeader className="pb-3 border-b border-gray-200 dark:border-gray-700">
          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-50"> {/* text-xl cho tiêu đề */}
            Chi tiết chuyến đi: <span className="font-semibold text-primary">{departure.tour_code}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-y-3 py-4 text-sm text-gray-700 dark:text-gray-300"> {/* text-sm cho nội dung chính */}
          <Info label="Tên tour" value={departure.tour_name} />
          <Info label="Ngày khởi hành" value={formatDate(departure.departure_date)} />
          <Info label="Ngày trở về" value={formatDate(departure.return_date)} />
          <Info label="Hạn đăng ký" value={formatDate(departure.expiration_date)} />

          <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
            <div className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Giá vé:</div> {/* mb-1 cho khoảng cách nhỏ hơn */}
            <ul className="ml-4 list-disc space-y-0.5 text-xs text-gray-600 dark:text-gray-400"> {/* text-xs cho danh sách giá */}
              <li>Người lớn: <span className="font-medium">{formatCurrency(departure.prices.adult)}</span></li>
              <li>Trẻ em: <span className="font-medium">{formatCurrency(departure.prices.child)}</span></li>
              <li>Người cao tuổi: <span className="font-medium">{formatCurrency(departure.prices.senior)}</span></li>
            </ul>
          </div>

          <Info
            label="Số chỗ"
            value={`Còn ${departure.available_slots - departure.booked_slots}/${departure.available_slots} (Đã đặt: ${departure.booked_slots})`}
          />

          <div className="flex items-center gap-2 mt-2">
            <StatusIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" /> {/* Kích thước icon về lại ban đầu */}
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide ${status?.color} transition-colors duration-200 ease-in-out`} 
            >
              {status?.label}
            </span>
          </div>

          <Info
            label="Người tạo"
            value={`${departure.created_by.name} (Ngày tạo: ${formatDate(
              departure.created_at
            )})`}
          />
        </div>

        <DialogFooter className="pt-3 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" onClick={() => setIsOpen(false)} className="px-5 py-1.5 text-sm"> {/* px, py nhỏ hơn, text-sm cho button */}
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const Info = ({ label, value }) => (
  <div className="flex justify-between items-center gap-4 py-0.5"> {/* py nhỏ hơn */}
    <span className="font-medium text-gray-600 dark:text-gray-400 w-1/3">
      {label}:
    </span>
    <span className="text-right flex-1 font-semibold text-gray-800 dark:text-gray-200">
      {value}
    </span>
  </div>
);

export default DetailDepartureDialog;
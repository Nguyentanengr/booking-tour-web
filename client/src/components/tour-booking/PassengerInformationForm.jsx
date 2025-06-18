import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button"; // Make sure Button is imported if used directly
import { CalendarIcon, Users } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export function PassengerInformationForm({ passengerCounts, passengers, updatePassenger, getPassengerPrice }) {
  const renderPassengerInputs = (type, count, headerText, iconColor, fromYear, toYear) => {
    return count > 0 && (
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Users size={20} className={iconColor} />
          <h3 className="text-lg font-semibold">{headerText}</h3>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-600 pb-2 border-b">
            <div className="col-span-3">Họ tên *</div>
            <div className="col-span-2">Giới tính *</div>
            <div className="col-span-3">Ngày sinh *</div>
            {type !== "child" && <div className="col-span-2">Phòng đơn</div>}
            <div className="col-span-2">Giá</div>
          </div>
          {passengers
            .filter((p) => p.type === type)
            .map((passenger, index) => (
              <div key={passenger.id} className="grid grid-cols-12 gap-4 items-center py-2">
                <div className="col-span-3">
                  <Input
                    placeholder="Nhập họ tên"
                    value={passenger.fullName}
                    onChange={(e) => updatePassenger(passenger.id, "fullName", e.target.value)}
                    className="h-9"
                  />
                </div>
                <div className="col-span-2">
                  <Select
                    value={passenger.gender}
                    onValueChange={(value) => updatePassenger(passenger.id, "gender", value)}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Chọn" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Nam</SelectItem>
                      <SelectItem value="female">Nữ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal h-9">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {passenger.dateOfBirth ? (
                          format(passenger.dateOfBirth, "dd/MM/yyyy", { locale: vi })
                        ) : (
                          <span className="text-gray-400">--/--/----</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={passenger.dateOfBirth}
                        onSelect={(date) => updatePassenger(passenger.id, "dateOfBirth", date)}
                        locale={vi}
                        captionLayout="dropdown-buttons"
                        fromYear={fromYear}
                        toYear={toYear}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                {type !== "child" && (
                  <div className="col-span-2">
                    <div className="flex items-center justify-center">
                      <Checkbox
                        checked={passenger.singleRoom || false}
                        onCheckedChange={(checked) => updatePassenger(passenger.id, "singleRoom", checked)}
                      />
                    </div>
                  </div>
                )}
                <div className="col-span-2 text-right font-medium text-red-600">
                  {getPassengerPrice(type).toLocaleString()} đ
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border p-6">
      <h2 className="text-xl font-semibold mb-4">Thông tin hành khách</h2>

      {renderPassengerInputs("adult", passengerCounts.adult, "Người lớn (Từ 12 tuổi trở lên)", "text-blue-600", 1940, 2023)}
      {renderPassengerInputs("child", passengerCounts.child, "Trẻ em (Từ 5 - 11 tuổi)", "text-green-600", 2010, 2023)}
      {renderPassengerInputs("senior", passengerCounts.senior, "Người cao tuổi (Từ 65 tuổi trở lên)", "text-purple-600", 1940, 1960)}
    </div>
  );
}
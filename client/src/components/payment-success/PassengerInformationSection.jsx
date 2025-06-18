import React from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export function PassengerInformationSection({ passengers }) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4">Thông tin hành khách</h3>
      <div className="space-y-4">
        {passengers.map((passenger, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Họ tên</p>
                <p className="font-medium">{passenger.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Ngày sinh</p>
                <p className="font-medium">{format(passenger.dateOfBirth, "dd/MM/yyyy", { locale: vi })}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Giới tính</p>
                <p className="font-medium">{passenger.gender}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Số điện thoại</p>
                <p className="font-medium">{passenger.phoneNumber}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
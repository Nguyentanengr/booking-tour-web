// components/DepartureTable.jsx
import React from "react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export default function DepartureTable({ departures, selectedDeparture, handleSelectDeparture, departureTableRef }) {
  return (
    <div ref={departureTableRef} className="space-y-4">
      <h2 className="text-2xl font-bold">Lịch khởi hành & Giá tour</h2>
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Ngày khởi hành</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Ngày về</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Người lớn</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Trẻ em</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Người cao tuổi</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Còn lại</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Chọn</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {departures.map((departure) => (
                <tr key={departure.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">
                    {format(departure.departureDate, "dd/MM/yyyy", { locale: vi })}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {format(departure.returnDate, "dd/MM/yyyy", { locale: vi })}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex flex-col">
                      <span className="font-medium text-red-600">
                        {(departure.discountedPrice || departure.prices.adult).toLocaleString()} đ
                      </span>
                      {departure.discountedPrice && (
                        <span className="text-xs text-gray-500 line-through">
                          {departure.prices.adult.toLocaleString()} đ
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-red-600">
                    {departure.prices.child.toLocaleString()} đ
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-red-600">
                    {departure.prices.senior.toLocaleString()} đ
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        departure.availableSlots > 10
                          ? "bg-green-100 text-green-800"
                          : departure.availableSlots > 5
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {departure.availableSlots} chỗ
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      size="sm"
                      variant={selectedDeparture?.id === departure.id ? "default" : "outline"}
                      onClick={() => handleSelectDeparture(departure)}
                    >
                      {selectedDeparture?.id === departure.id ? "Đã chọn" : "Chọn"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
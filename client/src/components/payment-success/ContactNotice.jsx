import React from "react";
import { Phone } from "lucide-react";

export function ContactNotice() {
  return (
    <div className="bg-blue-50 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4 text-blue-800">Thông báo quan trọng</h3>
      <div className="flex items-start gap-3 text-blue-700">
        <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
          <Phone size={14} />
        </div>
        <div>
          <p className="font-medium mb-2">Nhân viên sẽ liên hệ tư vấn giấy tờ</p>
          <p className="text-sm">
            Trong vòng 24 giờ tới, nhân viên tư vấn của chúng tôi sẽ gọi điện để hướng dẫn bạn chuẩn bị các giấy tờ
            cần thiết cho chuyến đi. Vui lòng để ý điện thoại và chuẩn bị sẵn hộ chiếu để kiểm tra thông tin.
          </p>
          <p className="text-sm mt-2">
            <strong>Hotline hỗ trợ:</strong> 1900 1234 (8:00 - 17:30, Thứ 2 - Thứ 6)
          </p>
        </div>
      </div>
    </div>
  );
}
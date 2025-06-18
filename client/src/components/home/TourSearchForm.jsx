import React from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function TourSearchForm() {
  return (
    <section className="container -mt-16 relative z-20 mb-12 w-[1400px] mx-auto z-100">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Tìm kiếm tour du lịch</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Tìm kiếm</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input placeholder="Tên tour hoặc mã tour" className="pl-9" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Điểm khởi hành</label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn điểm khởi hành" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hcm">TP. Hồ Chí Minh</SelectItem>
                <SelectItem value="hanoi">Hà Nội</SelectItem>
                <SelectItem value="danang">Đà Nẵng</SelectItem>
                <SelectItem value="cantho">Cần Thơ</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Điểm đến</label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn điểm đến" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vungtau">Vũng Tàu</SelectItem>
                <SelectItem value="dalat">Đà Lạt</SelectItem>
                <SelectItem value="phuquoc">Phú Quốc</SelectItem>
                <SelectItem value="nhatrang">Nha Trang</SelectItem>
                <SelectItem value="sapa">Sa Pa</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Thời gian</label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn thời gian" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1n">1 ngày</SelectItem>
                <SelectItem value="2n1d">2N1Đ</SelectItem>
                <SelectItem value="3n2d">3N2Đ</SelectItem>
                <SelectItem value="4n3d">4N3Đ</SelectItem>
                <SelectItem value="5n4d">5N4Đ</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <Search className="mr-2 h-4 w-4" />
              Tìm kiếm
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
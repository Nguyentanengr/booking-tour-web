import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Search, CalendarIcon, X } from "lucide-react"
import { useState, useEffect } from "react"

// Hàm tự viết để định dạng ngày tháng (thay thế date-fns format)
const formatDate = (date) => {
  if (!date) return ""
  const d = date.getDate().toString().padStart(2, '0');
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
};

export function TourFilters({
  selectedFilters,
  searchTerm,
  onSearchTermChange,
  onFilterChange,
  onClearFilters,
  hasActiveFilters,
}) {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [localFilters, setLocalFilters] = useState(selectedFilters);

  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    setLocalFilters(selectedFilters);
  }, [selectedFilters]);

  const handleLocalFilterChange = (key, value) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleLocalSearchTermChange = (value) => {
    setLocalSearchTerm(value);
  };

  const handleSubmit = () => {
    onSearchTermChange(localSearchTerm);
    onFilterChange(localFilters);
  };

  const handleClear = () => {
    setLocalSearchTerm("");
    setLocalFilters({
      priceRange: "",
      duration: "",
      startingProvince: "",
      destination: "",
      transportation: "",
      rating: "",
      departureDate: undefined,
      bestsellerOnly: false,
    });
    onClearFilters();
  };

  const isChanged = localSearchTerm !== searchTerm ||
                    JSON.stringify(localFilters) !== JSON.stringify(selectedFilters);

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Bộ lọc tìm kiếm</h2>
        {(hasActiveFilters || isChanged) && (
          <Button variant="ghost" size="sm" onClick={handleClear} className="text-red-500">
            <X size={16} className="mr-1" />
            Xóa bộ lọc
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4 lg:grid-cols-1 lg:gap-y-6">
        {/* Search */}
        <div className="col-span-1 flex flex-col gap-2">
          <label htmlFor="search" className="text-sm font-medium block">
            Tìm kiếm
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input
              id="search"
              placeholder="Tên tour hoặc mã tour..."
              className="pl-9 border-gray-300 h-10 w-full" // Added w-full for explicit full width
              value={localSearchTerm}
              onChange={(e) => handleLocalSearchTermChange(e.target.value)}
            />
          </div>
        </div>

        {/* Price Range */}
        <div className="col-span-1 flex flex-col gap-2">
          <label htmlFor="priceRange" className="text-sm font-medium block">
            Mức giá
          </label>
          <Select
            value={localFilters.priceRange}
            onValueChange={(value) => handleLocalFilterChange("priceRange", value)}
          >
            <SelectTrigger id="priceRange" className="border-gray-300 h-10 w-full"> {/* Added w-full */}
              <SelectValue placeholder="Chọn mức giá" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="under-5m">Dưới 5 triệu</SelectItem>
              <SelectItem value="5m-10m">5 - 10 triệu</SelectItem>
              <SelectItem value="10m-20m">10 - 20 triệu</SelectItem>
              <SelectItem value="over-20m">Trên 20 triệu</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Duration */}
        <div className="col-span-1 flex flex-col gap-2">
          <label htmlFor="duration" className="text-sm font-medium block">
            Thời gian
          </label>
          <Select
            value={localFilters.duration}
            onValueChange={(value) => handleLocalFilterChange("duration", value)}
          >
            <SelectTrigger id="duration" className="border-gray-300 h-10 w-full"> {/* Added w-full */}
              <SelectValue placeholder="Chọn thời gian" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-day">1 ngày</SelectItem>
              <SelectItem value="2n1d">2N1Đ</SelectItem>
              <SelectItem value="3n2d">3N2Đ</SelectItem>
              <SelectItem value="4n3d">4N3Đ</SelectItem>
              <SelectItem value="5n4d">5N4Đ</SelectItem>
              <SelectItem value="over-5d">Trên 5 ngày</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Starting Province */}
        <div className="col-span-1 flex flex-col gap-2">
          <label htmlFor="startingProvince" className="text-sm font-medium block">
            Điểm khởi hành
          </label>
          <Select
            value={localFilters.startingProvince}
            onValueChange={(value) => handleLocalFilterChange("startingProvince", value)}
          >
            <SelectTrigger id="startingProvince" className="border-gray-300 h-10 w-full"> {/* Added w-full */}
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

        {/* Destination */}
        <div className="col-span-1 flex flex-col gap-2">
          <label htmlFor="destination" className="text-sm font-medium block">
            Điểm đến
          </label>
          <Select
            value={localFilters.destination}
            onValueChange={(value) => handleLocalFilterChange("destination", value)}
          >
            <SelectTrigger id="destination" className="border-gray-300 h-10 w-full"> {/* Added w-full */}
              <SelectValue placeholder="Chọn điểm đến" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="singapore">Singapore</SelectItem>
              <SelectItem value="phuquoc">Phú Quốc</SelectItem>
              <SelectItem value="dalat">Đà Lạt</SelectItem>
              <SelectItem value="nhatrang">Nha Trang</SelectItem>
              <SelectItem value="halong">Hạ Long</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Transportation */}
        <div className="col-span-1 flex flex-col gap-2">
          <label htmlFor="transportation" className="text-sm font-medium block">
            Phương tiện
          </label>
          <Select
            value={localFilters.transportation}
            onValueChange={(value) => handleLocalFilterChange("transportation", value)}
          >
            <SelectTrigger id="transportation" className="border-gray-300 h-10 w-full"> {/* Added w-full */}
              <SelectValue placeholder="Chọn phương tiện" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="plane">Máy bay</SelectItem>
              <SelectItem value="bus">Xe khách</SelectItem>
              <SelectItem value="train">Tàu hỏa</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Rating */}
        <div className="col-span-1 flex flex-col gap-2">
          <label htmlFor="rating" className="text-sm font-medium block">
            Đánh giá
          </label>
          <Select
            value={localFilters.rating}
            onValueChange={(value) => handleLocalFilterChange("rating", value)}
          >
            <SelectTrigger id="rating" className="border-gray-300 h-10 w-full"> {/* Added w-full */}
              <SelectValue placeholder="Chọn đánh giá" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5-star">5 sao</SelectItem>
              <SelectItem value="4-star">4 sao trở lên</SelectItem>
              <SelectItem value="3-star">3 sao trở lên</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Departure Date */}
        <div className="col-span-1 flex flex-col gap-2">
          <label htmlFor="departureDate" className="text-sm font-medium block">
            Ngày khởi hành
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal border-gray-300 h-10" // w-full is already here
                id="departureDate"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {localFilters.departureDate ? (
                  formatDate(localFilters.departureDate)
                ) : (
                  <span>Chọn ngày đi</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={localFilters.departureDate}
                onSelect={(date) => handleLocalFilterChange("departureDate", date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Bestseller Only (Không thay đổi, vì nó đã là flex row) */}
        <div className="col-span-1 flex items-center space-x-2">
          <Checkbox
            id="bestseller"
            checked={localFilters.bestsellerOnly}
            onCheckedChange={(checked) => handleLocalFilterChange("bestsellerOnly", checked)}
          />
          <label htmlFor="bestseller" className="text-sm font-medium">
            Chỉ hiển thị Bestseller
          </label>
        </div>
      </div>

      {/* Buttons: Submit and Clear */}
      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline" onClick={handleClear} disabled={!hasActiveFilters && !isChanged}>
          Xóa
        </Button>
        <Button onClick={handleSubmit} disabled={!isChanged} className="bg-blue-600 text-white hover:bg-blue-700">
          Áp dụng
        </Button>
      </div>
    </div>
  )
}
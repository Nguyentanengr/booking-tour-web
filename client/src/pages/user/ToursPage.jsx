import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

import { TourCard } from "@/components/tours/TourCard"
import { TourFilters } from "@/components/tours/TourFilters"
import { TourPagination } from "@/components/tours/TourPagination"
import { fetchTours } from "@/utils/fakeAllTours.js"
import { Link } from "react-router-dom" // Đảm bảo import Link từ react-router-dom

const TOURS_PER_PAGE = 5

export default function ToursPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [favoriteTours, setFavoriteTours] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedFilters, setSelectedFilters] = useState({
    priceRange: "",
    duration: "",
    startingProvince: "",
    destination: "",
    transportation: "",
    rating: "",
    departureDate: undefined,
    bestsellerOnly: false,
  })

  const [tours, setTours] = useState([])
  const [totalTours, setTotalTours] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // useCallback cho fetchToursData để tránh re-render không cần thiết
  const fetchToursData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetchTours({
        searchTerm,
        sortBy,
        filters: selectedFilters,
        page: currentPage,
        limit: TOURS_PER_PAGE,
      })
      setTours(response.tours)
      setTotalTours(response.totalTours)
      setTotalPages(response.totalPages)
    } catch (err) {
      console.error("Failed to fetch tours:", err)
      setError("Không thể tải dữ liệu tour. Vui lòng thử lại sau.")
    } finally {
      setLoading(false)
    }
  }, [searchTerm, sortBy, selectedFilters, currentPage]) // Dependencies for useCallback

  // useEffect để gọi fetchToursData khi dependencies thay đổi
  useEffect(() => {
    fetchToursData()
  }, [fetchToursData]) // fetchToursData là dependency

  // Hàm được gọi khi nút Áp dụng trong TourFilters được nhấn
  const handleApplyFilters = (newFilters) => {
    setSelectedFilters(newFilters)
    setCurrentPage(1) // Luôn về trang 1 khi áp dụng bộ lọc mới
  }

  // Hàm được gọi khi search term trong TourFilters được nhấn Apply
  const handleApplySearchTerm = (term) => {
    setSearchTerm(term)
    setCurrentPage(1) // Luôn về trang 1 khi áp dụng search term mới
  }

  const toggleFavorite = (tourId) => {
    setFavoriteTours((prevFavorites) =>
      prevFavorites.includes(tourId) ? prevFavorites.filter((id) => id !== tourId) : [...prevFavorites, tourId],
    )
  }

  // Hàm clear filters, sẽ reset cả searchTerm và selectedFilters
  const clearAllFilters = () => {
    setSearchTerm("")
    setSelectedFilters({
      priceRange: "",
      duration: "",
      startingProvince: "",
      destination: "",
      transportation: "",
      rating: "",
      departureDate: undefined,
      bestsellerOnly: false,
    })
    setCurrentPage(1) // Reset về trang 1
  }

  const hasActiveFilters =
    Object.values(selectedFilters).some((value) => value !== "" && value !== undefined && value !== false) ||
    searchTerm !== ""

  return (
    <div className="container py-8 px-4 sm:px-6 lg:px-8"> {/* Đã thêm padding ngang */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1">
          <TourFilters
            selectedFilters={selectedFilters}
            searchTerm={searchTerm}
            onSearchTermChange={handleApplySearchTerm} // Đã đổi tên hàm
            onFilterChange={handleApplyFilters}       // Đã đổi tên hàm
            onClearFilters={clearAllFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="space-y-6">
            {/* Results Header */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <p className="text-gray-600">Chúng tôi tìm thấy</p>
                  <p className="text-xl font-bold">{totalTours} chương trình tour cho quý khách</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Sắp xếp theo:</span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Sắp xếp theo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Ngày khởi hành gần nhất</SelectItem>
                      <SelectItem value="price-asc">Giá tăng dần</SelectItem>
                      <SelectItem value="price-desc">Giá giảm dần</SelectItem>
                      <SelectItem value="rating">Đánh giá cao nhất</SelectItem>
                      <SelectItem value="name-asc">Tên A-Z</SelectItem>
                      <SelectItem value="name-desc">Tên Z-A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {loading && (
              <div className="text-center py-8">
                <p>Đang tải tour...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Lỗi:</strong>
                <span className="block sm:inline"> {error}</span>
              </div>
            )}

            {!loading && !error && tours.length > 0 ? (
              <div className="space-y-6">
                {tours.map((tour) => (
                  <TourCard
                    key={tour.id}
                    tour={tour}
                    isFavorite={favoriteTours.includes(tour.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            ) : !loading && !error && (
              <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <Search size={48} className="mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Không tìm thấy tour nào</h3>
                <p className="text-gray-500 mb-4">Vui lòng thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm</p>
                <Button onClick={clearAllFilters} variant="outline"> {/* Đã đổi tên hàm */}
                  Xóa tất cả bộ lọc
                </Button>
              </div>
            )}

            {/* Pagination */}
            {!loading && !error && totalPages > 1 && (
              <TourPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalTours={totalTours}
                toursPerPage={TOURS_PER_PAGE}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
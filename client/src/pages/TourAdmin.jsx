import React, { useState, useEffect } from 'react';
import { SearchIcon, PlusIcon, PencilIcon, TrashIcon, ScanSearch, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { Switch } from '@/components/ui/switch'; // Shadcn/UI Switch
import { Button } from '@/components/ui/button'; // Shadcn/UI Switch
import AddTourModal from '../components/tourAdmin/AddTourModal';
import EditTourModal from '../components/tourAdmin/EditTourModal';
import DeleteTourModal from '../components/tourAdmin/DeleteTourModal';
import ViewTourModal from '../components/tourAdmin/ViewTourModal';
import ToggleActiveModal from '../components/tourAdmin/ToggleActiveModal';
import { mockTours, mockProvinces } from '../utils/fakeTourAdmin';

const TourAdmin = () => {
  const [tours, setTours] = useState(mockTours);
  const [filteredTours, setFilteredTours] = useState(mockTours);
  const [searchTerm, setSearchTerm] = useState('');
  const [provinceFilter, setProvinceFilter] = useState('all');
  const [bestsellerFilter, setBestsellerFilter] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showToggleModal, setShowToggleModal] = useState(false);
  const [currentTour, setCurrentTour] = useState(null);
  const [deleteReason, setDeleteReason] = useState('');
  const [toggleActive, setToggleActive] = useState(null); // Lưu trạng thái bật/tắt mong muốn
  const [currentPage, setCurrentPage] = useState(1);
  const toursPerPage = 10;

  // Lọc tours dựa trên bộ lọc
  useEffect(() => {
    let filtered = [...tours];
    if (searchTerm) {
      filtered = filtered.filter(
        (tour) =>
          tour.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tour.tour_code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (provinceFilter !== 'all') {
      filtered = filtered.filter((tour) => tour.destination_province_id === provinceFilter);
    }
    if (bestsellerFilter) {
      filtered = filtered.filter((tour) => tour.is_bestseller);
    }
    setFilteredTours(filtered);
    setCurrentPage(1);
  }, [searchTerm, provinceFilter, bestsellerFilter, tours]);

  // Lấy tên tỉnh từ ID
  const getProvinceName = (id) => {
    const province = mockProvinces.find((p) => p._id === id);
    return province ? province.name : 'N/A';
  };

  // Xử lý yêu cầu bật/tắt toggle
  const handleToggleRequest = (tour) => {
    setCurrentTour(tour);
    setToggleActive(!tour.is_active);
    setShowToggleModal(true);
  };

  // Xử lý xác nhận bật/tắt
  const handleConfirmToggle = () => {
    if (currentTour && toggleActive !== null) {
      setTours((prev) =>
        prev.map((t) =>
          t._id === currentTour._id ? { ...t, is_active: toggleActive } : t
        )
      );
    }
    setShowToggleModal(false);
    setCurrentTour(null);
    setToggleActive(null);
  };

  // Phân trang
  const indexOfLastTour = currentPage * toursPerPage;
  const indexOfFirstTour = indexOfLastTour - toursPerPage;
  const currentTours = filteredTours.slice(indexOfFirstTour, indexOfLastTour);
  const totalPages = Math.ceil(filteredTours.length / toursPerPage);

  return (
    <div className="container mx-auto py-8 px-5">
      <h2 className="text-2xl font-bold text-black mb-6">Quản lý tour</h2>
      {/* Thanh công cụ */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã hoặc tên tour"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-300"
            />
          </div>
          <select
            value={provinceFilter}
            onChange={(e) => setProvinceFilter(e.target.value)}
            className="w-full md:w-48 p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-300"
          >
            <option value="all">Tất cả điểm đến</option>
            {mockProvinces.map((province) => (
              <option key={province._id} value={province._id}>
                {province.name}
              </option>
            ))}
          </select>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="bestseller"
              checked={bestsellerFilter}
              onChange={(e) => setBestsellerFilter(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-300 border-gray-300 rounded"
            />
            <label htmlFor="bestseller" className="text-sm text-gray-700">
              Chỉ hiện Bestseller
            </label>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-700 cursor-pointer text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Tạo tour mới
        </button>
      </div>
      {/* Bảng danh sách tour */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã tour</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên tour</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Điểm đến</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá đại diện</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hoạt động</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentTours.length > 0 ? (
              currentTours.map((tour) => (
                <tr key={tour._id} className="hover:bg-gray-100">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tour.tour_code}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tour.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getProvinceName(tour.destination_province_id)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tour.duration}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tour.representative_price.new_price ? (
                      <div>
                        <span className="line-through text-gray-400">{tour.representative_price.adult.toLocaleString('vi-VN')}đ</span>
                        <span className="ml-2 font-medium text-red-600">{tour.representative_price.new_price.toLocaleString('vi-VN')}đ</span>
                      </div>
                    ) : (
                      <span>{tour.representative_price.adult.toLocaleString('vi-VN')}đ</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${tour.is_bestseller ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-800'
                        }`}
                    >
                      {tour.is_bestseller ? 'Bestseller' : 'Thường'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Switch
                      checked={tour.is_active}
                      onCheckedChange={() => handleToggleRequest(tour)}
                      title={tour.is_active ? 'Vô hiệu hóa' : 'Kích hoạt'}
                      className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-red-400 data-[state=checked]:to-violet-800 cursor-pointer"
                    />
                  </td>
                  <td className="flex items-center px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button
                      onClick={() => {
                        setCurrentTour(tour);
                        setShowViewModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 flex items-center"
                      title="Xem chi tiết"
                    >
                      <ScanSearch className="h-4 w-4 mr-1" />
                    </button>
                    <button
                      onClick={() => {
                        setCurrentTour(tour);
                        setShowEditModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 flex items-center"
                      title="Chỉnh sửa"
                    >
                      <PencilIcon className="h-4 w-4 mr-1" />
                    </button>
                    <button
                      onClick={() => {
                        setCurrentTour(tour);
                        setShowDeleteModal(true);
                      }}
                      className="text-red-600 hover:text-red-800 flex items-center"
                      title="Hủy/Xóa"
                    >
                      <TrashIcon className="h-4 w-4 mr-1" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                  Không tìm thấy tour nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <nav className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
              className="h-6 w-6 cursor-pointer"
            >
              <ChevronLeftIcon className="h-3 w-3" />
            </Button>
            <span className="px-2 border rounded bg-white text-gray-800">{currentPage}</span>
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
              className="h-6 w-6 cursor-pointer"
            >
              <ChevronRightIcon className="h-3 w-3" />
            </Button>
          </nav>
        </div>
      )}
      {/* Modal */}
      <AddTourModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        setTours={setTours}
      />
      <EditTourModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        currentTour={currentTour}
        setTours={setTours}
      />
      <DeleteTourModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        currentTour={currentTour}
        deleteReason={deleteReason}
        setDeleteReason={setDeleteReason}
        setTours={setTours}
      />
      <ViewTourModal
        show={showViewModal}
        onClose={() => setShowViewModal(false)}
        currentTour={currentTour}
      />
      <ToggleActiveModal
        show={showToggleModal}
        onClose={() => setShowToggleModal(false)}
        currentTour={currentTour}
        toggleActive={toggleActive}
        onConfirm={handleConfirmToggle}
      />
    </div>
  );
};

export default TourAdmin;
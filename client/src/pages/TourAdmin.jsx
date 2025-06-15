import React, { useState, useEffect, useMemo } from 'react';
import { SearchIcon, PlusIcon, PencilIcon, TrashIcon, ScanSearch, ChevronLeftIcon, ChevronRightIcon, ArrowUpNarrowWideIcon, ArrowDownNarrowWideIcon, CalendarIcon, ClockIcon, CheckIcon } from 'lucide-react';
import { Switch } from '@/components/ui/switch'; // Shadcn/UI Switch
import { Button } from '@/components/ui/button'; // Shadcn/UI Button
import { Input } from '@/components/ui/input'; // Shadcn/UI Input
// Import Shadcn Table components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';

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
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'active', 'inactive'
  const [sortCriterion, setSortCriterion] = useState(null); // 'tour_code', 'name', 'price'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc', 'desc'

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showToggleModal, setShowToggleModal] = useState(false);
  const [currentTour, setCurrentTour] = useState(null);
  const [deleteReason, setDeleteReason] = useState('');
  const [toggleActive, setToggleActive] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const toursPerPage = 10;

  // Lọc và sắp xếp tours dựa trên bộ lọc
  useEffect(() => {
    let filtered = [...tours];

    // Search
    if (searchTerm) {
      filtered = filtered.filter(
        (tour) =>
          tour.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tour.tour_code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Province filter
    if (provinceFilter !== 'all') {
      filtered = filtered.filter((tour) => tour.destination_province_id === provinceFilter);
    }

    // Bestseller filter
    if (bestsellerFilter) {
      filtered = filtered.filter((tour) => tour.is_bestseller);
    }

    // Active status filter
    if (activeFilter === 'active') {
      filtered = filtered.filter((tour) => tour.is_active);
    } else if (activeFilter === 'inactive') {
      filtered = filtered.filter((tour) => !tour.is_active);
    }

    // Sorting
    if (sortCriterion) {
      filtered.sort((a, b) => {
        let valA, valB;
        if (sortCriterion === 'tour_code') {
          valA = a.tour_code;
          valB = b.tour_code;
        } else if (sortCriterion === 'name') {
          valA = a.name;
          valB = b.name;
        } else if (sortCriterion === 'price') {
          valA = a.representative_price.new_price || a.representative_price.adult;
          valB = b.representative_price.new_price || b.representative_price.adult;
        }

        if (valA < valB) {
          return sortOrder === 'asc' ? -1 : 1;
        }
        if (valA > valB) {
          return sortOrder === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredTours(filtered);
    setCurrentPage(1); // Reset to first page on filter/sort change
  }, [searchTerm, provinceFilter, bestsellerFilter, activeFilter, sortCriterion, sortOrder, tours]);

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

  const handleSort = (criterion) => {
    if (sortCriterion === criterion) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortCriterion(criterion);
      setSortOrder('asc');
    }
  };

  // Phân trang
  const indexOfLastTour = currentPage * toursPerPage;
  const indexOfFirstTour = indexOfLastTour - toursPerPage;
  const currentTours = filteredTours.slice(indexOfFirstTour, indexOfLastTour);
  const totalPages = Math.ceil(filteredTours.length / toursPerPage);

  // Statistics - Adjusted to precisely match tour data
  const tourStatistics = useMemo(() => {
    const total = tours.length;
    const activeTours = tours.filter((tour) => tour.is_active).length;
    const inactiveTours = tours.filter((tour) => !tour.is_active).length;
    const bestsellerTours = tours.filter((tour) => tour.is_bestseller).length;

    return {
      total,
      activeTours,
      inactiveTours,
      bestsellerTours,
    };
  }, [tours]);

  return (
    <div className="container mx-auto py-6 px-4">

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng tour</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tourStatistics.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang hoạt động</CardTitle>
            <CheckIcon className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tourStatistics.activeTours}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tạm dừng</CardTitle>
            <ClockIcon className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tourStatistics.inactiveTours}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bestseller</CardTitle>
            <CalendarIcon className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tourStatistics.bestsellerTours}</div>
          </CardContent>
        </Card>
      </div>

      {/* Thanh công cụ - Precisely styled to match image_cb5190.png */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative flex-grow min-w-[200px] max-w-sm">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Mã tour, tên tour..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 py-2 border border-gray-300 rounded-lg focus-visible:ring-offset-0 focus-visible:ring-blue-300 shadow-sm"
            />
          </div>

          {/* Active Status Filter */}
          <Select value={activeFilter} onValueChange={setActiveFilter}>
            <SelectTrigger className="w-[160px] rounded-lg focus-visible:ring-offset-0 focus-visible:ring-blue-300 shadow-sm">
              <SelectValue placeholder="Tất cả trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="active">Đang hoạt động</SelectItem>
              <SelectItem value="inactive">Tạm dừng</SelectItem>
            </SelectContent>
          </Select>

          {/* Province Filter */}
          <Select value={provinceFilter} onValueChange={setProvinceFilter}>
            <SelectTrigger className="w-[160px] rounded-lg focus-visible:ring-offset-0 focus-visible:ring-blue-300 shadow-sm">
              <SelectValue placeholder="Tất cả điểm đến" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả điểm đến</SelectItem>
              {mockProvinces.map((province) => (
                <SelectItem key={province._id} value={province._id}>
                  {province.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Bestseller Checkbox */}
          <div className="flex items-center space-x-2 mr-2">
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

          {/* Sort by Select */}
          <Select value={sortCriterion || ''} onValueChange={(value) => setSortCriterion(value)}>
            <SelectTrigger className="w-[160px] rounded-lg focus-visible:ring-offset-0 focus-visible:ring-blue-300 shadow-sm">
              <SelectValue placeholder="Sắp xếp theo..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Tên tour</SelectItem>
              <SelectItem value="tour_code">Mã tour</SelectItem>
              <SelectItem value="price">Giá đại diện</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Add New Tour Button */}
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white h-10 px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center shadow-md ml-auto md:ml-0"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Thêm chuyến đi
        </Button>
      </div>

      {/* Bảng danh sách tour - Using Shadcn Table components */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <Table>
          <TableHeader className="">
            <TableRow>
              <TableHead
                className="px-6 py-3 text-left  font-medium  tracking-wider cursor-pointer hover:bg-gray-100 transition duration-150 rounded-tl-xl"
                onClick={() => handleSort('tour_code')}
              >
                <div className="flex items-center">
                  Mã tour
                  {sortCriterion === 'tour_code' && (
                    sortOrder === 'asc' ? <ArrowUpNarrowWideIcon className="ml-1 h-3 w-3" /> : <ArrowDownNarrowWideIcon className="ml-1 h-3 w-3" />
                  )}
                </div>
              </TableHead>
              <TableHead
                className="px-6 py-3 text-left  font-medium   tracking-wider cursor-pointer hover:bg-gray-100 transition duration-150"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center">
                  Tên tour
                  {sortCriterion === 'name' && (
                    sortOrder === 'asc' ? <ArrowUpNarrowWideIcon className="ml-1 h-3 w-3" /> : <ArrowDownNarrowWideIcon className="ml-1 h-3 w-3" />
                  )}
                </div>
              </TableHead>
              <TableHead className="px-6 py-3 text-left  font-medium   tracking-wider">Điểm đến</TableHead>
              <TableHead className="px-6 py-3 text-left  font-medium   tracking-wider">Thời gian</TableHead>
              <TableHead
                className="px-6 py-3 text-left  font-medium   tracking-wider cursor-pointer hover:bg-gray-100 transition duration-150"
                onClick={() => handleSort('price')}
              >
                <div className="flex items-center">
                  Giá đại diện
                  {sortCriterion === 'price' && (
                    sortOrder === 'asc' ? <ArrowUpNarrowWideIcon className="ml-1 h-3 w-3" /> : <ArrowDownNarrowWideIcon className="ml-1 h-3 w-3" />
                  )}
                </div>
              </TableHead>
              <TableHead className="px-6 py-3 text-left  font-medium   tracking-wider">Trạng thái</TableHead>
              <TableHead className="px-6 py-3 text-left  font-medium   tracking-wider">Hoạt động</TableHead>
              <TableHead className="px-6 py-3 text-right  font-medium   tracking-wider rounded-tr-xl">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentTours.length > 0 ? (
              currentTours.map((tour) => (
                <TableRow key={tour._id} className="hover:bg-gray-50 transition duration-150">
                  <TableCell className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{tour.tour_code}</TableCell>
                  <TableCell className="px-6 py-2 whitespace-nowrap text-sm text-gray-800">{tour.name}</TableCell>
                  <TableCell className="px-6 py-2 whitespace-nowrap text-sm text-gray-800">{getProvinceName(tour.destination_province_id)}</TableCell>
                  <TableCell className="px-6 py-2 whitespace-nowrap text-sm text-gray-800">{tour.duration}</TableCell>
                  <TableCell className="px-6 py-2 whitespace-nowrap text-sm text-gray-800">
                    {tour.representative_price.new_price ? (
                      <div>
                        <span className="line-through text-gray-400">{tour.representative_price.adult.toLocaleString('vi-VN')}đ</span>
                        <span className="ml-2 font-medium text-red-600">{tour.representative_price.new_price.toLocaleString('vi-VN')}đ</span>
                      </div>
                    ) : (
                      <span>{tour.representative_price.adult.toLocaleString('vi-VN')}đ</span>
                    )}
                  </TableCell>
                  <TableCell className="px-6 py-2 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${tour.is_bestseller ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-800'
                        }`}
                    >
                      {tour.is_bestseller ? 'Bestseller' : 'Thường'}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-2 whitespace-nowrap">
                    <Switch
                      checked={tour.is_active}
                      onCheckedChange={() => handleToggleRequest(tour)}
                      title={tour.is_active ? 'Vô hiệu hóa' : 'Kích hoạt'}
                      className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-red-400 data-[state=checked]:to-violet-800 cursor-pointer"
                    />
                  </TableCell>
                  <TableCell className="flex items-center px-6 py-2 whitespace-nowrap justify-end text-sm font-medium space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setCurrentTour(tour);
                        setShowViewModal(true);
                      }}
                      className="text-blue-600 hover:bg-blue-50 hover:text-blue-700 p-2 rounded-full h-8 w-8"
                      title="Xem chi tiết"
                    >
                      <ScanSearch className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setCurrentTour(tour);
                        setShowEditModal(true);
                      }}
                      className="text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 p-2 rounded-full h-8 w-8"
                      title="Chỉnh sửa"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setCurrentTour(tour);
                        setShowDeleteModal(true);
                      }}
                      className="text-red-600 hover:bg-red-50 hover:text-red-700 p-2 rounded-full h-8 w-8"
                      title="Hủy/Xóa"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="px-6 py-10 text-center text-base text-gray-500">
                  Không tìm thấy tour nào phù hợp với tiêu chí tìm kiếm.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* Phân trang - Styled to match image_cc3dcf.png */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex items-center justify-center gap-2">
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
          </div>
        </div>
      )}
      {/* Modals remain the same */}
      <AddTourModal show={showAddModal} onClose={() => setShowAddModal(false)} setTours={setTours} />
      <EditTourModal show={showEditModal} onClose={() => setShowEditModal(false)} currentTour={currentTour} setTours={setTours} />
      <DeleteTourModal show={showDeleteModal} onClose={() => setShowDeleteModal(false)} currentTour={currentTour} deleteReason={deleteReason} setDeleteReason={setDeleteReason} setTours={setTours} />
      <ViewTourModal show={showViewModal} onClose={() => setShowViewModal(false)} currentTour={currentTour} />
      <ToggleActiveModal show={showToggleModal} onClose={() => setShowToggleModal(false)} currentTour={currentTour} toggleActive={toggleActive} onConfirm={handleConfirmToggle} />
    </div>
  );
};

export default TourAdmin;
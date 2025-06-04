import React from 'react';
import { XIcon } from 'lucide-react';
import { mockProvinces } from '../../utils/fakeTourAdmin';

const ViewTourModal = ({ show, onClose, currentTour }) => {
  if (!show || !currentTour) return null;

  // Lấy tên tỉnh từ ID
  const getProvinceName = (id) => {
    const province = mockProvinces.find((p) => p._id === id);
    return province ? province.name : 'N/A';
  };

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[600px] max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-black">Chi tiết tour: {currentTour.name}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-6">
          {/* Thông tin cơ bản */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800">Thông tin cơ bản</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div>
                <p className="text-sm font-medium text-gray-600">Mã tour</p>
                <p className="text-sm text-gray-900">{currentTour.tour_code}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Tên tour</p>
                <p className="text-sm text-gray-900">{currentTour.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Điểm xuất phát</p>
                <p className="text-sm text-gray-900">{getProvinceName(currentTour.starting_province_id)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Điểm đến</p>
                <p className="text-sm text-gray-900">{getProvinceName(currentTour.destination_province_id)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Thời gian</p>
                <p className="text-sm text-gray-900">{currentTour.duration}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Phương tiện</p>
                <p className="text-sm text-gray-900">{currentTour.transportation || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Giá người lớn</p>
                <p className="text-sm text-gray-900">{currentTour.representative_price.adult.toLocaleString('vi-VN')}đ</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Giá khuyến mãi</p>
                <p className="text-sm text-gray-900">
                  {currentTour.representative_price.new_price
                    ? `${currentTour.representative_price.new_price.toLocaleString('vi-VN')}đ`
                    : 'Không có'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Trạng thái</p>
                <p className="text-sm text-gray-900">{currentTour.is_bestseller ? 'Bestseller' : 'Thường'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Hoạt động</p>
                <p className="text-sm text-gray-900">{currentTour.is_active ? 'Hoạt động' : 'Vô hiệu hóa'}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-gray-600">Mô tả</p>
                <p className="text-sm text-gray-900">{currentTour.description || 'Không có mô tả'}</p>
              </div>
            </div>
          </div>
          {/* Dịch vụ */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800">Dịch vụ</h4>
            <ul className="list-disc list-inside mt-2">
              {currentTour.services.length > 0 ? (
                currentTour.services.map((service, index) => (
                  <li key={index} className="text-sm text-gray-900">{service}</li>
                ))
              ) : (
                <p className="text-sm text-gray-900">Không có dịch vụ</p>
              )}
            </ul>
          </div>
          {/* Ngày khởi hành */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800">Ngày khởi hành</h4>
            <ul className="list-disc list-inside mt-2">
              {currentTour.departure_summary.length > 0 ? (
                currentTour.departure_summary.map((dep, index) => (
                  <li key={index} className="text-sm text-gray-900">{dep.departure_date}</li>
                ))
              ) : (
                <p className="text-sm text-gray-900">Không có ngày khởi hành</p>
              )}
            </ul>
          </div>
          {/* Lịch trình */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800">Lịch trình</h4>
            {currentTour.itinerary.length > 0 ? (
              currentTour.itinerary.map((item, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg mt-2">
                  <p className="text-sm font-medium text-gray-600">Ngày {item.day}: {item.title}</p>
                  <p className="text-sm text-gray-900 mt-1">{item.description}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-900 mt-2">Không có lịch trình</p>
            )}
          </div>
          {/* Chính sách */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800">Chính sách</h4>
            {currentTour.policies.length > 0 ? (
              currentTour.policies.map((policy, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg mt-2">
                  <p className="text-sm font-medium text-gray-600">{policy.title}</p>
                  <p className="text-sm text-gray-900 mt-1">{policy.description}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-900 mt-2">Không có chính sách</p>
            )}
          </div>
          {/* Hình ảnh */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800">Hình ảnh</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
              {currentTour.images.length > 0 ? (
                currentTour.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Hình ảnh tour ${index + 1}`}
                    className="w-full h-32 object-cover rounded"
                  />
                ))
              ) : (
                <p className="text-sm text-gray-900">Không có hình ảnh</p>
              )}
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 border rounded text-gray-700 hover:bg-gray-100 cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewTourModal;
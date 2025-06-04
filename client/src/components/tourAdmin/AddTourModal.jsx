import React, { useState, useCallback } from 'react';
import { PlusIcon, XIcon, ImageIcon, GripVertical } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { Sortable } from 'sortablejs';
import { mockProvinces } from '../../utils/fakeTourAdmin';

const AddTourModal = ({ show, onClose, setTours }) => {
  const [formData, setFormData] = useState({
    name: '',
    tour_code: '',
    description: '',
    images: [], // Lưu { url: string, file: File, isMain: boolean }
    services: [],
    itinerary: [{ day: 1, title: '', description: '' }],
    policies: [{ title: '', description: '' }],
    duration: '',
    starting_province_id: '',
    destination_province_id: '',
    transportation: '',
    representative_price: { adult: 0 },
    departure_summary: [{ departure_id: '', departure_date: '' }],
    is_bestseller: false,
  });
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('basic');

  // Validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name || formData.name.length < 3) {
      newErrors.name = 'Tên tour phải ít nhất 3 ký tự';
    }
    if (!formData.tour_code || formData.tour_code.length < 3) {
      newErrors.tour_code = 'Mã tour phải ít nhất 3 ký tự';
    }
    if (!formData.duration) {
      newErrors.duration = 'Thời gian không được để trống';
    }
    if (!formData.destination_province_id) {
      newErrors.destination_province_id = 'Vui lòng chọn điểm đến';
    }
    if (!formData.representative_price.adult || formData.representative_price.adult <= 0) {
      newErrors.adult_price = 'Giá người lớn phải lớn hơn 0';
    }
    if (formData.images.length === 0) {
      newErrors.images = 'Phải tải lên ít nhất 1 hình ảnh';
    }
    if (!formData.images.some((img) => img.isMain)) {
      newErrors.images = 'Phải chọn ít nhất 1 hình ảnh chính';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Xử lý thêm tour
  const handleAddTour = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const newTour = {
      ...formData,
      _id: `t${Date.now()}`,
      total_slots_booked: 0,
      images: formData.images.map((img) => img.url), // Chỉ lưu URL
    };
    setTours((prev) => [...prev, newTour]);
    onClose();
  };

  // Xử lý thay đổi form
  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Xử lý thay đổi giá
  const handlePriceChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      representative_price: { ...prev.representative_price, [field]: Number(value) },
    }));
  };

  // Xử lý dịch vụ
  const handleServiceChange = (service, checked) => {
    if (checked) {
      setFormData((prev) => ({ ...prev, services: [...prev.services, service] }));
    } else {
      setFormData((prev) => ({ ...prev, services: prev.services.filter((s) => s !== service) }));
    }
  };

  // Thêm/xóa/cập nhật ngày khởi hành
  const addDepartureDate = () => {
    setFormData((prev) => ({
      ...prev,
      departure_summary: [...prev.departure_summary, { departure_id: `new-${Date.now()}`, departure_date: '' }],
    }));
  };
  const removeDepartureDate = (index) => {
    setFormData((prev) => ({
      ...prev,
      departure_summary: prev.departure_summary.filter((_, i) => i !== index),
    }));
  };
  const updateDepartureDate = (index, date) => {
    const newDepartures = [...formData.departure_summary];
    newDepartures[index] = { ...newDepartures[index], departure_date: date };
    setFormData((prev) => ({ ...prev, departure_summary: newDepartures }));
  };

  // Thêm/xóa/cập nhật lịch trình
  const addItinerary = () => {
    setFormData((prev) => ({
      ...prev,
      itinerary: [...prev.itinerary, { day: prev.itinerary.length + 1, title: '', description: '' }],
    }));
  };
  const removeItinerary = (index) => {
    setFormData((prev) => ({
      ...prev,
      itinerary: prev.itinerary.filter((_, i) => i !== index),
    }));
  };
  const updateItinerary = (index, field, value) => {
    const newItinerary = [...formData.itinerary];
    newItinerary[index] = { ...newItinerary[index], [field]: value };
    setFormData((prev) => ({ ...prev, itinerary: newItinerary }));
  };

  // Thêm/xóa/cập nhật chính sách
  const addPolicy = () => {
    setFormData((prev) => ({
      ...prev,
      policies: [...prev.policies, { title: '', description: '' }],
    }));
  };
  const removePolicy = (index) => {
    setFormData((prev) => ({
      ...prev,
      policies: prev.policies.filter((_, i) => i !== index),
    }));
  };
  const updatePolicy = (index, field, value) => {
    const newPolicies = [...formData.policies];
    newPolicies[index] = { ...newPolicies[index], [field]: value };
    setFormData((prev) => ({ ...prev, policies: newPolicies }));
  };

  // Xử lý hình ảnh
  const onDrop = useCallback((acceptedFiles) => {
    const newImages = acceptedFiles.map((file) => ({
      url: URL.createObjectURL(file),
      file,
      isMain: formData.images.length === 0, // Hình đầu tiên là hình chính
    }));
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));
  }, [formData.images]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif'] },
    multiple: true,
  });

  const removeImage = (index) => {
    setFormData((prev) => {
      const newImages = prev.images.filter((_, i) => i !== index);
      // Nếu xóa hình chính, đặt hình đầu tiên còn lại làm chính
      if (prev.images[index].isMain && newImages.length > 0) {
        newImages[0].isMain = true;
      }
      return { ...prev, images: newImages };
    });
  };

  const setMainImage = (index) => {
    setFormData((prev) => {
      const newImages = prev.images.map((img, i) => ({
        ...img,
        isMain: i === index,
      }));
      return { ...prev, images: newImages };
    });
  };

  const handleSortImages = (evt) => {
    const newImages = [...formData.images];
    const [movedItem] = newImages.splice(evt.oldIndex, 1);
    newImages.splice(evt.newIndex, 0, movedItem);
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-black">Tạo tour mới</h3>
          <p className="text-gray-500">Điền đầy đủ thông tin để tạo tour mới</p>
        </div>
        <form onSubmit={handleAddTour}>
          <div className="mb-4">
            <div className="grid grid-cols-4 gap-2">
              {['basic', 'itinerary', 'policies', 'images'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-4 rounded ${
                    activeTab === tab ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tab === 'basic' && 'Thông tin cơ bản'}
                  {tab === 'itinerary' && 'Lịch trình'}
                  {tab === 'policies' && 'Chính sách'}
                  {tab === 'images' && 'Hình ảnh'}
                </button>
              ))}
            </div>
          </div>
          {activeTab === 'basic' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tên tour <span className="text-red-500">*</span></label>
                <input
                  value={formData.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-300"
                />
                {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Mã tour <span className="text-red-500">*</span></label>
                <input
                  value={formData.tour_code}
                  onChange={(e) => handleFormChange('tour_code', e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-300"
                />
                {errors.tour_code && <p className="text-red-500 text-xs">{errors.tour_code}</p>}
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Mô tả</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-300"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Thời gian <span className="text-red-500">*</span></label>
                <input
                  value={formData.duration}
                  onChange={(e) => handleFormChange('duration', e.target.value)}
                  placeholder="Ví dụ: 3N2Đ"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-300"
                />
                {errors.duration && <p className="text-red-500 text-xs">{errors.duration}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phương tiện</label>
                <select
                  value={formData.transportation}
                  onChange={(e) => handleFormChange('transportation', e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-300"
                >
                  <option value="">Chọn phương tiện</option>
                  <option value="Xe buýt">Xe buýt</option>
                  <option value="Máy bay">Máy bay</option>
                  <option value="Tàu hỏa">Tàu hỏa</option>
                  <option value="Xe hơi">Xe hơi</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Điểm xuất phát</label>
                <select
                  value={formData.starting_province_id}
                  onChange={(e) => handleFormChange('starting_province_id', e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-300"
                >
                  <option value="">Chọn điểm xuất phát</option>
                  {mockProvinces.map((province) => (
                    <option key={province._id} value={province._id}>
                      {province.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Điểm đến <span className="text-red-500">*</span></label>
                <select
                  value={formData.destination_province_id}
                  onChange={(e) => handleFormChange('destination_province_id', e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-300"
                >
                  <option value="">Chọn điểm đến</option>
                  {mockProvinces.map((province) => (
                    <option key={province._id} value={province._id}>
                      {province.name}
                    </option>
                  ))}
                </select>
                {errors.destination_province_id && <p className="text-red-500 text-xs">{errors.destination_province_id}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Giá người lớn <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  min="0"
                  value={formData.representative_price.adult}
                  onChange={(e) => handlePriceChange('adult', e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-300"
                />
                {errors.adult_price && <p className="text-red-500 text-xs">{errors.adult_price}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Giá khuyến mãi</label>
                <input
                  type="number"
                  min="0"
                  value={formData.representative_price.new_price || ''}
                  onChange={(e) => handlePriceChange('new_price', e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-300"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Dịch vụ</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Ăn uống', 'Vé tham quan', 'Hướng dẫn viên', 'Vé máy bay', 'Khách sạn', 'Xe đưa đón'].map((service) => (
                    <div key={service} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`service-${service}`}
                        checked={formData.services.includes(service)}
                        onChange={(e) => handleServiceChange(service, e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-300 border-gray-300 rounded"
                      />
                      <label htmlFor={`service-${service}`} className="text-sm text-gray-700">
                        {service}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Ngày khởi hành</label>
                  <button
                    type="button"
                    onClick={addDepartureDate}
                    className="text-blue-600 hover:text-blue-700 text-xs flex items-center"
                  >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Thêm ngày
                  </button>
                </div>
                {formData.departure_summary.map((departure, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="date"
                      value={departure.departure_date}
                      onChange={(e) => updateDepartureDate(index, e.target.value)}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-300"
                    />
                    {formData.departure_summary.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeDepartureDate(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <XIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex items-center space-x-2 md:col-span-2">
                <input
                  type="checkbox"
                  id="is_bestseller"
                  checked={formData.is_bestseller}
                  onChange={(e) => handleFormChange('is_bestseller', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-300 border-gray-300 rounded"
                />
                <label htmlFor="is_bestseller" className="text-sm text-gray-700">
                  Đánh dấu là Bestseller
                </label>
              </div>
            </div>
          )}
          {activeTab === 'itinerary' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Lịch trình</label>
                <button
                  type="button"
                  onClick={addItinerary}
                  className="text-blue-600 hover:text-blue-700 text-xs flex items-center"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Thêm ngày
                </button>
              </div>
              {formData.itinerary.map((item, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <label htmlFor={`day-${index}`} className="text-sm font-medium mr-2">
                        Ngày:
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={item.day}
                        onChange={(e) => updateItinerary(index, 'day', Number(e.target.value))}
                        className="w-20 p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-300"
                      />
                    </div>
                    {formData.itinerary.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItinerary(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <XIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Tiêu đề</label>
                      <input
                        value={item.title}
                        onChange={(e) => updateItinerary(index, 'title', e.target.value)}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Mô tả</label>
                      <textarea
                        value={item.description}
                        onChange={(e) => updateItinerary(index, 'description', e.target.value)}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-300"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'policies' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Chính sách</label>
                <button
                  type="button"
                  onClick={addPolicy}
                  className="text-blue-600 hover:text-blue-700 text-xs flex items-center"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Thêm chính sách
                </button>
              </div>
              {formData.policies.map((policy, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-sm font-medium">Chính sách {index + 1}</label>
                    {formData.policies.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePolicy(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <XIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Tiêu đề</label>
                      <input
                        value={policy.title}
                        onChange={(e) => updatePolicy(index, 'title', e.target.value)}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Mô tả</label>
                      <textarea
                        value={policy.description}
                        onChange={(e) => updatePolicy(index, 'description', e.target.value)}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-300"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'images' && (
            <div className="space-y-4">
              <label className="text-sm font-medium">Hình ảnh <span className="text-red-500">*</span></label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  isDragActive ? 'border-blue-600 bg-blue-50' : 'border-gray-300 bg-gray-50'
                }`}
              >
                <input {...getInputProps()} />
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  Kéo và thả hình ảnh vào đây, hoặc nhấn để chọn file
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  (Chỉ chấp nhận .jpg, .jpeg, .png, .gif)
                </p>
              </div>
              {errors.images && <p className="text-red-500 text-xs">{errors.images}</p>}
              {formData.images.length > 0 && (
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4"
                  ref={(el) => {
                    if (el) {
                      Sortable.create(el, {
                        animation: 150,
                        handle: '.drag-handle',
                        onEnd: handleSortImages,
                      });
                    }
                  }}
                >
                  {formData.images.map((image, index) => (
                    <div
                      key={index}
                      className={`relative border rounded-lg p-2 bg-white transition-transform hover:scale-105 ${
                        image.isMain ? 'border-blue-600 border-2' : 'border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="drag-handle cursor-move">
                          <GripVertical className="h-4 w-4 text-gray-500" />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <XIcon className="h-4 w-4" />
                        </button>
                      </div>
                      <img
                        src={image.url}
                        alt={`Hình ảnh ${index + 1}`}
                        className="w-full h-32 object-cover rounded"
                      />
                      <div className="mt-2 text-center">
                        <button
                          type="button"
                          onClick={() => setMainImage(index)}
                          className={`text-xs px-2 py-1 rounded ${
                            image.isMain
                              ? 'bg-blue-600 text-white'
                              : 'border border-blue-600 text-blue-600 hover:bg-blue-50'
                          }`}
                        >
                          {image.isMain ? 'Hình chính' : 'Đặt làm chính'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border rounded text-gray-700 hover:bg-gray-100"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Tạo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTourModal;
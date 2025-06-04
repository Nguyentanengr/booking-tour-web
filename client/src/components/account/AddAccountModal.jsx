import React, { useState, useRef } from 'react';
import { EyeIcon, EyeOffIcon, UploadIcon, XIcon } from 'lucide-react';

const AddAccountModal = ({ show, onClose, formData, onFormChange, onSubmit, activeTab, showPassword, setShowPassword }) => {
  if (!show) return null;

  const [errors, setErrors] = useState({});
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    // Validate full_name (at least 4 characters)
    if (!formData.full_name || formData.full_name.length < 4) {
      newErrors.full_name = 'Họ tên phải ít nhất 4 ký tự';
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = 'Email không đúng định dạng';
    }

    // Validate phone number format (10 digits for Vietnamese phone numbers)
    const phoneRegex = /^\d{10}$/;
    if (!formData.phone_number || !phoneRegex.test(formData.phone_number)) {
      newErrors.phone_number = 'Số điện thoại chưa đúng định dạng (10 chữ số)';
    }

    // Validate password (must contain at least one letter and one number)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!formData.password || !passwordRegex.test(formData.password)) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự, gồm cả chữ và số';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle file upload for avatar
  const handleAvatarUpload = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        onFormChange('avatar_url', reader.result); // Store base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle file input change
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    handleAvatarUpload(file);
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleAvatarUpload(file);
  };

  // Handle remove avatar
  const handleRemoveAvatar = () => {
    setAvatarPreview(null);
    onFormChange('avatar_url', '');
    fileInputRef.current.value = null;
  };

  // Handle form submission with validation
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="mb-4">
          <h3 className="text-xl font-bold">
            Tạo {activeTab === 'admins' ? 'Quản trị viên' : activeTab === 'users' ? 'Người dùng' : 'Hướng dẫn viên'} mới
          </h3>
          <p className="text-gray-500">Điền đầy đủ thông tin để tạo tài khoản mới</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input
                value={formData.full_name || ''}
                onChange={(e) => onFormChange('full_name', e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-300"
              />
              {errors.full_name && <p className="text-red-500 text-xs">{errors.full_name}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => onFormChange('email', e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-300"
              />
              {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input
                value={formData.phone_number || ''}
                onChange={(e) => onFormChange('phone_number', e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-300"
              />
              {errors.phone_number && <p className="text-red-500 text-xs">{errors.phone_number}</p>}
            </div>
            <div className="space-y-2 relative">
              <label className="text-sm font-medium">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password || ''}
                onChange={(e) => onFormChange('password', e.target.value)}
                className="w-full p-2 border rounded pr-10 focus:outline-none focus:ring-1 focus:ring-blue-300"
              />
              {/* <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 transform -translate-y-1/2 text-gray-500 flex items-center justify-center"
              >
                {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
              </button> */}
              {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Ngày sinh</label>
              <input
                type="date"
                value={formData.date_of_birth || ''}
                onChange={(e) => onFormChange('date_of_birth', e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-300"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Giới tính</label>
              <select
                value={formData.gender || ''}
                onChange={(e) => onFormChange('gender', e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-300"
              >
                <option value="">Chọn giới tính</option>
                <option value="Male">Nam</option>
                <option value="Female">Nữ</option>
                <option value="Other">Khác</option>
              </select>
            </div>
            {activeTab === 'admins' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Vai trò</label>
                <select
                  value={formData.role || ''}
                  onChange={(e) => onFormChange('role', e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-300"
                >
                  <option value="">Chọn vai trò</option>
                  <option value="super_admin">Super Admin</option>
                  <option value="admin">Admin</option>
                  <option value="staff">Staff</option>
                </select>
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium">Trạng thái</label>
              <select
                value={formData.status || ''}
                onChange={(e) => onFormChange('status', e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-300"
              >
                <option value="active">Hoạt động</option>
                <option value="inactive">Tạm khóa</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Tải lên Avatar (không bắt buộc)</label>
              <div
                className={`relative w-32 h-32 mx-auto border-2 border-dashed rounded-full flex items-center justify-center transition-all duration-300 ${
                  isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {avatarPreview ? (
                  <div className="relative w-full h-full">
                    <img
                      src={avatarPreview}
                      alt="Avatar Preview"
                      className="w-32 h-32 object-cover rounded-full"
                      style={{ width: '128px', height: '128px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transform translate-x-1 -translate-y-1"
                    >
                      <XIcon className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <UploadIcon className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-xs text-gray-500">Kéo thả hoặc nhấp</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileInputChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      ref={fileInputRef}
                    />
                  </div>
                )}
              </div>
              <p className="text-gray-500 text-xs text-center">Hỗ trợ định dạng: JPG, PNG, GIF</p>
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border rounded cursor-pointer text-gray-700 hover:bg-gray-100"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 cursor-pointer rounded hover:bg-blue-700"
            >
              Tạo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAccountModal;
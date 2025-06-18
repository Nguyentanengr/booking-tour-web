import React, { useState } from 'react';

const DeleteAccountModal = ({ show, onClose, currentAccount, deleteReason, onDeleteReasonChange, onSubmit }) => {
  const [error, setError] = useState('');

  if (!show || !currentAccount) return null;

  // Validation function
  const validateReason = () => {
    if (!deleteReason || deleteReason.trim().length === 0) {
      setError('Lý do xóa không được để trống');
      return false;
    }
    if (deleteReason.trim().length < 5) {
      setError('Lý do xóa phải có ít nhất 5 ký tự');
      return false;
    }
    setError('');
    return true;
  };

  // Handle form submission with validation
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateReason()) {
      onSubmit();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md">
        <div className="mb-4">
          <h3 className="text-xl font-bold">Xóa tài khoản</h3>
          <p className="text-gray-500">Bạn có chắc chắn muốn xóa tài khoản này? Hành động này không thể hoàn tác.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Lý do xóa <span className="text-red-500">*</span></label>
              <textarea
                value={deleteReason}
                onChange={onDeleteReasonChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-300"
                placeholder="Nhập lý do xóa tài khoản"
                rows={3}
                spellCheck={false}
              />
              {error && <p className="text-red-500 text-xs">{error}</p>}
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded cursor-pointer text-gray-700 hover:bg-gray-100"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="bg-red-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-red-700"
            >
              Xóa tài khoản
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
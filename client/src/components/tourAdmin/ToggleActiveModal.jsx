import React from 'react';

const ToggleActiveModal = ({ show, onClose, currentTour, toggleActive, onConfirm }) => {
  if (!show || !currentTour) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-black">
            {toggleActive ? 'Kích hoạt tour' : 'Vô hiệu hóa tour'}
          </h3>
          <p className="text-gray-500 mt-2">
            Bạn có chắc chắn muốn {toggleActive ? 'kích hoạt' : 'vô hiệu hóa'} tour <strong>{currentTour.name}</strong>?
            {currentTour.total_slots_booked > 0 && !toggleActive && (
              <span className="text-amber-600 block mt-1">
                Tour này đã có {currentTour.total_slots_booked} chỗ đặt. Vô hiệu hóa có thể ảnh hưởng đến khách hàng.
              </span>
            )}
          </p>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-6 py-2 border rounded text-gray-700 hover:bg-gray-100"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className={`px-6 py-2 rounded text-white ${
              toggleActive ? 'bg-blue-700 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {toggleActive ? 'Kích hoạt' : 'Vô hiệu hóa'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ToggleActiveModal;
import React, { useState } from 'react';

const DeleteTourModal = ({ show, onClose, currentTour, deleteReason, setDeleteReason, setTours }) => {
  const [error, setError] = useState('');

  if (!show || !currentTour) return null;

  // Validation
  const validateReason = () => {
    if (!deleteReason || deleteReason.trim().length === 0) {
      setError('Lý do không được để trống');
      return false;
    }
    if (deleteReason.trim().length < 5) {
      setError('Lý do phải ít nhất 5 ký tự');
      return false;
    }
    setError('');
    return true;
  };

  // Xử lý xóa/hủy tour
  const handleDeleteTour = (e) => {
    e.preventDefault();
    if (!validateReason()) return;

    if (currentTour.total_slots_booked > 0) {
      // Hủy tour
      setTours((prev) =>
        prev.map((tour) =>
          tour._id === currentTour._id
            ? {
                ...tour,
                departure_summary: tour.departure_summary.map((dep) => ({ ...dep, status: 'cancelled' })),
              }
            : tour
        )
      );
    } else {
      // Xóa tour
      setTours((prev) => prev.filter((tour) => tour._id !== currentTour._id));
    }
    setDeleteReason('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md min-w-[450px]">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-black">
            {currentTour.total_slots_booked > 0 ? 'Xóa tour' : 'Xóa tour'} {currentTour.tour_code}
          </h3>
          <p className="text-gray-500">
            {currentTour.total_slots_booked > 0
              ? 'Tour hiện tại đã có đặt chỗ, chắc chắn xóa tour?'
              : 'Chắc chắn xóa tour hiện tại?'}
          </p>
        </div>
        <form onSubmit={handleDeleteTour}>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Lý do {currentTour.total_slots_booked > 0 ? 'xóa' : 'xóa'} <span className="text-red-500">*</span>
              </label>
              <textarea
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-300"
                placeholder={`Nhập lý do ${currentTour.total_slots_booked > 0 ? 'xóa' : 'xóa'} tour`}
                rows={3}
              />
              {error && <p className="text-red-500 text-xs">{error}</p>}
            </div>
          </div>
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
              className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
            >
              {currentTour.total_slots_booked > 0 ? 'Xóa tour' : 'Xóa tour'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeleteTourModal;
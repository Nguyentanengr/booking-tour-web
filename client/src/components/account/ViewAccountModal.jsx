import React from 'react';
import avatar from '../../assets/img/default-avatar.png';

const ViewAccountModal = ({ show, onClose, currentAccount, activeTab, formatDate, getStatusBadgeVariant, getStatusText, getInitials }) => {
  if (!show || !currentAccount) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-20 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-120 max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="mb-4">
          <h3 className="text-xl font-bold">Chi tiết {activeTab === "admins" ? "Quản trị viên" : activeTab === "users" ? "Người dùng" : "Hướng dẫn viên"}</h3>
        </div>
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full overflow-hidden">
              <img src={currentAccount.avatar_url || avatar} alt={currentAccount.full_name} className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{currentAccount.full_name || "N/A"}</h3>
              <p className="text-gray-500 mb-1">{currentAccount.email || "N/A"}</p>
              <span className={`px-2 py-1 rounded ${getStatusBadgeVariant(currentAccount.status) === "success" ? "bg-green-100 text-green-800" : getStatusBadgeVariant(currentAccount.status) === "warning" ? "bg-yellow-100 text-yellow-800" : getStatusBadgeVariant(currentAccount.status) === "destructive" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"}`}>
                {getStatusText(currentAccount.status)}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Số điện thoại</label>
              <p className="text-sm">{currentAccount.phone_number || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Giới tính</label>
              <p className="text-sm">{currentAccount.gender || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Ngày sinh</label>
              <p className="text-sm">{formatDate(currentAccount.date_of_birth)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Ngày tạo</label>
              <p className="text-sm">{formatDate(currentAccount.created_at)}</p>
            </div>
            {activeTab === "admins" && (
              <div>
                <label className="text-sm font-medium text-gray-700">Vai trò</label>
                <p className="text-sm">{currentAccount.role || "N/A"}</p>
              </div>
            )}
            {activeTab === "users" && (
              <>
                <div>
                  <label className="text-sm font-medium text-gray-500">Số tour đã tham gia</label>
                  <p className="text-sm">{currentAccount.tour_history?.length || 0}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Tour yêu thích</label>
                  <p className="text-sm">{currentAccount.favorite_tours?.length || 0}</p>
                </div>
              </>
            )}
            {activeTab === "guides" && (
              <div>
                <label className="text-sm font-medium text-gray-500">Số tour đã dẫn</label>
                <p className="text-sm">{currentAccount.past_assignments?.length || 0}</p>
              </div>
            )}
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 border rounded cursor-pointer hover:border-gray-300 duration-200">Đóng</button>
        </div>
      </div>
    </div>
  );
};

export default ViewAccountModal;
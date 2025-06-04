import React from 'react';
import { NavLink } from 'react-router-dom';
import avatar from '../assets/img/default-avatar.png';

const DashboardSidebar = () => {
  // Giả lập thông tin người dùng, bạn có thể thay bằng dữ liệu thực tế
  const user = {
    name: "Admin",
    email: "admin@example.com",
    avatar: avatar,
  };

  return (
    <aside className="bg-white text-blue-900 w-64 h-screen shadow flex flex-col justify-between fixed top-0 left-0">
      <div className="px-4 pt-4 overflow-y-auto flex-1">
        <div className="flex items-center space-x-3 mb-6">
          <span className="text-xl font-semibold text-blue-600">TourTravel</span>
        </div>
        <nav className="flex flex-col space-y-2 pt-6">
          <NavLink
            to="/admin/tong-quan"
            className={({ isActive }) =>
              isActive
                ? 'bg-blue-100 text-blue-600 rounded px-3 py-2 font-semibold'
                : 'text-blue-900 hover:bg-blue-50 rounded px-3 py-2'
            }
          >
            Tổng quan
          </NavLink>
          <NavLink
            to="/admin/tai-khoan"
            className={({ isActive }) =>
              isActive
                ? 'bg-blue-100 text-blue-600 rounded px-3 py-2 font-semibold'
                : 'text-blue-900 hover:bg-blue-50 rounded px-3 py-2'
            }
          >
            Quản lý tài khoản
          </NavLink>
        </nav>
      </div>
      <div className="flex items-center space-x-3 py-4 px-4 border-t">
        <div className="w-10 h-10 flex items-center justify-center">
          <img src={user.avatar} alt="" className="rounded-full" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-blue-900">{user.name}</span>
          <span className="text-xs text-blue-600">{user.email}</span>
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
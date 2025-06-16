
import React from 'react';
import { NavLink } from 'react-router-dom';
import avatar from '../assets/img/default-avatar.png';
import { Home, Map, Bus, Users, User, Mail, Ticket } from 'lucide-react';

const DashboardSidebar = () => {
    // Giả lập thông tin người dùng, bạn có thể thay bằng dữ liệu thực tế
    const user = {
        name: "Admin",
        email: "admin@example.com",
        avatar: avatar,
    };

    // Định nghĩa các mục điều hướng để tránh lặp code NavLink
    const navItems = [
        { to: "/admin/tong-quan", label: "Tổng quan", icon: Home },
        { to: "/admin/tour", label: "Quản lý tour", icon: Map },
        { to: "/admin/chuyen-di", label: "Quản lý chuyến đi", icon: Bus },
        { to: "/admin/dat-cho", label: "Quản lý đặt chỗ", icon: Ticket }, 
        { to: "/admin/thanh-toan", label: "Quản lý thanh toán", icon: Ticket }, 
        { to: "/admin/tai-khoan", label: "Quản lý tài khoản", icon: Users },
    ];

    // Hàm để tạo className dựa trên trạng thái isActive
    const getNavLinkClass = ({ isActive }) =>
        isActive
            ? 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 rounded-lg px-4 py-2 font-semibold transition-all duration-200'
            : 'text-blue-800 hover:bg-gradient-to-r hover:from-blue-50 hover:to-white rounded-lg px-4 py-2 transition-all duration-200';

    return (
        <aside className="bg-white text-blue-900 w-64 h-screen shadow-lg flex flex-col justify-between fixed top-0 left-0 overflow-hidden">
            <div className="px-6 pt-6 pb-4 overflow-y-auto flex-1">
                {/* Logo/Brand Section */}
                <div className="flex items-center space-x-4 mb-8">
                    <span className="text-2xl font-bold text-blue-700 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                        TourTravel
                    </span>
                </div>

                {/* Navigation Links Section */}
                <nav className="flex flex-col space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={getNavLinkClass}
                        >
                            {({ isActive }) => (
                                <div className="flex items-center">
                                    <item.icon className={`mr-2 h-4 w-4 ${isActive ? 'text-blue-700' : 'text-blue-500'}`} />
                                    {item.label}
                                </div>
                            )}
                        </NavLink>
                    ))}
                </nav>
            </div>

            {/* User Info Section */}
            <div className="flex items-center space-x-4 py-5 px-6 bg-white border-t border-blue-100 shadow-inner">
                <div className="w-8 h-8 flex items-center justify-center overflow-hidden">
                    <img src={user.avatar} alt="User Avatar" className="rounded-full object-cover w-full h-full transition-transform duration-200 hover:scale-110" />
                </div>
                <div className="flex flex-col text-left">
                    <div className="flex items-center">
                        <span className="text-base font-semibold text-blue-900">{user.name}</span>
                    </div>
                    <div className="flex items-center">
                        <span className="text-sm text-blue-600 hover:text-blue-700 transition-colors duration-200">{user.email}</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default DashboardSidebar;

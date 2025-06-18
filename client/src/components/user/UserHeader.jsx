// client/src/components/user/UserHeader.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown, User, Heart, MapPin, LogOut, Bell, LayoutDashboard } from "lucide-react";
// Sửa đổi 1: Import action `logout` từ slice
import { logout } from '../../redux/slices/userSlice';

// LƯU Ý: Dữ liệu này nên được fetch từ API trong môi trường production
const regions = [
    {
        id: "mien-bac", name: "Miền Bắc",
        provinces: [ { id: "ha-noi", name: "Hà Nội" }, /* ... */ ],
    },
    {
        id: "mien-trung", name: "Miền Trung",
        provinces: [ { id: "da-nang", name: "Đà Nẵng" }, /* ... */ ],
    },
    {
        id: "mien-nam", name: "Miền Nam",
        provinces: [ { id: "ho-chi-minh", name: "TP. Hồ Chí Minh" }, /* ... */ ],
    },
];

// Hàm phụ trợ để lấy chữ cái đầu của tên
const getInitials = (name = "") => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

export default function UserHeader() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Sửa đổi 2: Lấy state người dùng và token từ Redux store
    const { user, token } = useSelector((state) => state.user);
    // Suy ra trạng thái đăng nhập từ token
    const isLoggedIn = !!token;

    // TODO: Dữ liệu này cần được lấy từ API
    const [unreadNotifications, setUnreadNotifications] = useState(3);

    // Sửa đổi 3: Dispatch action `logout` khi người dùng đăng xuất
    const handleLogout = () => {
        dispatch(logout());
        navigate("/dang-nhap");
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white">
            <div className="mx-auto flex h-16 w-[1400px] items-center justify-between">
                <div className="flex items-center gap-16">
                    <Link to="/" className="flex items-center gap-2">
                        <img src="/logo.svg" alt="Logo" width={40} height={40} />
                        <span className="text-xl font-bold text-blue-600">Du Lịch Việt</span>
                    </Link>

                    <nav className="hidden items-center gap-6 md:flex">
                        {/* Dropdown Destinations */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="flex w-25 items-center gap-1">
                                    Điểm đến <ChevronDown size={16} />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-[500px] p-4">
                                <div className="grid grid-cols-3 gap-6">
                                    {regions.map((region) => (
                                        <div key={region.id}>
                                            <DropdownMenuLabel className="font-semibold text-blue-600">{region.name}</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <div className="space-y-1">
                                                {region.provinces.map((province) => (
                                                    <DropdownMenuItem key={province.id} asChild>
                                                        <Link to={`/tours?destination=${province.id}`} className="block rounded px-2 py-1 text-sm hover:bg-gray-100">
                                                            {province.name}
                                                        </Link>
                                                    </DropdownMenuItem>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Link to="/lien-he" className="text-sm font-medium hover:text-blue-600">
                            Liên hệ
                        </Link>
                    </nav>
                </div>

                <div className="flex items-center gap-8">
                    {isLoggedIn && user ? (
                        <>
                            {/* Icons for logged-in users */}
                            <Link to="/tour-yeu-thich">
                                <Button variant="ghost" size="icon" className="relative">
                                    <Heart size={18} />
                                    <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center bg-blue-600 p-0 text-xs">3</Badge>
                                </Button>
                            </Link>
                            <Link to="/tour-cua-toi">
                                <Button variant="ghost" size="icon"><MapPin size={18} /></Button>
                            </Link>

                            {/* Notifications Menu */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="relative">
                                        <Bell size={18} />
                                        {unreadNotifications > 0 && (
                                            <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center bg-blue-600 p-0 text-xs">
                                                {unreadNotifications}
                                            </Badge>
                                        )}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-[300px]">
                                    {/* Notification items */}
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* User Menu */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8">
                                            {/* Sửa đổi 4: Lấy avatar và tên từ state */}
                                            <AvatarImage src={user.avatar_url || ""} />
                                            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                        </Avatar>
                                        <span className="hidden md:inline">{user.name}</span>
                                        <ChevronDown size={16} />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-[240px]">
                                    {/* Sửa đổi 5: Thêm link tới Dashboard cho Admin */}
                                    {user.role === 'admin' || user.role === 'super_admin'&& (
                                        <>
                                            <DropdownMenuItem asChild>
                                                <Link to="/admin/tong-quan" className="flex items-center gap-2">
                                                    <LayoutDashboard size={16} />
                                                    <span>Trang quản trị</span>
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                        </>
                                    )}
                                    <DropdownMenuItem asChild>
                                        <Link to="/tai-khoan" className="flex items-center gap-2">
                                            <User size={16} />
                                            <span>Thông tin cá nhân</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleLogout} className="flex cursor-pointer items-center gap-2 text-red-500">
                                        <LogOut size={16} />
                                        <span>Đăng xuất</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (
                        // Buttons for logged-out users
                        <div className="flex items-center gap-2">
                            <Link to="/dang-nhap">
                                <Button variant="ghost" className="w-25">Đăng nhập</Button>
                            </Link>
                            <Link to="/dang-ky">
                                <Button className="w-25 bg-blue-600 hover:bg-blue-800">Đăng ký</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
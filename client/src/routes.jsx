import React from 'react';
import { Navigate, Route, Routes, Outlet } from "react-router-dom";
import { useSelector } from 'react-redux';

// Layouts
import UserLayout from "./layouts/UserLayout";
import DashboardLayout from "./layouts/DashboardLayout";

// User Pages
import HomePage from "./pages/user/HomePage";
import LoginPage from "./pages/user/LoginPage";
import RegisterPage from "./pages/user/RegisterPage";
import ForgotPasswordPage from "./pages/user/ForgotPasswordPage";
import ProfilePage from "./pages/user/ProfilePage";
import ContactPage from "./pages/user/ContactPage";

// Admin Pages
import Overview from "./pages/Overview";
import Account from "./pages/Account";
import TourAdmin from "./pages/TourAdmin";
import Departure from "./pages/Departure";
import Booking from "./pages/Booking";
import Payment from "./pages/Payment";

// Component bảo vệ các route chỉ dành cho người dùng đã đăng nhập (cả user và admin)
const UserPrivateRoute = () => {
  const { token } = useSelector((state) => state.user);
  // Nếu có token (đã đăng nhập), cho phép truy cập. Ngược lại, chuyển hướng về trang đăng nhập.
  return token ? <Outlet /> : <Navigate to="/dang-nhap" replace />;
};

// Component bảo vệ các route chỉ dành cho Admin
const AdminPrivateRoute = () => {
  const { token, user } = useSelector((state) => state.user);
  // Nếu có token và role là 'admin', cho phép truy cập. Ngược lại, chuyển hướng về trang chủ.
  return token && user?.role === 'admin' ? <Outlet /> : <Navigate to="/" replace />;
};

// Component chỉ cho phép truy cập các route khi người dùng CHƯA đăng nhập (vd: trang login, register)
const PublicOnlyRoute = () => {
  const { token } = useSelector((state) => state.user);
  // Nếu đã đăng nhập, chuyển hướng về trang chủ. Ngược lại, cho phép truy cập.
  return token ? <Navigate to="/" replace /> : <Outlet />;
};

const RouterConfig = () => (
  <Routes>
    {/* Các route trong UserLayout */}
    <Route path="/" element={<UserLayout />}>
      {/* Route công khai cho tất cả mọi người */}
      <Route index element={<HomePage />} />
      <Route path="/lien-he" element={<ContactPage />} />

      {/* Route chỉ dành cho người dùng CHƯA đăng nhập */}
      <Route element={<PublicOnlyRoute />}>
        <Route path="/dang-nhap" element={<LoginPage />} />
        <Route path="/dang-ky" element={<RegisterPage />} />
        <Route path="/quen-mat-khau" element={<ForgotPasswordPage />} />
      </Route>

      {/* Route chỉ dành cho người dùng ĐÃ đăng nhập */}
      <Route element={<UserPrivateRoute />}>
        <Route path="/tai-khoan" element={<ProfilePage />} />
        {/* Thêm các trang riêng tư khác của user ở đây, ví dụ: /tour-da-dat, /tour-yeu-thich */}
      </Route>
    </Route>

    {/* Các route Quản trị (Admin) */}
    <Route element={<AdminPrivateRoute />}>
      <Route path="/admin" element={<DashboardLayout />}>
        {/* Chuyển hướng /admin về /admin/tong-quan */}
        <Route index element={<Navigate to="/admin/tong-quan" replace />} />
        <Route path="tong-quan" element={<Overview />} />
        <Route path="chuyen-di" element={<Departure />} />
        <Route path="dat-cho" element={<Booking />} />
        <Route path="tour" element={<TourAdmin />} />
        <Route path="thanh-toan" element={<Payment />} />
        <Route path="tai-khoan" element={<Account />} />
      </Route>
    </Route>
  </Routes>
);

export default RouterConfig;

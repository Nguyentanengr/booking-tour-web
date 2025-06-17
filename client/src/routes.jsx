import { Navigate, Route, Routes, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import UserLayout from "./layouts/UserLayout";
import HomePage from "./pages/user/HomePage"
import LoginPage from "./pages/user/LoginPage";
import RegisterPage from "./pages/user/RegisterPage";
import ForgotPasswordPage from "./pages/user/ForgotPasswordPage";
import ProfilePage from "./pages/user/ProfilePage";
import ContactPage from "./pages/user/ContactPage";
import DashboardLayout from "./layouts/DashboardLayout";
import Overview from "./pages/Overview";
import Account from "./pages/Account";
import TourAdmin from "./pages/TourAdmin";
import Departure from "./pages/Departure";
import Booking from "./pages/Booking";
import Payment from "./pages/Payment";
import CustomersAnalytics from "./pages/CustomersAnalytics";

// Simple private route wrapper
const PrivateRoute = ({ children }) => {
  const isAuthenticated = true; // Replace with real auth logic
  const isAdmin = true;         // Replace with real admin check

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/" />;
  }
  return children;
};

// Component bảo vệ các route chỉ dành cho người dùng đã đăng nhập (cả user và admin)
const UserPrivateRoute = () => {
  const { token } = useSelector((state) => state.user);
  // Nếu có token (đã đăng nhập), cho phép truy cập. Ngược lại, chuyển hướng về trang đăng nhập.
  return token ? <Outlet /> : <Navigate to="/dang-nhap" replace />;
};

// Component bảo vệ các route chỉ dành cho Admin
const AdminPrivateRoute = () => {
  const { token, user } = useSelector((state) => state.user);
  // Nếu có token và role là 'admin' hoặc 'super_admin', cho phép truy cập.
  // Ngược lại, chuyển hướng về trang chủ.
  return token && (user?.role === 'admin' || user?.role === 'super_admin')
    ? <Outlet />
    : <Navigate to="/" replace />;
};

// Component chỉ cho phép truy cập các route khi người dùng CHƯA đăng nhập (vd: trang login, register)
const PublicOnlyRoute = () => {
  const { token, user } = useSelector((state) => state.user);
  // Nếu đã đăng nhập, chuyển hướng đến trang phù hợp. Ngược lại, cho phép truy cập.
  if (token) {
    return user?.role === 'admin' || user?.role === 'super_admin'
      ? <Navigate to="/admin/tong-quan" replace />
      : <Navigate to="/" replace />;
  }
  return <Outlet />;
};

// file: routes.jsx

const RouterConfig = () => (
  <Routes>
    <Route path="/" element={<UserLayout />}>
      <Route index element={<HomePage />} />

      {/* BỌC CÁC ROUTE NÀY BẰNG PublicOnlyRoute */}
      <Route element={<PublicOnlyRoute />}>
        <Route path="/dang-nhap" element={<LoginPage />} />
        <Route path="/dang-ky" element={<RegisterPage />} />
        <Route path="/quen-mat-khau" element={<ForgotPasswordPage />} />
      </Route>

      <Route path="/lien-he" element={<ContactPage />} />

      {/* Routes chỉ dành cho người đã đăng nhập */}
      <Route element={<UserPrivateRoute />}>
        <Route path="/tai-khoan" element={<ProfilePage />} />
      </Route>

    </Route>

    {/* Route cho admin */}
    <Route path="/admin" element={<AdminPrivateRoute />}>
      <Route element={<DashboardLayout />}>
        <Route path="tong-quan" element={<Overview />} />
        {/* ... các route con của admin ... */}
        <Route path="khach-hang" element={<CustomersAnalytics />} />
        <Route path="chuyen-di" element={<Departure />} />
        <Route path="dat-cho" element={<Booking />} />
        <Route path="tour" element={<TourAdmin />} />
        <Route path="thanh-toan" element={<Payment />} />
        <Route path="nguoi-dung" element={<Account />} />
      </Route>
    </Route>
  </Routes>
);

export default RouterConfig;

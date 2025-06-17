import { Navigate, Route, Routes, Outlet } from "react-router-dom";
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
import ToursPage from "./pages/user/ToursPage";
import MyToursPage from "./pages/user/MyToursPage";
import FavoriteToursPage from "./pages/user/FavoriteToursPage";




// Simple private route wrapper
const PrivateRoute = ({ children }) => {
  const isAuthenticated = true; // Replace with real auth logic
  const isAdmin = true;         // Replace with real admin check

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/" />;
  }
  return children;
};

const RouterConfig = () => (
  <Routes>
    <Route path="/" element={<UserLayout />}>
      <Route index element={<HomePage />} />
      <Route path = "/dang-nhap" element={<LoginPage />} />
      <Route path = "/dang-ky" element={<RegisterPage/>} />
      <Route path = "/quen-mat-khau" element = {<ForgotPasswordPage/>} />
      <Route path="/lien-he" element={< ContactPage/>} />
      <Route path="/tai-khoan" element={<ProfilePage />} />
      <Route path="/danh-sach-tour" element={<ToursPage />} />
      <Route path="/tour-cua-toi" element={<MyToursPage />} />
      <Route path="/tour-yeu-thich" element={<FavoriteToursPage />} />

    </Route>
    <Route path="/admin" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
      <Route path="tong-quan" element={<Overview />} />
      <Route path="khach-hang" element={<CustomersAnalytics />} />
      <Route path="chuyen-di" element={<Departure />} />
      <Route path="dat-cho" element={<Booking />} />
      <Route path="tour" element={<TourAdmin />} />
      <Route path="thanh-toan" element={<Payment />} />
      <Route path="nguoi-dung" element={<Account />} />
    </Route>
  </Routes>
);

export default RouterConfig;

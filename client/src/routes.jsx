import { Navigate, Route, Routes, Outlet } from "react-router-dom";
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import BookingLayout from "./layouts/BookingLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import ManageTours from "./pages/ManageTours";
import Revenue from "./pages/Revenue";

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
    <Route path="/" element={<BookingLayout />}>
      <Route index element={<Home />} />
      <Route path="about" element={<About />} />
      <Route path="contact" element={<Contact />} />
    </Route>
    <Route path="/dashboard" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
      <Route path="manage-tours" element={<ManageTours />} />
      <Route path="revenue" element={<Revenue />} />
    </Route>
  </Routes>
);

export default RouterConfig;

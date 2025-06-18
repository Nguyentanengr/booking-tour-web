// service/overviewService.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/v1/admin/overviews'; // Đảm bảo đúng port của server

const getOverviewStats = async (timeRange) => {
  const response = await axios.get(`${API_URL}/stats?timeRange=${timeRange}`);
  return response.data;
};

const getMonthlyRevenue = async (timeRange) => {
  const response = await axios.get(`${API_URL}/revenue?timeRange=${timeRange}`);
  return response.data;
};

const getPopularTours = async (timeRange, limit = 5) => {
  const response = await axios.get(`${API_URL}/popular-tours?timeRange=${timeRange}&limit=${limit}`);
  return response.data;
};

const getRecentBookings = async (timeRange, limit = 5) => {
  const response = await axios.get(`${API_URL}/recent-bookings?timeRange=${timeRange}&limit=${limit}`);
  return response.data;
};

const overviewService = {
  getOverviewStats,
  getMonthlyRevenue,
  getPopularTours,
  getRecentBookings,
};

export default overviewService;
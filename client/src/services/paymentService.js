import axios from 'axios';

const API_URL = '/api/v1/admin/payments';

// Helper to convert camelCase to snake_case
const toSnakeCase = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(toSnakeCase);
  return Object.keys(obj).reduce((acc, key) => {
    const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
    acc[snakeKey] = toSnakeCase(obj[key]);
    return acc;
  }, {});
};

// Helper to convert snake_case to camelCase
const toCamelCase = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(toCamelCase);
  return Object.keys(obj).reduce((acc, key) => {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    acc[camelKey] = toCamelCase(obj[key]);
    return acc;
  }, {});
};

const getPayments = async ({ search = '', type = 'all', status = 'all', method = 'all', year, page = 1, limit = 10 }) => {
  try {
    const response = await axios.get(API_URL, {
      params: { search, type, status, method, year, page, limit },
    });
    console.log("API Response for getPayments:", response.data);
    const data = toSnakeCase(response.data.data || {});
    const payments = Array.isArray(data.payments) ? data.payments : [];
    const pagination = data.pagination || { currentPage: page, totalPages: 1, totalItems: 0, limit };
    return { payments, pagination };
  } catch (error) {
    console.error("Error in getPayments:", error.response?.data || error.message);
    throw error;
  }
};

const getStats = async (year) => {
  try {
    const response = await axios.get(`${API_URL}/stats`, { params: { year } });
    console.log("API Response for getStats:", response.data);
    return toSnakeCase(response.data.data.stats || {});
  } catch (error) {
    console.error("Error in getStats:", error.response?.data || error.message);
    throw error;
  }
};

const getPaymentById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    console.log("API Response for getPaymentById:", response.data);
    return toSnakeCase(response.data.data || {});
  } catch (error) {
    console.error("Error in getPaymentById:", error.response?.data || error.message);
    throw error;
  }
};

const createPayment = async (paymentData) => {
  try {
    // Send paymentData in snake_case (no camelCase transformation)
    const response = await axios.post(API_URL, paymentData);
    console.log("API Response for createPayment:", response.data);
    return toSnakeCase(response.data.data || {});
  } catch (error) {
    console.error("Error in createPayment:", error.response?.data || error.message);
    throw error;
  }
};

const updatePayment = async ({ id, paymentData }) => {
  try {
    const camelData = toCamelCase(paymentData);
    const response = await axios.put(`${API_URL}/${id}`, camelData);
    console.log("API Response for updatePayment:", response.data);
    return toSnakeCase(response.data.data || {});
  } catch (error) {
    console.error("Error in updatePayment:", error.response?.data || error.message);
    throw error;
  }
};

const deletePayment = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    console.log("API Response for deletePayment:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in deletePayment:", error.response?.data || error.message);
    throw error;
  }
};

export default {
  getPayments,
  getStats,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment,
};
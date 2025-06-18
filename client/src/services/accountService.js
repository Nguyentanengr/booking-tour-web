import axios from 'axios';

const API_URL = 'http://localhost:3000/api/v1/admin/accounts';

const getAccounts = async (type, search = '', status = 'all', page = 1, limit = 10) => {
  const response = await axios.get(API_URL, {
    params: { type, search, status, page, limit },
  });
  return response.data;
};

const createAccount = async (accountData) => {
  const response = await axios.post(API_URL, accountData);
  return response.data;
};

const getAccountById = async (id, type) => {
  const response = await axios.get(`${API_URL}/${id}`, { params: { type } });
  return response.data;
};

const updateAccount = async (id, accountData) => {
  const response = await axios.put(`${API_URL}/${id}`, accountData);
  return response.data;
};

const deleteAccount = async (id, data) => {
  const response = await axios.delete(`${API_URL}/${id}`, { data });
  return response.data;
};

export default {
  getAccounts,
  createAccount,
  getAccountById,
  updateAccount,
  deleteAccount,
};
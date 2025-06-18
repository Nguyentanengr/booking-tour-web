import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import accountService from '../../services/accountService';
import { toast } from 'sonner';

export const fetchAccounts = createAsyncThunk(
  'accounts/fetchAccounts',
  async ({ type, search, status, page, limit }, thunkAPI) => {
    try {
      const response = await accountService.getAccounts(type, search, status, page, limit);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || { message: 'Lỗi không xác định' });
    }
  }
);

export const createAccount = createAsyncThunk(
  'accounts/createAccount',
  async (accountData, thunkAPI) => {
    try {
      const response = await accountService.createAccount(accountData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || { message: 'Lỗi không xác định' });
    }
  }
);

export const fetchAccountById = createAsyncThunk(
  'accounts/fetchAccountById',
  async ({ id, type }, thunkAPI) => {
    try {
      const response = await accountService.getAccountById(id, type);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || { message: 'Lỗi không xác định' });
    }
  }
);

export const updateAccount = createAsyncThunk(
  'accounts/updateAccount',
  async ({ id, accountData }, thunkAPI) => {
    try {
      const response = await accountService.updateAccount(id, accountData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || { message: 'Lỗi không xác định' });
    }
  }
);

export const deleteAccount = createAsyncThunk(
  'accounts/deleteAccount',
  async ({ id, type, deleteReason }, thunkAPI) => {
    try {
      const response = await accountService.deleteAccount(id, { type, delete_reason: deleteReason });
      return { id, type, message: response.data.message };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || { message: 'Lỗi không xác định' });
    }
  }
);

const accountSlice = createSlice({
  name: 'accounts',
  initialState: {
    accounts: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      limit: 10,
    },
    currentAccount: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
    setCurrentAccount: (state, action) => {
      state.currentAccount = action.payload;
    },
    clearCurrentAccount: (state) => {
      state.currentAccount = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.loading = false;
        state.accounts = action.payload.accounts;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error('Lỗi khi tải danh sách tài khoản', {
          description: action.payload.message || 'Vui lòng thử lại sau.',
        });
      })
      .addCase(createAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.accounts = [action.payload, ...state.accounts];
        state.pagination.totalItems += 1;
        toast.success('Tạo tài khoản thành công');
      })
      .addCase(createAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error('Lỗi khi tạo tài khoản', {
          description: action.payload.message || 'Vui lòng thử lại sau.',
        });
      })
      .addCase(fetchAccountById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccountById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAccount = action.payload;
      })
      .addCase(fetchAccountById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error('Lỗi khi tải thông tin tài khoản', {
          description: action.payload.message || 'Vui lòng thử lại sau.',
        });
      })
      .addCase(updateAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.accounts = state.accounts.map((account) =>
          account._id === action.payload._id ? action.payload : account
        );
        state.currentAccount = action.payload;
        toast.success('Cập nhật tài khoản thành công');
      })
      .addCase(updateAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error('Lỗi khi cập nhật tài khoản', {
          description: action.payload.message || 'Vui lòng thử lại sau.',
        });
      })
      .addCase(deleteAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.accounts = state.accounts.filter((account) => account._id !== action.payload.id);
        toast.success('Xóa tài khoản thành công');
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error('Lỗi khi xóa tài khoản', {
          description: action.payload.message || 'Vui lòng thử lại sau.',
        });
      });
  },
});

export const { resetError, setCurrentAccount, clearCurrentAccount } = accountSlice.actions;
export default accountSlice.reducer;
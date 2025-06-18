import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import paymentService from '../../services/paymentService';

export const fetchPayments = createAsyncThunk(
  'payments/fetchPayments',
  async (params, { rejectWithValue }) => {
    try {
      const data = await paymentService.getPayments(params);
      console.log("fetchPayments data:", data); // Debug log
      return data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Lỗi khi lấy danh sách giao dịch';
      console.error("fetchPayments error:", errorMsg, error);
      return rejectWithValue(errorMsg);
    }
  }
);

export const fetchStats = createAsyncThunk(
  'payments/fetchStats',
  async (year, { rejectWithValue }) => {
    try {
      const data = await paymentService.getStats(year);
      console.log("fetchStats data:", data); // Debug log
      return data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Lỗi khi lấy thống kê';
      console.error("fetchStats error:", errorMsg, error);
      return rejectWithValue(errorMsg);
    }
  }
);

export const fetchPaymentById = createAsyncThunk(
  'payments/fetchPaymentById',
  async (id, { rejectWithValue }) => {
    try {
      const data = await paymentService.getPaymentById(id);
      console.log("fetchPaymentById data:", data); // Debug log
      return data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Lỗi khi lấy chi tiết giao dịch';
      console.error("fetchPaymentById error:", errorMsg, error);
      return rejectWithValue(errorMsg);
    }
  }
);

export const createPayment = createAsyncThunk(
  'payments/createPayment',
  async (paymentData, { rejectWithValue }) => {
    try {
      const data = await paymentService.createPayment(paymentData);
      console.log("createPayment data:", data); // Debug log
      return data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Lỗi khi tạo giao dịch';
      console.error("createPayment error:", errorMsg, error);
      return rejectWithValue(errorMsg);
    }
  }
);

export const updatePayment = createAsyncThunk(
  'payments/updatePayment',
  async ({ id, paymentData }, { rejectWithValue }) => {
    try {
      const data = await paymentService.updatePayment({ id, paymentData });
      console.log("updatePayment data:", data); // Debug log
      return data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Lỗi khi cập nhật giao dịch';
      console.error("updatePayment error:", errorMsg, error);
      return rejectWithValue(errorMsg);
    }
  }
);

export const deletePayment = createAsyncThunk(
  'payments/deletePayment',
  async (id, { rejectWithValue }) => {
    try {
      await paymentService.deletePayment(id);
      console.log("deletePayment success:", id); // Debug log
      return id;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Lỗi khi xóa giao dịch';
      console.error("deletePayment error:", errorMsg, error);
      return rejectWithValue(errorMsg);
    }
  }
);

const initialState = {
  payments: [],
  pagination: { currentPage: 1, totalPages: 1, totalItems: 0, limit: 10 },
  stats: { total_payment_count: 0, total_payment_amount: 0, total_refunded_count: 0, total_refunded_amount: 0, net_revenue: 0 },
  currentPayment: null,
  loading: false,
  error: null,
};

const paymentSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    setCurrentPayment(state, action) {
      state.currentPayment = action.payload;
    },
    clearCurrentPayment(state) {
      state.currentPayment = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Payments
      .addCase(fetchPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.loading = false;
        // Ensure payments is an array
        state.payments = Array.isArray(action.payload.payments) ? action.payload.payments : [];
        state.pagination = action.payload.pagination || initialState.pagination;
        console.log("fetchPayments fulfilled:", state.payments, state.pagination); // Debug log
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.payments = []; // Reset to empty array on error
        console.error("fetchPayments rejected:", action.payload); // Debug log
      })
      // Fetch Stats
      .addCase(fetchStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.loading = false;
        const temp = action.payload || initialState.stats;
        console.log("temp stats:", temp); // Debug log
        state.stats = action.payload || initialState.stats;
        console.log("fetchStats fulfilled:", state.stats); // Debug log
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error("fetchStats rejected:", action.payload); // Debug log
      })
      // Fetch Payment By Id
      .addCase(fetchPaymentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPayment = action.payload || null;
        console.log("fetchPaymentById fulfilled:", state.currentPayment); // Debug log
      })
      .addCase(fetchPaymentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error("fetchPaymentById rejected:", action.payload); // Debug log
      })
      // Create Payment
      .addCase(createPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = [action.payload, ...state.payments];
        state.pagination.totalItems += 1;
        console.log("createPayment fulfilled:", action.payload); // Debug log
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error("createPayment rejected:", action.payload); // Debug log
      })
      // Update Payment
      .addCase(updatePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePayment.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = state.payments.map((p) =>
          p._id === action.payload._id ? action.payload : p
        );
        state.currentPayment = action.payload;
        console.log("updatePayment fulfilled:", action.payload); // Debug log
      })
      .addCase(updatePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error("updatePayment rejected:", action.payload); // Debug log
      })
      // Delete Payment
      .addCase(deletePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePayment.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = state.payments.filter((p) => p._id !== action.payload);
        state.pagination.totalItems -= 1;
        state.currentPayment = null;
        console.log("deletePayment fulfilled:", action.payload); // Debug log
      })
      .addCase(deletePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error("deletePayment rejected:", action.payload); // Debug log
      });
  },
});

export const { setCurrentPayment, clearCurrentPayment, clearError } = paymentSlice.actions;
export default paymentSlice.reducer;
// redux/slices/overviewSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import overviewService from '../../services/overviewService';

// Async Thunks
export const fetchOverviewStats = createAsyncThunk(
  'overview/fetchOverviewStats',
  async (timeRange, thunkAPI) => {
    try {
      return await overviewService.getOverviewStats(timeRange);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const fetchMonthlyRevenue = createAsyncThunk(
  'overview/fetchMonthlyRevenue',
  async (timeRange, thunkAPI) => {
    try {
      return await overviewService.getMonthlyRevenue(timeRange);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const fetchPopularTours = createAsyncThunk(
  'overview/fetchPopularTours',
  async (timeRange, thunkAPI) => {
    try {
      return await overviewService.getPopularTours(timeRange);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const fetchRecentBookings = createAsyncThunk(
  'overview/fetchRecentBookings',
  async (timeRange, thunkAPI) => {
    try {
      return await overviewService.getRecentBookings(timeRange);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const overviewSlice = createSlice({
  name: 'overview',
  initialState: {
    stats: {
      totalTours: 0,
      activeTours: 0,
      totalDepartures: 0,
      upcomingDepartures: 0,
      totalBookings: 0,
      pendingBookings: 0,
      totalRevenue: 0,
      monthlyRevenue: 0,
    },
    monthlyData: [],
    popularTours: [],
    recentBookings: [],
    loadingStats: false,
    loadingMonthly: false,
    loadingTours: false,
    loadingBookings: false,
    errorStats: null,
    errorMonthly: null,
    errorTours: null,
    errorBookings: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Overview Stats
      .addCase(fetchOverviewStats.pending, (state) => {
        state.loadingStats = true;
        state.errorStats = null;
      })
      .addCase(fetchOverviewStats.fulfilled, (state, action) => {
        state.loadingStats = false;
        state.stats = action.payload.data;
      })
      .addCase(fetchOverviewStats.rejected, (state, action) => {
        state.loadingStats = false;
        state.errorStats = action.payload;
      })
      .addCase(fetchMonthlyRevenue.pending, (state) => {
        state.loadingMonthly = true;
        state.errorMonthly = null;
      })
      .addCase(fetchMonthlyRevenue.fulfilled, (state, action) => {
        state.loadingMonthly = false;
        state.monthlyData = action.payload.data;
      })
      .addCase(fetchMonthlyRevenue.rejected, (state, action) => {
        state.loadingMonthly = false;
        state.errorMonthly = action.payload;
      })
      // Repeat for fetchPopularTours and fetchRecentBookings
      .addCase(fetchPopularTours.pending, (state) => {
        state.loadingTours = true;
        state.errorTours = null;
      })
      .addCase(fetchPopularTours.fulfilled, (state, action) => {
        state.loadingTours = false;
        state.popularTours = action.payload.data;
      })
      .addCase(fetchPopularTours.rejected, (state, action) => {
        state.loadingTours = false;
        state.errorTours = action.payload;
      })
      .addCase(fetchRecentBookings.pending, (state) => {
        state.loadingBookings = true;
        state.errorBookings = null;
      })
      .addCase(fetchRecentBookings.fulfilled, (state, action) => {
        state.loadingBookings = false;
        state.recentBookings = action.payload.data;
      })
      .addCase(fetchRecentBookings.rejected, (state, action) => {
        state.loadingBookings = false;
        state.errorBookings = action.payload;
      });
  },
});

export default overviewSlice.reducer;
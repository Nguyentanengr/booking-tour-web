import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchTours } from '../../services/tourService';

export const getTours = createAsyncThunk('tours/getTours', async () => {
  const response = await fetchTours();
  return response;
});

const tourSlice = createSlice({
  name: 'tours',
  initialState: {
    tours: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTours.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTours.fulfilled, (state, action) => {
        state.loading = false;
        state.tours = action.payload;
      })
      .addCase(getTours.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default tourSlice.reducer;

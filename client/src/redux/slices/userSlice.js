import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    loading: false,
    error: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase('user/login/pending', (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase('user/login/fulfilled', (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase('user/login/rejected', (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const {
} = userSlice.actions;

export default userSlice.reducer;
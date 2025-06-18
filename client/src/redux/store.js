import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import tourReducer from './slices/tourSlice';
import overviewReducer from './slices/overviewSlice';
import accountReducer from './slices/accountSlice';
import paymentReducer from './slices/paymentSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    tours: tourReducer,
    overview: overviewReducer, 
    accounts: accountReducer,
    payments: paymentReducer,
  },
});

export default store;
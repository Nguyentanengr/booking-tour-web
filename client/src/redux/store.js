import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import tourReducer from './slices/tourSlice';


const store = configureStore({
  reducer: {
    user: userReducer,
    tours: tourReducer,
  },
});

export default store;
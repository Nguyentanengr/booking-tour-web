
import overviewReducer from './slices/overviewSlice';
import accountReducer from './slices/accountSlice';
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';


const store = configureStore({
  reducer: {
    user: userReducer,
    overview: overviewReducer, 
    accounts: accountReducer,
  },
});

export default store;
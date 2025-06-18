
import tourReducer from './slices/tourSlice';
import overviewReducer from './slices/overviewSlice';
import accountReducer from './slices/accountSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    tours: tourReducer,
    overview: overviewReducer, 
    accounts: accountReducer,
  },
});

export default store;
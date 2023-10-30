import { configureStore } from '@reduxjs/toolkit';
import buyersSlice from '../reducer/buyersSlice';


export const store = configureStore({
  reducer: {
    buyer: buyersSlice
  }
});
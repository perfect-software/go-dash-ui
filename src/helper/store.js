import { configureStore } from '@reduxjs/toolkit';
import buyersSlice from '../reducer/buyersSlice';
import sampleSlice from '../reducer/sampleSlice';




export const store = configureStore({
  reducer: {
    buyer: buyersSlice,
    sample:sampleSlice,
  }
});
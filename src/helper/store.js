import { configureStore } from '@reduxjs/toolkit';
import buyersSlice from '../reducer/buyersSlice';
import sampleSlice from '../reducer/sampleSlice';
import dataReducer from '../reducer/grpSubgrpSlice';



export const store = configureStore({
  reducer: {
    buyer: buyersSlice,
    sample:sampleSlice,
    data: dataReducer,
  }
});
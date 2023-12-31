import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchAllBuyers = createAsyncThunk(
  'buyer/fetchAllBuyers',
  async () => {
    const response = await axios.get(`http://localhost:8081/api/sample/getAllBuyer`);
    return response.data; 
  }
);

const buyersSlice = createSlice({
  name: 'buyer',
  initialState: {
    buyers: [],
    loaded: false,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllBuyers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBuyers.fulfilled, (state, action) => {
        state.buyers = action.payload;
        state.loaded = true;
        state.loading = false;
      })
      .addCase(fetchAllBuyers.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  }
});

export default buyersSlice.reducer;

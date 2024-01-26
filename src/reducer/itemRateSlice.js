import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchAllItemRates = createAsyncThunk(
  'itemRate/fetchAllItemRates',
  async () => {
    const response = await axios.get(`http://localhost:8081/api/item/getItemQuotation`);
    console.log(response.data);
    return response.data; 

  }
);

const itemRateSlice = createSlice({
  name: 'itemRate',
  initialState: {
    itemRates: [],
    loaded: false,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllItemRates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllItemRates.fulfilled, (state, action) => {
        state.itemRates = action.payload;
        state.loaded = true;
        state.loading = false;
      })
      .addCase(fetchAllItemRates.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  }
});

export default itemRateSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../features/url';

export const fetchAllProductionBom = createAsyncThunk(
  'article/fetchAllProductionBom',
  async () => {
    const response = await axios.get(`${API_URL}/api/productionBom/viewBOM`);
    return response.data; 
  }
);

const productionBomSlice = createSlice({
  name: 'productionBom',
  initialState: {
    productionBom: [],
    loaded: false,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProductionBom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProductionBom.fulfilled, (state, action) => {
        state.productionBom = action.payload;
        state.loaded = true;
        state.loading = false;
      })
      .addCase(fetchAllProductionBom.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  }
});

export default productionBomSlice.reducer;

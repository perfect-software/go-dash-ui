import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../features/url';

export const fetchAllBom = createAsyncThunk(
  'article/fetchAllBom',
  async () => {
    const response = await axios.get(`${API_URL}/api/bom/viewSRBOM`);
    return response.data; 
  }
);

const bomSlice = createSlice({
  name: 'bom',
  initialState: {
    bom: [],
    loaded: false,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllBom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBom.fulfilled, (state, action) => {
        state.bom = action.payload;
        state.loaded = true;
        state.loading = false;
      })
      .addCase(fetchAllBom.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  }
});

export default bomSlice.reducer;

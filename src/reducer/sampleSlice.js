import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchAllSamples = createAsyncThunk(
  'sample/fetchAllSamples',
  async () => {
    const response = await axios.get(`http://localhost:8081/api/sample/viewAllSample`);
    return response.data; 
  }
);

const sampleSlice = createSlice({
  name: 'sample',
  initialState: {
    samples: [],
    loaded: false,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllSamples.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllSamples.fulfilled, (state, action) => {
        state.samples = action.payload;
        state.loaded = true;
        state.loading = false;
      })
      .addCase(fetchAllSamples.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  }
});

export default sampleSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchAllItemHeads = createAsyncThunk(
  'itemHead/fetchAllItemHeads',
  async () => {
    const response = await axios.get(`http://localhost:8081/api/item/getItemHead`);
    console.log(response.data);
    return response.data; 

  }
);

const itemHeadSlice = createSlice({
  name: 'itemHead',
  initialState: {
    itemHeads: [],
    loaded: false,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllItemHeads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllItemHeads.fulfilled, (state, action) => {
        state.itemHeads = action.payload;
        state.loaded = true;
        state.loading = false;
      })
      .addCase(fetchAllItemHeads.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  }
});

export default itemHeadSlice.reducer;

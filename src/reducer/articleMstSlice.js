import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../features/url';

export const fetchAllArticleMst = createAsyncThunk(
  'article/fetchAllArticleMst',
  async () => {
    const response = await axios.get(`${API_URL}/api/article/getArticleMst`);
    return response.data; 
  }
);

const articleMstSlice = createSlice({
  name: 'articleMst',
  initialState: {
    articleMst: [],
    loaded: false,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllArticleMst.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllArticleMst.fulfilled, (state, action) => {
        state.articleMst = action.payload;
        state.loaded = true;
        state.loading = false;
      })
      .addCase(fetchAllArticleMst.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  }
});

export default articleMstSlice.reducer;

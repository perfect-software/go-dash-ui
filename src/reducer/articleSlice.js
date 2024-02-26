import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../features/url';

export const fetchAllArticles = createAsyncThunk(
  'article/fetchAllArticles',
  async () => {
    const response = await axios.get(`${API_URL}/api/article/getArticle`);
    return response.data; 
  }
);

const articleSlice = createSlice({
  name: 'article',
  initialState: {
    articles: [],
    loaded: false,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllArticles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllArticles.fulfilled, (state, action) => {
        state.articles = action.payload;
        state.loaded = true;
        state.loading = false;
      })
      .addCase(fetchAllArticles.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  }
});

export default articleSlice.reducer;

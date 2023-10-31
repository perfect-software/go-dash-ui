// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';

// export const fetchAllBuyers = createAsyncThunk(
//   'buyer/fetchAllBuyers',
//   async (input) => {
//     const response = await axios.get(`http://localhost:8081/api/sample/getAllBuyer?input=${encodeURIComponent(input)}`);
   
//     const extractedData = response.data.map(item => ({
//       bsName: item.bsName,
//       code: item.code,
//       billingAddress: item.billingAddress
//   }));
//   return extractedData;
//   }
// );

// const buyersSlice = createSlice({
//   name: 'buyer',
//   initialState: {
//     buyers: [],
//     loaded: false,
//     loading: false,
//     error: null
//   },
//   reducers: {},
//   extraReducers: {
//     [fetchAllBuyers.pending]: (state) => {
//       state.loading = true;
//     },
//     [fetchAllBuyers.fulfilled]: (state, action) => {
//       state.buyers = action.payload;
//       state.loaded = true;
//       state.loading = false;
//     },
//     [fetchAllBuyers.rejected]: (state, action) => {
//       state.error = action.error.message;
//       state.loading = false;
//     }
//   }
// });

// export default buyersSlice.reducer;

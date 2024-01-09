import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchItemGroupsAndSubGroups = createAsyncThunk(
    'data/fetchItemGroupsAndSubGroups',
    async () => {
      const response = await axios.get('http://localhost:8081/api/item/getItemGrpAndSubGrp');
      return response.data; 
     
    }
  );
  const dataSlice = createSlice({
    name: 'data',
    initialState: {
      itemGroups: {},
      itemSubGroups: {},
      loaded: false,
      loading: false,
      error: null
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchItemGroupsAndSubGroups.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchItemGroupsAndSubGroups.fulfilled, (state, action) => {
          const itemGroups = {};
          const itemSubGroups = {};
          action.payload.forEach(item => {
            const trimmedItemGrpName = item.itemGrpName.trim();
            const trimmedItemSubGrpName = item.itemSubGrpName.trim();
            
            if (!itemGroups[item.itemGrp]) {
              itemGroups[item.itemGrp] = trimmedItemGrpName;
            }
            if (!itemSubGroups[item.itemSubGrp]) {
              itemSubGroups[item.itemSubGrp] = {
                name: trimmedItemSubGrpName,
                groupNumber: item.itemGrp
              };
            }
          });
        
          state.itemGroups = itemGroups;
          state.itemSubGroups = itemSubGroups;
          state.loaded = true;
          state.loading = false;
        })
        
          
        .addCase(fetchItemGroupsAndSubGroups.rejected, (state, action) => {
          state.error = action.error.message;
          state.loading = false;
        });
    }
  });
  
  export default dataSlice.reducer;
  
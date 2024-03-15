import { configureStore } from '@reduxjs/toolkit';
import buyersSlice from '../reducer/buyersSlice';
import sampleSlice from '../reducer/sampleSlice';
import dataSlice from '../reducer/grpSubgrpSlice';
import itemRateSlice from '../reducer/itemRateSlice';
import articleSlice from '../reducer/articleSlice';
import bomSlice from '../reducer/bomSlice';
import articleMstSlice from '../reducer/articleMstSlice';
import itemHeadSlice from '../reducer/itemHeadSlice';
import productionBomSlice from '../reducer/productionBomSlice';



export const store = configureStore({
  reducer: {
    buyer: buyersSlice,
    sample:sampleSlice,
    data: dataSlice,
    itemRate: itemRateSlice,
    article:articleSlice,
    bom:bomSlice,
    articleMst:articleMstSlice,
    itemHead:itemHeadSlice,
    productionBom:productionBomSlice
  }
});
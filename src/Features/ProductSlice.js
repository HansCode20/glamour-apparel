import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  items: [],
  status: null,
  error: null,
};

export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',
  async () => {
    const response = await axios.get("https://restapistore-default-rtdb.asia-southeast1.firebasedatabase.app/Store.json?auth=QVdNWO3MDXvTdszmf7YUy0tcjRjR3drAmOlmNrc4");  
    return response.data;
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'success';
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'rejected';
        state.error = action.error.message;
      });
  },
});

export default productSlice.reducer;

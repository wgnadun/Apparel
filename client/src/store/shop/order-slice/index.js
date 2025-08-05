import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
    approvalURL: null,
    isLoading: false,
    orderId: null,
    orderList: [],
    orderDetails: null,
};

export const createNewOrder = createAsyncThunk(
  "/order/createNewOrder",
  async (orderData) => {
    const response = await axios.post(
      "http://localhost:5000/api/shop/order/create",
      orderData
    );

    return response.data;
  }
);

const shoppingOrderSlice = createSlice({
    name: "shoppingOrderSlice",
    initialState,
    reducers :{},
    extraReducers: (builder)=>{},
})

export default shoppingOrderSlice.reducer;
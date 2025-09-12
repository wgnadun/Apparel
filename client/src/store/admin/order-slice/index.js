import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../../services/api";
import { createAuthenticatedApi } from "../../../services/api";

const initialState = {
  orderList: [],
  orderDetails: null,
};

export const getAllOrdersForAdmin = createAsyncThunk(
  "/order/getAllOrdersForAdmin",
  async ({ getAccessTokenSilently, authType }) => {
    let apiInstance;
    
    // Use authenticated API for Auth0 users, regular API for JWT users
    if (authType === 'auth0' && getAccessTokenSilently) {
        apiInstance = createAuthenticatedApi(getAccessTokenSilently);
    } else {
        apiInstance = api;
    }
    
    const response = await apiInstance.get(
      `/admin/orders/get`
    );

    return response.data;
  }
);

export const getOrderDetailsForAdmin = createAsyncThunk(
  "/order/getOrderDetailsForAdmin",
  async ({ id, getAccessTokenSilently, authType }) => {
    let apiInstance;
    
    // Use authenticated API for Auth0 users, regular API for JWT users
    if (authType === 'auth0' && getAccessTokenSilently) {
        apiInstance = createAuthenticatedApi(getAccessTokenSilently);
    } else {
        apiInstance = api;
    }
    
    const response = await apiInstance.get(
      `/admin/orders/details/${id}`
    );

    return response.data;
  }
);

export const updateOrderStatus = createAsyncThunk(
  "/order/updateOrderStatus",
  async ({ id, orderStatus, getAccessTokenSilently, authType }) => {
    let apiInstance;
    
    // Use authenticated API for Auth0 users, regular API for JWT users
    if (authType === 'auth0' && getAccessTokenSilently) {
        apiInstance = createAuthenticatedApi(getAccessTokenSilently);
    } else {
        apiInstance = api;
    }
    
    const response = await apiInstance.put(
      `/admin/orders/update/${id}`,
      {
        orderStatus,
      }
    );

    return response.data;
  }
);

const adminOrderSlice = createSlice({
  name: "adminOrderSlice",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      console.log("resetOrderDetails");

      state.orderDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllOrdersForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrdersForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data;
      })
      .addCase(getAllOrdersForAdmin.rejected, (state) => {
        state.isLoading = false;
        state.orderList = [];
      })
      .addCase(getOrderDetailsForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetailsForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload.data;
      })
      .addCase(getOrderDetailsForAdmin.rejected, (state) => {
        state.isLoading = false;
        state.orderDetails = null;
      });
  },
});

export const { resetOrderDetails } = adminOrderSlice.actions;

export default adminOrderSlice.reducer;

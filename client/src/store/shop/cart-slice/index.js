import api from "../../../services/api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  cartItems: null,
  guestCartItems: JSON.parse(localStorage.getItem("guestCart")) || [],
  isLoading: false,
};

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ userId, productId, quantity }) => {
    const response = await api.post(
      "/shop/cart/add",
      {
        userId,
        productId,
        quantity,
      }
    );

    return response.data;
  }
);

export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async (userId) => {
    const response = await api.get(
      `/shop/cart/get/${userId}`
    );

    return response.data;
  }
);

export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async ({ userId, productId }) => {
    const response = await api.delete(
      `/shop/cart/${userId}/${productId}`
    );

    return response.data;
  }
);

export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({ userId, productId, quantity }) => {
    const response = await api.put(
      "/shop/cart/update-cart",
      {
        userId,
        productId,
        quantity,
      }
    );

    return response.data;
  }
);

export const syncCart = createAsyncThunk(
  "cart/syncCart",
  async ({ userId, items }) => {
    console.log("Thunk: syncCart started for", userId, items);
    const response = await api.post(
      "/shop/cart/sync",
      {
        userId,
        items,
      }
    );
    console.log("Thunk: syncCart response:", response.data);
    return response.data;
  }
);


const shoppingCartSlice = createSlice({
  name: "shoppingCart",
  initialState,
  reducers: {
    addToGuestCart: (state, action) => {
      const { productId, quantity } = action.payload;
      const findCurrentProductIndex = state.guestCartItems.findIndex(
        (item) => item.productId === productId
      );

      if (findCurrentProductIndex === -1) {
        state.guestCartItems.push({ productId, quantity });
      } else {
        state.guestCartItems[findCurrentProductIndex].quantity += quantity;
      }
      localStorage.setItem("guestCart", JSON.stringify(state.guestCartItems));
    },
    updateGuestCartQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const findCurrentProductIndex = state.guestCartItems.findIndex(
        (item) => item.productId === productId
      );

      if (findCurrentProductIndex !== -1) {
        state.guestCartItems[findCurrentProductIndex].quantity = quantity;
      }
      localStorage.setItem("guestCart", JSON.stringify(state.guestCartItems));
    },
    deleteGuestCartItem: (state, action) => {
      const { productId } = action.payload;
      state.guestCartItems = state.guestCartItems.filter(
        (item) => item.productId !== productId
      );
      localStorage.setItem("guestCart", JSON.stringify(state.guestCartItems));
    },
    clearGuestCart: (state) => {
      state.guestCartItems = [];
      localStorage.removeItem("guestCart");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(addToCart.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })
      .addCase(fetchCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(fetchCartItems.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })
      .addCase(updateCartQuantity.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(updateCartQuantity.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })
      .addCase(deleteCartItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(deleteCartItem.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })
      .addCase(syncCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(syncCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(syncCart.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { 
  addToGuestCart, 
  updateGuestCartQuantity, 
  deleteGuestCartItem, 
  clearGuestCart 
} = shoppingCartSlice.actions;

export default shoppingCartSlice.reducer;
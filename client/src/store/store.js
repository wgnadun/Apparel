import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import adminProductsSlice from "./admin/products-slice";
import adminOrderSlice from "./admin/order-slice";
import featureSlice from "./common/feature-slice"

import shoppingProductSlice from "./shop/products-slice";
import shopCartSlice from "./shop/cart-slice";
import addressSlice from "./shop/address-slice";
import shopOrderSlice from "./shop/order-slice";
import shopSearchSlice  from "./shop/search-slice";
import shopReviewSlice  from "./shop/review-slice";

const store = configureStore({
  reducer: {
    auth: authReducer,

    adminProducts: adminProductsSlice,
    adminOrder: adminOrderSlice,

    shopProducts: shoppingProductSlice,
    shopCart: shopCartSlice,
    shopAddress: addressSlice,
    shopOrder: shopOrderSlice,
    shopSearch : shopSearchSlice,
    shopReview : shopReviewSlice,
    commonFeature : featureSlice,
  },
});

export default store;

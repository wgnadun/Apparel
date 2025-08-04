import { configureStore }  from  "@reduxjs/toolkit"
import authReducer from './auth-slice'
import adminProductsSlice from "./admin/products-slice"
import shoppingProductSlice from "./shop/products-slice"
import shopCartSlice from "./shop/cart-slice"
import addressSlice from "./shop/address-slice"

const store = configureStore({
    reducer : {
        auth : authReducer,
        adminProducts: adminProductsSlice,
        shopProducts : shoppingProductSlice,
        shopCart : shopCartSlice,
        shopAddress : addressSlice
    },
})



export default store;
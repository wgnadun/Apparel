import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../services/api";
import { createAuthenticatedApi } from "../../../services/api";

const initialState = {
    isLoading : false,
    productList : [],
}
//add thunk
export const addNewProduct = createAsyncThunk(
    "/products/addnewproduct",async({ formData, getAccessTokenSilently, authType })=>{
        let apiInstance;
        
        // Use authenticated API for Auth0 users, regular API for JWT users
        if (authType === 'auth0' && getAccessTokenSilently) {
            apiInstance = createAuthenticatedApi(getAccessTokenSilently);
        } else {
            apiInstance = api;
        }
        
        const result = await apiInstance.post(
            "/admin/products/add-product",
             formData
        );
    
    return result?.data;
    
    }
);

    //fetch all thunk
export const fetchAllProducts = createAsyncThunk(
    "/products/fetchAllProducts",async({ getAccessTokenSilently, authType })=>{
        let apiInstance;
        
        // Use authenticated API for Auth0 users, regular API for JWT users
        if (authType === 'auth0' && getAccessTokenSilently) {
            apiInstance = createAuthenticatedApi(getAccessTokenSilently);
        } else {
            apiInstance = api;
        }
        
        const result = await apiInstance.get("/admin/products/fetch-all-products");
    
    return result?.data;
    
    });
//edit thunk
export const editProduct = createAsyncThunk(
    "/products/editproduct",async({id, formData, getAccessTokenSilently, authType})=>{
        let apiInstance;
        
        // Use authenticated API for Auth0 users, regular API for JWT users
        if (authType === 'auth0' && getAccessTokenSilently) {
            apiInstance = createAuthenticatedApi(getAccessTokenSilently);
        } else {
            apiInstance = api;
        }
        
        const result = await apiInstance.put(`/admin/products/edit-product/${id}`, formData);
    
    return result?.data;
    
    });

//delete thunk

export const deleteProduct = createAsyncThunk(
    "/products/deleteProduct",async({id, getAccessTokenSilently, authType})=>{
        let apiInstance;
        
        // Use authenticated API for Auth0 users, regular API for JWT users
        if (authType === 'auth0' && getAccessTokenSilently) {
            apiInstance = createAuthenticatedApi(getAccessTokenSilently);
        } else {
            apiInstance = api;
        }
        
        const result = await apiInstance.delete(`/admin/products/delete-product/${id}`);
    
    return result?.data;
    
    });


const AdminProductsSlice = createSlice({
  name: "adminProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.productList = [];
      });
  },
});

export default AdminProductsSlice.reducer;
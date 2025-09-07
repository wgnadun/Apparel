import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../services/api";

const initialState = {
    isLoading : false,
    productList : [],
}
//add thunk
export const addNewProduct = createAsyncThunk(
    "/products/addnewproduct",async(formData)=>{
        const result = await api.post(
            "/admin/products/add-product",
             formData
        );
    
    return result?.data;
    
    }
);

    //fetch all thunk
export const fetchAllProducts = createAsyncThunk(
    "/products/fetchAllProducts",async()=>{
        const result = await api.get("/admin/products/fetch-all-products");
    
    return result?.data;
    
    });
//edit thunk
export const editProduct = createAsyncThunk(
    "/products/editproduct",async({id,formData})=>{
        const result = await api.put(`/admin/products/edit-product/${id}`, formData);
    
    return result?.data;
    
    });

//delete thunk

export const deleteProduct = createAsyncThunk(
    "/products/deleteProduct",async(id)=>{
        const result = await api.delete(`/admin/products/delete-product/${id}`);
    
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
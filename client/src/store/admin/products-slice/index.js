import axios from "axios";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    isLoading : false,
    productList : [],
}
//add thunk
export const addNewProduct = createAsyncThunk(
    "/products/addnewproduct",async(formData)=>{
        const result = await axios.post(
            "http://localhost:5000/api/admin/products/add-product",
             formData,
             {
               headers: {
                "Content-Type" : "application/json",
            },
        }
    );
    
    return result?.data;
    
    }
);

    //fetch all thunk
export const fetchAllProducts = createAsyncThunk(
    "/products/fetchAllProducts",async()=>{
        const result = await axios.get("http://localhost:5000/api/admin/products/fetch-all-products",
    );
    
    return result?.data;
    
    });
//edit thunk
export const editProduct = createAsyncThunk(
    "/products/editproduct",async({id,formData})=>{
        const result = await axios.put(`http://localhost:5000/api/admin/products/edit-product/${id}`, formData,{
            headers: {
                "Content-Type" : "application/json",
            },
        }
    );
    
    return result?.data;
    
    });

//delete thunk

export const deleteProduct = createAsyncThunk(
    "/products/deleteProduct",async(id)=>{
        const result = await axios.delete(`http://localhost:5000/api/admin/products/delete-product/${id}`
    );
    
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
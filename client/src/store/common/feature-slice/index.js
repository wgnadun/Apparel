import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../../services/api";
import { createAuthenticatedApi } from "../../../services/api";

const initialState = {
  isLoading: false,
  featureImageList: [],
  adminStats: null,
  statsLoading: false,
  statsError: null,
};

// ===== FEATURE IMAGES =====
export const getFeatureImages = createAsyncThunk(
  "feature/getFeatureImages",
  async () => {
    const response = await api.get(
      `/common/feature/get`
    );
    return response.data;
  }
);

export const addFeatureImage = createAsyncThunk(
  "feature/addFeatureImage",
  async (image) => {
    const response = await api.post(
      `/common/feature/add`,
      { image }
    );
    return response.data;
  }
);

export const deleteFeatureImages = createAsyncThunk(
  "feature/deleteFeatureImage",
  async (id) => {
    const response = await api.delete(
      `/common/feature/delete/${id}`
    );
    return response.data;
  }
);

// ===== ADMIN STATS =====
export const fetchAdminStats = createAsyncThunk(
  "adminStats/fetchAdminStats",
  async ({ days = 30, getAccessTokenSilently, authType }, { rejectWithValue }) => {
    try {
      let apiInstance;
      
      // Use authenticated API for Auth0 users, regular API for JWT users
      if (authType === 'auth0' && getAccessTokenSilently) {
          apiInstance = createAuthenticatedApi(getAccessTokenSilently);
      } else {
          apiInstance = api;
      }
      
      const { data } = await apiInstance.get(
        `/common/feature/stats?days=${days}`
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ===== SLICE =====
const commonSlice = createSlice({
  name: "commonSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Feature images
    builder
      .addCase(getFeatureImages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFeatureImages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.featureImageList = action.payload.data;
      })
      .addCase(getFeatureImages.rejected, (state) => {
        state.isLoading = false;
        state.featureImageList = [];
      });

    // Admin stats
    builder
      .addCase(fetchAdminStats.pending, (state) => {
        state.statsLoading = true;
        state.statsError = null;
      })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.adminStats = action.payload;
      })
      .addCase(fetchAdminStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.statsError = action.payload;
      });
  },
});

export default commonSlice.reducer;

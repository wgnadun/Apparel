import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";
import { createAuthenticatedApi } from "../../services/api";

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  authType: null, // 'jwt' or 'auth0'
};

export const registerUser = createAsyncThunk(
  "/auth/register",
  async (formData) => {
    const response = await api.post(
      "/auth/register",
      formData
    );

    return response.data;
  }
);

export const loginUser = createAsyncThunk(
  "/auth/login",
  async (formData) => {
    const response = await api.post(
      "/auth/login",
      formData
    );

    return response.data;
  }
);

export const logoutUser = createAsyncThunk(
  "/auth/logout",
  async () => {
    const response = await api.post(
      "/auth/logout",
      {}
    );

    return response.data;
  }
);

export const checkAuth = createAsyncThunk(
  "/auth/checkauth",
  async (_, { getState }) => {
    const state = getState();
    
    // If user is already authenticated via Auth0, don't check JWT
    if (state.auth.authType === 'auth0' && state.auth.isAuthenticated) {
      return {
        success: true,
        user: state.auth.user,
        authType: 'auth0'
      };
    }
    
    // Only check JWT auth if not using Auth0
    if (state.auth.authType === 'auth0') {
      return {
        success: false,
        user: null,
        authType: null
      };
    }
    
    try {
      const response = await api.get(
        "/auth/check-auth",
        {
          headers: {
            "Cache-Control":
              "no-store, no-cache, must-revalidate, proxy-revalidate",
          },
        }
      );
      return { ...response.data, authType: 'jwt' };
    } catch (error) {
      // If JWT check fails, return unauthenticated
      return {
        success: false,
        user: null,
        authType: null
      };
    }
  }
);

export const syncAuth0User = createAsyncThunk(
  "/auth/auth0/sync",
  async (getAccessTokenSilently) => {
    const api = createAuthenticatedApi(getAccessTokenSilently);
    const response = await api.post("/auth/auth0/sync");
    return response.data;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.authType = 'auth0'; // Assume Auth0 when setting user directly
    },
    updateUser: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    setAuthType: (state, action) => {
      state.authType = action.payload;
    },
    clearAuth: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.authType = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log(action);

        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
        state.authType = action.payload.authType || null;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(syncAuth0User.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(syncAuth0User.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
        state.authType = action.payload.success ? 'auth0' : null;
      })
      .addCase(syncAuth0User.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { setUser, updateUser, setAuthType, clearAuth } = authSlice.actions;
export default authSlice.reducer;
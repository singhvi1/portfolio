import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../lib/api.js';

// status: 'idle' -> not yet checked | 'checking' -> /me in flight |
// 'authenticated' | 'unauthenticated'
// Starting at 'idle' (not 'unauthenticated') is what lets ProtectedRoute
// avoid a flash of the login page before the /me check resolves.

export const checkAuth = createAsyncThunk('auth/checkAuth', async (_, { rejectWithValue }) => {
  try {
    return await api.get('/auth/me');
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const login = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    return await api.post('/auth/login', { email, password });
  } catch (err) {
    return rejectWithValue({ message: err.message, status: err.status, errors: err.errors });
  }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  try {
    await api.post('/auth/logout');
  } catch {
    // logging out client-side regardless of server response is fine
  }
  return null;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    admin: null,
    status: 'idle',
    loginError: null,
    loginPending: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.status = 'checking';
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.status = 'authenticated';
        state.admin = action.payload;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.status = 'unauthenticated';
        state.admin = null;
      })
      .addCase(login.pending, (state) => {
        state.loginPending = true;
        state.loginError = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loginPending = false;
        state.status = 'authenticated';
        state.admin = { email: action.payload.email };
        // store the bearer token too, as a fallback if third-party
        // cookie restrictions ever block the httpOnly cookie in dev
        if (action.payload.token) {
          sessionStorage.setItem('admin_token', action.payload.token);
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loginPending = false;
        state.loginError = action.payload?.message || 'Login failed';
      })
      .addCase(logout.fulfilled, (state) => {
        state.status = 'unauthenticated';
        state.admin = null;
        sessionStorage.removeItem('admin_token');
      });
  },
});

export default authSlice.reducer;

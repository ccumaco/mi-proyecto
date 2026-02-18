import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { User } from '@supabase/supabase-js';
import { createClientBrowser } from '@/lib/supabase';

const supabase = createClientBrowser();

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  status: 'idle',
  error: null,
};

export const loginWithPassword = createAsyncThunk(
  'auth/loginWithPassword',
  async (
    credentials: Parameters<typeof supabase.auth.signInWithPassword>[0],
    { rejectWithValue }
  ) => {
    const { data, error } = await supabase.auth.signInWithPassword(credentials);
    if (error) {
      return rejectWithValue(error.message);
    }
    return data.user;
  }
);

export const signUpWithPassword = createAsyncThunk(
  'auth/signUpWithPassword',
  async (
    credentials: Parameters<typeof supabase.auth.signUp>[0],
    { rejectWithValue }
  ) => {
    const { data, error } = await supabase.auth.signUp(credentials);
    if (error) {
      return rejectWithValue(error.message);
    }
    return data.user;
  }
);

export const logoutFromSupabase = createAsyncThunk(
  'auth/logoutFromSupabase',
  async (_, { rejectWithValue }) => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUser = createAsyncThunk(
  'auth/fetchUser',
  async (_, { rejectWithValue }) => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) {
      return rejectWithValue(error.message);
    }
    return user;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loginWithPassword.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginWithPassword.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginWithPassword.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(signUpWithPassword.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(signUpWithPassword.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // User is not set here because they need to confirm their email
      })
      .addCase(signUpWithPassword.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(logoutFromSupabase.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(logoutFromSupabase.fulfilled, state => {
        state.status = 'succeeded';
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutFromSupabase.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(fetchUser.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { setUser } = authSlice.actions;

export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectUser = (state: RootState) => state.auth.user;
export const selectUserRole = (state: RootState) => state.auth.user?.user_metadata?.role || 'user';
export const selectAuthStatus = (state: RootState) => state.auth.status;
export const selectAuthError = (state: RootState) => state.auth.error;

export default authSlice.reducer;

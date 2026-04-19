import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { apiClient, User } from '@/lib/api';
import { normalizeRole, type UserRole } from '@/lib/roles';

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
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const { user } = await apiClient.login(credentials);
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Credenciales inválidas');
    }
  }
);

export const signUpWithPassword = createAsyncThunk(
  'auth/signUpWithPassword',
  async (
    params: {
      email: string;
      password: string;
      full_name?: string;
      phone?: string;
      nit?: string;
      role?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const { user } = await apiClient.register({
        email: params.email,
        password: params.password,
        fullName: params.full_name,
        displayName: params.full_name,
        phone: params.phone,
        nit: params.nit,
        role: params.role,
      });
      return user;
    } catch (error: any) {
      return rejectWithValue(
        error.message || 'No se pudo registrar el usuario'
      );
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await apiClient.logout();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al cerrar sesión');
    }
  }
);

export const fetchUser = createAsyncThunk(
  'auth/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      const user = await apiClient.getCurrentUser();
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message || 'No se pudo obtener el usuario');
    }
  }
);

export const uploadUserAvatar = createAsyncThunk(
  'auth/uploadUserAvatar',
  async (file: File, { rejectWithValue }) => {
    try {
      const user = await apiClient.uploadAvatar(file);
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al subir la foto de perfil');
    }
  }
);

export const refreshAuth = createAsyncThunk(
  'auth/refreshAuth',
  async (_, { rejectWithValue }) => {
    try {
      await apiClient.refresh();
      const user = await apiClient.getCurrentUser();
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const sendOtpToEmail = createAsyncThunk(
  'auth/sendOtpToEmail',
  async (email: string, { rejectWithValue }) => {
    try {
      const { maskedPhone } = await apiClient.requestOtp(email);
      return { email, maskedPhone };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al enviar OTP');
    }
  }
);

export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async (params: { email: string; token: string }, { rejectWithValue }) => {
    try {
      const { user } = await apiClient.verifyOtp(params.email, params.token);
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al verificar OTP');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.status = 'succeeded';
      state.error = null;
    },
    clearAuth: state => {
      state.user = null;
      state.isAuthenticated = false;
      state.status = 'succeeded';
      state.error = null;
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
        // Debug: show role returned by backend (helps diagnose menu visibility issues)
        console.debug('[auth] loginWithPassword role:', action.payload?.role);
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
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(signUpWithPassword.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(logout.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(logout.fulfilled, state => {
        state.status = 'succeeded';
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logout.rejected, (state, action) => {
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
        console.debug('[auth] fetchUser role:', action.payload?.role);
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(sendOtpToEmail.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(sendOtpToEmail.fulfilled, state => {
        state.status = 'succeeded';
      })
      .addCase(sendOtpToEmail.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(verifyOtp.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.isAuthenticated = true;
        console.debug('[auth] verifyOtp role:', action.payload?.role);
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(uploadUserAvatar.pending, state => {
        state.error = null;
      })
      .addCase(uploadUserAvatar.fulfilled, (state, action) => {
        if (state.user) {
          state.user = { ...state.user, avatarUrl: action.payload.avatarUrl };
        }
      })
      .addCase(uploadUserAvatar.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { setUser, clearAuth } = authSlice.actions;

export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectUser = (state: RootState) => state.auth.user;
export const selectUserRole = (state: RootState): UserRole =>
  normalizeRole(state.auth.user?.role);
export const selectAuthStatus = (state: RootState) => state.auth.status;
export const selectAuthError = (state: RootState) => state.auth.error;

export default authSlice.reducer;

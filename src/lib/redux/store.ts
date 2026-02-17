import { configureStore } from '@reduxjs/toolkit';
import { PreloadedState } from 'redux';
import authReducer from './slices/authSlice';
import type { User } from '@supabase/supabase-js';

// Define the root state type
export interface RootState {
  auth: {
    isAuthenticated: boolean;
    user: User | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
  };
  // Add other slices here
}

export const makeStore = (preloadedState?: PreloadedState<RootState>) => {
  return configureStore<RootState>({
    reducer: {
      auth: authReducer,
    },
    preloadedState,
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore['dispatch'];

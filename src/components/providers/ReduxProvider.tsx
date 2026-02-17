'use client';

import { useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore, RootState } from '@/lib/redux/store';

export function ReduxProvider({
  children,
  initialState,
}: {
  children: React.ReactNode;
  initialState?: RootState;
}) {
  const storeRef = useRef<AppStore>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore(initialState);
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}

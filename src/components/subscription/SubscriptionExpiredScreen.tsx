'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Lock, CreditCard, Loader2 } from 'lucide-react';
import { AppDispatch } from '@/lib/redux/store';
import { logout } from '@/lib/redux/slices/authSlice';
import { apiClient } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

interface SubscriptionExpiredScreenProps {
  role: 'ADMIN' | 'RESIDENT';
}

export function SubscriptionExpiredScreen({
  role,
}: SubscriptionExpiredScreenProps) {
  const t = useTranslations('subscription');
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    await dispatch(logout());
    router.replace('/login');
  };

  const handleActivatePlan = async () => {
    setLoading(true);
    setError(null);
    try {
      const { url } = await apiClient.createCheckoutSession();
      if (url) {
        window.location.href = url;
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Error al crear la sesión de pago.';
      setError(message);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-100 p-4 dark:bg-zinc-950">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg dark:bg-zinc-900">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
            <Lock className="h-8 w-8 text-zinc-500 dark:text-zinc-400" />
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              {t('expiredTitle')}
            </h1>

            {role === 'ADMIN' ? (
              <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                {t('expiredAdminDesc')}
              </p>
            ) : (
              <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                {t('expiredResidentDesc')}
              </p>
            )}
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          {role === 'ADMIN' && (
            <button
              onClick={handleActivatePlan}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CreditCard className="h-4 w-4" />
              )}
              {loading ? t('processing') : t('activatePlan')}
            </button>
          )}

          <a
            href="mailto:soporte@propadmin.app"
            className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            soporte@propadmin.app
          </a>

          <button
            onClick={handleLogout}
            className="w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            {t('logoutButton')}
          </button>
        </div>
      </div>
    </div>
  );
}

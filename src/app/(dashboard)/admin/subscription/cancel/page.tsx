'use client';

import { useState } from 'react';
import { XCircle, CreditCard, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { apiClient } from '@/lib/api';
import { useTranslations } from 'next-intl';

export default function SubscriptionCancelPage() {
  const t = useTranslations('subscription');
  const [loading, setLoading] = useState(false);

  const handleRetry = async () => {
    setLoading(true);
    try {
      const { url } = await apiClient.createCheckoutSession();
      if (url) {
        window.location.href = url;
      }
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg dark:bg-zinc-900">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
            <XCircle className="h-8 w-8 text-zinc-500 dark:text-zinc-400" />
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              {t('cancelTitle')}
            </h1>
            <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
              {t('cancelDesc')}
            </p>
          </div>

          <button
            onClick={handleRetry}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CreditCard className="h-4 w-4" />
            )}
            {loading ? t('processing') : t('cancelRetry')}
          </button>

          <Link
            href="/admin"
            className="text-sm font-medium text-zinc-500 hover:underline dark:text-zinc-400"
          >
            {t('cancelBack')}
          </Link>
        </div>
      </div>
    </div>
  );
}

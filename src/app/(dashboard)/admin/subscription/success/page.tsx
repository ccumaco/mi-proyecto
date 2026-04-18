'use client';

import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function SubscriptionSuccessPage() {
  const t = useTranslations('subscription');

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg dark:bg-zinc-900">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-950/30">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              {t('successTitle')}
            </h1>
            <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
              {t('successDesc')}
            </p>
          </div>

          <Link
            href="/admin"
            className="w-full rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-primary/90"
          >
            {t('successButton')}
          </Link>
        </div>
      </div>
    </div>
  );
}

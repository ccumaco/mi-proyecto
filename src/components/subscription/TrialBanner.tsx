'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface TrialBannerProps {
  trialEndsAt: string;
}

function getDaysRemaining(trialEndsAt: string): number {
  const now = new Date();
  const end = new Date(trialEndsAt);
  const diffMs = end.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

function getTrialMessage(
  isExpired: boolean,
  daysRemaining: number,
  t: (key: string, options?: any) => string
): string {
  if (isExpired) {
    return t('trialExpired');
  }

  if (daysRemaining === 0) {
    return t('trialEndsToday');
  }

  return t('trialEndsInDays', {
    days: daysRemaining,
    unit:
      daysRemaining === 1 ? t('trialDaysSingular') : t('trialDaysPlural'),
  });
}

export function TrialBanner({ trialEndsAt }: TrialBannerProps) {
  const t = useTranslations('subscription');
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const now = new Date();
  const end = new Date(trialEndsAt);
  const isExpired = end < now;
  const daysRemaining = getDaysRemaining(trialEndsAt);
  const message = getTrialMessage(isExpired, daysRemaining, t);

  return (
    <div className="flex items-center justify-between gap-4 bg-amber-400 px-4 py-2.5 text-amber-950 dark:bg-amber-500 dark:text-amber-950">
      <div className="flex-1 text-center text-sm font-medium">{message}</div>
      <button
        onClick={() => setDismissed(true)}
        aria-label={t('closeNotice')}
        className="shrink-0 rounded p-0.5 transition-colors hover:bg-amber-500 dark:hover:bg-amber-600"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

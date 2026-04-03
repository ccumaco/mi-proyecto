'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

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

export function TrialBanner({ trialEndsAt }: TrialBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const daysRemaining = getDaysRemaining(trialEndsAt);

  const message =
    daysRemaining === 0
      ? 'Tu período de prueba vence hoy.'
      : `Tu período de prueba vence en ${daysRemaining} ${daysRemaining === 1 ? 'día' : 'días'}.`;

  return (
    <div className="flex items-center justify-between gap-4 bg-amber-400 px-4 py-2.5 text-amber-950 dark:bg-amber-500 dark:text-amber-950">
      <div className="flex-1 text-center text-sm font-medium">{message}</div>
      <button
        onClick={() => setDismissed(true)}
        aria-label="Cerrar aviso"
        className="flex-shrink-0 rounded p-0.5 transition-colors hover:bg-amber-500 dark:hover:bg-amber-600"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

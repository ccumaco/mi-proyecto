'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api';
import { faEnvelope, faUnlockKeyhole, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function RecoveryPage() {
  const t = useTranslations('recovery');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleRecovery = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await apiClient.forgotPassword(email);
      setSuccess(result.message);
    } catch (err: any) {
      setError(err?.message ?? t('unexpectedError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
    <div className="w-full space-y-6">
      {/* Icon & Header */}
      <div className="text-center space-y-2">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <FontAwesomeIcon icon={faUnlockKeyhole} className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          {t('title')}
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {t('subtitle')}
        </p>
      </div>

      <form onSubmit={handleRecovery} className="space-y-4">
        <Input
          label={t('emailLabel')}
          type="email"
          placeholder={t('emailPlaceholder')}
          leftIcon={faEnvelope}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          required
        />

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-500 dark:bg-red-900/20">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-lg bg-green-50 p-3 text-sm font-medium text-green-600 dark:bg-green-900/20">
            {success}
          </div>
        )}

        <Button
          type="submit"
          className="w-full py-6 text-base"
          isLoading={loading}
        >
          {t('sendButton')}
        </Button>
      </form>

      <div className="text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="h-3 w-3" />
          {t('backToLogin')}
        </Link>
      </div>
    </div>
      </div>
    </div>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const LOCALES = [
  { code: 'es', label: 'ES' },
  { code: 'en', label: 'EN' },
  { code: 'pt', label: 'PT' },
];

function getCookieLocale(): string {
  const match = document.cookie.match(/(?:^|;\s*)locale=([^;]+)/);
  return match ? match[1] : 'es';
}

export function LanguageSwitcher() {
  const router = useRouter();
  const [active, setActive] = useState('es');

  useEffect(() => {
    setActive(getCookieLocale());
  }, []);

  const setLocale = (locale: string) => {
    document.cookie = `locale=${locale}; path=/; max-age=31536000`;
    setActive(locale);
    window.location.reload();
  };

  return (
    <div className="flex items-center rounded-lg bg-[#f0f2f4] p-0.5 dark:bg-zinc-800">
      {LOCALES.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => setLocale(code)}
          className={`rounded-md px-2 py-1 text-xs font-medium transition-colors ${
            active === code
              ? 'bg-white text-zinc-800 shadow-sm dark:bg-zinc-700 dark:text-white'
              : 'text-[#617589] hover:text-zinc-800 dark:hover:text-zinc-300'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

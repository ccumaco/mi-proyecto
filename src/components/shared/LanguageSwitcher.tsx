'use client';

import { useEffect, useState } from 'react';

const LOCALES = [
  { code: 'es', label: 'ES' },
  { code: 'en', label: 'EN' },
  { code: 'pt', label: 'PT' },
];

function getCookieLocale(): string {
  if (typeof document === 'undefined') return 'es';
  const match = document.cookie.match(/(?:^|;\s*)locale=([^;]+)/);
  return match ? match[1] : 'es';
}

export function LanguageSwitcher() {
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
    <div className="flex items-center rounded-xl bg-slate-100 dark:bg-white/5 p-1 border border-slate-200 dark:border-white/10">
      {LOCALES.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => setLocale(code)}
          className={`rounded-lg px-3 py-1.5 text-[10px] font-black tracking-widest transition-all duration-300 ${
            active === code
              ? 'bg-white dark:bg-emerald-green text-navy dark:text-white shadow-md'
              : 'text-slate-gray hover:text-navy dark:hover:text-white'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

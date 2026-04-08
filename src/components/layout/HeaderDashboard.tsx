'use client';
import {
  faSearch,
  faBell,
  faBars,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useRef, useEffect } from 'react';
import { ThemeToggle } from '../shared/ThemeToggle';
import { LanguageSwitcher } from '../shared/LanguageSwitcher';
import type { User } from '@/lib/api';
import { useTranslations } from 'next-intl';

export const HeaderDashboard = ({
  user,
  onMenuToggle,
}: {
  user: User | null;
  onMenuToggle?: () => void;
}) => {
  const t = useTranslations('layout.header');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-[#dbe0e6] bg-white px-4 transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-900 md:px-6 lg:px-8">
      {/* Izquierda: botón hamburguesa (mobile) + buscador */}
      <div className="flex flex-1 items-center gap-3">
        {/* Hamburguesa — solo visible en mobile */}
        <button
          onClick={onMenuToggle}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#617589] transition-colors hover:bg-[#f0f2f4] dark:hover:bg-zinc-800 lg:hidden"
          aria-label={t('openMenu')}
        >
          <FontAwesomeIcon icon={faBars} className="h-5 w-5" />
        </button>

        {/* Buscador — oculto en mobile muy pequeño */}
        <div className="relative hidden w-full max-w-xl sm:block">
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute top-1/2 left-3 -translate-y-1/2 text-[#617589]"
          />
          <input
            className="w-full rounded-lg border-none bg-[#f0f2f4] py-2 pr-4 pl-10 text-sm transition-all placeholder:text-[#617589] focus:bg-white focus:ring-2 focus:ring-blue-500/30 dark:bg-zinc-800 dark:text-white dark:focus:bg-zinc-700"
            placeholder={t('searchPlaceholder')}
            type="text"
          />
        </div>
      </div>

      {/* Derecha: acciones */}
      <div className="flex items-center gap-2 md:gap-3">
        <LanguageSwitcher />
        <ThemeToggle />

        <div className="h-6 w-px bg-[#dbe0e6] dark:bg-zinc-800" />

        {/* Notificaciones */}
        <div className="relative" ref={modalRef}>
          <button
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-[#617589] transition-colors hover:bg-[#f0f2f4] dark:hover:bg-zinc-800"
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            aria-label={t('notifications')}
          >
            <FontAwesomeIcon icon={faBell} className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full border-2 border-white bg-red-500 dark:border-zinc-900" />
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
              <div className="border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
                <h3 className="font-semibold text-zinc-800 dark:text-white">{t('notificationsTitle')}</h3>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800">
                <div className="px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800">
                  <p className="text-sm text-zinc-600 dark:text-zinc-300">
                    <span className="font-semibold">{t('newAssembly')}</span> {t('notification1')}
                  </p>
                  <p className="mt-0.5 text-xs text-zinc-400">{t('notification1Time')}</p>
                </div>
                <div className="px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800">
                  <p className="text-sm text-zinc-600 dark:text-zinc-300">
                    {t('notification2')}
                  </p>
                  <p className="mt-0.5 text-xs text-zinc-400">{t('notification2Time')}</p>
                </div>
                <div className="px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800">
                  <p className="text-sm text-zinc-600 dark:text-zinc-300">
                    {t('notification3')}
                  </p>
                  <p className="mt-0.5 text-xs text-zinc-400">{t('notification3Time')}</p>
                </div>
              </div>
              <div className="border-t border-zinc-100 p-2 text-center dark:border-zinc-800">
                <a href="#" className="text-sm text-blue-500 hover:underline">
                  {t('viewAllNotifications')}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

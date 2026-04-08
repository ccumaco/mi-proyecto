'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faRightFromBracket,
  faChevronDown,
} from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  logout,
  selectAuthStatus,
  selectIsAuthenticated,
  selectUser,
} from '@/lib/redux/slices/authSlice';
import { AppDispatch } from '@/lib/redux/store';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { useTranslations } from 'next-intl';

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const t = useTranslations('landing.nav');

  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const authStatus = useSelector(selectAuthStatus);

  const handleLogout = async () => {
    await dispatch(logout());
    setDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md dark:border-white/10 dark:bg-[#191919]/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-primary text-2xl font-bold">
            {t('brand')}
          </Link>
        </div>

        <nav className="hidden space-x-8 text-sm font-medium md:flex">
          <a href="#nosotros" className="hover:text-primary transition-colors">
            {t('whoWeAre')}
          </a>
          <a href="#servicios" className="hover:text-primary transition-colors">
            {t('services')}
          </a>
          <a
            href="#beneficios"
            className="hover:text-primary transition-colors"
          >
            {t('benefits')}
          </a>
          <a href="#contacto" className="hover:text-primary transition-colors">
            {t('contact')}
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          {authStatus === 'loading' ? (
            <div className="h-8 w-24 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
          ) : isAuthenticated && user ? (
            /* Usuario logueado */
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium transition-all hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:border-gray-600 dark:hover:bg-gray-800"
              >
                <div className="bg-primary/10 text-primary flex h-7 w-7 items-center justify-center rounded-full">
                  <FontAwesomeIcon icon={faUser} className="h-3.5 w-3.5" />
                </div>
                <span className="hidden max-w-32 truncate sm:block">
                  {user.email?.split('@')[0]}
                </span>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`h-3 w-3 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Dropdown menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-lg border border-gray-200 bg-white py-2 shadow-lg dark:border-gray-700 dark:bg-[#1a1a1a]">
                  <div className="border-b border-gray-100 px-4 py-2 dark:border-gray-700">
                    <p className="text-xs text-gray-500">{t('connectedAs')}</p>
                    <p className="truncate text-sm font-medium">{user.email}</p>
                  </div>
                  <Link
                    href="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="hover:bg-primary/5 flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
                  >
                    <FontAwesomeIcon icon={faUser} className="h-4 w-4" />
                    {t('myProfile')}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <FontAwesomeIcon
                      icon={faRightFromBracket}
                      className="h-4 w-4"
                    />
                    {t('logout')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Usuario no logueado */
            <>
              <Link href="/login">
                <button className="hover:text-primary cursor-pointer text-sm font-medium transition-colors">
                  {t('login')}
                </button>
              </Link>
              <button className="bg-primary rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-700">
                {t('requestInfo')}
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

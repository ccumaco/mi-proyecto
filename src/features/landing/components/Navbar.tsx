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
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher';
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
    <nav className="dark:bg-navy/60 fixed top-0 z-50 w-full border-b border-slate-200 bg-white/60 backdrop-blur-xl transition-all duration-300 dark:border-white/5">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-8 py-4">
        <div className="text-navy text-2xl font-black tracking-tighter dark:text-white">
          <Link href="/">
            PropAdmin <span className="text-emerald-green">PRO</span>
          </Link>
        </div>

        <div className="hidden items-center gap-8 md:flex">
          <a
            className="text-emerald-green border-emerald-green border-b-2 pb-1 text-sm font-bold tracking-wide"
            href="#services"
          >
            {t('services')}
          </a>
          <a
            className="text-slate-gray hover:text-navy text-sm font-bold tracking-wide transition-colors dark:hover:text-white"
            href="#pricing"
          >
            {t('benefits')}
          </a>
          <a
            className="text-slate-gray hover:text-navy text-sm font-bold tracking-wide transition-colors dark:hover:text-white"
            href="#footer"
          >
            {t('contact')}
          </a>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-3 lg:flex">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>

          <div className="mx-2 hidden h-8 w-px bg-slate-200 lg:block dark:bg-white/10"></div>

          {authStatus === 'loading' ? (
            <div className="h-10 w-10 animate-pulse rounded-full bg-slate-100 dark:bg-white/5" />
          ) : isAuthenticated && user ? (
            <div className="flex items-center gap-4">
              {/* Dashboard Access */}
              <Link
                href="/dashboard"
                className="bg-navy dark:text-navy hidden rounded-xl px-5 py-2.5 text-xs font-black tracking-widest text-white uppercase shadow-lg transition-all hover:opacity-90 sm:block dark:bg-white"
              >
                Dashboard
              </Link>

              {/* Minimal Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="bg-emerald-green flex h-10 w-10 items-center justify-center rounded-full text-xs font-black text-white shadow-lg shadow-emerald-500/20 transition-transform hover:scale-105"
                >
                  {user.email?.charAt(0).toUpperCase()}
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-64 rounded-2xl border border-slate-200 bg-white py-2 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-900">
                    <div className="border-b border-slate-100 px-4 py-3 dark:border-white/5">
                      <p className="text-emerald-green mb-1 text-[10px] font-black tracking-widest uppercase">
                        {t('connectedAs')}
                      </p>
                      <p className="truncate text-sm font-bold dark:text-white">
                        {user.email}
                      </p>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-bold transition-colors hover:bg-slate-50 dark:text-white dark:hover:bg-white/5"
                    >
                      <FontAwesomeIcon
                        icon={faUser}
                        className="text-emerald-green h-4 w-4"
                      />
                      {t('myProfile')}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 px-4 py-3 text-sm font-black text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"
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
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <Link
                href="/login"
                className="text-slate-gray hover:text-navy text-sm font-bold dark:hover:text-white"
              >
                {t('login')}
              </Link>
              <Link
                href="/register"
                className="bg-emerald-green hidden rounded-xl px-6 py-2.5 text-sm font-bold tracking-wide text-white shadow-lg shadow-emerald-500/20 transition-all hover:opacity-90 active:scale-95 sm:block"
              >
                {t('watchDemoButton')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

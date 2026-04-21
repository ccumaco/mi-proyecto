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
    <nav className="fixed top-0 w-full z-50 bg-white/60 dark:bg-navy/60 backdrop-blur-xl transition-all duration-300 border-b border-slate-200 dark:border-white/5">
      <div className="flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto">
        <div className="text-2xl font-black tracking-tighter text-navy dark:text-white">
          <Link href="/">
            PropAdmin <span className="text-emerald-green">PRO</span>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <a className="text-emerald-green font-bold border-b-2 border-emerald-green pb-1 text-sm tracking-wide" href="#services">
            {t('services')}
          </a>
          <a className="text-slate-gray hover:text-navy dark:hover:text-white transition-colors text-sm font-bold tracking-wide" href="#pricing">
            {t('benefits')}
          </a>
          <a className="text-slate-gray hover:text-navy dark:hover:text-white transition-colors text-sm font-bold tracking-wide" href="#footer">
            {t('contact')}
          </a>
        </div>

        <div className="flex items-center gap-6">
          <ThemeToggle />
          
          {authStatus === 'loading' ? (
            <div className="h-10 w-24 animate-pulse rounded-xl bg-slate-100 dark:bg-white/5" />
          ) : isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 rounded-xl bg-slate-50 dark:bg-white/5 px-4 py-2 text-sm font-bold transition-all hover:bg-slate-100 dark:hover:bg-white/10"
              >
                <span className="hidden max-w-32 truncate sm:block dark:text-white">
                  {user.email?.split('@')[0]}
                </span>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`h-3 w-3 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white py-2 shadow-xl dark:border-white/10 dark:bg-slate-900">
                  <div className="border-b border-slate-100 px-4 py-2 dark:border-white/5">
                    <p className="text-[10px] font-black text-emerald-green uppercase tracking-widest">{t('connectedAs')}</p>
                    <p className="truncate text-sm font-medium dark:text-white">{user.email}</p>
                  </div>
                  <Link
                    href="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-slate-50 dark:hover:bg-white/5 dark:text-white"
                  >
                    <FontAwesomeIcon icon={faUser} className="h-4 w-4 text-emerald-green" />
                    {t('myProfile')}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"
                  >
                    <FontAwesomeIcon icon={faRightFromBracket} className="h-4 w-4" />
                    {t('logout')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="text-slate-gray hover:text-navy dark:hover:text-white font-bold text-sm">
              {t('login')}
            </Link>
          )}

          <Link
            href="/register"
            className="hidden sm:block bg-emerald-green text-white font-bold px-6 py-2.5 rounded-xl hover:opacity-90 transition-all active:scale-95 text-sm tracking-wide shadow-lg shadow-emerald-500/20"
          >
            {t('requestInfo')}
          </Link>
        </div>
      </div>
    </nav>
  );
}

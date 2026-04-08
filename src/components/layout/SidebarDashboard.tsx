'use client';
import {
  faArrowRightFromBracket,
  faCampground,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/lib/redux/store';
import { logout, selectUserRole } from '@/lib/redux/slices/authSlice';
import type { User } from '@/lib/api';
import { MENU_ITEMS } from '@/config/menu-items';
import { useTranslations } from 'next-intl';

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:4000';

function getAvatarUrl(avatarUrl?: string): string | null {
  if (!avatarUrl) return null;
  if (avatarUrl.startsWith('http')) return avatarUrl;
  return `${BACKEND_URL}${avatarUrl}`;
}

function getInitials(name?: string, email?: string): string {
  const source = name || email || 'U';
  const parts = source.split(/[\s@]+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return source.slice(0, 2).toUpperCase();
}

interface SidebarProps {
  user: User | null;
  isOpen?: boolean;
  onClose?: () => void;
}

function SidebarContent({
  user,
  onClose,
}: {
  user: User | null;
  onClose?: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const currentRole = useSelector(selectUserRole);
  const t = useTranslations('layout.sidebar');

  const filteredNavItems = MENU_ITEMS.filter(item => item.roles.includes(currentRole));

  const handleLogout = async () => {
    await dispatch(logout());
    router.push('/login');
  };

  const inactiveLinkClasses =
    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-[#617589] transition-colors hover:bg-gray-100 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100';
  const activeLinkClasses =
    'bg-primary/10 text-primary flex items-center gap-3 rounded-lg px-3 py-2.5 dark:bg-primary/20';

  const src = getAvatarUrl(user?.avatarUrl);
  const initials = getInitials(user?.displayName || user?.fullName, user?.email);

  return (
    <div className="flex h-full flex-col justify-between p-6">
      <div className="flex flex-col gap-8">
        {/* Logo / Brand */}
        <div className="flex items-center gap-3">
          <div className="bg-primary rounded-lg p-2 text-white">
            <FontAwesomeIcon icon={faCampground} className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-base leading-tight font-bold text-[#111418] dark:text-white">
              {t('brandName')}
            </h1>
            <p className="text-xs font-normal text-[#617589]">{t('brandSubtitle')}</p>
          </div>
          {/* Botón cerrar — solo visible en mobile */}
          {onClose && (
            <button
              onClick={onClose}
              className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 lg:hidden"
              aria-label={t('closeMenu')}
            >
              <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col gap-1">
          {filteredNavItems.map(item => (
            <Link
              key={item.label}
              href={item.href}
              onClick={onClose}
              className={pathname === item.href ? activeLinkClasses : inactiveLinkClasses}
            >
              <FontAwesomeIcon icon={item.icon} className="h-5 w-5 shrink-0" />
              <span className="text-sm font-semibold">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Bottom User */}
      <div className="border-t border-[#dbe0e6] pt-6 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          {src ? (
            <img src={src} alt="Avatar" className="h-9 w-9 rounded-full object-cover shrink-0" />
          ) : (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-xs font-bold text-zinc-600 dark:bg-zinc-700 dark:text-zinc-200">
              {initials}
            </div>
          )}
          <div className="flex min-w-0 flex-col">
            <p className="truncate text-sm font-bold text-zinc-900 dark:text-white">
              {user?.displayName ||
                user?.email?.slice(0, user?.email?.indexOf('@') || 0) ||
                t('defaultUser')}
            </p>
            <p className="text-xs capitalize text-zinc-500 dark:text-zinc-400">{currentRole}</p>
          </div>
          <button
            className="ml-auto shrink-0 cursor-pointer text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            onClick={handleLogout}
            aria-label={t('logout')}
          >
            <FontAwesomeIcon icon={faArrowRightFromBracket} className="h-5 w-5 rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
}

export const SidebarDashboard = ({ user, isOpen = false, onClose }: SidebarProps) => {
  return (
    <>
      {/* Sidebar desktop — siempre visible en lg+ */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-[#dbe0e6] bg-white transition-colors duration-300 lg:flex dark:border-zinc-800 dark:bg-zinc-950">
        <SidebarContent user={user} />
      </aside>

      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer mobile */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 transform bg-white shadow-xl transition-transform duration-300 ease-in-out dark:bg-zinc-950 lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent user={user} onClose={onClose} />
      </aside>
    </>
  );
};

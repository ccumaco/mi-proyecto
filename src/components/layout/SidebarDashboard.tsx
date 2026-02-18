'use client';
import {
  faArrowRightFromBracket,
  faCampground,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/lib/redux/store';
import {
  logoutFromSupabase,
  selectUserRole,
} from '@/lib/redux/slices/authSlice';
import type { User } from '@supabase/supabase-js';
import { MENU_ITEMS } from '@/config/menu-items';

export const SidebarDashboard = ({ user }: { user: User | null }) => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const currentRole = useSelector(selectUserRole) as
    | 'user'
    | 'admin'
    | 'super-admin';

  // Filtrar items según el rol del usuario
  const filteredNavItems = MENU_ITEMS.filter(item =>
    item.roles.includes(currentRole)
  );

  const handleLogout = async () => {
    await dispatch(logoutFromSupabase());
    router.push('/login');
  };

  const inactiveLinkClasses =
    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-[#617589] transition-colors hover:bg-gray-100 dark:hover:bg-gray-800';
  const activeLinkClasses =
    'bg-primary/10 text-primary flex items-center gap-3 rounded-lg px-3 py-2.5';

  return (
    <aside className="dark:bg-background-dark top-0 hidden h-screen w-64 flex-col border-r border-[#dbe0e6] bg-white lg:flex dark:border-gray-800">
      <div className="flex h-full flex-col justify-between p-6">
        <div className="flex flex-col gap-8">
          {/* Logo / Brand */}
          <div className="flex items-center gap-3">
            <div className="bg-primary rounded-lg p-2 text-white">
              <FontAwesomeIcon icon={faCampground} className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-base leading-tight font-bold text-[#111418] dark:text-white">
                PropManagement
              </h1>
              <p className="text-xs font-normal text-[#617589]">
                Gestión Residencial
              </p>
            </div>
          </div>
          {/* Nav Links */}
          <nav className="flex flex-col gap-2">
            {filteredNavItems.map(item => (
              <Link
                key={item.label}
                href={item.href}
                className={
                  pathname === item.href
                    ? activeLinkClasses
                    : inactiveLinkClasses
                }
              >
                <FontAwesomeIcon icon={item.icon} className="h-5 w-5" />
                <span className="text-sm font-semibold">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
        {/* Bottom User Nav */}
        <div className="border-t border-[#dbe0e6] pt-6 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={faUser} className="h-9 w-9 text-[#617589]" />
            <div className="flex flex-col">
              <p className="text-sm font-bold dark:text-white">
                {user?.user_metadata?.full_name ||
                  user?.email?.slice(0, user?.email?.indexOf('@') || 0) ||
                  'Usuario'}
              </p>
              <p className="text-xs text-[#617589] capitalize">{currentRole}</p>
            </div>
            <button className="ml-auto text-[#617589]" onClick={handleLogout}>
              <FontAwesomeIcon
                icon={faArrowRightFromBracket}
                className="h-5 w-5 rotate-180"
              />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

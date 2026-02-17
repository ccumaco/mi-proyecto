import {
  faArrowRightFromBracket,
  faCampground,
  faCoins,
  faDashboard,
  faFileSignature,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/lib/redux/store';
import { logoutFromSupabase, selectUser } from '@/lib/redux/slices/authSlice';
import { useEffect, useState } from 'react';
import { createClientBrowser } from '@/lib/supabase';

export const SidebarDashboard = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const reduxUser = useSelector(selectUser);
  const [role, setRole] = useState<string | null>(null);
  const supabase = createClientBrowser();

  useEffect(() => {
    if (reduxUser) {
      const fetchRole = async () => {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', reduxUser.id)
          .single();
        if (error) {
          console.error('Error fetching profile:', error);
        } else {
          setRole(profile.role);
        }
      };
      fetchRole();
    }
  }, [reduxUser, supabase]);

  const handleLogout = async () => {
    await dispatch(logoutFromSupabase());
    router.push('/auth/login');
  };
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
                Gestión Residencial
              </h1>
              <p className="text-xs font-normal text-[#617589]">
                Admin Central
              </p>
            </div>
          </div>
          {/* Nav Links */}
          <nav className="flex flex-col gap-2">
            <a
              className="bg-primary/10 text-primary flex items-center gap-3 rounded-lg px-3 py-2.5"
              href="#"
            >
              <FontAwesomeIcon icon={faDashboard} className="h-5 w-5" />
              <span className="text-sm font-semibold">Inicio</span>
            </a>
            <Link
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[#617589] transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              href="/announcements"
            >
              <FontAwesomeIcon icon={faCampground} className="h-5 w-5" />
              <span className="text-sm font-medium">Comunicados</span>
            </Link>
            <a
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[#617589] transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              href="#"
            >
              <FontAwesomeIcon icon={faCoins} className="h-5 w-5" />
              <span className="text-sm font-medium">Pagos</span>
            </a>
            <a
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[#617589] transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              href="#"
            >
              <FontAwesomeIcon icon={faFileSignature} className="h-5 w-5" />
              <span className="text-sm font-medium">Documentos</span>
            </a>
          </nav>
        </div>
        {/* Bottom User Nav */}
        <div className="border-t border-[#dbe0e6] pt-6 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={faUser} className="h-9 w-9 text-[#617589]" />
            <div className="flex flex-col">
              <p className="text-sm font-bold dark:text-white">
                {reduxUser?.user_metadata?.full_name ||
                  reduxUser?.email?.slice(
                    0,
                    reduxUser?.email?.indexOf('@') || 0
                  ) ||
                  'Usuario'}
              </p>
              <p className="text-xs text-[#617589]">
                {role || 'Rol Desconocido'}
              </p>
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

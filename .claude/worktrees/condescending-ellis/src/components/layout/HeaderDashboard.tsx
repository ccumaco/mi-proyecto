'use client';
import {
  faCirclePlus,
  faSearch,
  faBell,
  faCog,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useRef, useEffect } from 'react';
import { ThemeToggle } from '../shared/ThemeToggle';
import type { User } from '@supabase/supabase-js';

export const HeaderDashboard = ({ user }: { user: User | null }) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="dark:bg-zinc-900 sticky top-0 z-10 flex h-16 items-center justify-between border-b border-[#dbe0e6] bg-white px-8 dark:border-zinc-800 transition-colors duration-300">
      <div className="flex max-w-xl flex-1 items-center gap-4">
        <div className="relative w-full">
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute top-1/2 left-3 -translate-y-1/2 text-[#617589]"
          />
          <input
            className="focus:ring-primary w-full rounded-lg border-none bg-[#f0f2f4] py-2 pr-4 pl-10 text-sm transition-all placeholder:text-[#617589] focus:bg-white focus:ring-2 dark:bg-zinc-800 dark:focus:bg-zinc-700 dark:text-white"
            placeholder="Buscar comunicados, pagos o documentos..."
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <div className="mx-2 h-6 w-[1px] bg-[#dbe0e6] dark:bg-zinc-800"></div>
        <button className="bg-primary hover:bg-primary/90 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors shrink-0">
          <FontAwesomeIcon icon={faCirclePlus} className="h-4 w-4" />
          <span className="hidden md:inline">Nueva Solicitud</span>
        </button>
        <div className="relative">
          <button
            className="relative cursor-pointer rounded-lg p-2 text-[#617589] hover:bg-[#f0f2f4] dark:hover:bg-gray-800"
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
          >
            <FontAwesomeIcon icon={faBell} className="h-5 w-5" />
            <span className="dark:border-background-dark absolute top-2 right-2 h-2 w-2 rounded-full border-2 border-white bg-red-500"></span>
          </button>
          {isNotificationsOpen && (
            <div
              ref={modalRef}
              className="absolute right-0 mt-2 w-80 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="border-b border-gray-200 p-4 dark:border-gray-700">
                <h3 className="font-semibold text-gray-800 dark:text-white">
                  Notificaciones
                </h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {/* Notification items */}
                <div className="border-b border-gray-200 p-4 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-bold">Nueva asamblea</span> programada
                    para el 25 de diciembre.
                  </p>
                  <p className="text-xs text-gray-400">hace 5 minutos</p>
                </div>
                <div className="border-b border-gray-200 p-4 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Recordatorio de pago de administración.
                  </p>
                  <p className="text-xs text-gray-400">hace 1 hora</p>
                </div>
                <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Mantenimiento de piscina programado.
                  </p>
                  <p className="text-xs text-gray-400">hace 3 horas</p>
                </div>
              </div>
              <div className="border-t border-gray-200 p-2 text-center dark:border-gray-700">
                <a href="#" className="text-sm text-blue-500 hover:underline">
                  Ver todas las notificaciones
                </a>
              </div>
            </div>
          )}
        </div>
        <button className="cursor-pointer rounded-lg p-2 text-[#617589] hover:bg-[#f0f2f4] dark:hover:bg-gray-800">
          <FontAwesomeIcon icon={faCog} className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
};

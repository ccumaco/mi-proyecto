'use client';
import { DashboardLayout } from '@/Layout/dashboardLayout';
import {
  faArrowLeft,
  faArrowRotateForward,
  faBriefcaseMedical,
  faChampagneGlasses,
  faGears,
  faLock,
  faUsers,
  faWrench,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { User } from '@supabase/supabase-js';
import { useState } from 'react';

export default function AnnouncementsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  return (
    <DashboardLayout user={user} role={role}>
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 space-y-6 overflow-y-auto p-6 lg:p-8">
          <div className="hide-scrollbar flex items-center gap-2 overflow-x-auto pb-2">
            <button className="bg-primary rounded-lg px-4 py-2 text-sm font-semibold whitespace-nowrap text-white shadow-sm">
              Todos
            </button>
            <button className="rounded-lg border border-[#dbe0e6] bg-white px-4 py-2 text-sm font-medium whitespace-nowrap text-[#617589] transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
              Mantenimiento
            </button>
            <button className="rounded-lg border border-[#dbe0e6] bg-white px-4 py-2 text-sm font-medium whitespace-nowrap text-[#617589] transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
              Eventos
            </button>
            <button className="rounded-lg border border-[#dbe0e6] bg-white px-4 py-2 text-sm font-medium whitespace-nowrap text-[#617589] transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
              Seguridad
            </button>
          </div>
          <div className="grid gap-6">
            <article className="dark:bg-background-dark flex flex-col gap-6 rounded-xl border border-[#dbe0e6] bg-white p-6 shadow-sm transition-shadow hover:shadow-md md:flex-row dark:border-gray-800">
              <div className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-900/30">
                <FontAwesomeIcon icon={faWrench} className="text-3xl" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="rounded bg-orange-100 px-2 py-0.5 text-[10px] font-bold tracking-wider text-orange-600 uppercase dark:bg-orange-900/30">
                      Mantenimiento
                    </span>
                    <h3 className="mt-1 text-xl font-bold">
                      Suspensión Programada de Agua
                    </h3>
                  </div>
                  <span className="text-xs text-[#617589]">24 Oct, 2023</span>
                </div>
                <p className="text-sm leading-relaxed text-[#617589]">
                  Estimados residentes, se informa que debido a trabajos de
                  reparación en la tubería matriz del edificio, el suministro de
                  agua será suspendido el próximo miércoles...
                </p>
                <div className="pt-2">
                  <button className="text-primary flex items-center gap-1 text-sm font-bold hover:underline">
                    Leer más
                    <FontAwesomeIcon icon={faArrowLeft} className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </article>
            <article className="dark:bg-background-dark flex flex-col gap-6 rounded-xl border border-[#dbe0e6] bg-white p-6 shadow-sm transition-shadow hover:shadow-md md:flex-row dark:border-gray-800">
              <div className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/30">
                <FontAwesomeIcon
                  icon={faChampagneGlasses}
                  className="text-3xl"
                />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold tracking-wider text-blue-600 uppercase dark:bg-blue-900/30">
                      Eventos
                    </span>
                    <h3 className="mt-1 text-xl font-bold">
                      Fiesta de Halloween en el Clubhouse
                    </h3>
                  </div>
                  <span className="text-xs text-[#617589]">20 Oct, 2023</span>
                </div>
                <p className="text-sm leading-relaxed text-[#617589]">
                  ¡Prepárate para una tarde llena de sorpresas! Invitamos a
                  todos los niños y adultos a nuestro concurso de disfraces
                  anual que se llevará a cabo en el área común...
                </p>
                <div className="pt-2">
                  <button className="text-primary flex items-center gap-1 text-sm font-bold hover:underline">
                    Leer más
                    <FontAwesomeIcon icon={faArrowLeft} className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </article>
            <article className="dark:bg-background-dark flex flex-col gap-6 rounded-xl border border-[#dbe0e6] bg-white p-6 shadow-sm transition-shadow hover:shadow-md md:flex-row dark:border-gray-800">
              <div className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-900/30">
                <FontAwesomeIcon icon={faLock} className="text-3xl" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="rounded bg-red-100 px-2 py-0.5 text-[10px] font-bold tracking-wider text-red-600 uppercase dark:bg-red-900/30">
                      Seguridad
                    </span>
                    <h3 className="mt-1 text-xl font-bold">
                      Actualización de Protocolos de Acceso
                    </h3>
                  </div>
                  <span className="text-xs text-[#617589]">18 Oct, 2023</span>
                </div>
                <p className="text-sm leading-relaxed text-[#617589]">
                  A partir del próximo mes, se implementará un nuevo sistema de
                  códigos QR para visitantes con el fin de mejorar la
                  trazabilidad y seguridad de nuestro conjunto...
                </p>
                <div className="pt-2">
                  <button className="text-primary flex items-center gap-1 text-sm font-bold hover:underline">
                    Leer más
                    <FontAwesomeIcon icon={faArrowLeft} className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </article>
          </div>
        </main>
        <aside className="dark:bg-background-dark sticky top-16 hidden h-[calc(100vh-4rem)] w-80 flex-col gap-8 overflow-y-auto border-l border-[#dbe0e6] bg-white p-6 xl:flex dark:border-gray-800">
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-sm font-bold tracking-wider text-[#617589] uppercase">
                Calendario de Eventos
              </h4>
              <button className="text-primary text-xs font-bold">
                Ver todo
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex size-12 flex-col items-center justify-center rounded-lg border border-[#dbe0e6] bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                  <span className="text-[10px] font-bold text-red-500 uppercase">
                    Oct
                  </span>
                  <span className="text-lg leading-none font-black">28</span>
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">
                    Asamblea Ordinaria
                  </p>
                  <p className="text-xs text-[#617589]">18:00 • Salón Social</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex size-12 flex-col items-center justify-center rounded-lg border border-[#dbe0e6] bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                  <span className="text-[10px] font-bold text-red-500 uppercase">
                    Oct
                  </span>
                  <span className="text-lg leading-none font-black">31</span>
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">Halloween Party</p>
                  <p className="text-xs text-[#617589]">
                    16:00 • Áreas Comunes
                  </p>
                </div>
              </div>
              <div className="flex gap-4 opacity-60">
                <div className="flex size-12 flex-col items-center justify-center rounded-lg border border-[#dbe0e6] bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                  <span className="text-[10px] font-bold text-red-500 uppercase">
                    Nov
                  </span>
                  <span className="text-lg leading-none font-black">05</span>
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">
                    Fumigación Torres
                  </p>
                  <p className="text-xs text-[#617589]">
                    08:00 • Todo el predio
                  </p>
                </div>
              </div>
            </div>
          </section>
          <hr className="border-[#dbe0e6] dark:border-gray-800" />
          <section>
            <h4 className="mb-4 text-sm font-bold tracking-wider text-[#617589] uppercase">
              Contactos de Emergencia
            </h4>
            <div className="space-y-3">
              <a
                className="flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 p-3 transition-colors hover:bg-red-100 dark:border-red-900/30 dark:bg-red-900/10"
                href="tel:911"
              >
                <div className="flex size-8 items-center justify-center rounded-full bg-red-500 text-white">
                  <FontAwesomeIcon
                    icon={faBriefcaseMedical}
                    className="h-4 w-4"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-red-700 dark:text-red-400">
                    Portería Principal
                  </p>
                  <p className="text-xs text-red-600/70">Ext. 101 / 102</p>
                </div>
              </a>
              <div className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#dbe0e6] p-3 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
                <div className="flex size-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30">
                  <FontAwesomeIcon icon={faUsers} className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold">Cuadrante Policía</p>
                  <p className="text-xs text-[#617589]">300 123 4567</p>
                </div>
              </div>
              <div className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#dbe0e6] p-3 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
                <div className="flex size-8 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30">
                  <FontAwesomeIcon icon={faGears} className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold">Servicios Técnicos</p>
                  <p className="text-xs text-[#617589]">Mantenimiento 24h</p>
                </div>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </DashboardLayout>
  );
}

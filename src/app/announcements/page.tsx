'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/Layout/dashboardLayout';
import {
  faArrowLeft,
  faBriefcaseMedical,
  faChampagneGlasses,
  faGears,
  faLock,
  faUsers,
  faWrench,
  IconDefinition, // Import IconDefinition type
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface Announcement {
  id: string;
  title: string;
  category: string;
  date: string;
  content: string;
  icon: IconDefinition;
  iconBgColor: string;
  iconTextColor: string;
  categoryBgColor: string;
  categoryTextColor: string;
}

const dummyAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'Suspensión Programada de Agua',
    category: 'Mantenimiento',
    date: '24 Oct, 2023',
    content: 'Estimados residentes, se informa que debido a trabajos de reparación en la tubería matriz del edificio, el suministro de agua será suspendido el próximo miércoles...',
    icon: faWrench,
    iconBgColor: 'bg-orange-100',
    iconTextColor: 'text-orange-600',
    categoryBgColor: 'bg-orange-100',
    categoryTextColor: 'text-orange-600',
  },
  {
    id: '2',
    title: 'Fiesta de Halloween en el Clubhouse',
    category: 'Eventos',
    date: '20 Oct, 2023',
    content: '¡Prepárate para una tarde llena de sorpresas! Invitamos a todos los niños y adultos a nuestro concurso de disfraces anual que se llevará a cabo en el área común...',
    icon: faChampagneGlasses,
    iconBgColor: 'bg-blue-100',
    iconTextColor: 'text-blue-600',
    categoryBgColor: 'bg-blue-100',
    categoryTextColor: 'text-blue-600',
  },
  {
    id: '3',
    title: 'Actualización de Protocolos de Acceso',
    category: 'Seguridad',
    date: '18 Oct, 2023',
    content: 'A partir del próximo mes, se implementará un nuevo sistema de códigos QR para visitantes con el fin de mejorar la trazabilidad y seguridad de nuestro conjunto...',
    icon: faLock,
    iconBgColor: 'bg-red-100',
    iconTextColor: 'text-red-600',
    categoryBgColor: 'bg-red-100',
    categoryTextColor: 'text-red-600',
  },
  // Add more dummy data if needed
];

export default function AnnouncementsPage() {
  const [activeTab, setActiveTab] = useState('Todos');

  const categories = ['Todos', ...new Set(dummyAnnouncements.map((ann) => ann.category))];

  const filteredAnnouncements =
    activeTab === 'Todos'
      ? dummyAnnouncements
      : dummyAnnouncements.filter((ann) => ann.category === activeTab);

  // Existing styles for tabs
  const activeTabClasses = 'bg-primary rounded-lg px-4 py-2 text-sm font-semibold whitespace-nowrap text-white shadow-sm';
  const inactiveTabClasses = 'rounded-lg border border-[#dbe0e6] bg-white px-4 py-2 text-sm font-medium whitespace-nowrap text-[#617589] transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700';


  return (
    <DashboardLayout>
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 space-y-6 overflow-y-auto p-6 lg:p-8">
          <div className="hide-scrollbar flex items-center gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveTab(category)}
                className={activeTab === category ? activeTabClasses : inactiveTabClasses}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="grid gap-6">
            {filteredAnnouncements.length > 0 ? (
              filteredAnnouncements.map((announcement) => (
                <article
                  key={announcement.id}
                  className="dark:bg-background-dark flex flex-col gap-6 rounded-xl border border-[#dbe0e6] bg-white p-6 shadow-sm transition-shadow hover:shadow-md md:flex-row dark:border-gray-800"
                >
                  <div className={`flex size-16 shrink-0 items-center justify-center rounded-xl ${announcement.iconBgColor} ${announcement.iconTextColor} dark:${announcement.iconBgColor.replace('bg-', 'bg-')}/30`}>
                    <FontAwesomeIcon icon={announcement.icon} className="text-3xl" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className={`rounded ${announcement.categoryBgColor} px-2 py-0.5 text-[10px] font-bold tracking-wider ${announcement.categoryTextColor} uppercase dark:${announcement.categoryBgColor.replace('bg-', 'bg-')}/30`}>
                          {announcement.category}
                        </span>
                        <h3 className="mt-1 text-xl font-bold">
                          {announcement.title}
                        </h3>
                      </div>
                      <span className="text-xs text-[#617589]">{announcement.date}</span>
                    </div>
                    <p className="text-sm leading-relaxed text-[#617589]">
                      {announcement.content}
                    </p>
                    <div className="pt-2">
                      <button className="text-primary flex items-center gap-1 text-sm font-bold hover:underline">
                        Leer más
                        <FontAwesomeIcon icon={faArrowLeft} className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400">No hay comunicados para esta categoría.</p>
            )}
          </div>
        </main>
        {/* The aside content remains unchanged */}
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

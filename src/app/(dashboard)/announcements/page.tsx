'use client';

import { useState } from 'react';
import {
  faArrowRight,
  faBriefcaseMedical,
  faChampagneGlasses,
  faGears,
  faLock,
  faUsers,
  faWrench,
  faCalendarAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface Announcement {
  id: string;
  title: string;
  category: string;
  date: string;
  content: string;
  icon: any;
  color: 'orange' | 'blue' | 'red' | 'green' | 'purple';
}

const ANNOUNCEMENTS: Announcement[] = [
  {
    id: '1',
    title: 'Suspensión Programada de Agua',
    category: 'Mantenimiento',
    date: '24 Oct, 2023',
    content: 'Estimados residentes, se informa que debido a trabajos de reparación en la tubería matriz del edificio, el suministro de agua será suspendido el próximo miércoles...',
    icon: faWrench,
    color: 'orange',
  },
  {
    id: '2',
    title: 'Fiesta de Halloween en el Clubhouse',
    category: 'Eventos',
    date: '20 Oct, 2023',
    content: '¡Prepárate para una tarde llena de sorpresas! Invitamos a todos los niños y adultos a nuestro concurso de disfraces anual que se llevará a cabo en el área común...',
    icon: faChampagneGlasses,
    color: 'blue',
  },
  {
    id: '3',
    title: 'Actualización de Protocolos de Acceso',
    category: 'Seguridad',
    date: '18 Oct, 2023',
    content: 'A partir del próximo mes, se implementará un nuevo sistema de códigos QR para visitantes con el fin de mejorar la trazabilidad y seguridad de nuestro conjunto...',
    icon: faLock,
    color: 'red',
  },
];

const CATEGORIES = ['Todos', 'Mantenimiento', 'Eventos', 'Seguridad', 'Finanzas'];

export default function AnnouncementsPage() {
  const [activeTab, setActiveTab] = useState('Todos');

  const filteredAnnouncements = activeTab === 'Todos'
    ? ANNOUNCEMENTS
    : ANNOUNCEMENTS.filter(ann => ann.category === activeTab);

  const colorMap = {
    orange: 'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-950/20 dark:border-orange-900/30',
    blue: 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-950/20 dark:border-blue-900/30',
    red: 'bg-red-50 text-red-600 border-red-100 dark:bg-red-950/20 dark:border-red-900/30',
    green: 'bg-green-50 text-green-600 border-green-100 dark:bg-green-950/20 dark:border-green-900/30',
    purple: 'bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-950/20 dark:border-purple-900/30',
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full">
      {/* Main Content */}
      <main className="flex-1 space-y-6">
        <header className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Anuncios y Comunicados</h1>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map(category => (
              <Button
                key={category}
                variant={activeTab === category ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setActiveTab(category)}
                className="whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>
        </header>

        <div className="grid gap-4">
          {filteredAnnouncements.map((ann) => (
            <Card key={ann.id} isHoverable className="flex flex-col md:flex-row gap-6">
              <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border ${colorMap[ann.color]}`}>
                <FontAwesomeIcon icon={ann.icon} className="text-2xl" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border ${colorMap[ann.color]}`}>
                      {ann.category}
                    </span>
                    <CardTitle className="text-xl">{ann.title}</CardTitle>
                  </div>
                  <span className="text-xs text-zinc-500 font-medium">{ann.date}</span>
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {ann.content}
                </p>
                <div className="pt-2">
                  <button className="text-primary text-sm font-bold flex items-center gap-1 hover:underline group">
                    Leer más completo
                    <FontAwesomeIcon icon={faArrowRight} className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>

      {/* Sidebar Info */}
      <aside className="w-full lg:w-80 space-y-8">
        <Card padding="md">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Próximos Eventos</h3>
            <Button variant="ghost" size="sm" className="text-primary">Ver todo</Button>
          </div>
          <div className="space-y-4">
            <EventItem day="28" month="OCT" title="Asamblea Ordinaria" time="18:00 • Salón Social" />
            <EventItem day="31" month="OCT" title="Halloween Party" time="16:00 • Áreas Comunes" />
            <EventItem day="05" month="NOV" title="Fumigación Torres" time="08:00 • Todo el predio" isPast />
          </div>
        </Card>

        <Card padding="md">
          <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-6">Contactos de Emergencia</h3>
          <div className="space-y-3">
            <EmergencyContact 
              icon={faBriefcaseMedical} 
              title="Portería Principal" 
              subtitle="Ext. 101 / 102" 
              variant="danger" 
              href="tel:101"
            />
            <EmergencyContact 
              icon={faUsers} 
              title="Cuadrante Policía" 
              subtitle="300 123 4567" 
            />
            <EmergencyContact 
              icon={faGears} 
              title="Mantenimiento 24h" 
              subtitle="Servicios Técnicos" 
            />
          </div>
        </Card>
      </aside>
    </div>
  );
}

function EventItem({ day, month, title, time, isPast = false }: { day: string, month: string, title: string, time: string, isPast?: boolean }) {
  return (
    <div className={`flex gap-4 ${isPast ? 'opacity-50' : ''}`}>
      <div className="flex h-12 w-12 flex-col items-center justify-center rounded-xl border border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
        <span className="text-[10px] font-bold text-red-500 uppercase">{month}</span>
        <span className="text-lg font-black text-zinc-900 dark:text-white leading-none">{day}</span>
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-zinc-900 dark:text-white">{title}</p>
        <p className="text-xs text-zinc-500">{time}</p>
      </div>
    </div>
  );
}

function EmergencyContact({ icon, title, subtitle, variant = 'default', href }: { icon: any, title: string, subtitle: string, variant?: 'default' | 'danger', href?: string }) {
  const styles = variant === 'danger' 
    ? 'border-red-100 bg-red-50 text-red-600 dark:border-red-900/30 dark:bg-red-900/10'
    : 'border-zinc-100 bg-white hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/50';

  const content = (
    <div className={`flex items-center gap-3 rounded-xl border p-3 transition-colors ${styles}`}>
      <div className={`flex h-8 w-8 items-center justify-center rounded-full ${variant === 'danger' ? 'bg-red-500 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'}`}>
        <FontAwesomeIcon icon={icon} className="h-4 w-4" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold">{title}</p>
        <p className="text-xs opacity-70">{subtitle}</p>
      </div>
    </div>
  );

  return href ? <a href={href}>{content}</a> : <div className="cursor-pointer">{content}</div>;
}

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
import { CardSkeleton } from '@/components/ui/CardSkeleton';
import { useAnnouncements } from '@/features/announcements/hooks/useAnnouncements';
import { useTranslations } from 'next-intl';
// comment tests
const CATEGORIES = [
  'Todos',
  'GENERAL',
  'MAINTENANCE',
  'EVENT',
  'SECURITY',
  'FINANCE',
];

const getCategoryIcon = (type: string) => {
  switch (type) {
    case 'MAINTENANCE':
      return faWrench;
    case 'EVENT':
      return faChampagneGlasses;
    case 'SECURITY':
      return faLock;
    case 'FINANCE':
      return faUsers;
    default:
      return faGears;
  }
};

const getCategoryColor = (type: string) => {
  switch (type) {
    case 'MAINTENANCE':
      return 'orange';
    case 'EVENT':
      return 'blue';
    case 'SECURITY':
      return 'red';
    case 'FINANCE':
      return 'green';
    default:
      return 'purple';
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export default function AnnouncementsPage() {
  const t = useTranslations('announcements');
  const { announcements, loading, error } = useAnnouncements();
  const [activeTab, setActiveTab] = useState('Todos');

  const filteredAnnouncements =
    activeTab === 'Todos'
      ? announcements
      : announcements.filter(ann => ann.type === activeTab);

  const colorMap = {
    orange:
      'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-950/20 dark:border-orange-900/30',
    blue: 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-950/20 dark:border-blue-900/30',
    red: 'bg-red-50 text-red-600 border-red-100 dark:bg-red-950/20 dark:border-red-900/30',
    green:
      'bg-green-50 text-green-600 border-green-100 dark:bg-green-950/20 dark:border-green-900/30',
    purple:
      'bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-950/20 dark:border-purple-900/30',
  };

  if (loading) {
    return (
      <div className="flex h-full flex-col gap-8 lg:flex-row">
        <main className="flex-1 space-y-6">
          <div className="h-8 w-64 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-700" />
          <div className="grid gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-red-500">{t('loadingError', { error: error ?? '' })}</p>
          <Button onClick={() => window.location.reload()}>{t('retryButton')}</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-8 lg:flex-row">
      {/* Main Content */}
      <main className="flex-1 space-y-6">
        <header className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            {t('title')}
          </h1>
          <div className="scrollbar-hide flex items-center gap-2 overflow-x-auto pb-2">
            {CATEGORIES.map(category => (
              <Button
                key={category}
                variant={activeTab === category ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setActiveTab(category)}
                className="whitespace-nowrap"
              >
                {category === 'Todos' ? category : category.replace('_', ' ')}
              </Button>
            ))}
          </div>
        </header>

        <div className="grid gap-4">
          {filteredAnnouncements.map(ann => {
            const color = getCategoryColor(ann.type);
            const icon = getCategoryIcon(ann.type);

            return (
              <Card
                key={ann.id}
                isHoverable
                className="flex flex-col gap-6 md:flex-row"
              >
                <div
                  className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border ${colorMap[color as keyof typeof colorMap]}`}
                >
                  <FontAwesomeIcon icon={icon} className="text-2xl" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <span
                        className={`inline-block rounded border px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase ${colorMap[color as keyof typeof colorMap]}`}
                      >
                        {ann.type.replace('_', ' ')}
                      </span>
                      <CardTitle className="text-xl">{ann.title}</CardTitle>
                    </div>
                    <span className="text-xs font-medium text-zinc-500">
                      {formatDate(ann.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {ann.content.length > 200
                      ? `${ann.content.substring(0, 200)}...`
                      : ann.content}
                  </p>
                  <div className="pt-2">
                    <button className="text-primary group flex items-center gap-1 text-sm font-bold hover:underline">
                      {t('readMore')}
                      <FontAwesomeIcon
                        icon={faArrowRight}
                        className="h-3 w-3 transition-transform group-hover:translate-x-1"
                      />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {filteredAnnouncements.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-zinc-500">{t('noAnnouncements')}</p>
          </div>
        )}
      </main>

      {/* Sidebar Info */}
      <aside className="w-full space-y-8 lg:w-80">
        <Card padding="md">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-sm font-bold tracking-wider text-zinc-500 uppercase">
              {t('upcomingEvents')}
            </h3>
            <Button variant="ghost" size="sm" className="text-primary">
              {t('viewAll')}
            </Button>
          </div>
          <div className="space-y-4">
            <EventItem
              day="28"
              month="OCT"
              title="Asamblea Ordinaria"
              time="18:00 • Salón Social"
            />
            <EventItem
              day="31"
              month="OCT"
              title="Halloween Party"
              time="16:00 • Áreas Comunes"
            />
            <EventItem
              day="05"
              month="NOV"
              title="Fumigación Torres"
              time="08:00 • Todo el predio"
              isPast
            />
          </div>
        </Card>

        <Card padding="md">
          <h3 className="mb-6 text-sm font-bold tracking-wider text-zinc-500 uppercase">
            {t('emergencyContacts')}
          </h3>
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

function EventItem({
  day,
  month,
  title,
  time,
  isPast = false,
}: {
  day: string;
  month: string;
  title: string;
  time: string;
  isPast?: boolean;
}) {
  return (
    <div className={`flex gap-4 ${isPast ? 'opacity-50' : ''}`}>
      <div className="flex h-12 w-12 flex-col items-center justify-center rounded-xl border border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
        <span className="text-[10px] font-bold text-red-500 uppercase">
          {month}
        </span>
        <span className="text-lg leading-none font-black text-zinc-900 dark:text-white">
          {day}
        </span>
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-zinc-900 dark:text-white">
          {title}
        </p>
        <p className="text-xs text-zinc-500">{time}</p>
      </div>
    </div>
  );
}

function EmergencyContact({
  icon,
  title,
  subtitle,
  variant = 'default',
  href,
}: {
  icon: any;
  title: string;
  subtitle: string;
  variant?: 'default' | 'danger';
  href?: string;
}) {
  const styles =
    variant === 'danger'
      ? 'border-red-100 bg-red-50 text-red-600 dark:border-red-900/30 dark:bg-red-900/10'
      : 'border-zinc-100 bg-white hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/50';

  const content = (
    <div
      className={`flex items-center gap-3 rounded-xl border p-3 transition-colors ${styles}`}
    >
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full ${variant === 'danger' ? 'bg-red-500 text-white' : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800'}`}
      >
        <FontAwesomeIcon icon={icon} className="h-4 w-4" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold">{title}</p>
        <p className="text-xs opacity-70">{subtitle}</p>
      </div>
    </div>
  );

  return href ? (
    <a href={href}>{content}</a>
  ) : (
    <div className="cursor-pointer">{content}</div>
  );
}

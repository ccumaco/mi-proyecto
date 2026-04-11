'use client';

import { useSelector } from 'react-redux';
import { selectUser } from '@/lib/redux/slices/authSlice';
import { Card, CardTitle } from '@/components/ui/Card';
import {
  faUsers,
  faBuilding,
  faWallet,
  faChartLine,
  faBell,
  faBullhorn,
  faUpload,
  faUserPlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@/components/ui/Button';
import { useTranslations } from 'next-intl';

export default function AdminPage() {
  const t = useTranslations('dashboard');
  const user = useSelector(selectUser);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
          {t('pageTitle')}
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          {t('welcomePrefix')}{' '}
          {user?.displayName ||
            user?.email?.split('@')[0] ||
            t('defaultAdminName')}
          . {t('welcomeSuffix')}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={faUsers}
          label={t('statResidents')}
          value="124"
          trend={t('statResidentsTrend')}
        />
        <StatCard
          icon={faBuilding}
          label={t('statUnits')}
          value="48"
          trend={t('statUnitsTrend')}
        />
        <StatCard
          icon={faWallet}
          label={t('statCollection')}
          value="$12.4M"
          trend={t('statCollectionTrend')}
          color="green"
        />
        <StatCard
          icon={faChartLine}
          label={t('statExpenses')}
          value="$4.2M"
          trend={t('statExpensesTrend')}
          color="red"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <CardTitle>{t('recentActivity')}</CardTitle>
            <Button variant="ghost" size="sm">
              {t('viewAll')}
            </Button>
          </div>
          <div className="space-y-4">
            <ActivityItem
              icon={faWallet}
              title={t('activity1Title')}
              time={t('activity1Time')}
              desc={t('activity1Desc')}
            />
            <ActivityItem
              icon={faBell}
              title={t('activity2Title')}
              time={t('activity2Time')}
              desc={t('activity2Desc')}
              color="orange"
            />
            <ActivityItem
              icon={faUsers}
              title={t('activity3Title')}
              time={t('activity3Time')}
              desc={t('activity3Desc')}
              color="blue"
            />
          </div>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardTitle className="mb-5">{t('quickActions')}</CardTitle>
          <div className="flex flex-col gap-3">
            {/* Invitar Residente — acción primaria */}
            <button
              type="button"
              className="bg-primary flex w-full items-center gap-4 rounded-xl px-4 py-4 text-left transition hover:opacity-90"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/20">
                <FontAwesomeIcon icon={faUserPlus} className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{t('inviteResident')}</p>
                <p className="text-xs text-white/70">{t('inviteResidentDescription')}</p>
              </div>
            </button>

            {/* Nuevo Comunicado */}
            <ActionCard
              icon={faBullhorn}
              title={t('createAnnouncement')}
              description={t('createAnnouncementDescription')}
            />

            {/* Subir Documento */}
            <ActionCard
              icon={faUpload}
              title={t('uploadDocument')}
              description={t('uploadDocumentDescription')}
            />

            {/* Próximas Tareas */}
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-bold text-zinc-900 dark:text-white">
                  {t('upcomingTasks')}
                </p>
                <FontAwesomeIcon
                  icon={faChartLine}
                  className="h-4 w-4 text-zinc-400"
                />
              </div>
              <div className="space-y-3">
                <TaskItem
                  title={t('taskElevator')}
                  status={t('taskTomorrowTime')}
                  color="blue"
                />
                <TaskItem
                  title={t('taskAssembly')}
                  status={t('taskAssemblyTime')}
                  color="orange"
                />
                <TaskItem
                  title={t('taskLawn')}
                  status={t('taskCompleted')}
                  completed
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  trend,
  color = 'primary',
}: {
  icon: any;
  label: string;
  value: string;
  trend: string;
  color?: string;
}) {
  const colorMap: any = {
    primary: 'bg-primary/10 text-primary',
    green: 'bg-green-100 text-green-600 dark:bg-green-950/30',
    red: 'bg-red-100 text-red-600 dark:bg-red-950/30',
    orange: 'bg-orange-100 text-orange-600 dark:bg-orange-950/30',
  };

  return (
    <Card padding="sm" className="flex items-center gap-4">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-xl ${colorMap[color] || colorMap.primary}`}
      >
        <FontAwesomeIcon icon={icon} className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs font-bold tracking-wider text-zinc-500 uppercase">
          {label}
        </p>
        <p className="text-xl font-black text-zinc-900 dark:text-white">
          {value}
        </p>
        <p className="mt-0.5 text-[10px] text-zinc-400">{trend}</p>
      </div>
    </Card>
  );
}

function ActivityItem({
  icon,
  title,
  time,
  desc,
  color = 'green',
}: {
  icon: any;
  title: string;
  time: string;
  desc: string;
  color?: string;
}) {
  const colorMap: any = {
    green: 'text-green-500',
    orange: 'text-orange-500',
    blue: 'text-blue-500',
  };

  return (
    <div className="flex gap-4 rounded-xl p-3 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
      <div className={`mt-1 ${colorMap[color]}`}>
        <FontAwesomeIcon icon={icon} className="h-4 w-4" />
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-zinc-900 dark:text-white">
            {title}
          </p>
          <span className="text-xs text-zinc-400">{time}</span>
        </div>
        <p className="line-clamp-1 text-xs text-zinc-500">{desc}</p>
      </div>
    </div>
  );
}

function ActionCard({
  icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      className="flex w-full items-center gap-4 rounded-xl border border-zinc-200 bg-white px-4 py-4 text-left transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
        <FontAwesomeIcon icon={icon} className="h-4 w-4" />
      </div>
      <div>
        <p className="text-sm font-bold text-zinc-900 dark:text-white">{title}</p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{description}</p>
      </div>
    </button>
  );
}

function TaskItem({
  title,
  status,
  color = 'blue',
  completed = false,
}: {
  title: string;
  status: string;
  color?: 'blue' | 'orange';
  completed?: boolean;
}) {
  const colorMap: any = {
    blue: 'bg-blue-500',
    orange: 'bg-orange-500',
  };

  return (
    <div
      className={`flex items-center justify-between rounded-3xl px-4 py-3 ${
        completed
          ? 'bg-zinc-100 text-zinc-400 dark:bg-zinc-950/50 dark:text-zinc-500'
          : 'bg-white dark:bg-zinc-900'
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`h-2.5 w-2.5 rounded-full ${
            completed ? 'bg-zinc-400' : colorMap[color]
          }`}
        />
        <p className={`text-sm font-medium ${completed ? 'line-through' : ''}`}>
          {title}
        </p>
      </div>
      <span className="text-xs text-zinc-500 dark:text-zinc-400">{status}</span>
    </div>
  );
}

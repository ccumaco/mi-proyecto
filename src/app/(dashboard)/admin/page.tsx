'use client';

import { useSelector } from 'react-redux';
import { selectUser, selectUserRole } from '@/lib/redux/slices/authSlice';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import {
  faUsers,
  faBuilding,
  faWallet,
  faChartLine,
  faBell,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@/components/ui/Button';
import { useTranslations } from 'next-intl';

export default function AdminPage() {
  const t = useTranslations('dashboard');
  const user = useSelector(selectUser);
  const role = useSelector(selectUserRole);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
          {t('pageTitle')}
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          {t('welcomePrefix')}{' '}
          {user?.displayName || user?.email?.split('@')[0] || t('defaultAdminName')}.{' '}
          {t('welcomeSuffix')}
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
          <CardTitle className="mb-6">{t('quickActions')}</CardTitle>
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start gap-3"
              size="lg"
            >
              <FontAwesomeIcon icon={faBell} /> {t('createAnnouncement')}
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-3"
              size="lg"
            >
              <FontAwesomeIcon icon={faWallet} /> {t('generateReceipts')}
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-3"
              size="lg"
            >
              <FontAwesomeIcon icon={faUsers} /> {t('registerResident')}
            </Button>
            <Button variant="primary" className="mt-4 w-full" size="lg">
              {t('downloadReport')}
            </Button>
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

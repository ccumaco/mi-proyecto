'use client';

import { useSelector } from 'react-redux';
import { selectUser } from '@/lib/redux/slices/authSlice';
import { Card, CardTitle } from '@/components/ui/Card';
import {
  faShieldAlt,
  faBuilding,
  faUsers,
  faCog,
  faServer,
  faHistory,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@/components/ui/Button';
import { useTranslations } from 'next-intl';

export default function SuperAdminPage() {
  const user = useSelector(selectUser);
  const t = useTranslations('superAdmin');

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-xl">
            <FontAwesomeIcon icon={faShieldAlt} className="h-5 w-5" />
          </div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            {t('title')}
          </h1>
        </div>
        <p className="text-zinc-500 dark:text-zinc-400">{t('subtitle')}</p>
      </div>

      {/* Global Stats Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <GlobalStatCard
          icon={faBuilding}
          label={t('statComplexes')}
          value="24"
          color="blue"
        />
        <GlobalStatCard
          icon={faUsers}
          label={t('statUsers')}
          value="1,840"
          color="purple"
        />
        <GlobalStatCard
          icon={faServer}
          label={t('statApiStatus')}
          value="99.9%"
          color="green"
        />
        <GlobalStatCard
          icon={faHistory}
          label={t('statLogsToday')}
          value="2.4k"
          color="orange"
        />
      </div>

      {/* Management Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Managed Complexes */}
        <Card className="lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <CardTitle>{t('registeredComplexesTitle')}</CardTitle>
            <Button variant="primary" size="sm">
              {t('addComplexButton')}
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-500 dark:text-zinc-400">
              <thead className="bg-zinc-50 text-xs text-zinc-700 uppercase dark:bg-zinc-800 dark:text-zinc-400">
                <tr>
                  <th className="px-6 py-3">{t('tableHeaderName')}</th>
                  <th className="px-6 py-3">{t('tableHeaderUnits')}</th>
                  <th className="px-6 py-3">{t('tableHeaderAdmin')}</th>
                  <th className="px-6 py-3">{t('tableHeaderStatus')}</th>
                  <th className="px-6 py-3">{t('tableHeaderAction')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                <ComplexRow
                  name="Residencial Los Sauces"
                  units="48"
                  admin="Juan Pérez"
                  status="Activo"
                  editLabel={t('editButton')}
                />
                <ComplexRow
                  name="Torres del Bosque"
                  units="120"
                  admin="María García"
                  status="Activo"
                  editLabel={t('editButton')}
                />
                <ComplexRow
                  name="Condominio El Prado"
                  units="24"
                  admin="Sin Asignar"
                  status="Pendiente"
                  isAlert
                  editLabel={t('editButton')}
                />
              </tbody>
            </table>
          </div>
        </Card>

        {/* System Settings Quick Access */}
        <Card>
          <CardTitle className="mb-6">{t('systemSecurityTitle')}</CardTitle>
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start gap-3"
              size="lg"
            >
              <FontAwesomeIcon icon={faCog} /> {t('globalSettingsButton')}
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-3"
              size="lg"
            >
              <FontAwesomeIcon icon={faShieldAlt} /> {t('accessAuditButton')}
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-3"
              size="lg"
            >
              <FontAwesomeIcon icon={faShieldAlt} /> {t('accessAuditButton')}
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-3"
              size="lg"
            >
              <FontAwesomeIcon icon={faUsers} /> {t('roleManagerButton')}
            </Button>
            <Button variant="danger" className="mt-4 w-full" size="lg">
              {t('maintenanceButton')}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function GlobalStatCard({
  icon,
  label,
  value,
  color = 'primary',
}: {
  icon: any;
  label: string;
  value: string;
  color?: string;
}) {
  const colorMap: any = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-950/30',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-950/30',
    green: 'bg-green-100 text-green-600 dark:bg-green-950/30',
    orange: 'bg-orange-100 text-orange-600 dark:bg-orange-950/30',
  };

  return (
    <Card padding="sm" className="flex items-center gap-4">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-xl ${colorMap[color]}`}
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
      </div>
    </Card>
  );
}

function ComplexRow({
  name,
  units,
  admin,
  status,
  isAlert = false,
  editLabel,
}: {
  name: string;
  units: string;
  admin: string;
  status: string;
  isAlert?: boolean;
  editLabel: string;
}) {
  return (
    <tr className="border-b bg-white transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/30">
      <td className="px-6 py-4 font-bold text-zinc-900 dark:text-white">
        {name}
      </td>
      <td className="px-6 py-4">{units}</td>
      <td className="px-6 py-4">{admin}</td>
      <td className="px-6 py-4">
        <span
          className={`rounded px-2 py-1 text-[10px] font-bold uppercase ${isAlert ? 'bg-orange-100 text-orange-600 dark:bg-orange-950/30' : 'bg-green-100 text-green-600 dark:bg-green-950/30'}`}
        >
          {status}
        </span>
      </td>
      <td className="px-6 py-4">
        <Button variant="ghost" size="sm" className="text-primary p-0">
          {editLabel}
        </Button>
      </td>
    </tr>
  );
}

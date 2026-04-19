'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  faUsers, 
  faSearch, 
  faUserShield,
  faEllipsisV,
  faCalendarCheck
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslations } from 'next-intl';

export default function GlobalUsersPage() {
  const t = useTranslations('superAdmin');
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">{t('users.title')}</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{t('users.description')}</p>
      </div>

      {/* Stats Mini */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MiniStat label={t('users.statSuperAdmins')} value="4" icon={faUserShield} color="blue" />
        <MiniStat label={t('users.statAdmins')} value="28" icon={faUsers} color="purple" />
        <MiniStat label={t('users.statNewMonth')} value="+5" icon={faCalendarCheck} color="green" />
      </div>

      {/* Main Card with Table */}
      <Card padding="none">
        <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-80">
            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 h-3.5 w-3.5" />
            <input 
              type="text" 
              placeholder={t('users.searchPlaceholder')}
              className="w-full pl-9 pr-4 py-2 bg-zinc-50 dark:bg-zinc-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm">{t('users.exportButton')}</Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 bg-zinc-50 dark:bg-zinc-800/50">
              <tr>
                <th className="px-6 py-4">{t('users.tableUser')}</th>
                <th className="px-6 py-4">{t('users.tableRole')}</th>
                <th className="px-6 py-4">{t('users.tableComplex')}</th>
                <th className="px-6 py-4">{t('users.tableStatus')}</th>
                <th className="px-6 py-4 text-right">{t('users.tableActions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              <UserRow 
                name="Juan Pérez" 
                email="juan@admin.com" 
                role="ADMIN" 
                complex="Residencial Los Sauces" 
                status="Activo" 
              />
              <UserRow 
                name="Soporte Técnico" 
                email="soporte@plataforma.com" 
                role="SUPER_ADMIN" 
                complex="Plataforma Global" 
                status="Activo" 
              />
              <UserRow 
                name="María García" 
                email="m.garcia@torres.com" 
                role="ADMIN" 
                complex="Torres del Bosque" 
                status="Activo" 
              />
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function MiniStat({ label, value, icon, color }: any) {
  const colors: any = {
    blue: 'bg-blue-50 text-blue-500 dark:bg-blue-950/20',
    purple: 'bg-purple-50 text-purple-500 dark:bg-purple-950/20',
    green: 'bg-green-50 text-green-500 dark:bg-green-950/20',
  };

  return (
    <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 flex items-center gap-4">
      <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${colors[color]}`}>
        <FontAwesomeIcon icon={icon} />
      </div>
      <div>
        <p className="text-xs text-zinc-500 font-medium">{label}</p>
        <p className="text-lg font-bold text-zinc-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
}

function UserRow({ name, email, role, complex, status }: any) {
  return (
    <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
            {name.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-zinc-900 dark:text-white">{name}</p>
            <p className="text-xs text-zinc-500">{email}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${role === 'SUPER_ADMIN' ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'}`}>
          {role}
        </span>
      </td>
      <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">{complex}</td>
      <td className="px-6 py-4">
        <span className="flex items-center gap-1.5 text-green-600 font-bold text-xs uppercase">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
          {status}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <button className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
          <FontAwesomeIcon icon={faEllipsisV} />
        </button>
      </td>
    </tr>
  );
}

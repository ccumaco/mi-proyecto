'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  faBuilding, 
  faSearch, 
  faPlus, 
  faFilter,
  faEllipsisV,
  faMapMarkerAlt
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslations } from 'next-intl';

export default function ComplexesManagementPage() {
  const t = useTranslations('superAdmin');
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">{t('complexes.title')}</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{t('complexes.description')}</p>
        </div>
        <Button className="gap-2">
          <FontAwesomeIcon icon={faPlus} />
          {t('addComplexButton')}
        </Button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <div className="relative w-full sm:w-96">
          <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 h-4 w-4" />
          <input 
            type="text" 
            placeholder={t('complexes.searchPlaceholder')}
            className="w-full pl-10 pr-4 py-2 bg-zinc-50 dark:bg-zinc-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="gap-2 flex-1 sm:flex-none">
            <FontAwesomeIcon icon={faFilter} /> {t('complexes.filterButton')}
          </Button>
        </div>
      </div>

      {/* Grid de Conjuntos */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <ComplexCard 
          name="Residencial Los Sauces" 
          location="Bogotá, Colombia" 
          units={48} 
          admin="Juan Pérez" 
          status="Activo"
          plan="Premium"
          t={t}
        />
        <ComplexCard 
          name="Torres del Bosque" 
          location="Medellín, Colombia" 
          units={120} 
          admin="María García" 
          status="Activo"
          plan="Standard"
          t={t}
        />
        <ComplexCard 
          name="Condominio El Prado" 
          location="Cali, Colombia" 
          units={24} 
          admin="Pendiente" 
          status="Pendiente"
          plan="Prueba"
          t={t}
        />
      </div>
    </div>
  );
}

function ComplexCard({ name, location, units, admin, status, plan, t }: any) {
  const statusColors: any = {
    'Activo': 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400',
    'Pendiente': 'bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400',
  };

  return (
    <Card className="hover:border-primary/50 transition-colors group">
      <div className="flex justify-between items-start mb-4">
        <div className="h-12 w-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500">
          <FontAwesomeIcon icon={faBuilding} className="h-6 w-6" />
        </div>
        <button className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
          <FontAwesomeIcon icon={faEllipsisV} />
        </button>
      </div>

      <h3 className="font-bold text-lg text-zinc-900 dark:text-white mb-1">{name}</h3>
      <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-sm mb-4">
        <FontAwesomeIcon icon={faMapMarkerAlt} className="h-3 w-3" />
        {location}
      </div>

      <div className="grid grid-cols-2 gap-4 py-4 border-y border-zinc-100 dark:border-zinc-800 mb-4">
        <div>
          <p className="text-[10px] uppercase font-bold text-zinc-400 mb-1">{t('complexes.cardUnits')}</p>
          <p className="text-sm font-bold text-zinc-700 dark:text-zinc-200">{units}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase font-bold text-zinc-400 mb-1">{t('complexes.cardPlan')}</p>
          <p className="text-sm font-bold text-zinc-700 dark:text-zinc-200">{plan}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-xs font-bold">
            {admin.charAt(0)}
          </div>
          <div className="text-xs">
            <p className="font-bold text-zinc-700 dark:text-zinc-200">{admin}</p>
            <p className="text-zinc-400">{t('complexes.cardAdmin')}</p>
          </div>
        </div>
        <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${statusColors[status] || ''}`}>
          {status}
        </span>
      </div>
    </Card>
  );
}

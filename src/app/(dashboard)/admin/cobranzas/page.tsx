'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  faFileInvoiceDollar,
  faDownload,
  faFilter,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslations } from 'next-intl';

export default function CollectionsPage() {
  const t = useTranslations('admin.cobranzas');
  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            {t('title')}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {t('subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <FontAwesomeIcon icon={faFilter} className="mr-2" /> {t('filterButton')}
          </Button>
          <Button variant="primary" size="lg">
            <FontAwesomeIcon icon={faDownload} className="mr-2" /> {t('exportButton')}
          </Button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <SummaryCard
          title={t('totalCollected')}
          value="$12,500"
          description="Mes de Octubre 2023"
          variant="green"
        />
        <SummaryCard
          title={t('delinquentPortfolio')}
          value="$1,250"
          description="1.4% vs. mes pasado"
          variant="red"
        />
        <SummaryCard
          title={t('pendingPayments')}
          value="24"
          description="Solicitudes por revisar"
          variant="orange"
        />
      </div>

      <Card>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
            {t('paymentListTitle')}
          </h2>
          <Button variant="outline" size="sm">
            {t('viewAll')}
          </Button>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-left text-sm text-zinc-600 dark:text-zinc-300">
            <thead className="border-b border-zinc-200 text-xs tracking-wider uppercase dark:border-zinc-700">
              <tr>
                <th className="px-4 py-3">{t('tableHeaderResident')}</th>
                <th className="px-4 py-3">{t('tableHeaderConcept')}</th>
                <th className="px-4 py-3">{t('tableHeaderAmount')}</th>
                <th className="px-4 py-3">{t('tableHeaderDate')}</th>
                <th className="px-4 py-3">{t('tableHeaderStatus')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              <PaymentRow
                name="Andrea Morales"
                unit="Torre A - 402"
                concept="Expensas Octubre"
                amount="$450.00"
                status="Pagado"
              />
              <PaymentRow
                name="Lucía Vargas"
                unit="Torre B - 201"
                concept="Expensas Octubre"
                amount="$450.00"
                status="Pendiente"
              />
              <PaymentRow
                name="Carlos Pineda"
                unit="Torre A - 502"
                concept="Cuota Extra"
                amount="$120.00"
                status="Mora"
              />
              <PaymentRow
                name="Jorge Ruiz"
                unit="Torre C - 105"
                concept="Reserva Gimnasio"
                amount="$15.00"
                status="Pagado"
              />
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  description,
  variant,
}: {
  title: string;
  value: string;
  description: string;
  variant: 'green' | 'red' | 'orange';
}) {
  const colors: any = {
    green: {
      bg: 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-300',
    },
    red: {
      bg: 'bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-300',
    },
    orange: {
      bg: 'bg-orange-100 text-orange-700 dark:bg-orange-950/30 dark:text-orange-300',
    },
  };

  return (
    <Card className="p-6" padding="lg">
      <div className={`${colors[variant].bg} rounded-xl p-4`}>
        <p className="text-sm font-bold text-zinc-800 dark:text-white">
          {title}
        </p>
        <p className="mt-3 text-3xl font-black text-zinc-900 dark:text-white">
          {value}
        </p>
        <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
          {description}
        </p>
      </div>
    </Card>
  );
}

function PaymentRow({
  name,
  unit,
  concept,
  amount,
  status,
}: {
  name: string;
  unit: string;
  concept: string;
  amount: string;
  status: string;
}) {
  const statusColors: any = {
    Pagado: 'text-green-600 dark:text-green-300',
    Pendiente: 'text-amber-600 dark:text-amber-300',
    Mora: 'text-red-600 dark:text-red-300',
  };

  return (
    <tr>
      <td className="px-4 py-3">
        <div className="font-semibold text-zinc-900 dark:text-white">
          {name}
        </div>
        <div className="text-xs text-zinc-500 dark:text-zinc-400">{unit}</div>
      </td>
      <td className="px-4 py-3">{concept}</td>
      <td className="px-4 py-3">{amount}</td>
      <td className="px-4 py-3">{new Date().toLocaleDateString('es-ES')}</td>
      <td className={`px-4 py-3 font-semibold ${statusColors[status] || ''}`}>
        {status}
      </td>
    </tr>
  );
}

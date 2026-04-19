'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  faCreditCard, 
  faArrowUp,
  faCheckCircle,
  faExclamationCircle,
  faDownload,
  faHistory
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslations } from 'next-intl';

export default function PlatformSubscriptionsPage() {
  const t = useTranslations('superAdmin.subscriptions');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">{t('title')}</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{t('description')}</p>
        </div>
        <Button variant="outline" className="gap-2">
          <FontAwesomeIcon icon={faDownload} /> {t('reportButton')}
        </Button>
      </div>

      {/* Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <RevenueCard label={t('statMRR')} value="$8,450.00" trend="+12%" icon={faArrowUp} color="green" />
        <RevenueCard label={t('statPending')} value="$1,200.00" trend={t('statPendingCount', { count: 4 })} icon={faExclamationCircle} color="amber" />
        <RevenueCard label={t('statARR')} value="$94,200.00" trend="+5.4%" icon={faArrowUp} color="blue" />
      </div>

      {/* Recent Payments List */}
      <Card padding="none">
        <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-3">
          <FontAwesomeIcon icon={faHistory} className="text-zinc-400" />
          <h3 className="font-bold text-zinc-900 dark:text-white">{t('historyTitle')}</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[11px] font-bold uppercase text-zinc-400 bg-zinc-50 dark:bg-zinc-800/50">
              <tr>
                <th className="px-6 py-4">{t('tableComplex')}</th>
                <th className="px-6 py-4">{t('tablePlan')}</th>
                <th className="px-6 py-4">{t('tableDate')}</th>
                <th className="px-6 py-4">{t('tableAmount')}</th>
                <th className="px-6 py-4">{t('tableStatus')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              <PaymentRow complex="Residencial Los Sauces" plan="Premium" date="15 Abr, 2024" amount="$350.00" status={t('statusCompleted')} />
              <PaymentRow complex="Torres del Bosque" plan="Standard" date="14 Abr, 2024" amount="$150.00" status={t('statusCompleted')} />
              <PaymentRow complex="Condominio El Prado" plan="Prueba" date="12 Abr, 2024" amount="$0.00" status={t('statusPending')} isWarning />
              <PaymentRow complex="Altos de la Sierra" plan="Premium" date="10 Abr, 2024" amount="$350.00" status={t('statusCompleted')} />
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function RevenueCard({ label, value, trend, icon, color }: any) {
  const colors: any = {
    green: 'text-green-500 bg-green-50 dark:bg-green-950/20',
    amber: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20',
    blue: 'text-blue-500 bg-blue-50 dark:bg-blue-950/20',
  };

  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800">
      <p className="text-sm font-medium text-zinc-500 mb-1">{label}</p>
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-black text-zinc-900 dark:text-white leading-none">{value}</h2>
          <div className="mt-2 flex items-center gap-1.5">
            <span className={`flex items-center justify-center h-5 w-5 rounded-full ${colors[color]}`}>
              <FontAwesomeIcon icon={icon} className="h-2.5 w-2.5" />
            </span>
            <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">{trend}</span>
          </div>
        </div>
        <div className="h-10 w-10 bg-zinc-50 dark:bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-400">
          <FontAwesomeIcon icon={faCreditCard} />
        </div>
      </div>
    </div>
  );
}

function PaymentRow({ complex, plan, date, amount, status, isWarning = false }: any) {
  return (
    <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
      <td className="px-6 py-4 font-bold text-zinc-900 dark:text-white">{complex}</td>
      <td className="px-6 py-4 text-zinc-500">{plan}</td>
      <td className="px-6 py-4 text-zinc-400">{date}</td>
      <td className="px-6 py-4 font-bold text-zinc-900 dark:text-white">{amount}</td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${isWarning ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/30' : 'bg-green-100 text-green-700 dark:bg-green-950/30'}`}>
          <FontAwesomeIcon icon={isWarning ? faExclamationCircle : faCheckCircle} />
          {status}
        </span>
      </td>
    </tr>
  );
}

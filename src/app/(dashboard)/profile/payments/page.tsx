'use client';

import { 
  faWallet, 
  faDownload, 
  faCreditCard, 
  faHistory,
  faCircleCheck,
  faClock,
  faExclamationCircle,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface Transaction {
  id: string;
  concept: string;
  date: string;
  amount: string;
  status: 'paid' | 'pending' | 'overdue';
  method?: string;
}

const TRANSACTIONS: Transaction[] = [
  { id: '1', concept: 'Administración Octubre 2023', date: '01 Oct, 2023', amount: '$240,000', status: 'paid', method: 'PSE / Visa' },
  { id: '2', concept: 'Administración Septiembre 2023', date: '01 Sep, 2023', amount: '$240,000', status: 'paid', method: 'Transferencia' },
  { id: '3', concept: 'Multa Convivencia (Ruidos)', date: '15 Ago, 2023', amount: '$120,000', status: 'paid', method: 'PSE / Mastercard' },
  { id: '4', concept: 'Administración Agosto 2023', date: '01 Ago, 2023', amount: '$240,000', status: 'paid', method: 'Transferencia' },
];

export default function PaymentsPage() {
  const t = useTranslations('payments');
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link href="/profile" className="text-primary text-sm font-bold flex items-center gap-2 hover:underline mb-2">
            <FontAwesomeIcon icon={faArrowLeft} className="h-3 w-3" />
            {t('backLink')}
          </Link>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">{t('title')}</h1>
          <p className="text-zinc-500 dark:text-zinc-400">{t('subtitle')}</p>
        </div>
        <Button size="lg" className="shadow-lg shadow-primary/20">
          <FontAwesomeIcon icon={faCreditCard} className="mr-2 h-4 w-4" />
          {t('payCurrentQuota')}
        </Button>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-green-500" padding="lg">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 dark:bg-green-950/30 text-green-600 p-3 rounded-xl">
              <FontAwesomeIcon icon={faWallet} className="h-6 w-6" />
            </div>
            <Badge variant="success">{t('upToDate')}</Badge>
          </div>
          <p className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-1">{t('pendingBalance')}</p>
          <p className="text-4xl font-black text-zinc-900 dark:text-white">$0.00</p>
        </Card>

        <Card padding="lg">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-primary/10 text-primary p-3 rounded-xl">
              <FontAwesomeIcon icon={faClock} className="h-6 w-6" />
            </div>
          </div>
          <p className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-1">{t('nextDueDate')}</p>
          <p className="text-2xl font-black text-zinc-900 dark:text-white">01 Nov, 2023</p>
          <p className="text-sm text-zinc-500 mt-1">{t('estimatedValue')}</p>
        </Card>

        <Card padding="lg">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 p-3 rounded-xl">
              <FontAwesomeIcon icon={faHistory} className="h-6 w-6" />
            </div>
          </div>
          <p className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-1">{t('lastPayment')}</p>
          <p className="text-2xl font-black text-zinc-900 dark:text-white">$240,000</p>
          <p className="text-sm text-zinc-500 mt-1 italic">{t('lastPaymentDate')}</p>
        </Card>
      </div>

      {/* Transactions History */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <CardTitle>{t('transactionsTitle')}</CardTitle>
            <CardDescription>{t('transactionsSubtitle')}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <FontAwesomeIcon icon={faDownload} className="mr-2 h-3.5 w-3.5" />
              {t('downloadStatement')}
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto -mx-6">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-zinc-500 uppercase bg-zinc-50 dark:bg-zinc-800/50 border-y border-zinc-100 dark:border-zinc-800">
              <tr>
                <th className="px-6 py-4 font-bold">{t('tableHeaderConcept')}</th>
                <th className="px-6 py-4 font-bold text-center">{t('tableHeaderDate')}</th>
                <th className="px-6 py-4 font-bold text-center">{t('tableHeaderStatus')}</th>
                <th className="px-6 py-4 font-bold text-right">{t('tableHeaderAmount')}</th>
                <th className="px-6 py-4 font-bold text-center">{t('tableHeaderActions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {TRANSACTIONS.map((tx) => (
                <tr key={tx.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors group">
                  <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-white">
                    <div className="flex flex-col">
                      <span>{tx.concept}</span>
                      <span className="text-[10px] text-zinc-500 font-normal uppercase">{tx.method}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-zinc-500 dark:text-zinc-400">
                    {tx.date}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <StatusBadge status={tx.status} t={t} />
                  </td>
                  <td className="px-6 py-4 text-right font-black text-zinc-900 dark:text-white">
                    {tx.amount}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="text-primary hover:scale-110 transition-transform p-2">
                      <FontAwesomeIcon icon={faDownload} className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Methods and Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card padding="md">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <FontAwesomeIcon icon={faCircleCheck} className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-zinc-900 dark:text-white">{t('securePaymentTitle')}</h4>
              <p className="text-xs text-zinc-500">{t('securePaymentDesc')}</p>
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-orange-100 text-orange-600">
              <FontAwesomeIcon icon={faExclamationCircle} className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-zinc-900 dark:text-white">{t('reminderTitle')}</h4>
              <p className="text-xs text-zinc-500">{t('reminderDesc')}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function StatusBadge({ status, t }: { status: Transaction['status']; t: (key: string) => string }) {
  const configs = {
    paid: { variant: 'success' as const, label: t('statusPaid'), icon: faCircleCheck },
    pending: { variant: 'warning' as const, label: t('statusPending'), icon: faClock },
    overdue: { variant: 'danger' as const, label: t('statusOverdue'), icon: faExclamationCircle },
  };

  const { variant, label, icon } = configs[status];

  return (
    <Badge variant={variant} className="gap-1.5 flex justify-center items-center">
      <FontAwesomeIcon icon={icon} className="h-2.5 w-2.5" />
      {label}
    </Badge>
  );
}

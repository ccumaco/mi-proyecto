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
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link href="/profile" className="text-primary text-sm font-bold flex items-center gap-2 hover:underline mb-2">
            <FontAwesomeIcon icon={faArrowLeft} className="h-3 w-3" />
            Volver a mi resumen
          </Link>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Pagos y Finanzas</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Gestiona tus cuotas de administración y servicios adicionales.</p>
        </div>
        <Button size="lg" className="shadow-lg shadow-primary/20">
          <FontAwesomeIcon icon={faCreditCard} className="mr-2 h-4 w-4" />
          Pagar Cuota Actual
        </Button>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-green-500" padding="lg">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 dark:bg-green-950/30 text-green-600 p-3 rounded-xl">
              <FontAwesomeIcon icon={faWallet} className="h-6 w-6" />
            </div>
            <Badge variant="success">Al Día</Badge>
          </div>
          <p className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-1">Saldo Pendiente</p>
          <p className="text-4xl font-black text-zinc-900 dark:text-white">$0.00</p>
        </Card>

        <Card padding="lg">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-primary/10 text-primary p-3 rounded-xl">
              <FontAwesomeIcon icon={faClock} className="h-6 w-6" />
            </div>
          </div>
          <p className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-1">Próximo Vencimiento</p>
          <p className="text-2xl font-black text-zinc-900 dark:text-white">01 Nov, 2023</p>
          <p className="text-sm text-zinc-500 mt-1">Valor estimado: $240,000</p>
        </Card>

        <Card padding="lg">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 p-3 rounded-xl">
              <FontAwesomeIcon icon={faHistory} className="h-6 w-6" />
            </div>
          </div>
          <p className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-1">Último Pago</p>
          <p className="text-2xl font-black text-zinc-900 dark:text-white">$240,000</p>
          <p className="text-sm text-zinc-500 mt-1 italic">Realizado el 02 Oct, 2023</p>
        </Card>
      </div>

      {/* Transactions History */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <CardTitle>Historial de Transacciones</CardTitle>
            <CardDescription>Registro detallado de tus pagos y cargos realizados.</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <FontAwesomeIcon icon={faDownload} className="mr-2 h-3.5 w-3.5" />
              Estado de Cuenta (PDF)
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto -mx-6">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-zinc-500 uppercase bg-zinc-50 dark:bg-zinc-800/50 border-y border-zinc-100 dark:border-zinc-800">
              <tr>
                <th className="px-6 py-4 font-bold">Concepto</th>
                <th className="px-6 py-4 font-bold text-center">Fecha</th>
                <th className="px-6 py-4 font-bold text-center">Estado</th>
                <th className="px-6 py-4 font-bold text-right">Monto</th>
                <th className="px-6 py-4 font-bold text-center">Acciones</th>
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
                    <StatusBadge status={tx.status} />
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
              <h4 className="font-bold text-zinc-900 dark:text-white">Pago Seguro</h4>
              <p className="text-xs text-zinc-500">Aceptamos tarjetas de crédito, PSE y transferencias.</p>
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-orange-100 text-orange-600">
              <FontAwesomeIcon icon={faExclamationCircle} className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-zinc-900 dark:text-white">Recordatorio</h4>
              <p className="text-xs text-zinc-500">Los pagos realizados después del 10 se consideran extemporáneos.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Transaction['status'] }) {
  const configs = {
    paid: { variant: 'success' as const, label: 'Pagado', icon: faCircleCheck },
    pending: { variant: 'warning' as const, label: 'Pendiente', icon: faClock },
    overdue: { variant: 'danger' as const, label: 'Vencido', icon: faExclamationCircle },
  };

  const { variant, label, icon } = configs[status];

  return (
    <Badge variant={variant} className="gap-1.5 flex justify-center items-center">
      <FontAwesomeIcon icon={icon} className="h-2.5 w-2.5" />
      {label}
    </Badge>
  );
}

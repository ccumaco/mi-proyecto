'use client';

import { useSelector } from 'react-redux';
import { selectUser, selectUserRole } from '@/lib/redux/slices/authSlice';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { 
  faUsers, 
  faBuilding, 
  faWallet, 
  faChartLine,
  faBell
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@/components/ui/Button';

export default function AdminPage() {
  const user = useSelector(selectUser);
  const role = useSelector(selectUserRole);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
          Panel de Administración
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Bienvenido, {user?.user_metadata?.full_name || 'Administrador'}. Gestiona tu comunidad de forma eficiente.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={faUsers} label="Total Residentes" value="124" trend="+3 este mes" />
        <StatCard icon={faBuilding} label="Unidades" value="48" trend="98% Ocupación" />
        <StatCard icon={faWallet} label="Recaudación" value="$12.4M" trend="85% del total" color="green" />
        <StatCard icon={faChartLine} label="Gastos" value="$4.2M" trend="-5% vs mes anterior" color="red" />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <CardTitle>Actividad Reciente</CardTitle>
            <Button variant="ghost" size="sm">Ver todo</Button>
          </div>
          <div className="space-y-4">
            <ActivityItem 
              icon={faWallet} 
              title="Pago recibido - Unidad 402" 
              time="Hace 15 min" 
              desc="El residente Juan Pérez ha pagado la cuota de administración." 
            />
            <ActivityItem 
              icon={faBell} 
              title="Nueva Solicitud de PQRS" 
              time="Hace 1 hora" 
              desc="Reparación de luminaria en el pasillo del piso 3." 
              color="orange"
            />
            <ActivityItem 
              icon={faUsers} 
              title="Nuevo Residente Registrado" 
              time="Ayer, 4:30 PM" 
              desc="Se ha completado el registro de María García en la Torre A." 
              color="blue"
            />
          </div>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardTitle className="mb-6">Acciones Rápidas</CardTitle>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start gap-3" size="lg">
              <FontAwesomeIcon icon={faBell} /> Crear Comunicado
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3" size="lg">
              <FontAwesomeIcon icon={faWallet} /> Generar Recibos
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3" size="lg">
              <FontAwesomeIcon icon={faUsers} /> Registrar Residente
            </Button>
            <Button variant="primary" className="w-full mt-4" size="lg">
              Descargar Reporte Mensual
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, trend, color = 'primary' }: { icon: any, label: string, value: string, trend: string, color?: string }) {
  const colorMap: any = {
    primary: 'bg-primary/10 text-primary',
    green: 'bg-green-100 text-green-600 dark:bg-green-950/30',
    red: 'bg-red-100 text-red-600 dark:bg-red-950/30',
    orange: 'bg-orange-100 text-orange-600 dark:bg-orange-950/30',
  };

  return (
    <Card padding="sm" className="flex items-center gap-4">
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colorMap[color] || colorMap.primary}`}>
        <FontAwesomeIcon icon={icon} className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{label}</p>
        <p className="text-xl font-black text-zinc-900 dark:text-white">{value}</p>
        <p className="text-[10px] text-zinc-400 mt-0.5">{trend}</p>
      </div>
    </Card>
  );
}

function ActivityItem({ icon, title, time, desc, color = 'green' }: { icon: any, title: string, time: string, desc: string, color?: string }) {
  const colorMap: any = {
    green: 'text-green-500',
    orange: 'text-orange-500',
    blue: 'text-blue-500',
  };

  return (
    <div className="flex gap-4 p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
      <div className={`mt-1 ${colorMap[color]}`}>
        <FontAwesomeIcon icon={icon} className="h-4 w-4" />
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-zinc-900 dark:text-white">{title}</p>
          <span className="text-xs text-zinc-400">{time}</span>
        </div>
        <p className="text-xs text-zinc-500 line-clamp-1">{desc}</p>
      </div>
    </div>
  );
}

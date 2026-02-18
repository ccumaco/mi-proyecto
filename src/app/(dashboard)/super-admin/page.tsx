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
  faHistory
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@/components/ui/Button';

export default function SuperAdminPage() {
  const user = useSelector(selectUser);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <FontAwesomeIcon icon={faShieldAlt} className="h-5 w-5" />
          </div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Panel Super Admin</h1>
        </div>
        <p className="text-zinc-500 dark:text-zinc-400">
          Control total de la plataforma. Gestiona conjuntos y configuraciones globales.
        </p>
      </div>

      {/* Global Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlobalStatCard icon={faBuilding} label="Conjuntos" value="24" color="blue" />
        <GlobalStatCard icon={faUsers} label="Total Usuarios" value="1,840" color="purple" />
        <GlobalStatCard icon={faServer} label="Estado API" value="99.9%" color="green" />
        <GlobalStatCard icon={faHistory} label="Logs Hoy" value="2.4k" color="orange" />
      </div>

      {/* Management Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Managed Complexes */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <CardTitle>Conjuntos Registrados</CardTitle>
            <Button variant="primary" size="sm">Añadir Conjunto</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-zinc-500 dark:text-zinc-400">
              <thead className="text-xs text-zinc-700 uppercase bg-zinc-50 dark:bg-zinc-800 dark:text-zinc-400">
                <tr>
                  <th className="px-6 py-3">Nombre</th>
                  <th className="px-6 py-3">Unidades</th>
                  <th className="px-6 py-3">Admin</th>
                  <th className="px-6 py-3">Estado</th>
                  <th className="px-6 py-3">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                <ComplexRow name="Residencial Los Sauces" units="48" admin="Juan Pérez" status="Activo" />
                <ComplexRow name="Torres del Bosque" units="120" admin="María García" status="Activo" />
                <ComplexRow name="Condominio El Prado" units="24" admin="Sin Asignar" status="Pendiente" isAlert />
              </tbody>
            </table>
          </div>
        </Card>

        {/* System Settings Quick Access */}
        <Card>
          <CardTitle className="mb-6">Sistema y Seguridad</CardTitle>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start gap-3" size="lg">
              <FontAwesomeIcon icon={faCog} /> Configuración Global
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3" size="lg">
              <FontAwesomeIcon icon={faShieldAlt} /> Auditoría de Accesos
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3" size="lg">
              <FontAwesomeIcon icon={faUsers} /> Gestor de Roles
            </Button>
            <Button variant="danger" className="w-full mt-4" size="lg">
              Mantenimiento Programado
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function GlobalStatCard({ icon, label, value, color = 'primary' }: { icon: any, label: string, value: string, color?: string }) {
  const colorMap: any = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-950/30',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-950/30',
    green: 'bg-green-100 text-green-600 dark:bg-green-950/30',
    orange: 'bg-orange-100 text-orange-600 dark:bg-orange-950/30',
  };

  return (
    <Card padding="sm" className="flex items-center gap-4">
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colorMap[color]}`}>
        <FontAwesomeIcon icon={icon} className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{label}</p>
        <p className="text-xl font-black text-zinc-900 dark:text-white">{value}</p>
      </div>
    </Card>
  );
}

function ComplexRow({ name, units, admin, status, isAlert = false }: { name: string, units: string, admin: string, status: string, isAlert?: boolean }) {
  return (
    <tr className="bg-white border-b dark:bg-zinc-900 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
      <td className="px-6 py-4 font-bold text-zinc-900 dark:text-white">{name}</td>
      <td className="px-6 py-4">{units}</td>
      <td className="px-6 py-4">{admin}</td>
      <td className="px-6 py-4">
        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${isAlert ? 'bg-orange-100 text-orange-600 dark:bg-orange-950/30' : 'bg-green-100 text-green-600 dark:bg-green-950/30'}`}>
          {status}
        </span>
      </td>
      <td className="px-6 py-4">
        <Button variant="ghost" size="sm" className="text-primary p-0">Editar</Button>
      </td>
    </tr>
  );
}

'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { faSearch, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const residents = [
  { name: 'Alejandra Mendoza', unit: 'Torre A - 402', status: 'Activo' },
  { name: 'Ricardo Castillo', unit: 'Torre B - 103', status: 'Pendiente' },
  { name: 'Sofía Valencia', unit: 'Torre C - 201', status: 'Activo' },
  { name: 'Jorge Paredes', unit: 'Torre D - 502', status: 'Expirado' },
];

export default function ResidentsPage() {
  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Gestión de Residentes
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Administra invitados, invitaciones y estado de acceso.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute top-1/2 left-3 -translate-y-1/2 text-zinc-400"
            />
            <input
              className="focus:border-primary w-full rounded-xl border border-zinc-200 bg-white py-2 pr-4 pl-10 text-sm text-zinc-700 shadow-sm focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
              placeholder="Buscar residente..."
            />
          </div>
          <Button variant="primary" size="lg">
            <FontAwesomeIcon icon={faUserPlus} className="mr-2" /> Invitar
          </Button>
        </div>
      </header>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-200 text-left text-sm text-zinc-600 dark:divide-zinc-800 dark:text-zinc-300">
            <thead className="bg-zinc-50 text-xs tracking-wide uppercase dark:bg-zinc-900">
              <tr>
                <th className="px-4 py-3">Residente</th>
                <th className="px-4 py-3">Unidad</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {residents.map(resident => (
                <tr key={resident.name}>
                  <td className="px-4 py-3 font-semibold text-zinc-900 dark:text-white">
                    {resident.name}
                  </td>
                  <td className="px-4 py-3">{resident.unit}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        resident.status === 'Activo'
                          ? 'bg-green-100 text-green-700 dark:bg-green-950/20 dark:text-green-300'
                          : resident.status === 'Pendiente'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/20 dark:text-amber-300'
                            : 'bg-red-100 text-red-700 dark:bg-red-950/20 dark:text-red-300'
                      }`}
                    >
                      {resident.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Button variant="outline" size="sm">
                      Ver
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

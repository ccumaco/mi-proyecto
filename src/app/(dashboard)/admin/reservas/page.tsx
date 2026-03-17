'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  faDumbbell,
  faSwimmingPool,
  faFire,
  faRocket,
  faPlus,
  faSearch,
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const zones = [
  {
    id: 1,
    name: 'Gimnasio',
    info: 'Capacidad: 15 personas',
    status: 'ACTIVO',
    icon: faDumbbell,
    enabled: true,
  },
  {
    id: 2,
    name: 'Piscina',
    info: 'Apertura: 09:00 - 21:00',
    status: 'MANTENIMIENTO',
    icon: faSwimmingPool,
    enabled: false,
  },
  {
    id: 3,
    name: 'Zona BBQ',
    info: '2 estaciones disponibles',
    status: 'ACTIVO',
    icon: faFire,
    enabled: true,
  },
  {
    id: 4,
    name: 'Cancha Padel',
    info: 'Reserva máx. 2 horas',
    status: 'ACTIVO',
    icon: faRocket,
    enabled: true,
  },
];

const reservations = [
  {
    id: 1,
    resident: 'Juan Pérez',
    unit: 'Apt. 402B',
    zone: 'Zona BBQ - Estación 1',
    date: '25 Oct, 2023',
    time: '18:00 - 22:00',
  },
  {
    id: 2,
    resident: 'María García',
    unit: 'Apt. 1503',
    zone: 'Cancha Padel',
    date: '26 Oct, 2023',
    time: '08:00 - 09:30',
  },
  {
    id: 3,
    resident: 'Carlos Ruiz',
    unit: 'Apt. 801C',
    zone: 'Gimnasio',
    date: '26 Oct, 2023',
    time: '19:00 - 20:00',
  },
];

export default function ReservationsPage() {
  const [zones_, setZones] = useState(zones);
  const [currentPage, setCurrentPage] = useState(1);

  const handleToggleZone = (id: number) => {
    setZones(
      zones_.map(z => (z.id === id ? { ...z, enabled: !z.enabled } : z))
    );
  };

  const statusColorMap: any = {
    ACTIVO:
      'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300',
    MANTENIMIENTO:
      'bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300',
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Gestión de Zonas y Reservas
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Controla la disponibilidad de los espacios para los residentes.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute top-1/2 left-3 -translate-y-1/2 text-zinc-400"
            />
            <input
              className="focus:border-primary w-full rounded-lg border border-zinc-200 bg-white py-2 pr-4 pl-10 text-sm text-zinc-700 shadow-sm focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
              placeholder="Buscar residente, unidad..."
            />
          </div>
          <Button variant="primary" size="lg">
            <FontAwesomeIcon icon={faPlus} className="mr-2" /> Nueva Zona
          </Button>
        </div>
      </header>

      {/* Estado de Zonas Comunes */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
            Estado de Zonas Comunes
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Controla la disponibilidad de los espacios para los residentes.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {zones_.map(zone => (
            <Card
              key={zone.id}
              className="flex flex-col gap-4 border border-zinc-200 p-4 dark:border-zinc-800"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400">
                  <FontAwesomeIcon icon={zone.icon} className="h-5 w-5" />
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase ${
                    statusColorMap[zone.status]
                  }`}
                >
                  {zone.status}
                </span>
              </div>

              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-white">
                  {zone.name}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {zone.info}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-zinc-200 pt-3 dark:border-zinc-800">
                <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                  Habilitar Reservas
                </span>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={zone.enabled}
                    onChange={() => handleToggleZone(zone.id)}
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-zinc-300 peer-checked:bg-blue-600 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-md after:transition-all peer-checked:after:translate-x-5 dark:bg-zinc-600 dark:peer-checked:bg-blue-600" />
                </label>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Reservas Pendientes */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
            Reservas Pendientes de Aprobación
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Solicitudes recientes que requieren tu validación.
          </p>
        </div>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold tracking-wider text-zinc-600 uppercase dark:text-zinc-400">
                    Residente
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold tracking-wider text-zinc-600 uppercase dark:text-zinc-400">
                    Zona
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold tracking-wider text-zinc-600 uppercase dark:text-zinc-400">
                    Fecha y Hora
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold tracking-wider text-zinc-600 uppercase dark:text-zinc-400">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {reservations.map(res => (
                  <tr
                    key={res.id}
                    className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-sm font-bold text-white">
                          {res.resident.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-zinc-900 dark:text-white">
                            {res.resident}
                          </p>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            {res.unit}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-zinc-900 dark:text-white">
                        {res.zone}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-zinc-900 dark:text-white">
                          {res.date}
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          {res.time}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950/20"
                        >
                          Rechazar
                        </Button>
                        <Button variant="primary" size="sm">
                          Aprobar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-zinc-200 bg-zinc-50 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Mostrando 3 de 12 solicitudes pendientes
            </p>
            <div className="flex items-center gap-2">
              <button className="rounded-lg border border-zinc-200 p-2 text-zinc-600 hover:bg-white dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800">
                <FontAwesomeIcon icon={faChevronLeft} className="h-4 w-4" />
              </button>
              <button className="rounded-lg border border-zinc-200 p-2 text-zinc-600 hover:bg-white dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800">
                <FontAwesomeIcon icon={faChevronRight} className="h-4 w-4" />
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

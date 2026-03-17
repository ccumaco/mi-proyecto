'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  faMapLocationDot,
  faPlus,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const zones = [
  {
    name: 'Piscina',
    description: 'Área de descanso y piscinas climatizadas.',
    status: 'Activo',
    capacity: 30,
  },
  {
    name: 'Gimnasio',
    description: 'Sala de entrenamiento con equipos modernos.',
    status: 'Activo',
    capacity: 20,
  },
  {
    name: 'Cancha de Pádel',
    description: 'Reservas de 1h máximo por turno.',
    status: 'Mantenimiento',
    capacity: 10,
  },
  {
    name: 'Salón Social',
    description: 'Espacio para eventos y reuniones familiares.',
    status: 'Activo',
    capacity: 80,
  },
];

export default function ZonesManagementPage() {
  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Gestión de Zonas
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Administra las zonas comunes del conjunto y revisa su
            disponibilidad.
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
              placeholder="Buscar zona..."
            />
          </div>
          <Button variant="primary" size="lg">
            <FontAwesomeIcon icon={faPlus} className="mr-2" /> Nueva Zona
          </Button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        {zones.map(zone => (
          <Card
            key={zone.name}
            className="flex flex-col gap-4 rounded-xl border border-zinc-200 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
            isHoverable
          >
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-xl">
                <FontAwesomeIcon icon={faMapLocationDot} className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  {zone.name}
                </h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {zone.description}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-200">
                  Capacidad: {zone.capacity}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    zone.status === 'Activo'
                      ? 'bg-green-100 text-green-600 dark:bg-green-950/30 dark:text-green-300'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300'
                  }`}
                >
                  {zone.status}
                </span>
              </div>
              <Button variant="outline" size="sm">
                Ver horarios
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

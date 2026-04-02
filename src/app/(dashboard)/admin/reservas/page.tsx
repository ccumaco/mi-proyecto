'use client';

import { useState } from 'react';
import { Building2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  faDumbbell,
  faSwimmingPool,
  faFire,
  faTableTennisPaddleBall,
  faPlus,
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// ─── Tipos ────────────────────────────────────────────────────────────────────

type ZoneStatus = 'ACTIVO' | 'MANTENIMIENTO' | 'INACTIVO';

interface Zone {
  id: number;
  name: string;
  info: string;
  status: ZoneStatus;
  icon: typeof faDumbbell | null;
  enabled: boolean;
}

// ─── Estado inicial del form de nueva zona ────────────────────────────────────

interface NuevaZonaForm {
  nombre: string;
  descripcion: string;
  estado: ZoneStatus;
  reservasHabilitadas: boolean;
}

interface Reservation {
  id: number;
  resident: string;
  unit: string;
  zone: string;
  zoneIcon: typeof faDumbbell;
  date: string;
  time: string;
  avatarColor: string;
}

// ─── Datos mock ───────────────────────────────────────────────────────────────

const INITIAL_ZONES: Zone[] = [
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
    info: 'Reserva máx: 2 horas',
    status: 'ACTIVO',
    icon: faTableTennisPaddleBall,
    enabled: true,
  },
];

const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: 1,
    resident: 'Juan Pérez',
    unit: 'Apt 402B',
    zone: 'Zona BBQ - Estación 1',
    zoneIcon: faFire,
    date: '25 Oct, 2023',
    time: '18:00 - 22:00',
    avatarColor: 'from-orange-400 to-orange-600',
  },
  {
    id: 2,
    resident: 'Maria Garcia',
    unit: 'Apt 105A',
    zone: 'Cancha Padel',
    zoneIcon: faTableTennisPaddleBall,
    date: '26 Oct, 2023',
    time: '08:00 - 09:30',
    avatarColor: 'from-violet-400 to-violet-600',
  },
  {
    id: 3,
    resident: 'Carlos Ruiz',
    unit: 'Apt 801C',
    zone: 'Gimnasio',
    zoneIcon: faDumbbell,
    date: '26 Oct, 2023',
    time: '19:00 - 20:00',
    avatarColor: 'from-sky-400 to-sky-600',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map(part => part.charAt(0).toUpperCase())
    .join('');
}

// ─── Página ───────────────────────────────────────────────────────────────────

const FORM_INICIAL: NuevaZonaForm = {
  nombre: '',
  descripcion: '',
  estado: 'ACTIVO',
  reservasHabilitadas: true,
};

export default function ReservationsPage() {
  const [zones, setZones] = useState<Zone[]>(INITIAL_ZONES);
  const [reservations, setReservations] =
    useState<Reservation[]>(INITIAL_RESERVATIONS);
  const [currentPage, setCurrentPage] = useState(1);

  // ── Estado del modal Nueva Zona ─────────────────────────────────────────
  const [modalAbierto, setModalAbierto] = useState(false);
  const [form, setForm] = useState<NuevaZonaForm>(FORM_INICIAL);

  const TOTAL_PENDING = 12;

  const handleToggleZone = (id: number) => {
    setZones(prev =>
      prev.map(z => (z.id === id ? { ...z, enabled: !z.enabled } : z))
    );
  };

  const handleAbrirModal = () => {
    setForm(FORM_INICIAL);
    setModalAbierto(true);
  };

  const handleCerrarModal = () => {
    setForm(FORM_INICIAL);
    setModalAbierto(false);
  };

  const handleCrearZona = () => {
    const nueva: Zone = {
      id: Date.now(),
      name: form.nombre.trim() || 'Nueva Zona',
      info: form.descripcion.trim() || 'Sin descripción',
      status: form.estado,
      icon: null,
      enabled: form.reservasHabilitadas,
    };
    setZones(prev => [...prev, nueva]);
    setModalAbierto(false);
    setForm(FORM_INICIAL);
  };

  const handleApprove = (id: number) => {
    setReservations(prev => prev.filter(r => r.id !== id));
  };

  const handleReject = (id: number) => {
    setReservations(prev => prev.filter(r => r.id !== id));
  };

  const statusStyles: Record<ZoneStatus, string> = {
    ACTIVO:
      'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400',
    MANTENIMIENTO:
      'bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400',
    INACTIVO:
      'bg-zinc-100 text-zinc-500 dark:bg-zinc-800/60 dark:text-zinc-400',
  };

  return (
    <div className="space-y-8">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header>
        <nav className="mb-1 flex items-center gap-1 text-xs text-zinc-400">
          <span>Inicio</span>
          <span>/</span>
          <span className="text-zinc-500 dark:text-zinc-300">
            Dashboard Principal
          </span>
        </nav>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Gestión de Zonas y Reservas
        </h1>
      </header>

      {/* ── Sección 1: Estado de Zonas Comunes ─────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
              Estado de Zonas Comunes
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Controla la disponibilidad de los espacios para los residentes.
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            className="shrink-0 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            onClick={handleAbrirModal}
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2 h-3.5 w-3.5" />
            Nueva Zona
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {zones.map(zone => (
            <Card
              key={zone.id}
              padding="md"
              className="flex flex-col gap-4"
            >
              {/* Icono + Badge */}
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400">
                  {zone.icon !== null ? (
                    <FontAwesomeIcon icon={zone.icon} className="h-5 w-5" />
                  ) : (
                    <Building2 className="h-5 w-5" />
                  )}
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase ${statusStyles[zone.status]}`}
                >
                  {zone.status}
                </span>
              </div>

              {/* Nombre + Info */}
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-white">
                  {zone.name}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {zone.info}
                </p>
              </div>

              {/* Toggle */}
              <div className="flex items-center justify-between border-t border-zinc-100 pt-3 dark:border-zinc-800">
                <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  Habilitar Reservas
                </span>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={zone.enabled}
                    onChange={() => handleToggleZone(zone.id)}
                    className="peer sr-only"
                    aria-label={`Habilitar reservas para ${zone.name}`}
                  />
                  <div className="peer h-6 w-11 rounded-full bg-zinc-300 transition-colors peer-checked:bg-blue-600 after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-sm after:transition-all peer-checked:after:translate-x-5 dark:bg-zinc-600 dark:peer-checked:bg-blue-600" />
                </label>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Sección 2: Reservas Pendientes de Aprobación ───────────────────── */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
            Reservas Pendientes de Aprobación
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Solicitudes recientes que requieren tu validación.
          </p>
        </div>

        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                    Residente
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                    Zona
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                    Fecha y Hora
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {reservations.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-10 text-center text-sm text-zinc-400"
                    >
                      No hay solicitudes pendientes de aprobación.
                    </td>
                  </tr>
                ) : (
                  reservations.map(res => (
                    <tr
                      key={res.id}
                      className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
                    >
                      {/* Residente */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br ${res.avatarColor} text-xs font-bold text-white`}
                          >
                            {getInitials(res.resident)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                              {res.resident}
                            </p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                              {res.unit}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Zona */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FontAwesomeIcon
                            icon={res.zoneIcon}
                            className="h-3.5 w-3.5 text-zinc-400"
                          />
                          <span className="text-sm font-medium text-zinc-900 dark:text-white">
                            {res.zone}
                          </span>
                        </div>
                      </td>

                      {/* Fecha y hora */}
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-zinc-900 dark:text-white">
                          {res.date}
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          {res.time}
                        </p>
                      </td>

                      {/* Acciones */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 dark:border-red-800/60 dark:text-red-400 dark:hover:bg-red-950/20"
                            onClick={() => handleReject(res.id)}
                          >
                            Rechazar
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            className="bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                            onClick={() => handleApprove(res.id)}
                          >
                            Aprobar
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ── Footer de tabla: paginación ─────────────────────────────────── */}
          <div className="flex items-center justify-between border-t border-zinc-100 bg-zinc-50 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-800/50">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Mostrando {reservations.length} de {TOTAL_PENDING} solicitudes
              pendientes
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                aria-label="Página anterior"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
              >
                <FontAwesomeIcon icon={faChevronLeft} className="h-3 w-3" />
              </button>
              <button
                onClick={() => setCurrentPage(p => p + 1)}
                aria-label="Página siguiente"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 transition-colors hover:bg-white dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
              >
                <FontAwesomeIcon icon={faChevronRight} className="h-3 w-3" />
              </button>
            </div>
          </div>
        </Card>
      </section>

      {/* ── Modal: Nueva Zona ───────────────────────────────────────────────── */}
      {modalAbierto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={handleCerrarModal}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900"
            onClick={e => e.stopPropagation()}
          >
            {/* Título */}
            <h2 className="mb-5 text-lg font-bold text-zinc-900 dark:text-white">
              Nueva Zona
            </h2>

            <div className="space-y-4">
              {/* Nombre */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Nombre de la zona
                </label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={e => setForm(prev => ({ ...prev, nombre: e.target.value }))}
                  placeholder="Ej: Salón de Eventos"
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-700/40"
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Descripción / Detalle
                </label>
                <input
                  type="text"
                  value={form.descripcion}
                  onChange={e => setForm(prev => ({ ...prev, descripcion: e.target.value }))}
                  placeholder="Ej: Capacidad: 50 personas"
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-700/40"
                />
              </div>

              {/* Fila: Estado + Reservas */}
              <div className="grid grid-cols-2 gap-3">
                {/* Estado */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Estado
                  </label>
                  <select
                    value={form.estado}
                    onChange={e =>
                      setForm(prev => ({
                        ...prev,
                        estado: e.target.value as ZoneStatus,
                      }))
                    }
                    className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-zinc-500 dark:focus:ring-zinc-700/40"
                  >
                    <option value="ACTIVO">Activo</option>
                    <option value="MANTENIMIENTO">Mantenimiento</option>
                    <option value="INACTIVO">Inactivo</option>
                  </select>
                </div>

                {/* Reservas */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Reservas
                  </label>
                  <select
                    value={form.reservasHabilitadas ? 'habilitadas' : 'deshabilitadas'}
                    onChange={e =>
                      setForm(prev => ({
                        ...prev,
                        reservasHabilitadas: e.target.value === 'habilitadas',
                      }))
                    }
                    className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-zinc-500 dark:focus:ring-zinc-700/40"
                  >
                    <option value="habilitadas">Habilitadas</option>
                    <option value="deshabilitadas">Deshabilitadas</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="outline"
                size="md"
                className="border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                onClick={handleCerrarModal}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                size="md"
                className="bg-gray-900 hover:bg-gray-800 text-white"
                onClick={handleCrearZona}
              >
                Crear Zona
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

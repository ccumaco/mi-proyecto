'use client';

import { useState } from 'react';
import { Building2, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  faPlus,
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePropertyId } from '@/features/admin/hooks/usePropertyId';
import { useZones } from '@/features/admin/hooks/useZones';
import { useReservations } from '@/features/admin/hooks/useReservations';
import type { ReservationWithDetails } from '@/features/admin/hooks/useReservations';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map(part => part.charAt(0).toUpperCase())
    .join('');
}

function formatearFecha(isoDate: string): string {
  return new Date(isoDate + 'T00:00:00').toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

const AVATAR_COLORS = [
  'from-orange-400 to-orange-600',
  'from-violet-400 to-violet-600',
  'from-sky-400 to-sky-600',
  'from-emerald-400 to-emerald-600',
  'from-rose-400 to-rose-600',
];

function avatarGradient(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmada',
  CANCELLED: 'Cancelada',
};

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400',
  CONFIRMED: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400',
  CANCELLED: 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800/60 dark:text-zinc-400',
};

const ZONE_STATUS_STYLES: Record<string, string> = {
  true: 'bg-green-100 text-green-600 dark:bg-green-950/30 dark:text-green-300',
  false: 'bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300',
};

// ─── Página ───────────────────────────────────────────────────────────────────

const PAGE_SIZE = 10;

export default function ReservationsPage() {
  const { propertyId, loading: loadingProperty } = usePropertyId();
  const { zones, loading: loadingZones } = useZones(propertyId);
  const { reservations, loading: loadingReservations, error, updateReservation, refetch } =
    useReservations(propertyId);

  const [currentPage, setCurrentPage] = useState(1);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loading = loadingProperty || loadingZones || loadingReservations;

  const pendientes = reservations.filter(r => r.status === 'PENDING');
  const totalPages = Math.max(1, Math.ceil(pendientes.length / PAGE_SIZE));
  const paginated = pendientes.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  async function handleApprove(id: string) {
    setUpdatingId(id);
    try {
      await updateReservation(id, { status: 'CONFIRMED' });
    } catch (err: any) {
      alert(err.message || 'No se pudo confirmar la reserva');
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleReject(id: string) {
    setUpdatingId(id);
    try {
      await updateReservation(id, { status: 'CANCELLED' });
    } catch (err: any) {
      alert(err.message || 'No se pudo cancelar la reserva');
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <header>
        <nav className="mb-1 flex items-center gap-1 text-xs text-zinc-400">
          <span>Inicio</span>
          <span>/</span>
          <span className="text-zinc-500 dark:text-zinc-300">
            Gestión de Zonas y Reservas
          </span>
        </nav>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Gestión de Zonas y Reservas
        </h1>
      </header>

      {/* Estado de carga global */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-800 dark:bg-red-950/20 dark:text-red-400">
          Error al cargar los datos: {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Sección 1: Estado de Zonas Comunes */}
          <section className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                  Estado de Zonas Comunes
                </h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Disponibilidad de los espacios para los residentes.
                </p>
              </div>
            </div>

            {zones.length === 0 ? (
              <p className="text-sm text-zinc-400 dark:text-zinc-500">
                No hay zonas registradas para esta propiedad.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {zones.map(zone => (
                  <Card key={zone.id} padding="md" className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${ZONE_STATUS_STYLES[String(zone.isActive)]}`}
                      >
                        {zone.isActive ? 'Activa' : 'Inactiva'}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-zinc-900 dark:text-white">
                        {zone.name}
                      </h3>
                      {zone.description && (
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          {zone.description}
                        </p>
                      )}
                      {zone.capacity != null && (
                        <p className="mt-1 text-xs text-zinc-400">
                          Capacidad: {zone.capacity} personas
                        </p>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </section>

          {/* Sección 2: Reservas Pendientes de Aprobación */}
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
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                        Residente
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                        Zona
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                        Fecha y Hora
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                        Estado
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                        Acciones
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {paginated.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-10 text-center text-sm text-zinc-400">
                          No hay solicitudes pendientes de aprobación.
                        </td>
                      </tr>
                    ) : (
                      paginated.map((res: ReservationWithDetails) => {
                        const residente = res.unit?.resident;
                        const nombre = residente?.fullName || residente?.displayName || residente?.email || 'Residente';
                        const unidad = res.unit
                          ? `${res.unit.block ? res.unit.block + ' - ' : ''}Unidad ${res.unit.unitNumber}`
                          : '—';

                        return (
                          <tr
                            key={res.id}
                            className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br ${avatarGradient(res.id)} text-xs font-bold text-white`}
                                >
                                  {getInitials(nombre)}
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                                    {nombre}
                                  </p>
                                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                    {unidad}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-6 py-4">
                              <span className="text-sm font-medium text-zinc-900 dark:text-white">
                                {res.zone?.name || '—'}
                              </span>
                            </td>

                            <td className="px-6 py-4">
                              <p className="text-sm font-medium text-zinc-900 dark:text-white">
                                {formatearFecha(res.date)}
                              </p>
                              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                {res.startTime} - {res.endTime}
                              </p>
                            </td>

                            <td className="px-6 py-4">
                              <span
                                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[res.status] || ''}`}
                              >
                                {STATUS_LABELS[res.status] || res.status}
                              </span>
                            </td>

                            <td className="px-6 py-4">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-red-200 text-red-600 hover:border-red-300 hover:bg-red-50 dark:border-red-800/60 dark:text-red-400 dark:hover:bg-red-950/20"
                                  onClick={() => handleReject(res.id)}
                                  disabled={updatingId === res.id}
                                >
                                  {updatingId === res.id ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                  ) : (
                                    'Rechazar'
                                  )}
                                </Button>
                                <Button
                                  variant="primary"
                                  size="sm"
                                  className="bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                                  onClick={() => handleApprove(res.id)}
                                  disabled={updatingId === res.id}
                                >
                                  {updatingId === res.id ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                  ) : (
                                    'Aprobar'
                                  )}
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Footer: paginación */}
              <div className="flex items-center justify-between border-t border-zinc-100 bg-zinc-50 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-800/50">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Mostrando {paginated.length} de {pendientes.length} solicitudes pendientes
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
                  <span className="px-2 text-xs text-zinc-500">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    aria-label="Página siguiente"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
                  >
                    <FontAwesomeIcon icon={faChevronRight} className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </Card>
          </section>

          {/* Sección 3: Todas las reservas */}
          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                Historial de Reservas
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Todas las reservas de la propiedad.
              </p>
            </div>

            <Card padding="none">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                        Residente
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                        Zona
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                        Fecha y Hora
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {reservations.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-10 text-center text-sm text-zinc-400">
                          No hay reservas registradas.
                        </td>
                      </tr>
                    ) : (
                      reservations.map((res: ReservationWithDetails) => {
                        const residente = res.unit?.resident;
                        const nombre = residente?.fullName || residente?.displayName || residente?.email || 'Residente';
                        const unidad = res.unit
                          ? `${res.unit.block ? res.unit.block + ' - ' : ''}Unidad ${res.unit.unitNumber}`
                          : '—';
                        return (
                          <tr
                            key={res.id}
                            className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
                          >
                            <td className="px-6 py-4">
                              <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                                {nombre}
                              </p>
                              <p className="text-xs text-zinc-500 dark:text-zinc-400">{unidad}</p>
                            </td>
                            <td className="px-6 py-4 text-sm text-zinc-700 dark:text-zinc-300">
                              {res.zone?.name || '—'}
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm font-medium text-zinc-900 dark:text-white">
                                {formatearFecha(res.date)}
                              </p>
                              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                {res.startTime} - {res.endTime}
                              </p>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[res.status] || ''}`}
                              >
                                {STATUS_LABELS[res.status] || res.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </section>
        </>
      )}
    </div>
  );
}

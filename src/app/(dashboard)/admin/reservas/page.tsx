'use client';

import { useState } from 'react';
import { Building2, ImageIcon, Loader2, X } from 'lucide-react';
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
import { useTranslations } from 'next-intl';

// ─── Modal Nueva Zona ─────────────────────────────────────────────────────────

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:4000';

interface ModalNuevaZonaProps {
  onClose: () => void;
  onCrear: (data: { name: string; description?: string; isActive: boolean; image?: File }) => Promise<void>;
  t: (key: string) => string;
}

function ModalNuevaZona({ onClose, onCrear, t }: ModalNuevaZonaProps) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [imagen, setImagen] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setImagen(file);
    if (file) setPreview(URL.createObjectURL(file));
    else setPreview(null);
  }

  async function handleCrear() {
    if (!nombre.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await onCrear({
        name: nombre.trim(),
        description: descripcion.trim() || undefined,
        isActive,
        image: imagen ?? undefined,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || t('modalCreateError'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl dark:bg-zinc-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4 dark:border-zinc-800">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">{t('modalNewZoneTitle')}</h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-zinc-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 p-6">
          {/* Foto */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {t('modalFieldPhoto')}
            </label>
            <label className="group relative flex cursor-pointer overflow-hidden rounded-xl border-2 border-dashed border-zinc-200 transition-colors hover:border-blue-400 dark:border-zinc-700">
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              {preview ? (
                <img src={preview} alt="Preview" className="h-36 w-full object-cover" />
              ) : (
                <div className="flex h-36 w-full flex-col items-center justify-center gap-2 text-zinc-400">
                  <ImageIcon className="h-8 w-8" />
                  <span className="text-xs">{t('modalClickToUpload')}</span>
                </div>
              )}
              {preview && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="text-xs font-semibold text-white">{t('modalChangePhoto')}</span>
                </div>
              )}
            </label>
          </div>

          {/* Nombre */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {t('modalFieldName')}
            </label>
            <input
              type="text"
              placeholder={t('modalNamePlaceholder')}
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {t('modalFieldDescription')}
            </label>
            <input
              type="text"
              placeholder={t('modalDescriptionPlaceholder')}
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500"
            />
          </div>

          {/* Estado */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {t('modalFieldStatus')}
            </label>
            <select
              value={isActive ? 'activo' : 'inactivo'}
              onChange={e => setIsActive(e.target.value === 'activo')}
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            >
              <option value="activo">{t('modalStatusActive')}</option>
              <option value="inactivo">{t('modalStatusInactive')}</option>
            </select>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/20 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
            >
              {t('modalCancelButton')}
            </button>
            <button
              type="button"
              onClick={handleCrear}
              disabled={saving || !nombre.trim()}
              className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500/40 disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {t('modalCreateButton')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

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

const STATUS_LABEL_KEYS: Record<string, string> = {
  PENDING: 'statusPending',
  CONFIRMED: 'statusConfirmed',
  CANCELLED: 'statusCancelled',
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
  const t = useTranslations('admin.reservas');
  const { propertyId, loading: loadingProperty } = usePropertyId();
  const { zones, loading: loadingZones, createZone } = useZones(propertyId);
  const { reservations, loading: loadingReservations, error, updateReservation, refetch } =
    useReservations(propertyId);

  const [currentPage, setCurrentPage] = useState(1);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [modalZonaAbierto, setModalZonaAbierto] = useState(false);

  const loading = loadingProperty || loadingZones || loadingReservations;

  const pendientes = reservations.filter(r => r.status === 'PENDING');
  const totalPages = Math.max(1, Math.ceil(pendientes.length / PAGE_SIZE));
  const paginated = pendientes.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  async function handleApprove(id: string) {
    setUpdatingId(id);
    try {
      await updateReservation(id, { status: 'CONFIRMED' });
    } catch (err: any) {
      alert(err.message || t('approveError'));
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleReject(id: string) {
    setUpdatingId(id);
    try {
      await updateReservation(id, { status: 'CANCELLED' });
    } catch (err: any) {
      alert(err.message || t('rejectError'));
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <header>
        <nav className="mb-1 flex items-center gap-1 text-xs text-zinc-400">
          <span>{t('breadcrumbHome')}</span>
          <span>/</span>
          <span className="text-zinc-500 dark:text-zinc-300">
            {t('breadcrumbReservations')}
          </span>
        </nav>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          {t('title')}
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
          {t('loadingError', { error })}
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Sección 1: Estado de Zonas Comunes */}
          <section className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                  {t('zonesTitle')}
                </h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {t('zonesSubtitle')}
                </p>
              </div>
              <Button variant="primary" size="md" onClick={() => setModalZonaAbierto(true)}>
                <FontAwesomeIcon icon={faPlus} className="mr-2 h-3.5 w-3.5" />
                {t('newZoneButton')}
              </Button>
            </div>

            {zones.length === 0 ? (
              <p className="text-sm text-zinc-400 dark:text-zinc-500">
                {t('noZones')}
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {zones.map(zone => {
                  const imgSrc = zone.imageUrl
                    ? (zone.imageUrl.startsWith('http') ? zone.imageUrl : `${BACKEND_URL}${zone.imageUrl}`)
                    : null;
                  return (
                    <Card key={zone.id} padding="none" className="flex flex-col overflow-hidden">
                      {/* Imagen o placeholder */}
                      {imgSrc ? (
                        <img src={imgSrc} alt={zone.name} className="h-32 w-full object-cover" />
                      ) : (
                        <div className="flex h-32 w-full items-center justify-center bg-zinc-100 dark:bg-zinc-800">
                          <Building2 className="h-8 w-8 text-zinc-300 dark:text-zinc-600" />
                        </div>
                      )}
                      {/* Info */}
                      <div className="flex flex-col gap-2 p-4">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold leading-tight text-zinc-900 dark:text-white">
                            {zone.name}
                          </h3>
                          <span
                            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${ZONE_STATUS_STYLES[String(zone.isActive)]}`}
                          >
                            {zone.isActive ? t('statusActive') : t('statusInactive')}
                          </span>
                        </div>
                        {zone.description && (
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">{zone.description}</p>
                        )}
                        {zone.capacity != null && (
                          <p className="text-xs text-zinc-400">{t('capacityLabel', { count: zone.capacity })}</p>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </section>

          {/* Sección 2: Reservas Pendientes de Aprobación */}
          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                {t('pendingReservationsTitle')}
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {t('pendingReservationsSubtitle')}
              </p>
            </div>

            <Card padding="none">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                        {t('tableHeaderResident')}
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                        {t('tableHeaderZone')}
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                        {t('tableHeaderDateTime')}
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                        {t('tableHeaderStatus')}
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                        {t('tableHeaderActions')}
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {paginated.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-10 text-center text-sm text-zinc-400">
                          {t('noPendingRequests')}
                        </td>
                      </tr>
                    ) : (
                      paginated.map((res: ReservationWithDetails) => {
                        const residente = res.unit?.resident;
                        const nombre = residente?.fullName || residente?.displayName || residente?.email || t('defaultResident');
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
                                {STATUS_LABEL_KEYS[res.status] ? t(STATUS_LABEL_KEYS[res.status]) : res.status}
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
                                    t('rejectButton')
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
                                    t('approveButton')
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
                  {t('showingOf', { shown: paginated.length, total: pendientes.length })}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    aria-label={t('prevPage')}
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
                    aria-label={t('nextPage')}
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
                {t('historyTitle')}
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {t('historySubtitle')}
              </p>
            </div>

            <Card padding="none">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                        {t('tableHeaderResident')}
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                        {t('tableHeaderZone')}
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                        {t('tableHeaderDateTime')}
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                        {t('tableHeaderStatus')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {reservations.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-10 text-center text-sm text-zinc-400">
                          {t('noReservations')}
                        </td>
                      </tr>
                    ) : (
                      reservations.map((res: ReservationWithDetails) => {
                        const residente = res.unit?.resident;
                        const nombre = residente?.fullName || residente?.displayName || residente?.email || t('defaultResident');
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
                                {STATUS_LABEL_KEYS[res.status] ? t(STATUS_LABEL_KEYS[res.status]) : res.status}
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

      {modalZonaAbierto && (
        <ModalNuevaZona
          t={t}
          onClose={() => setModalZonaAbierto(false)}
          onCrear={async ({ image, ...data }) => {
            if (!propertyId) throw new Error(t('noPropertyError'));
            await createZone({ ...data, propertyId, image });
          }}
        />
      )}
    </div>
  );
}

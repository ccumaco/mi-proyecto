'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  faMapLocationDot,
  faPlus,
  faSearch,
  faTrashAlt,
  faPencil,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Loader2 } from 'lucide-react';
import { usePropertyId } from '@/features/admin/hooks/usePropertyId';
import { useZones } from '@/features/admin/hooks/useZones';
import type { ZoneAPI } from '@/features/admin/hooks/useZones';
import { useTranslations } from 'next-intl';

// ─── Formulario ───────────────────────────────────────────────────────────────

interface FormZona {
  name: string;
  description: string;
  capacity: string;
}

const FORM_INICIAL: FormZona = { name: '', description: '', capacity: '' };

// ─── Página ───────────────────────────────────────────────────────────────────

export default function ZonesManagementPage() {
  const t = useTranslations('admin.zonas');
  const { propertyId, loading: loadingProperty } = usePropertyId();
  const { zones, loading: loadingZones, error, createZone, updateZone, deleteZone } = useZones(propertyId);

  const [busqueda, setBusqueda] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [form, setForm] = useState<FormZona>(FORM_INICIAL);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const loading = loadingProperty || loadingZones;

  const zonasFiltradas = zones.filter(z =>
    z.name.toLowerCase().includes(busqueda.toLowerCase())
  );

  function abrirModalNueva() {
    setForm(FORM_INICIAL);
    setEditandoId(null);
    setSubmitError(null);
    setModalAbierto(true);
  }

  function abrirModalEditar(zona: ZoneAPI) {
    setForm({
      name: zona.name,
      description: zona.description || '',
      capacity: zona.capacity != null ? String(zona.capacity) : '',
    });
    setEditandoId(zona.id);
    setSubmitError(null);
    setModalAbierto(true);
  }

  function cerrarModal() {
    setForm(FORM_INICIAL);
    setEditandoId(null);
    setSubmitError(null);
    setModalAbierto(false);
  }

  async function handleGuardar() {
    if (!form.name.trim() || !propertyId) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        capacity: form.capacity ? parseInt(form.capacity, 10) : undefined,
        propertyId,
      };
      if (editandoId) {
        await updateZone(editandoId, payload);
      } else {
        await createZone(payload);
      }
      cerrarModal();
    } catch (err: any) {
      setSubmitError(err.message || t('saveError'));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleEliminar(id: string) {
    if (!confirm(t('confirmDelete'))) return;
    try {
      await deleteZone(id);
    } catch (err: any) {
      alert(err.message || t('deleteError'));
    }
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            {t('title')}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {t('subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute top-1/2 left-3 -translate-y-1/2 text-zinc-400"
            />
            <input
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-white py-2 pr-4 pl-10 text-sm text-zinc-700 shadow-sm focus:border-blue-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
              placeholder={t('searchPlaceholder')}
            />
          </div>
          <Button variant="primary" size="lg" onClick={abrirModalNueva}>
            <FontAwesomeIcon icon={faPlus} className="mr-2" /> {t('newZoneButton')}
          </Button>
        </div>
      </header>

      {/* Estado de carga */}
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

      {/* Lista */}
      {!loading && !error && (
        <>
          {zonasFiltradas.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-zinc-50 py-16 text-center dark:border-zinc-700 dark:bg-zinc-800/30">
              <FontAwesomeIcon
                icon={faMapLocationDot}
                className="mb-3 h-10 w-10 text-zinc-300 dark:text-zinc-600"
              />
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                {t('emptyTitle')}
              </p>
              <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
                {t('emptySubtitle')}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              {zonasFiltradas.map(zone => (
                <Card
                  key={zone.id}
                  className="flex flex-col gap-4 rounded-xl border border-zinc-200 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
                  isHoverable
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-xl">
                      <FontAwesomeIcon icon={faMapLocationDot} className="h-5 w-5" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                        {zone.name}
                      </h2>
                      {zone.description && (
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                          {zone.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {zone.capacity != null && (
                        <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-200">
                          {t('capacity', { count: zone.capacity })}
                        </span>
                      )}
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          zone.isActive
                            ? 'bg-green-100 text-green-600 dark:bg-green-950/30 dark:text-green-300'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300'
                        }`}
                      >
                        {zone.isActive ? t('statusActive') : t('statusInactive')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => abrirModalEditar(zone)}
                        title={t('editTitle')}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-zinc-200"
                      >
                        <FontAwesomeIcon icon={faPencil} className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleEliminar(zone.id)}
                        title={t('deleteTitle')}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                      >
                        <FontAwesomeIcon icon={faTrashAlt} className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Modal crear/editar zona */}
      {modalAbierto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={e => { if (e.target === e.currentTarget) cerrarModal(); }}
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                {editandoId ? t('modalTitleEdit') : t('modalTitleNew')}
              </h2>
              <button
                onClick={cerrarModal}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-zinc-200"
                aria-label="Cerrar modal"
              >
                <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {t('fieldNameRequired')}
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder={t('fieldNamePlaceholder')}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {t('fieldDescription')}
                </label>
                <input
                  type="text"
                  value={form.description}
                  onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder={t('fieldDescriptionPlaceholder')}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {t('fieldCapacity')}
                </label>
                <input
                  type="number"
                  min={1}
                  value={form.capacity}
                  onChange={e => setForm(prev => ({ ...prev, capacity: e.target.value }))}
                  placeholder={t('fieldCapacityPlaceholder')}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500"
                />
              </div>
            </div>

            {submitError && (
              <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/20 dark:text-red-400">
                {submitError}
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={cerrarModal}
                className="border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                {t('cancelButton')}
              </Button>
              <button
                onClick={handleGuardar}
                disabled={submitting || !form.name.trim()}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-60"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {editandoId ? t('saveButton') : t('createButton')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

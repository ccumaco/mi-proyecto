'use client';

import { useState, useRef } from 'react';
import { Card } from '@/components/ui/Card';
import {
  Search,
  Mail,
  Phone,
  Home,
  Users,
  User,
  X,
  ChevronDown,
  Loader2,
  Upload,
  FileText,
} from 'lucide-react';
import { usePropertyId } from '@/features/admin/hooks/usePropertyId';
import { useUnitsWithResidents } from '@/features/admin/hooks/useUnitsWithResidents';
import type { UnitWithResident } from '@/features/admin/hooks/useUnitsWithResidents';
import { useTranslations } from 'next-intl';

// ---------------------------------------------------------------------------
// Sub-componentes
// ---------------------------------------------------------------------------

function StatCard({
  icono,
  label,
  valor,
  colorIcono,
  colorFondo,
}: {
  icono: React.ReactNode;
  label: string;
  valor: number;
  colorIcono: string;
  colorFondo: string;
}) {
  return (
    <Card padding="sm" className="flex items-center gap-4">
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${colorFondo}`}
      >
        <span className={colorIcono}>{icono}</span>
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          {label}
        </p>
        <p className="text-2xl font-black text-zinc-900 dark:text-white">
          {valor}
        </p>
      </div>
    </Card>
  );
}

function SelectFiltro({
  valor,
  onChange,
  opciones,
  placeholder,
}: {
  valor: string;
  onChange: (v: string) => void;
  opciones: { label: string; value: string }[];
  placeholder: string;
}) {
  return (
    <div className="relative">
      <select
        value={valor}
        onChange={e => onChange(e.target.value)}
        className="appearance-none rounded-xl border border-zinc-200 bg-white py-2 pr-8 pl-3 text-sm text-zinc-700 shadow-sm focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
      >
        <option value="">{placeholder}</option>
        {opciones.map(op => (
          <option key={op.value} value={op.value}>
            {op.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Modal: Detalle de Unidad / Residente
// ---------------------------------------------------------------------------

function FilaDetalle({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-between border-b border-gray-100 py-2 last:border-0 dark:border-zinc-800">
      <span className="text-sm text-zinc-500 dark:text-zinc-400">{label}</span>
      <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
        {children}
      </span>
    </div>
  );
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map(p => p.charAt(0).toUpperCase())
    .join('');
}

const AVATAR_COLORS = [
  'bg-violet-500',
  'bg-sky-500',
  'bg-pink-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-teal-500',
  'bg-indigo-500',
];

function avatarColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function ModalDetalleUnidad({
  unit,
  onCerrar,
  t,
}: {
  unit: UnitWithResident | null;
  onCerrar: () => void;
  t: (key: string, values?: Record<string, string | number>) => string;
}) {
  if (!unit) return null;
  const residente = unit.resident;
  const nombre = residente?.fullName || residente?.displayName || residente?.email || t('noResident');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
            {t('modalTitle')}
          </h2>
          <button
            onClick={onCerrar}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {residente ? (
          <>
            <div className="mb-5 flex items-center gap-4">
              <div
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${avatarColor(residente.id)}`}
              >
                {getInitials(nombre)}
              </div>
              <div>
                <p className="font-bold text-zinc-900 dark:text-white">{nombre}</p>
                <p className="text-sm text-zinc-400">
                  {unit.block ? `${unit.block} - ` : ''}{t('modalUnit', { number: unit.unitNumber })}
                </p>
              </div>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-zinc-800">
              <FilaDetalle label={t('fieldEmail')}>
                <a href={`mailto:${residente.email}`} className="text-blue-600 hover:underline dark:text-blue-400">
                  {residente.email}
                </a>
              </FilaDetalle>
              <FilaDetalle label={t('fieldPhone')}>{residente.phone || '—'}</FilaDetalle>
              <FilaDetalle label={t('fieldUnit')}>{unit.unitNumber}</FilaDetalle>
              {unit.block && <FilaDetalle label={t('fieldBlock')}>{unit.block}</FilaDetalle>}
              <FilaDetalle label={t('fieldRole')}>{residente.role}</FilaDetalle>
            </div>
          </>
        ) : (
          <div className="rounded-xl border border-dashed border-zinc-300 py-8 text-center dark:border-zinc-700">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {t('noResidentAssigned')}
            </p>
          </div>
        )}

        <button
          onClick={onCerrar}
          className="mt-6 w-full rounded-xl bg-zinc-100 py-2.5 text-sm font-semibold text-zinc-600 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
        >
          {t('closeButton')}
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Modal: Invitar Residente
// ---------------------------------------------------------------------------

type TabInvitacion = 'individual' | 'masiva';

function InputField({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 placeholder-zinc-400 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500"
      />
    </div>
  );
}

function ModalInvitarResidente({
  onCerrar,
  t,
}: {
  onCerrar: () => void;
  t: (key: string, values?: Record<string, string | number>) => string;
}) {
  const [tab, setTab] = useState<TabInvitacion>('individual');
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [celular, setCelular] = useState('');
  const [torre, setTorre] = useState('');
  const [apartamento, setApartamento] = useState('');
  const [archivo, setArchivo] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) setArchivo(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setArchivo(file);
  };

  const tabBase =
    'flex-1 rounded-lg py-2 text-sm font-semibold transition-colors';
  const tabActive = 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white';
  const tabInactive = 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl dark:bg-zinc-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4 dark:border-zinc-800">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
            {t('modalInviteTitle')}
          </h2>
          <button
            onClick={onCerrar}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-4">
          <div className="flex gap-1 rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800/60">
            <button
              type="button"
              onClick={() => setTab('individual')}
              className={`${tabBase} ${tab === 'individual' ? tabActive : tabInactive}`}
            >
              {t('modalTabSingle')}
            </button>
            <button
              type="button"
              onClick={() => setTab('masiva')}
              className={`${tabBase} ${tab === 'masiva' ? tabActive : tabInactive}`}
            >
              {t('modalTabBulk')}
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {tab === 'individual' ? (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <InputField
                    label={t('modalFieldName')}
                    value={nombre}
                    onChange={setNombre}
                    placeholder={t('modalFieldNamePlaceholder')}
                    required
                  />
                </div>
                <div className="col-span-2">
                  <InputField
                    label={t('modalFieldEmail')}
                    type="email"
                    value={correo}
                    onChange={setCorreo}
                    placeholder={t('modalFieldEmailPlaceholder')}
                    required
                  />
                </div>
                <div className="col-span-2">
                  <InputField
                    label={t('modalFieldPhone')}
                    type="tel"
                    value={celular}
                    onChange={setCelular}
                    placeholder={t('modalFieldPhonePlaceholder')}
                  />
                </div>
                <InputField
                  label={t('modalFieldTower')}
                  value={torre}
                  onChange={setTorre}
                  placeholder={t('modalFieldTowerPlaceholder')}
                />
                <InputField
                  label={t('modalFieldApartment')}
                  value={apartamento}
                  onChange={setApartamento}
                  placeholder={t('modalFieldApartmentPlaceholder')}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {t('modalBulkDesc')}
              </p>
              <div
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 transition-colors ${
                  dragging
                    ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/20'
                    : archivo
                      ? 'border-green-400 bg-green-50 dark:bg-green-950/20'
                      : 'border-zinc-300 bg-zinc-50 hover:border-blue-300 hover:bg-blue-50/40 dark:border-zinc-700 dark:bg-zinc-800/40 dark:hover:border-blue-600'
                }`}
              >
                {archivo ? (
                  <>
                    <FileText className="h-8 w-8 text-green-500" />
                    <p className="text-sm font-semibold text-green-700 dark:text-green-400">
                      {archivo.name}
                    </p>
                    <button
                      type="button"
                      onClick={e => { e.stopPropagation(); setArchivo(null); }}
                      className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                    >
                      {t('modalCancel')}
                    </button>
                  </>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-zinc-400" />
                    <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
                      {t('modalBulkDropzone')}
                    </p>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">
                      {t('modalBulkFormats')}
                    </p>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xls,.xlsx"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
              <button
                type="button"
                className="self-start text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
              >
                {t('modalBulkDownloadTemplate')}
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-zinc-100 px-6 py-4 dark:border-zinc-800">
          <button
            type="button"
            onClick={onCerrar}
            className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            {t('modalCancel')}
          </button>
          <button
            type="button"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90"
          >
            {tab === 'individual' ? t('modalSend') : t('modalBulkSend')}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Página principal
// ---------------------------------------------------------------------------

export default function DirectorioResidentesPage() {
  const t = useTranslations('admin.residentes');
  const { propertyId, loading: loadingProperty } = usePropertyId();
  const { units, loading: loadingUnits, error } = useUnitsWithResidents(propertyId);

  const [busqueda, setBusqueda] = useState('');
  const [filtroBloque, setFiltroBloque] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [unidadSeleccionada, setUnidadSeleccionada] = useState<UnitWithResident | null>(null);
  const [modalInvitarAbierto, setModalInvitarAbierto] = useState(false);

  const loading = loadingProperty || loadingUnits;

  // Unidades que tienen residente
  const unitsConResidente = units.filter(u => u.resident != null);

  // Bloques únicos
  const bloquesUnicos = Array.from(new Set(units.map(u => u.block).filter(Boolean))) as string[];

  // Tipos únicos de unidad
  const tiposUnicos = Array.from(new Set(units.map(u => (u as any).type).filter(Boolean))) as string[];

  // Filtrado
  const filtradas = units.filter(u => {
    const nombre = u.resident?.fullName || u.resident?.displayName || u.resident?.email || '';
    const email = u.resident?.email || '';
    const phone = u.resident?.phone || '';

    const coincideBusqueda =
      busqueda === '' ||
      nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      email.toLowerCase().includes(busqueda.toLowerCase()) ||
      phone.includes(busqueda) ||
      u.unitNumber.includes(busqueda);

    const coincideBloque = filtroBloque === '' || u.block === filtroBloque;
    const coincideTipo = filtroTipo === '' || (u as any).type === filtroTipo;
    const tieneResidente = u.resident != null;
    const coincideEstado =
      filtroEstado === '' ||
      (filtroEstado === 'ocupada' && tieneResidente) ||
      (filtroEstado === 'libre' && !tieneResidente);

    return coincideBusqueda && coincideBloque && coincideTipo && coincideEstado;
  });

  return (
    <div className="space-y-6">
      {/* Header con breadcrumb */}
      <div>
        <nav className="mb-1 flex items-center gap-1 text-sm text-zinc-400">
          <span>{t('breadcrumbHome')}</span>
          <span>/</span>
          <span className="text-zinc-600 dark:text-zinc-300">{t('breadcrumbResidents')}</span>
        </nav>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          {t('title')}
        </h1>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icono={<Home className="h-5 w-5" />}
          label={t('statTotalUnits')}
          valor={units.length}
          colorIcono="text-blue-500"
          colorFondo="bg-blue-100 dark:bg-blue-950/40"
        />
        <StatCard
          icono={<User className="h-5 w-5" />}
          label={t('statWithResident')}
          valor={unitsConResidente.length}
          colorIcono="text-green-600"
          colorFondo="bg-green-100 dark:bg-green-950/40"
        />
        <StatCard
          icono={<Users className="h-5 w-5" />}
          label={t('statWithoutResident')}
          valor={units.length - unitsConResidente.length}
          colorIcono="text-orange-600"
          colorFondo="bg-orange-100 dark:bg-orange-950/40"
        />
        <StatCard
          icono={<Home className="h-5 w-5" />}
          label={t('statBlocks')}
          valor={bloquesUnicos.length}
          colorIcono="text-purple-600"
          colorFondo="bg-purple-100 dark:bg-purple-950/40"
        />
      </div>

      {/* Barra de filtros */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Buscador */}
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-56 rounded-lg border border-zinc-200 bg-white py-2 pr-4 pl-9 text-sm text-zinc-700 shadow-sm focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:placeholder-zinc-500"
            />
          </div>

          {/* Filtro bloque */}
          <SelectFiltro
            valor={filtroBloque}
            onChange={setFiltroBloque}
            placeholder={t('allBlocksFilter')}
            opciones={bloquesUnicos.map(b => ({ label: b, value: b }))}
          />

          {/* Filtro tipo */}
          <SelectFiltro
            valor={filtroTipo}
            onChange={setFiltroTipo}
            placeholder={t('allTypesFilter')}
            opciones={tiposUnicos.map(tp => ({ label: tp, value: tp }))}
          />

          {/* Filtro estado */}
          <SelectFiltro
            valor={filtroEstado}
            onChange={setFiltroEstado}
            placeholder={t('allStatusFilter')}
            opciones={[
              { label: t('statusOccupied'), value: 'ocupada' },
              { label: t('statusFree'), value: 'libre' },
            ]}
          />
        </div>

        {/* Botón Invitar Residente */}
        <button
          type="button"
          onClick={() => setModalInvitarAbierto(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white shadow-sm transition-opacity hover:opacity-90"
        >
          <span className="text-base leading-none">+</span>
          {t('inviteResidentButton')}
        </button>
      </div>

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

      {/* Tabla */}
      {!loading && !error && (
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-zinc-100 bg-zinc-50 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-400">
                <tr>
                  <th className="px-5 py-3">{t('tableHeaderResident')}</th>
                  <th className="px-5 py-3">{t('tableHeaderUnit')}</th>
                  <th className="px-5 py-3">{t('tableHeaderContact')}</th>
                  <th className="px-5 py-3">{t('tableHeaderStatus')}</th>
                  <th className="px-5 py-3">{t('tableHeaderActions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {filtradas.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-sm text-zinc-400">
                      {t('noResults')}
                    </td>
                  </tr>
                ) : (
                  filtradas.map(unit => {
                    const residente = unit.resident;
                    const nombre = residente?.fullName || residente?.displayName || residente?.email || null;
                    const initials = nombre ? getInitials(nombre) : '—';
                    const color = residente ? avatarColor(residente.id) : 'bg-zinc-300';

                    return (
                      <tr
                        key={unit.id}
                        className="transition-colors hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40"
                      >
                        {/* Residente */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${color}`}
                            >
                              {initials}
                            </div>
                            <div>
                              <p className="font-semibold text-zinc-900 dark:text-white">
                                {nombre || <span className="text-zinc-400 italic">{t('noResident')}</span>}
                              </p>
                              {residente?.email && nombre !== residente.email && (
                                <p className="text-xs text-zinc-400">{residente.email}</p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Unidad */}
                        <td className="px-5 py-4 text-zinc-600 dark:text-zinc-300">
                          {unit.block ? `${unit.block} - ` : ''}{unit.unitNumber}
                        </td>

                        {/* Contacto */}
                        <td className="px-5 py-4">
                          {residente ? (
                            <div className="flex flex-col gap-1">
                              <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                                <Mail className="h-3.5 w-3.5 shrink-0" />
                                {residente.email}
                              </span>
                              {residente.phone && (
                                <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                                  <Phone className="h-3.5 w-3.5 shrink-0" />
                                  {residente.phone}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-zinc-400">—</span>
                          )}
                        </td>

                        {/* Estado */}
                        <td className="px-5 py-4">
                          {residente ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700 dark:bg-green-950/40 dark:text-green-300">
                              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                              {t('statusOccupied')}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-semibold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                              <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
                              {t('statusFree')}
                            </span>
                          )}
                        </td>

                        {/* Acciones */}
                        <td className="px-5 py-4">
                          <button
                            onClick={() => setUnidadSeleccionada(unit)}
                            className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-800 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            {t('viewDetail')}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Modal detalle */}
      <ModalDetalleUnidad
        unit={unidadSeleccionada}
        onCerrar={() => setUnidadSeleccionada(null)}
        t={t}
      />

      {/* Modal Invitar Residente */}
      {modalInvitarAbierto && (
        <ModalInvitarResidente
          onCerrar={() => setModalInvitarAbierto(false)}
          t={t}
        />
      )}
    </div>
  );
}

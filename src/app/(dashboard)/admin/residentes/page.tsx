'use client';

import { useState } from 'react';
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
} from 'lucide-react';
import { usePropertyId } from '@/features/admin/hooks/usePropertyId';
import { useUnitsWithResidents } from '@/features/admin/hooks/useUnitsWithResidents';
import type { UnitWithResident } from '@/features/admin/hooks/useUnitsWithResidents';

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
}: {
  unit: UnitWithResident | null;
  onCerrar: () => void;
}) {
  if (!unit) return null;
  const residente = unit.resident;
  const nombre = residente?.fullName || residente?.displayName || residente?.email || 'Sin residente';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
            Detalle de Unidad
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
                  {unit.block ? `${unit.block} - ` : ''}Unidad {unit.unitNumber}
                </p>
              </div>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-zinc-800">
              <FilaDetalle label="Email">
                <a href={`mailto:${residente.email}`} className="text-blue-600 hover:underline dark:text-blue-400">
                  {residente.email}
                </a>
              </FilaDetalle>
              <FilaDetalle label="Teléfono">{residente.phone || '—'}</FilaDetalle>
              <FilaDetalle label="Unidad">{unit.unitNumber}</FilaDetalle>
              {unit.block && <FilaDetalle label="Bloque / Torre">{unit.block}</FilaDetalle>}
              <FilaDetalle label="Rol">{residente.role}</FilaDetalle>
            </div>
          </>
        ) : (
          <div className="rounded-xl border border-dashed border-zinc-300 py-8 text-center dark:border-zinc-700">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Esta unidad no tiene residente asignado.
            </p>
          </div>
        )}

        <button
          onClick={onCerrar}
          className="mt-6 w-full rounded-xl bg-zinc-100 py-2.5 text-sm font-semibold text-zinc-600 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Página principal
// ---------------------------------------------------------------------------

export default function DirectorioResidentesPage() {
  const { propertyId, loading: loadingProperty } = usePropertyId();
  const { units, loading: loadingUnits, error } = useUnitsWithResidents(propertyId);

  const [busqueda, setBusqueda] = useState('');
  const [filtroBloque, setFiltroBloque] = useState('');
  const [unidadSeleccionada, setUnidadSeleccionada] = useState<UnitWithResident | null>(null);

  const loading = loadingProperty || loadingUnits;

  // Unidades que tienen residente
  const unitsConResidente = units.filter(u => u.resident != null);

  // Bloques únicos
  const bloquesUnicos = Array.from(new Set(units.map(u => u.block).filter(Boolean))) as string[];

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

    return coincideBusqueda && coincideBloque;
  });

  return (
    <div className="space-y-6">
      {/* Header con breadcrumb */}
      <div>
        <nav className="mb-1 flex items-center gap-1 text-sm text-zinc-400">
          <span>Inicio</span>
          <span>/</span>
          <span className="text-zinc-600 dark:text-zinc-300">Residentes</span>
        </nav>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Directorio de Residentes
        </h1>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icono={<Home className="h-5 w-5" />}
          label="Total Unidades"
          valor={units.length}
          colorIcono="text-blue-500"
          colorFondo="bg-blue-100 dark:bg-blue-950/40"
        />
        <StatCard
          icono={<User className="h-5 w-5" />}
          label="Con Residente"
          valor={unitsConResidente.length}
          colorIcono="text-green-600"
          colorFondo="bg-green-100 dark:bg-green-950/40"
        />
        <StatCard
          icono={<Users className="h-5 w-5" />}
          label="Sin Residente"
          valor={units.length - unitsConResidente.length}
          colorIcono="text-orange-600"
          colorFondo="bg-orange-100 dark:bg-orange-950/40"
        />
        <StatCard
          icono={<Home className="h-5 w-5" />}
          label="Bloques"
          valor={bloquesUnicos.length}
          colorIcono="text-purple-600"
          colorFondo="bg-purple-100 dark:bg-purple-950/40"
        />
      </div>

      {/* Barra de filtros */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          {/* Buscador */}
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre, email, teléfono o unidad..."
              className="w-64 rounded-xl border border-zinc-200 bg-white py-2 pr-4 pl-9 text-sm text-zinc-700 shadow-sm focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:placeholder-zinc-500"
            />
          </div>

          {/* Filtro bloque */}
          {bloquesUnicos.length > 0 && (
            <SelectFiltro
              valor={filtroBloque}
              onChange={setFiltroBloque}
              placeholder="Todos los bloques"
              opciones={bloquesUnicos.map(b => ({ label: b, value: b }))}
            />
          )}
        </div>
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
          Error al cargar los residentes: {error}
        </div>
      )}

      {/* Tabla */}
      {!loading && !error && (
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-zinc-100 bg-zinc-50 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-400">
                <tr>
                  <th className="px-5 py-3">Residente</th>
                  <th className="px-5 py-3">Unidad</th>
                  <th className="px-5 py-3">Contacto</th>
                  <th className="px-5 py-3">Estado</th>
                  <th className="px-5 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {filtradas.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-sm text-zinc-400">
                      No se encontraron unidades con los filtros seleccionados.
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
                                {nombre || <span className="text-zinc-400 italic">Sin residente</span>}
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
                              Ocupada
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-semibold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                              <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
                              Libre
                            </span>
                          )}
                        </td>

                        {/* Acciones */}
                        <td className="px-5 py-4">
                          <button
                            onClick={() => setUnidadSeleccionada(unit)}
                            className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-800 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            Ver detalle
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
      />
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import {
  Search,
  Mail,
  Phone,
  Home,
  UserPlus,
  ChevronDown,
  Users,
  User,
  X,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

type TipoResidente = 'PROPIETARIO' | 'ARRENDATARIO';
type EstadoResidente = 'ACTIVO' | 'INACTIVO';

interface Residente {
  id: number;
  nombre: string;
  iniciales: string;
  colorAvatar: string;
  desde: string;
  torre: string;
  unidad: string;
  email: string;
  telefono: string;
  tipo: TipoResidente;
  estado: EstadoResidente;
  vehiculo: string;
  mascotas: number;
}

interface FormInvitacion {
  nombre: string;
  email: string;
  telefono: string;
  torre: string;
  unidad: string;
  tipo: string;
}

const FORM_INICIAL: FormInvitacion = {
  nombre: '',
  email: '',
  telefono: '',
  torre: '',
  unidad: '',
  tipo: '',
};

// ---------------------------------------------------------------------------
// Datos mock
// ---------------------------------------------------------------------------

const RESIDENTES_MOCK: Residente[] = [
  {
    id: 1,
    nombre: 'Andrea Morales',
    iniciales: 'AM',
    colorAvatar: 'bg-violet-500',
    desde: 'ene 2024',
    torre: 'Torre A',
    unidad: '402',
    email: 'andrea.m@email.com',
    telefono: '+57 300 123 4567',
    tipo: 'PROPIETARIO',
    estado: 'ACTIVO',
    vehiculo: 'ABC 123',
    mascotas: 1,
  },
  {
    id: 2,
    nombre: 'Jorge Ruiz',
    iniciales: 'JR',
    colorAvatar: 'bg-sky-500',
    desde: 'may 2024',
    torre: 'Torre C',
    unidad: '105',
    email: 'jorge.r@email.com',
    telefono: '+57 311 234 5678',
    tipo: 'ARRENDATARIO',
    estado: 'ACTIVO',
    vehiculo: '—',
    mascotas: 0,
  },
  {
    id: 3,
    nombre: 'Lucía Vargas',
    iniciales: 'LV',
    colorAvatar: 'bg-pink-500',
    desde: 'mar 2023',
    torre: 'Torre B',
    unidad: '201',
    email: 'lucia.v@email.com',
    telefono: '+57 320 345 6789',
    tipo: 'PROPIETARIO',
    estado: 'ACTIVO',
    vehiculo: 'DEF 456',
    mascotas: 2,
  },
  {
    id: 4,
    nombre: 'Carlos Pineda',
    iniciales: 'CP',
    colorAvatar: 'bg-emerald-500',
    desde: 'ago 2023',
    torre: 'Torre A',
    unidad: '502',
    email: 'carlos.p@email.com',
    telefono: '+57 315 456 7890',
    tipo: 'PROPIETARIO',
    estado: 'ACTIVO',
    vehiculo: 'GHI 789',
    mascotas: 0,
  },
  {
    id: 5,
    nombre: 'María López',
    iniciales: 'ML',
    colorAvatar: 'bg-amber-500',
    desde: 'dic 2024',
    torre: 'Torre B',
    unidad: '301',
    email: 'maria.l@email.com',
    telefono: '+57 318 567 8901',
    tipo: 'ARRENDATARIO',
    estado: 'ACTIVO',
    vehiculo: '—',
    mascotas: 3,
  },
  {
    id: 6,
    nombre: 'Roberto García',
    iniciales: 'RG',
    colorAvatar: 'bg-zinc-400',
    desde: 'nov 2022',
    torre: 'Torre A',
    unidad: '103',
    email: 'roberto.g@email.com',
    telefono: '+57 322 678 9012',
    tipo: 'PROPIETARIO',
    estado: 'INACTIVO',
    vehiculo: 'JKL 012',
    mascotas: 1,
  },
  {
    id: 7,
    nombre: 'Ana Torres',
    iniciales: 'AT',
    colorAvatar: 'bg-rose-500',
    desde: 'jun 2025',
    torre: 'Torre C',
    unidad: '408',
    email: 'ana.t@email.com',
    telefono: '+57 301 789 0123',
    tipo: 'ARRENDATARIO',
    estado: 'ACTIVO',
    vehiculo: '—',
    mascotas: 0,
  },
];

const TORRES_UNICAS = ['Torre A', 'Torre B', 'Torre C'];

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
        <p className="text-xs font-bold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
          {label}
        </p>
        <p className="text-2xl font-black text-zinc-900 dark:text-white">
          {valor}
        </p>
      </div>
    </Card>
  );
}

function BadgeTipo({ tipo }: { tipo: TipoResidente }) {
  if (tipo === 'PROPIETARIO') {
    return (
      <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
        Propietario
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-semibold text-orange-700 dark:bg-orange-950/40 dark:text-orange-300">
      Arrendatario
    </span>
  );
}

function BadgeEstado({ estado }: { estado: EstadoResidente }) {
  if (estado === 'ACTIVO') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700 dark:bg-green-950/40 dark:text-green-300">
        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
        Activo
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-semibold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
      <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
      Inactivo
    </span>
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
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none rounded-xl border border-zinc-200 bg-white py-2 pr-8 pl-3 text-sm text-zinc-700 shadow-sm focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
      >
        <option value="">{placeholder}</option>
        {opciones.map((op) => (
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
// Modal 1: Invitar Residente
// ---------------------------------------------------------------------------

function ModalInvitarResidente({
  abierto,
  onCerrar,
}: {
  abierto: boolean;
  onCerrar: () => void;
}) {
  const [form, setForm] = useState<FormInvitacion>(FORM_INICIAL);

  if (!abierto) return null;

  function actualizarCampo(campo: keyof FormInvitacion, valor: string) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }

  function handleCancelar() {
    setForm(FORM_INICIAL);
    onCerrar();
  }

  function handleEnviar() {
    console.log('Invitación enviada:', form);
    setForm(FORM_INICIAL);
    onCerrar();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900">
        {/* Encabezado */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
            Invitar Residente
          </h2>
          <button
            onClick={handleCancelar}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Nombre completo */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Nombre completo
            </label>
            <input
              type="text"
              value={form.nombre}
              onChange={(e) => actualizarCampo('nombre', e.target.value)}
              placeholder="Nombre y apellido"
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 placeholder-zinc-400 shadow-sm focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:placeholder-zinc-500"
            />
          </div>

          {/* Email y Teléfono */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => actualizarCampo('email', e.target.value)}
                placeholder="correo@email.com"
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 placeholder-zinc-400 shadow-sm focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:placeholder-zinc-500"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Teléfono
              </label>
              <input
                type="tel"
                value={form.telefono}
                onChange={(e) => actualizarCampo('telefono', e.target.value)}
                placeholder="+57 300..."
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 placeholder-zinc-400 shadow-sm focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:placeholder-zinc-500"
              />
            </div>
          </div>

          {/* Torre, Unidad y Tipo */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Torre
              </label>
              <div className="relative">
                <select
                  value={form.torre}
                  onChange={(e) => actualizarCampo('torre', e.target.value)}
                  className="w-full appearance-none rounded-xl border border-zinc-200 bg-white py-2 pr-7 pl-3 text-sm text-zinc-800 shadow-sm focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                >
                  <option value="">Torre</option>
                  <option value="Torre A">Torre A</option>
                  <option value="Torre B">Torre B</option>
                  <option value="Torre C">Torre C</option>
                </select>
                <ChevronDown className="pointer-events-none absolute top-1/2 right-2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Unidad
              </label>
              <input
                type="text"
                value={form.unidad}
                onChange={(e) => actualizarCampo('unidad', e.target.value)}
                placeholder="Ej: 402"
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 placeholder-zinc-400 shadow-sm focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:placeholder-zinc-500"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Tipo
              </label>
              <div className="relative">
                <select
                  value={form.tipo}
                  onChange={(e) => actualizarCampo('tipo', e.target.value)}
                  className="w-full appearance-none rounded-xl border border-zinc-200 bg-white py-2 pr-7 pl-3 text-sm text-zinc-800 shadow-sm focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                >
                  <option value="">Tipo</option>
                  <option value="PROPIETARIO">Propietario</option>
                  <option value="ARRENDATARIO">Arrendatario</option>
                </select>
                <ChevronDown className="pointer-events-none absolute top-1/2 right-2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={handleCancelar}
            className="rounded-xl bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-600 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            Cancelar
          </button>
          <button
            onClick={handleEnviar}
            className="rounded-xl bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 active:bg-blue-800"
          >
            Enviar Invitación
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Modal 2: Perfil del Residente
// ---------------------------------------------------------------------------

function formatearFecha(desde: string): string {
  const meses: Record<string, string> = {
    ene: '01',
    feb: '02',
    mar: '03',
    abr: '04',
    may: '05',
    jun: '06',
    jul: '07',
    ago: '08',
    sep: '09',
    oct: '10',
    nov: '11',
    dic: '12',
  };
  const partes = desde.split(' ');
  if (partes.length !== 2) return desde;
  const mes = meses[partes[0]] ?? '01';
  const anio = partes[1];
  return `01/${mes}/${anio}`;
}

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

function ModalPerfilResidente({
  residente,
  onCerrar,
}: {
  residente: Residente | null;
  onCerrar: () => void;
}) {
  if (!residente) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900">
        {/* Encabezado */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
            Perfil del Residente
          </h2>
          <button
            onClick={onCerrar}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Header del residente */}
        <div className="mb-5 flex items-center gap-4">
          <div
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${residente.colorAvatar}`}
          >
            {residente.iniciales}
          </div>
          <div>
            <p className="font-bold text-zinc-900 dark:text-white">
              {residente.nombre}
            </p>
            <p className="text-sm text-zinc-400">
              {residente.torre} - Unidad {residente.unidad}
            </p>
          </div>
        </div>

        {/* Lista de campos */}
        <div className="divide-y divide-gray-100 dark:divide-zinc-800">
          <FilaDetalle label="Email">
            <a
              href={`mailto:${residente.email}`}
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              {residente.email}
            </a>
          </FilaDetalle>

          <FilaDetalle label="Teléfono">{residente.telefono}</FilaDetalle>

          <FilaDetalle label="Tipo">
            {residente.tipo === 'PROPIETARIO' ? 'Propietario' : 'Arrendatario'}
          </FilaDetalle>

          <FilaDetalle label="Estado">
            {residente.estado === 'ACTIVO' ? (
              <span className="font-semibold text-green-600 dark:text-green-400">
                Activo
              </span>
            ) : (
              <span className="font-semibold text-zinc-400">Inactivo</span>
            )}
          </FilaDetalle>

          <FilaDetalle label="Fecha de ingreso">
            {formatearFecha(residente.desde)}
          </FilaDetalle>

          <FilaDetalle label="Vehículo">{residente.vehiculo}</FilaDetalle>

          <FilaDetalle label="Mascotas">{residente.mascotas}</FilaDetalle>
        </div>

        {/* Botón cerrar */}
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
  const [busqueda, setBusqueda] = useState('');
  const [filtroTorre, setFiltroTorre] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');

  // Estado modales
  const [modalInvitar, setModalInvitar] = useState(false);
  const [residenteSeleccionado, setResidenteSeleccionado] =
    useState<Residente | null>(null);

  // Cálculos de stats
  const totalResidentes = RESIDENTES_MOCK.length;
  const totalActivos = RESIDENTES_MOCK.filter((r) => r.estado === 'ACTIVO').length;
  const totalPropietarios = RESIDENTES_MOCK.filter(
    (r) => r.tipo === 'PROPIETARIO',
  ).length;
  const totalArrendatarios = RESIDENTES_MOCK.filter(
    (r) => r.tipo === 'ARRENDATARIO',
  ).length;

  // Filtrado
  const residentesFiltrados = RESIDENTES_MOCK.filter((r) => {
    const coincideBusqueda =
      busqueda === '' ||
      r.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      r.email.toLowerCase().includes(busqueda.toLowerCase()) ||
      r.telefono.includes(busqueda);

    const coincideTorre = filtroTorre === '' || r.torre === filtroTorre;
    const coincideTipo = filtroTipo === '' || r.tipo === filtroTipo;
    const coincideEstado = filtroEstado === '' || r.estado === filtroEstado;

    return coincideBusqueda && coincideTorre && coincideTipo && coincideEstado;
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
          label="Total Residentes"
          valor={totalResidentes}
          colorIcono="text-blue-500"
          colorFondo="bg-blue-100 dark:bg-blue-950/40"
        />
        <StatCard
          icono={<User className="h-5 w-5" />}
          label="Activos"
          valor={totalActivos}
          colorIcono="text-green-600"
          colorFondo="bg-green-100 dark:bg-green-950/40"
        />
        <StatCard
          icono={<Home className="h-5 w-5" />}
          label="Propietarios"
          valor={totalPropietarios}
          colorIcono="text-orange-600"
          colorFondo="bg-orange-100 dark:bg-orange-950/40"
        />
        <StatCard
          icono={<Users className="h-5 w-5" />}
          label="Arrendatarios"
          valor={totalArrendatarios}
          colorIcono="text-orange-500"
          colorFondo="bg-orange-50 dark:bg-orange-950/30"
        />
      </div>

      {/* Barra de filtros y acciones */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          {/* Buscador */}
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar residente..."
              className="w-52 rounded-xl border border-zinc-200 bg-white py-2 pr-4 pl-9 text-sm text-zinc-700 shadow-sm focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:placeholder-zinc-500"
            />
          </div>

          {/* Filtro torres */}
          <SelectFiltro
            valor={filtroTorre}
            onChange={setFiltroTorre}
            placeholder="Todas"
            opciones={TORRES_UNICAS.map((t) => ({ label: t, value: t }))}
          />

          {/* Filtro tipo */}
          <SelectFiltro
            valor={filtroTipo}
            onChange={setFiltroTipo}
            placeholder="Todos los tipos"
            opciones={[
              { label: 'Propietario', value: 'PROPIETARIO' },
              { label: 'Arrendatario', value: 'ARRENDATARIO' },
            ]}
          />

          {/* Filtro estado */}
          <SelectFiltro
            valor={filtroEstado}
            onChange={setFiltroEstado}
            placeholder="Todos los estados"
            opciones={[
              { label: 'Activo', value: 'ACTIVO' },
              { label: 'Inactivo', value: 'INACTIVO' },
            ]}
          />
        </div>

        {/* Botón invitar */}
        <button
          onClick={() => setModalInvitar(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 active:bg-blue-800"
        >
          <UserPlus className="h-4 w-4" />
          Invitar Residente
        </button>
      </div>

      {/* Tabla */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-zinc-100 bg-zinc-50 text-xs font-bold tracking-wider text-zinc-500 uppercase dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-400">
              <tr>
                <th className="px-5 py-3">Residente</th>
                <th className="px-5 py-3">Unidad</th>
                <th className="px-5 py-3">Contacto</th>
                <th className="px-5 py-3">Tipo</th>
                <th className="px-5 py-3">Estado</th>
                <th className="px-5 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {residentesFiltrados.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-10 text-center text-sm text-zinc-400"
                  >
                    No se encontraron residentes con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                residentesFiltrados.map((residente) => (
                  <tr
                    key={residente.id}
                    className="transition-colors hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40"
                  >
                    {/* Residente */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${residente.colorAvatar}`}
                        >
                          {residente.iniciales}
                        </div>
                        <div>
                          <p className="font-semibold text-zinc-900 dark:text-white">
                            {residente.nombre}
                          </p>
                          <p className="text-xs text-zinc-400">
                            Desde {residente.desde}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Unidad */}
                    <td className="px-5 py-4 text-zinc-600 dark:text-zinc-300">
                      {residente.torre} - {residente.unidad}
                    </td>

                    {/* Contacto */}
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                          <Mail className="h-3.5 w-3.5 shrink-0" />
                          {residente.email}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                          <Phone className="h-3.5 w-3.5 shrink-0" />
                          {residente.telefono}
                        </span>
                      </div>
                    </td>

                    {/* Tipo */}
                    <td className="px-5 py-4">
                      <BadgeTipo tipo={residente.tipo} />
                    </td>

                    {/* Estado */}
                    <td className="px-5 py-4">
                      <BadgeEstado estado={residente.estado} />
                    </td>

                    {/* Acciones */}
                    <td className="px-5 py-4">
                      <button
                        onClick={() => setResidenteSeleccionado(residente)}
                        className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-800 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        Ver perfil
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal 1: Invitar Residente */}
      <ModalInvitarResidente
        abierto={modalInvitar}
        onCerrar={() => setModalInvitar(false)}
      />

      {/* Modal 2: Perfil del Residente */}
      <ModalPerfilResidente
        residente={residenteSeleccionado}
        onCerrar={() => setResidenteSeleccionado(null)}
      />
    </div>
  );
}

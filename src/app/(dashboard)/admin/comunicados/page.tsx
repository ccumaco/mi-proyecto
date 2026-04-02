'use client';

import { useState } from 'react';
import {
  Megaphone,
  Pin,
  Trash2,
  Plus,
  AlertTriangle,
  Info,
  Wrench,
  X,
  Send,
} from 'lucide-react';

// ─── Tipos ────────────────────────────────────────────────────────────────────

type TipoComunicado = 'General' | 'Urgente' | 'Informativo' | 'Mantenimiento';

interface Comunicado {
  id: number;
  tipo: TipoComunicado;
  titulo: string;
  contenido: string;
  fecha: string;
  para: string;
  fijado: boolean;
  publicado: boolean;
}

type DestinatariosComunicado = 'Todos' | 'Torre A' | 'Torre B' | 'Torre C';

// ─── Datos mock ───────────────────────────────────────────────────────────────

const COMUNICADOS_INICIALES: Comunicado[] = [
  {
    id: 1,
    tipo: 'Urgente',
    titulo: 'Corte de agua programado - Torre B',
    contenido:
      'Se informa que el día miércoles 19 de marzo se realizará un corte de agua en la Torre B desde las 8:00 AM hasta las 2:00 PM por mantenimiento de tuberías. Agradecemos su...',
    fecha: '16 de mar de 2026',
    para: 'Torre B',
    fijado: true,
    publicado: true,
  },
  {
    id: 2,
    tipo: 'General',
    titulo: 'Asamblea extraordinaria de propietarios',
    contenido:
      'Se convoca a todos los propietarios a la asamblea extraordinaria que se realizará el viernes 21 de marzo a las 7:00 PM en el salón comunal. Temas: presupuesto 2027,...',
    fecha: '15 de mar de 2026',
    para: 'Todos',
    fijado: true,
    publicado: true,
  },
  {
    id: 3,
    tipo: 'Informativo',
    titulo: 'Nuevos horarios del gimnasio',
    contenido:
      'A partir del 1 de abril, el gimnasio tendrá nuevos horarios: Lunes a Viernes de 5:00 AM a 10:00 PM, Sábados de 6:00 AM a 8:00 PM, Domingos de 7:00 AM a 6:00 PM.',
    fecha: '14 de mar de 2026',
    para: 'Todos',
    fijado: false,
    publicado: true,
  },
  {
    id: 4,
    tipo: 'Mantenimiento',
    titulo: 'Mantenimiento de ascensores',
    contenido:
      'Se realizará mantenimiento preventivo de los ascensores de las tres torres durante la semana del 24 al 28 de marzo. Se habilitará un solo ascensor por torre.',
    fecha: '13 de mar de 2026',
    para: 'Todos',
    fijado: false,
    publicado: true,
  },
  {
    id: 5,
    tipo: 'General',
    titulo: 'Recordatorio: Pago de expensas',
    contenido:
      'Se recuerda a los residentes que el plazo para el pago de expensas del mes de marzo vence el 15 de marzo. Evite recargos pagando a tiempo.',
    fecha: '12 de mar de 2026',
    para: 'Todos',
    fijado: false,
    publicado: true,
  },
  {
    id: 6,
    tipo: 'Informativo',
    titulo: 'Normas de uso de áreas comunes',
    contenido:
      'Se recuerda a todos los residentes respetar los horarios establecidos para el uso de zonas comunes: piscina, salón social y BBQ. Consulta el reglamento actualizado en recepción.',
    fecha: '10 de mar de 2026',
    para: 'Todos',
    fijado: false,
    publicado: false,
  },
];

const TABS: { label: string; value: TipoComunicado | 'Todos' }[] = [
  { label: 'Todos', value: 'Todos' },
  { label: 'General', value: 'General' },
  { label: 'Urgente', value: 'Urgente' },
  { label: 'Informativo', value: 'Informativo' },
  { label: 'Mantenimiento', value: 'Mantenimiento' },
];

// ─── Helpers de estilo ────────────────────────────────────────────────────────

function badgeClasses(tipo: TipoComunicado): string {
  switch (tipo) {
    case 'Urgente':
      return 'bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400';
    case 'General':
      return 'bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400';
    case 'Informativo':
      return 'bg-cyan-100 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400';
    case 'Mantenimiento':
      return 'bg-orange-100 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400';
  }
}

function borderLeftClass(tipo: TipoComunicado): string {
  switch (tipo) {
    case 'Urgente':
      return 'border-l-4 border-l-red-500';
    case 'General':
      return 'border-l-4 border-l-blue-500';
    case 'Informativo':
      return 'border-l-4 border-l-cyan-500';
    case 'Mantenimiento':
      return 'border-l-4 border-l-orange-500';
  }
}

function BadgeIcon({ tipo }: { tipo: TipoComunicado }) {
  const cls = 'h-3.5 w-3.5';
  switch (tipo) {
    case 'Urgente':
      return <AlertTriangle className={cls} />;
    case 'General':
      return <Megaphone className={cls} />;
    case 'Informativo':
      return <Info className={cls} />;
    case 'Mantenimiento':
      return <Wrench className={cls} />;
  }
}

// ─── Componente de badge ──────────────────────────────────────────────────────

function TipoBadge({ tipo }: { tipo: TipoComunicado }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${badgeClasses(tipo)}`}
    >
      <BadgeIcon tipo={tipo} />
      {tipo}
    </span>
  );
}

// ─── Card fijado ──────────────────────────────────────────────────────────────

function CardFijado({
  comunicado,
  onTogglePin,
  onEliminar,
}: {
  comunicado: Comunicado;
  onTogglePin: (id: number) => void;
  onEliminar: (id: number) => void;
}) {
  return (
    <div
      className={`relative rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-700 dark:bg-zinc-900 ${borderLeftClass(comunicado.tipo)}`}
    >
      {/* Acciones */}
      <div className="absolute top-4 right-4 flex items-center gap-1">
        <button
          onClick={() => onTogglePin(comunicado.id)}
          title="Desfijar comunicado"
          className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
        >
          <Pin className="h-4 w-4 fill-current text-purple-500" />
        </button>
        <button
          onClick={() => onEliminar(comunicado.id)}
          title="Eliminar comunicado"
          className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Badge tipo */}
      <TipoBadge tipo={comunicado.tipo} />

      {/* Título */}
      <h3 className="mt-2 pr-16 text-sm font-bold text-zinc-900 dark:text-white">
        {comunicado.titulo}
      </h3>

      {/* Contenido */}
      <p className="mt-1.5 line-clamp-3 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
        {comunicado.contenido}
      </p>

      {/* Meta */}
      <div className="mt-3 flex items-center gap-3 text-xs text-zinc-400">
        <span>{comunicado.fecha}</span>
        <span className="text-zinc-300 dark:text-zinc-600">•</span>
        <span>Para: {comunicado.para}</span>
      </div>
    </div>
  );
}

// ─── Card normal ──────────────────────────────────────────────────────────────

function CardComunicado({
  comunicado,
  onTogglePin,
  onEliminar,
}: {
  comunicado: Comunicado;
  onTogglePin: (id: number) => void;
  onEliminar: (id: number) => void;
}) {
  return (
    <div className="flex items-start gap-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900">
      {/* Contenido principal */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <TipoBadge tipo={comunicado.tipo} />
        </div>
        <h3 className="mt-2 text-sm font-bold text-zinc-900 dark:text-white">
          {comunicado.titulo}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
          {comunicado.contenido}
        </p>
        <div className="mt-2.5 flex items-center gap-3 text-xs text-zinc-400">
          <span>{comunicado.fecha}</span>
          <span className="text-zinc-300 dark:text-zinc-600">•</span>
          <span>Para: {comunicado.para}</span>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex shrink-0 items-center gap-1">
        <button
          onClick={() => onTogglePin(comunicado.id)}
          title="Fijar comunicado"
          className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-purple-500 dark:hover:bg-zinc-800"
        >
          <Pin className="h-4 w-4" />
        </button>
        <button
          onClick={() => onEliminar(comunicado.id)}
          title="Eliminar comunicado"
          className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// ─── Estado inicial del formulario + Página principal ────────────────────────

const FORM_INICIAL = {
  titulo: '',
  contenido: '',
  tipo: 'General' as TipoComunicado,
  destinatarios: 'Todos' as DestinatariosComunicado,
};

// ─── Página principal ─────────────────────────────────────────────────────────

export default function ComunicadosPage() {
  const [tabActivo, setTabActivo] = useState<TipoComunicado | 'Todos'>('Todos');
  const [comunicados, setComunicados] =
    useState<Comunicado[]>(COMUNICADOS_INICIALES);

  // Estado del modal
  const [modalAbierto, setModalAbierto] = useState(false);
  const [form, setForm] = useState(FORM_INICIAL);

  // Handlers de la lista
  const handleTogglePin = (id: number) => {
    setComunicados((prev) =>
      prev.map((c) => (c.id === id ? { ...c, fijado: !c.fijado } : c)),
    );
  };

  const handleEliminar = (id: number) => {
    setComunicados((prev) => prev.filter((c) => c.id !== id));
  };

  // Handlers del modal
  const abrirModal = () => {
    setForm(FORM_INICIAL);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setForm(FORM_INICIAL);
    setModalAbierto(false);
  };

  const formatearFecha = (): string => {
    return new Date().toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleGuardarBorrador = () => {
    if (!form.titulo.trim() || !form.contenido.trim()) return;
    const nuevo: Comunicado = {
      id: Date.now(),
      tipo: form.tipo,
      titulo: form.titulo.trim(),
      contenido: form.contenido.trim(),
      fecha: formatearFecha(),
      para: form.destinatarios,
      fijado: false,
      publicado: false,
    };
    setComunicados((prev) => [nuevo, ...prev]);
    cerrarModal();
  };

  const handlePublicar = () => {
    if (!form.titulo.trim() || !form.contenido.trim()) return;
    const nuevo: Comunicado = {
      id: Date.now(),
      tipo: form.tipo,
      titulo: form.titulo.trim(),
      contenido: form.contenido.trim(),
      fecha: formatearFecha(),
      para: form.destinatarios,
      fijado: false,
      publicado: true,
    };
    setComunicados((prev) => [nuevo, ...prev]);
    cerrarModal();
  };

  // Filtrado por tab
  const filtrados =
    tabActivo === 'Todos'
      ? comunicados
      : comunicados.filter((c) => c.tipo === tabActivo);

  const fijados = filtrados.filter((c) => c.fijado);
  const noFijados = filtrados.filter((c) => !c.fijado);

  // Stats (siempre sobre la lista completa sin filtrar)
  const totalComunicados = comunicados.length;
  const totalFijados = comunicados.filter((c) => c.fijado).length;
  const statsPublicados = comunicados.filter((c) => c.publicado).length;
  const statsBorradores = comunicados.filter((c) => !c.publicado).length;

  return (
    <div className="space-y-6">
      {/* ── Breadcrumb + Título ── */}
      <div>
        <nav className="mb-1 flex items-center gap-1.5 text-xs text-zinc-400">
          <span className="hover:text-zinc-600 dark:hover:text-zinc-300 cursor-default">
            Inicio
          </span>
          <span>/</span>
          <span className="font-medium text-zinc-600 dark:text-zinc-300">
            Comunicados
          </span>
        </nav>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Comunicados y Avisos
        </h1>
      </div>

      {/* ── Stats cards ── */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard
          icono={<Megaphone className="h-5 w-5" />}
          etiqueta="Total Comunicados"
          valor={String(totalComunicados)}
          colorIcono="bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
        />
        <StatCard
          icono={<Megaphone className="h-5 w-5" />}
          etiqueta="Publicados"
          valor={String(statsPublicados)}
          colorIcono="bg-green-100 text-green-600 dark:bg-green-950/40 dark:text-green-400"
        />
        <StatCard
          icono={<Megaphone className="h-5 w-5" />}
          etiqueta="Borradores"
          valor={String(statsBorradores)}
          colorIcono="bg-orange-100 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400"
        />
        <StatCard
          icono={<Pin className="h-5 w-5" />}
          etiqueta="Fijados"
          valor={String(totalFijados)}
          colorIcono="bg-purple-100 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400"
        />
      </div>

      {/* ── Tabs + Botón nuevo ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Tabs */}
        <div className="flex flex-wrap gap-1 rounded-xl border border-zinc-200 bg-zinc-50 p-1 dark:border-zinc-700 dark:bg-zinc-800/50">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setTabActivo(tab.value)}
              className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors ${
                tabActivo === tab.value
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-zinc-600 hover:bg-zinc-200 dark:text-zinc-400 dark:hover:bg-zinc-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Botón nuevo */}
        <button
          onClick={abrirModal}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 active:bg-blue-800"
        >
          <Plus className="h-4 w-4" />
          Nuevo Comunicado
        </button>
      </div>

      {/* ── Sección fijados ── */}
      {fijados.length > 0 && (
        <section className="space-y-3">
          <p className="text-xs font-semibold tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
            📌 Fijados
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {fijados.map((comunicado) => (
              <CardFijado
                key={comunicado.id}
                comunicado={comunicado}
                onTogglePin={handleTogglePin}
                onEliminar={handleEliminar}
              />
            ))}
          </div>
        </section>
      )}

      {/* ── Lista de comunicados normales ── */}
      {noFijados.length > 0 && (
        <section className="space-y-3">
          {fijados.length > 0 && (
            <p className="text-xs font-semibold tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
              Otros comunicados
            </p>
          )}
          <div className="space-y-3">
            {noFijados.map((comunicado) => (
              <CardComunicado
                key={comunicado.id}
                comunicado={comunicado}
                onTogglePin={handleTogglePin}
                onEliminar={handleEliminar}
              />
            ))}
          </div>
        </section>
      )}

      {/* ── Estado vacío ── */}
      {filtrados.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-zinc-50 py-16 text-center dark:border-zinc-700 dark:bg-zinc-800/30">
          <Megaphone className="mb-3 h-10 w-10 text-zinc-300 dark:text-zinc-600" />
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            No hay comunicados para esta categoría
          </p>
          <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
            Crea un nuevo comunicado usando el botón de arriba.
          </p>
        </div>
      )}

      {/* ── Modal Nuevo Comunicado ── */}
      {modalAbierto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={(e) => {
            if (e.target === e.currentTarget) cerrarModal();
          }}
        >
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            {/* Encabezado */}
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-zinc-900">
                Nuevo Comunicado
              </h2>
              <button
                onClick={cerrarModal}
                className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600"
                aria-label="Cerrar modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Cuerpo del formulario */}
            <div className="space-y-4">
              {/* Campo Título */}
              <div>
                <label
                  htmlFor="modal-titulo"
                  className="mb-1.5 block text-sm font-medium text-zinc-700"
                >
                  Título
                </label>
                <input
                  id="modal-titulo"
                  type="text"
                  value={form.titulo}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, titulo: e.target.value }))
                  }
                  placeholder="Título del comunicado"
                  className="w-full rounded-xl border border-zinc-300 px-3.5 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Campo Contenido */}
              <div>
                <label
                  htmlFor="modal-contenido"
                  className="mb-1.5 block text-sm font-medium text-zinc-700"
                >
                  Contenido
                </label>
                <textarea
                  id="modal-contenido"
                  rows={4}
                  value={form.contenido}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, contenido: e.target.value }))
                  }
                  placeholder="Escribe el comunicado..."
                  className="w-full resize-none rounded-xl border border-zinc-300 px-3.5 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Fila Tipo + Destinatarios */}
              <div className="grid grid-cols-2 gap-4">
                {/* Dropdown Tipo */}
                <div>
                  <label
                    htmlFor="modal-tipo"
                    className="mb-1.5 block text-sm font-medium text-zinc-700"
                  >
                    Tipo
                  </label>
                  <select
                    id="modal-tipo"
                    value={form.tipo}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        tipo: e.target.value as TipoComunicado,
                      }))
                    }
                    className="w-full rounded-xl border border-zinc-300 px-3.5 py-2.5 text-sm text-zinc-900 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="General">General</option>
                    <option value="Urgente">Urgente</option>
                    <option value="Informativo">Informativo</option>
                    <option value="Mantenimiento">Mantenimiento</option>
                  </select>
                </div>

                {/* Dropdown Destinatarios */}
                <div>
                  <label
                    htmlFor="modal-destinatarios"
                    className="mb-1.5 block text-sm font-medium text-zinc-700"
                  >
                    Destinatarios
                  </label>
                  <select
                    id="modal-destinatarios"
                    value={form.destinatarios}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        destinatarios: e.target.value as DestinatariosComunicado,
                      }))
                    }
                    className="w-full rounded-xl border border-zinc-300 px-3.5 py-2.5 text-sm text-zinc-900 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="Todos">Todos</option>
                    <option value="Torre A">Torre A</option>
                    <option value="Torre B">Torre B</option>
                    <option value="Torre C">Torre C</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={handleGuardarBorrador}
                className="rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 active:bg-zinc-100"
              >
                Guardar Borrador
              </button>
              <button
                onClick={handlePublicar}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 active:bg-blue-800"
              >
                <Send className="h-4 w-4" />
                Publicar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Componente StatCard local ────────────────────────────────────────────────

function StatCard({
  icono,
  etiqueta,
  valor,
  colorIcono,
}: {
  icono: React.ReactNode;
  etiqueta: string;
  valor: string;
  colorIcono: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${colorIcono}`}
      >
        {icono}
      </div>
      <div className="min-w-0">
        <p className="truncate text-xs font-semibold tracking-wide text-zinc-500 dark:text-zinc-400">
          {etiqueta}
        </p>
        <p className="text-xl font-black text-zinc-900 dark:text-white">
          {valor}
        </p>
      </div>
    </div>
  );
}

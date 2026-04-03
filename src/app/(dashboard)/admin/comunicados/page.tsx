'use client';

import { useState } from 'react';
import {
  Megaphone,
  Pin,
  Trash2,
  Plus,
  AlertTriangle,
  Info,
  X,
  Send,
  Pencil,
  Loader2,
} from 'lucide-react';
import { useAdminAnnouncements } from '@/features/admin/hooks/useAdminAnnouncements';
import type { AnnouncementAPI } from '@/features/admin/hooks/useAdminAnnouncements';

// ─── Tipos UI ─────────────────────────────────────────────────────────────────

type TipoUI = 'GENERAL' | 'URGENT' | 'INFO';
type TabValue = TipoUI | 'Todos';

const TABS: { label: string; value: TabValue }[] = [
  { label: 'Todos', value: 'Todos' },
  { label: 'General', value: 'GENERAL' },
  { label: 'Urgente', value: 'URGENT' },
  { label: 'Informativo', value: 'INFO' },
];

// ─── Helpers de estilo ────────────────────────────────────────────────────────

function badgeClasses(tipo: TipoUI): string {
  switch (tipo) {
    case 'URGENT':
      return 'bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400';
    case 'GENERAL':
      return 'bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400';
    case 'INFO':
      return 'bg-cyan-100 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400';
  }
}

function borderLeftClass(tipo: TipoUI): string {
  switch (tipo) {
    case 'URGENT':
      return 'border-l-4 border-l-red-500';
    case 'GENERAL':
      return 'border-l-4 border-l-blue-500';
    case 'INFO':
      return 'border-l-4 border-l-cyan-500';
  }
}

function tipoLabel(tipo: TipoUI): string {
  switch (tipo) {
    case 'URGENT':
      return 'Urgente';
    case 'GENERAL':
      return 'General';
    case 'INFO':
      return 'Informativo';
  }
}

function TipoBadge({ tipo }: { tipo: TipoUI }) {
  const icon =
    tipo === 'URGENT' ? (
      <AlertTriangle className="h-3.5 w-3.5" />
    ) : tipo === 'INFO' ? (
      <Info className="h-3.5 w-3.5" />
    ) : (
      <Megaphone className="h-3.5 w-3.5" />
    );
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${badgeClasses(tipo)}`}
    >
      {icon}
      {tipoLabel(tipo)}
    </span>
  );
}

function formatearFecha(isoString: string): string {
  return new Date(isoString).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// ─── Estado inicial del formulario ───────────────────────────────────────────

const FORM_INICIAL = {
  title: '',
  content: '',
  type: 'GENERAL' as TipoUI,
};

// ─── Página principal ─────────────────────────────────────────────────────────

export default function ComunicadosPage() {
  const {
    announcements,
    loading,
    error,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
  } = useAdminAnnouncements();

  const [tabActivo, setTabActivo] = useState<TabValue>('Todos');
  const [pinnedIds, setPinnedIds] = useState<Set<string>>(new Set());

  // Estado del modal crear/editar
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [form, setForm] = useState(FORM_INICIAL);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Handlers de pin (solo local, la API no maneja pins)
  const handleTogglePin = (id: string) => {
    setPinnedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleEliminar = async (id: string) => {
    try {
      await deleteAnnouncement(id);
      setPinnedIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } catch (err: any) {
      alert(err.message || 'No se pudo eliminar el comunicado');
    }
  };

  // Handlers del modal
  const abrirModalNuevo = () => {
    setForm(FORM_INICIAL);
    setEditandoId(null);
    setSubmitError(null);
    setModalAbierto(true);
  };

  const abrirModalEditar = (comunicado: AnnouncementAPI) => {
    setForm({
      title: comunicado.title,
      content: comunicado.content,
      type: comunicado.type,
    });
    setEditandoId(comunicado.id);
    setSubmitError(null);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setForm(FORM_INICIAL);
    setEditandoId(null);
    setSubmitError(null);
    setModalAbierto(false);
  };

  const handlePublicar = async () => {
    if (!form.title.trim() || !form.content.trim()) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      if (editandoId) {
        await updateAnnouncement(editandoId, {
          title: form.title.trim(),
          content: form.content.trim(),
          type: form.type,
        });
      } else {
        await createAnnouncement({
          title: form.title.trim(),
          content: form.content.trim(),
          type: form.type,
        });
      }
      cerrarModal();
    } catch (err: any) {
      setSubmitError(err.message || 'No se pudo guardar el comunicado');
    } finally {
      setSubmitting(false);
    }
  };

  // Filtrado por tab
  const filtrados =
    tabActivo === 'Todos'
      ? announcements
      : announcements.filter(c => c.type === tabActivo);

  const fijados = filtrados.filter(c => pinnedIds.has(c.id));
  const noFijados = filtrados.filter(c => !pinnedIds.has(c.id));

  const totalFijados = pinnedIds.size;

  return (
    <div className="space-y-6">
      {/* Breadcrumb + Título */}
      <div>
        <nav className="mb-1 flex items-center gap-1.5 text-xs text-zinc-400">
          <span className="cursor-default hover:text-zinc-600 dark:hover:text-zinc-300">
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

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard
          icono={<Megaphone className="h-5 w-5" />}
          etiqueta="Total Comunicados"
          valor={String(announcements.length)}
          colorIcono="bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
        />
        <StatCard
          icono={<Megaphone className="h-5 w-5" />}
          etiqueta="Generales"
          valor={String(announcements.filter(c => c.type === 'GENERAL').length)}
          colorIcono="bg-green-100 text-green-600 dark:bg-green-950/40 dark:text-green-400"
        />
        <StatCard
          icono={<AlertTriangle className="h-5 w-5" />}
          etiqueta="Urgentes"
          valor={String(announcements.filter(c => c.type === 'URGENT').length)}
          colorIcono="bg-orange-100 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400"
        />
        <StatCard
          icono={<Pin className="h-5 w-5" />}
          etiqueta="Fijados"
          valor={String(totalFijados)}
          colorIcono="bg-purple-100 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400"
        />
      </div>

      {/* Tabs + Botón nuevo */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1 rounded-xl border border-zinc-200 bg-zinc-50 p-1 dark:border-zinc-700 dark:bg-zinc-800/50">
          {TABS.map(tab => (
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
        <button
          onClick={abrirModalNuevo}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 active:bg-blue-800"
        >
          <Plus className="h-4 w-4" />
          Nuevo Comunicado
        </button>
      </div>

      {/* Estado de carga */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      )}

      {/* Estado de error */}
      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-800 dark:bg-red-950/20 dark:text-red-400">
          Error al cargar los comunicados: {error}
        </div>
      )}

      {/* Sección fijados */}
      {!loading && !error && fijados.length > 0 && (
        <section className="space-y-3">
          <p className="text-xs font-semibold tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
            Fijados
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {fijados.map(comunicado => (
              <CardFijado
                key={comunicado.id}
                comunicado={comunicado}
                onTogglePin={handleTogglePin}
                onEliminar={handleEliminar}
                onEditar={abrirModalEditar}
              />
            ))}
          </div>
        </section>
      )}

      {/* Lista de comunicados normales */}
      {!loading && !error && noFijados.length > 0 && (
        <section className="space-y-3">
          {fijados.length > 0 && (
            <p className="text-xs font-semibold tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
              Otros comunicados
            </p>
          )}
          <div className="space-y-3">
            {noFijados.map(comunicado => (
              <CardComunicado
                key={comunicado.id}
                comunicado={comunicado}
                onTogglePin={handleTogglePin}
                onEliminar={handleEliminar}
                onEditar={abrirModalEditar}
              />
            ))}
          </div>
        </section>
      )}

      {/* Estado vacío */}
      {!loading && !error && filtrados.length === 0 && (
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

      {/* Modal Nuevo / Editar Comunicado */}
      {modalAbierto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={e => {
            if (e.target === e.currentTarget) cerrarModal();
          }}
        >
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                {editandoId ? 'Editar Comunicado' : 'Nuevo Comunicado'}
              </h2>
              <button
                onClick={cerrarModal}
                className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                aria-label="Cerrar modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="modal-titulo"
                  className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Título
                </label>
                <input
                  id="modal-titulo"
                  type="text"
                  value={form.title}
                  onChange={e =>
                    setForm(prev => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Título del comunicado"
                  className="w-full rounded-xl border border-zinc-300 px-3.5 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 transition-colors outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500"
                />
              </div>

              <div>
                <label
                  htmlFor="modal-contenido"
                  className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Contenido
                </label>
                <textarea
                  id="modal-contenido"
                  rows={4}
                  value={form.content}
                  onChange={e =>
                    setForm(prev => ({ ...prev, content: e.target.value }))
                  }
                  placeholder="Escribe el comunicado..."
                  className="w-full resize-none rounded-xl border border-zinc-300 px-3.5 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 transition-colors outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500"
                />
              </div>

              <div>
                <label
                  htmlFor="modal-tipo"
                  className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Tipo
                </label>
                <select
                  id="modal-tipo"
                  value={form.type}
                  onChange={e =>
                    setForm(prev => ({
                      ...prev,
                      type: e.target.value as TipoUI,
                    }))
                  }
                  className="w-full rounded-xl border border-zinc-300 px-3.5 py-2.5 text-sm text-zinc-900 transition-colors outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
                >
                  <option value="GENERAL">General</option>
                  <option value="URGENT">Urgente</option>
                  <option value="INFO">Informativo</option>
                </select>
              </div>
            </div>

            {submitError && (
              <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/20 dark:text-red-400">
                {submitError}
              </div>
            )}

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={cerrarModal}
                disabled={submitting}
                className="rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 active:bg-zinc-100 disabled:opacity-60 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
              >
                Cancelar
              </button>
              <button
                onClick={handlePublicar}
                disabled={
                  submitting || !form.title.trim() || !form.content.trim()
                }
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {editandoId ? 'Guardar cambios' : 'Publicar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Card fijado ──────────────────────────────────────────────────────────────

function CardFijado({
  comunicado,
  onTogglePin,
  onEliminar,
  onEditar,
}: {
  comunicado: AnnouncementAPI;
  onTogglePin: (id: string) => void;
  onEliminar: (id: string) => void;
  onEditar: (comunicado: AnnouncementAPI) => void;
}) {
  return (
    <div
      className={`relative rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-700 dark:bg-zinc-900 ${borderLeftClass(comunicado.type)}`}
    >
      <div className="absolute top-4 right-4 flex items-center gap-1">
        <button
          onClick={() => onEditar(comunicado)}
          title="Editar comunicado"
          className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
        >
          <Pencil className="h-4 w-4" />
        </button>
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

      <TipoBadge tipo={comunicado.type} />
      <h3 className="mt-2 pr-28 text-sm font-bold text-zinc-900 dark:text-white">
        {comunicado.title}
      </h3>
      <p className="mt-1.5 line-clamp-3 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
        {comunicado.content}
      </p>
      <div className="mt-3 flex items-center gap-3 text-xs text-zinc-400">
        <span>{formatearFecha(comunicado.createdAt)}</span>
      </div>
    </div>
  );
}

// ─── Card normal ──────────────────────────────────────────────────────────────

function CardComunicado({
  comunicado,
  onTogglePin,
  onEliminar,
  onEditar,
}: {
  comunicado: AnnouncementAPI;
  onTogglePin: (id: string) => void;
  onEliminar: (id: string) => void;
  onEditar: (comunicado: AnnouncementAPI) => void;
}) {
  return (
    <div className="flex items-start gap-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <TipoBadge tipo={comunicado.type} />
        </div>
        <h3 className="mt-2 text-sm font-bold text-zinc-900 dark:text-white">
          {comunicado.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
          {comunicado.content}
        </p>
        <div className="mt-2.5 flex items-center gap-3 text-xs text-zinc-400">
          <span>{formatearFecha(comunicado.createdAt)}</span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <button
          onClick={() => onEditar(comunicado)}
          title="Editar comunicado"
          className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800"
        >
          <Pencil className="h-4 w-4" />
        </button>
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
        <p className="truncate text-xs font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
          {etiqueta}
        </p>
        <p className="text-xl font-black text-zinc-900 dark:text-white">
          {valor}
        </p>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  faFileAlt,
  faFilePdf,
  faFileExcel,
  faFolderOpen,
  faSearch,
  faCloudUploadAlt,
  faEye,
  faDownload,
  faTrashAlt,
  faTimes,
  faUpload,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// ─── Tipos locales ────────────────────────────────────────────────────────────

type Categoria = 'ACTAS' | 'REGLAMENTOS' | 'INFORMES' | 'CONTRATOS' | 'OTROS';
type FormatoArchivo = 'PDF' | 'XLSX';

interface Documento {
  id: string;
  nombre: string;
  formato: FormatoArchivo;
  subidoPor: string;
  categoria: Categoria;
  tamanio: string;
  fecha: string;
  descargas: number;
}

// ─── Datos mock ───────────────────────────────────────────────────────────────

const DOCUMENTOS_MOCK: Documento[] = [
  {
    id: '1',
    nombre: 'Acta Asamblea General 2025',
    formato: 'PDF',
    subidoPor: 'Carlos Méndez',
    categoria: 'ACTAS',
    tamanio: '2.4 MB',
    fecha: '14 de feb de 2026',
    descargas: 45,
  },
  {
    id: '2',
    nombre: 'Reglamento Interno - Actualizado 2026',
    formato: 'PDF',
    subidoPor: 'Carlos Méndez',
    categoria: 'REGLAMENTOS',
    tamanio: '1.8 MB',
    fecha: '9 de ene de 2026',
    descargas: 89,
  },
  {
    id: '3',
    nombre: 'Informe Financiero Enero 2026',
    formato: 'XLSX',
    subidoPor: 'Carlos Méndez',
    categoria: 'INFORMES',
    tamanio: '3.2 MB',
    fecha: '31 de ene de 2026',
    descargas: 32,
  },
  {
    id: '4',
    nombre: 'Contrato Empresa de Seguridad',
    formato: 'PDF',
    subidoPor: 'Carlos Méndez',
    categoria: 'CONTRATOS',
    tamanio: '1.1 MB',
    fecha: '19 de nov de 2025',
    descargas: 12,
  },
  {
    id: '5',
    nombre: 'Manual de Convivencia',
    formato: 'PDF',
    subidoPor: 'Carlos Méndez',
    categoria: 'REGLAMENTOS',
    tamanio: '4.5 MB',
    fecha: '31 de may de 2025',
    descargas: 156,
  },
  {
    id: '6',
    nombre: 'Acta Asamblea Extraordinaria Sep 2025',
    formato: 'PDF',
    subidoPor: 'Carlos Méndez',
    categoria: 'ACTAS',
    tamanio: '1.9 MB',
    fecha: '29 de sept de 2025',
    descargas: 28,
  },
  {
    id: '7',
    nombre: 'Informe Financiero Febrero 2026',
    formato: 'XLSX',
    subidoPor: 'Carlos Méndez',
    categoria: 'INFORMES',
    tamanio: '2.8 MB',
    fecha: '4 de mar de 2026',
    descargas: 18,
  },
  {
    id: '8',
    nombre: 'Contrato Mantenimiento Ascensores',
    formato: 'PDF',
    subidoPor: 'Carlos Méndez',
    categoria: 'CONTRATOS',
    tamanio: '890 KB',
    fecha: '14 de ago de 2025',
    descargas: 8,
  },
];

// ─── Configuración de estilos por categoría ───────────────────────────────────

const CATEGORIA_ESTILOS: Record<
  Categoria,
  { badge: string; stat: string; icono: string }
> = {
  ACTAS: {
    badge:
      'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
    stat: 'bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400',
    icono: 'bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400',
  },
  REGLAMENTOS: {
    badge:
      'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300',
    stat: 'bg-purple-50 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400',
    icono:
      'bg-purple-50 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400',
  },
  INFORMES: {
    badge:
      'bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-300',
    stat: 'bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400',
    icono:
      'bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400',
  },
  CONTRATOS: {
    badge:
      'bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300',
    stat: 'bg-orange-50 text-orange-600 dark:bg-orange-950/30 dark:text-orange-400',
    icono:
      'bg-orange-50 text-orange-600 dark:bg-orange-950/30 dark:text-orange-400',
  },
  OTROS: {
    badge:
      'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
    stat: 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400',
    icono: 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400',
  },
};

const CATEGORIA_LABEL: Record<Categoria, string> = {
  ACTAS: 'Actas',
  REGLAMENTOS: 'Reglamentos',
  INFORMES: 'Informes',
  CONTRATOS: 'Contratos',
  OTROS: 'Otros',
};

// ─── Subcomponentes ───────────────────────────────────────────────────────────

function StatCard({
  categoria,
  cantidad,
}: {
  categoria: Categoria;
  cantidad: number;
}) {
  const estilos = CATEGORIA_ESTILOS[categoria];
  const icono = categoria === 'OTROS' ? faFolderOpen : faFileAlt;

  return (
    <Card padding="sm" className="flex items-center gap-4">
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${estilos.icono}`}
      >
        <FontAwesomeIcon icon={icono} className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs font-bold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
          {CATEGORIA_LABEL[categoria]}
        </p>
        <p className="text-2xl font-black text-zinc-900 dark:text-white">
          {cantidad}
        </p>
      </div>
    </Card>
  );
}

function BadgeCategoria({ categoria }: { categoria: Categoria }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-wide uppercase ${CATEGORIA_ESTILOS[categoria].badge}`}
    >
      {CATEGORIA_LABEL[categoria]}
    </span>
  );
}

function IconoFormato({ formato }: { formato: FormatoArchivo }) {
  if (formato === 'PDF') {
    return (
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400">
        <FontAwesomeIcon icon={faFilePdf} className="h-4 w-4" />
      </div>
    );
  }
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400">
      <FontAwesomeIcon icon={faFileExcel} className="h-4 w-4" />
    </div>
  );
}

// ─── Tipos del modal ──────────────────────────────────────────────────────────

type CategoriaForm = 'Actas' | 'Reglamentos' | 'Informes' | 'Contratos' | 'Otros';

interface FormSubida {
  nombre: string;
  categoria: CategoriaForm;
  archivo: File | null;
}

const FORM_INICIAL: FormSubida = {
  nombre: '',
  categoria: 'Actas',
  archivo: null,
};

// ─── Página principal ─────────────────────────────────────────────────────────

export default function DocumentosPage() {
  const [busqueda, setBusqueda] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [form, setForm] = useState<FormSubida>(FORM_INICIAL);

  function abrirModal() {
    setModalAbierto(true);
  }

  function cerrarModal() {
    setModalAbierto(false);
    setForm(FORM_INICIAL);
  }

  function handleArchivoSeleccionado(e: React.ChangeEvent<HTMLInputElement>) {
    const archivo = e.target.files?.[0] ?? null;
    setForm(prev => ({ ...prev, archivo }));
  }

  function handleSubir() {
    console.log('Subir documento:', {
      nombre: form.nombre,
      categoria: form.categoria,
      archivo: form.archivo?.name ?? null,
    });
    alert(
      `Documento "${form.nombre}" (${form.categoria}) listo para subir.\nArchivo: ${form.archivo?.name ?? 'Sin archivo'}`,
    );
    cerrarModal();
  }

  const documentosFiltrados = DOCUMENTOS_MOCK.filter(doc =>
    doc.nombre.toLowerCase().includes(busqueda.toLowerCase()),
  );

  const contarPorCategoria = (cat: Categoria) =>
    DOCUMENTOS_MOCK.filter(d => d.categoria === cat).length;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-sm text-zinc-400">
          <li>
            <span className="hover:text-zinc-600 cursor-default dark:hover:text-zinc-300">
              Inicio
            </span>
          </li>
          <li>
            <span className="select-none">/</span>
          </li>
          <li className="font-semibold text-zinc-700 dark:text-zinc-200">
            Documentos
          </li>
        </ol>
      </nav>

      {/* Título */}
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
          Gestión de Documentos
        </h1>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard categoria="ACTAS" cantidad={contarPorCategoria('ACTAS')} />
        <StatCard
          categoria="REGLAMENTOS"
          cantidad={contarPorCategoria('REGLAMENTOS')}
        />
        <StatCard
          categoria="INFORMES"
          cantidad={contarPorCategoria('INFORMES')}
        />
        <StatCard
          categoria="CONTRATOS"
          cantidad={contarPorCategoria('CONTRATOS')}
        />
        <StatCard categoria="OTROS" cantidad={contarPorCategoria('OTROS')} />
      </div>

      {/* Barra de acciones */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <FontAwesomeIcon
            icon={faSearch}
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
          />
          <input
            type="text"
            placeholder="Buscar documento..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:placeholder-zinc-500"
          />
        </div>
        <Button variant="primary" size="md" onClick={abrirModal}>
          <FontAwesomeIcon icon={faCloudUploadAlt} className="mr-2 h-4 w-4" />
          Subir Documento
        </Button>
      </div>

      {/* Tabla de documentos */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-100 text-sm dark:divide-zinc-800">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-800/50">
                <th className="px-6 py-3.5 text-left text-xs font-bold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                  Documento
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-bold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                  Categoría
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-bold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                  Tamaño
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-bold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                  Fecha
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-bold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                  Descargas
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-bold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 bg-white dark:divide-zinc-800 dark:bg-zinc-900">
              {documentosFiltrados.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-sm text-zinc-400"
                  >
                    No se encontraron documentos que coincidan con la búsqueda.
                  </td>
                </tr>
              ) : (
                documentosFiltrados.map(doc => (
                  <tr
                    key={doc.id}
                    className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
                  >
                    {/* Documento */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <IconoFormato formato={doc.formato} />
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-zinc-900 dark:text-white">
                            {doc.nombre}
                          </p>
                          <p className="mt-0.5 text-xs text-zinc-400">
                            {doc.formato} · Subido por {doc.subidoPor}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Categoría */}
                    <td className="px-6 py-4">
                      <BadgeCategoria categoria={doc.categoria} />
                    </td>

                    {/* Tamaño */}
                    <td className="whitespace-nowrap px-6 py-4 text-zinc-600 dark:text-zinc-300">
                      {doc.tamanio}
                    </td>

                    {/* Fecha */}
                    <td className="whitespace-nowrap px-6 py-4 text-zinc-600 dark:text-zinc-300">
                      {doc.fecha}
                    </td>

                    {/* Descargas */}
                    <td className="whitespace-nowrap px-6 py-4 text-zinc-600 dark:text-zinc-300">
                      {doc.descargas}
                    </td>

                    {/* Acciones */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          title="Ver documento"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-zinc-200"
                        >
                          <FontAwesomeIcon icon={faEye} className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          title="Descargar documento"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/30 dark:hover:text-blue-400"
                        >
                          <FontAwesomeIcon
                            icon={faDownload}
                            className="h-4 w-4"
                          />
                        </button>
                        <button
                          type="button"
                          title="Eliminar documento"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                        >
                          <FontAwesomeIcon
                            icon={faTrashAlt}
                            className="h-4 w-4"
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal: Subir Documento */}
      {modalAbierto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={e => {
            if (e.target === e.currentTarget) cerrarModal();
          }}
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900">
            {/* Cabecera */}
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                Subir Documento
              </h2>
              <button
                type="button"
                onClick={cerrarModal}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-zinc-200"
                aria-label="Cerrar modal"
              >
                <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
              </button>
            </div>

            {/* Zona drag & drop */}
            <label className="mb-4 flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed border-gray-200 p-8 text-center transition-colors hover:border-blue-400">
              <input
                type="file"
                accept=".pdf,.xlsx,.xls,.doc,.docx"
                className="hidden"
                onChange={handleArchivoSeleccionado}
              />
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-500 dark:bg-blue-950/30 dark:text-blue-400">
                <FontAwesomeIcon icon={faUpload} className="h-5 w-5" />
              </div>
              {form.archivo ? (
                <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
                  {form.archivo.name}
                </p>
              ) : (
                <>
                  <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
                    Arrastra un archivo o haz clic para seleccionar
                  </p>
                  <p className="text-xs text-zinc-400">
                    PDF, XLSX, DOC hasta 10MB
                  </p>
                </>
              )}
            </label>

            {/* Campo: nombre */}
            <div className="mb-4">
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Nombre del documento
              </label>
              <input
                type="text"
                placeholder="Nombre descriptivo"
                value={form.nombre}
                onChange={e => setForm(prev => ({ ...prev, nombre: e.target.value }))}
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500"
              />
            </div>

            {/* Campo: categoría */}
            <div className="mb-6">
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Categoría
              </label>
              <select
                value={form.categoria}
                onChange={e =>
                  setForm(prev => ({
                    ...prev,
                    categoria: e.target.value as CategoriaForm,
                  }))
                }
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              >
                <option value="Actas">Actas</option>
                <option value="Reglamentos">Reglamentos</option>
                <option value="Informes">Informes</option>
                <option value="Contratos">Contratos</option>
                <option value="Otros">Otros</option>
              </select>
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={cerrarModal}
                className="rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSubir}
                className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              >
                Subir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

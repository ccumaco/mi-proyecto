'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Loader2 } from 'lucide-react';
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
import { usePropertyId } from '@/features/admin/hooks/usePropertyId';
import { useDocuments } from '@/features/admin/hooks/useDocuments';
import type { DocumentAPI } from '@/features/admin/hooks/useDocuments';
import { useTranslations } from 'next-intl';

// ─── Tipos y configuración ────────────────────────────────────────────────────

type Categoria = 'ACTAS' | 'REGLAMENTOS' | 'INFORMES' | 'CONTRATOS' | 'OTROS';

const CATEGORIA_ESTILOS: Record<Categoria, { badge: string; icono: string }> = {
  ACTAS: {
    badge: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
    icono: 'bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400',
  },
  REGLAMENTOS: {
    badge: 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300',
    icono: 'bg-purple-50 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400',
  },
  INFORMES: {
    badge: 'bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-300',
    icono: 'bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400',
  },
  CONTRATOS: {
    badge: 'bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300',
    icono: 'bg-orange-50 text-orange-600 dark:bg-orange-950/30 dark:text-orange-400',
  },
  OTROS: {
    badge: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
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

const CATEGORIAS_API_MAP: Record<string, Categoria> = {
  Actas: 'ACTAS',
  Reglamentos: 'REGLAMENTOS',
  Informes: 'INFORMES',
  Contratos: 'CONTRATOS',
  Otros: 'OTROS',
  ACTAS: 'ACTAS',
  REGLAMENTOS: 'REGLAMENTOS',
  INFORMES: 'INFORMES',
  CONTRATOS: 'CONTRATOS',
  OTROS: 'OTROS',
};

function normalizeCategoria(cat?: string): Categoria {
  if (!cat) return 'OTROS';
  return CATEGORIAS_API_MAP[cat] ?? 'OTROS';
}

// ─── Subcomponentes ───────────────────────────────────────────────────────────

function StatCard({ categoria, cantidad }: { categoria: Categoria; cantidad: number }) {
  const estilos = CATEGORIA_ESTILOS[categoria];
  const icono = categoria === 'OTROS' ? faFolderOpen : faFileAlt;
  return (
    <Card padding="sm" className="flex items-center gap-4">
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${estilos.icono}`}>
        <FontAwesomeIcon icon={icono} className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          {CATEGORIA_LABEL[categoria]}
        </p>
        <p className="text-2xl font-black text-zinc-900 dark:text-white">{cantidad}</p>
      </div>
    </Card>
  );
}

function BadgeCategoria({ categoria }: { categoria: Categoria }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${CATEGORIA_ESTILOS[categoria].badge}`}
    >
      {CATEGORIA_LABEL[categoria]}
    </span>
  );
}

function IconoFormato({ filename }: { filename: string }) {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (ext === 'pdf') {
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

// ─── Formulario de subida ─────────────────────────────────────────────────────

interface FormSubida {
  nombre: string;
  descripcion: string;
  categoria: string;
  archivo: File | null;
}

const FORM_INICIAL: FormSubida = {
  nombre: '',
  descripcion: '',
  categoria: 'Actas',
  archivo: null,
};

// ─── Página principal ─────────────────────────────────────────────────────────

export default function DocumentosPage() {
  const t = useTranslations('admin.documentos');
  const { propertyId, loading: loadingProperty } = usePropertyId();
  const { documents, loading: loadingDocs, error, uploadDocument, deleteDocument } =
    useDocuments(propertyId);

  const [busqueda, setBusqueda] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [form, setForm] = useState<FormSubida>(FORM_INICIAL);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const loading = loadingProperty || loadingDocs;

  function abrirModal() {
    setModalAbierto(true);
    setSubmitError(null);
  }

  function cerrarModal() {
    setModalAbierto(false);
    setForm(FORM_INICIAL);
    setSubmitError(null);
  }

  function handleArchivoSeleccionado(e: React.ChangeEvent<HTMLInputElement>) {
    const archivo = e.target.files?.[0] ?? null;
    setForm(prev => ({ ...prev, archivo }));
  }

  async function handleSubir() {
    if (!form.archivo || !form.nombre.trim() || !propertyId) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const formData = new FormData();
      formData.append('file', form.archivo);
      formData.append('name', form.nombre.trim());
      formData.append('description', form.descripcion.trim());
      formData.append('category', form.categoria);
      formData.append('propertyId', propertyId);
      await uploadDocument(formData);
      cerrarModal();
    } catch (err: any) {
      setSubmitError(err.message || t('uploadError'));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleEliminar(id: string) {
    if (!confirm(t('confirmDelete'))) return;
    try {
      await deleteDocument(id);
    } catch (err: any) {
      alert(err.message || t('deleteError'));
    }
  }

  const documentosFiltrados = documents.filter(doc =>
    doc.name.toLowerCase().includes(busqueda.toLowerCase())
  );

  const contarPorCategoria = (cat: Categoria) =>
    documents.filter(d => normalizeCategoria(d.category) === cat).length;

  const formatearFecha = (isoString: string) =>
    new Date(isoString).toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-sm text-zinc-400">
          <li><span className="cursor-default hover:text-zinc-600 dark:hover:text-zinc-300">{t('breadcrumbHome')}</span></li>
          <li><span className="select-none">/</span></li>
          <li className="font-semibold text-zinc-700 dark:text-zinc-200">{t('breadcrumbDocuments')}</li>
        </ol>
      </nav>

      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
          {t('title')}
        </h1>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard categoria="ACTAS" cantidad={contarPorCategoria('ACTAS')} />
        <StatCard categoria="REGLAMENTOS" cantidad={contarPorCategoria('REGLAMENTOS')} />
        <StatCard categoria="INFORMES" cantidad={contarPorCategoria('INFORMES')} />
        <StatCard categoria="CONTRATOS" cantidad={contarPorCategoria('CONTRATOS')} />
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
            placeholder={t('searchPlaceholder')}
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:placeholder-zinc-500"
          />
        </div>
        <Button variant="primary" size="md" onClick={abrirModal}>
          <FontAwesomeIcon icon={faCloudUploadAlt} className="mr-2 h-4 w-4" />
          {t('uploadButton')}
        </Button>
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

      {/* Tabla de documentos */}
      {!loading && !error && (
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-100 text-sm dark:divide-zinc-800">
              <thead>
                <tr className="bg-zinc-50 dark:bg-zinc-800/50">
                  <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    {t('tableHeaderDocument')}
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    {t('tableHeaderCategory')}
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    {t('tableHeaderDate')}
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    {t('tableHeaderActions')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 bg-white dark:divide-zinc-800 dark:bg-zinc-900">
                {documentosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-sm text-zinc-400">
                      {documents.length === 0
                        ? t('emptyNoDocuments')
                        : t('emptyNoResults')}
                    </td>
                  </tr>
                ) : (
                  documentosFiltrados.map(doc => {
                    const categoria = normalizeCategoria(doc.category);
                    const fileUrl = doc.url.startsWith('http') ? doc.url : `${API_BASE.replace('/api', '')}${doc.url}`;
                    return (
                      <tr
                        key={doc.id}
                        className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
                      >
                        {/* Documento */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <IconoFormato filename={doc.filename} />
                            <div className="min-w-0">
                              <p className="truncate font-semibold text-zinc-900 dark:text-white">
                                {doc.name}
                              </p>
                              {doc.description && (
                                <p className="mt-0.5 truncate text-xs text-zinc-400">
                                  {doc.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Categoría */}
                        <td className="px-6 py-4">
                          <BadgeCategoria categoria={categoria} />
                        </td>

                        {/* Fecha */}
                        <td className="whitespace-nowrap px-6 py-4 text-zinc-600 dark:text-zinc-300">
                          {formatearFecha(doc.createdAt)}
                        </td>

                        {/* Acciones */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <a
                              href={fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              title={t('viewDocument')}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-zinc-200"
                            >
                              <FontAwesomeIcon icon={faEye} className="h-4 w-4" />
                            </a>
                            <a
                              href={fileUrl}
                              download
                              title={t('downloadDocument')}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/30 dark:hover:text-blue-400"
                            >
                              <FontAwesomeIcon icon={faDownload} className="h-4 w-4" />
                            </a>
                            <button
                              type="button"
                              title={t('deleteDocument')}
                              onClick={() => handleEliminar(doc.id)}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                            >
                              <FontAwesomeIcon icon={faTrashAlt} className="h-4 w-4" />
                            </button>
                          </div>
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

      {/* Modal: Subir Documento */}
      {modalAbierto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={e => { if (e.target === e.currentTarget) cerrarModal(); }}
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                {t('modalTitle')}
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
            <label className="mb-4 flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed border-gray-200 p-8 text-center transition-colors hover:border-blue-400 dark:border-zinc-700">
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
                    {t('dragOrClick')}
                  </p>
                  <p className="text-xs text-zinc-400">{t('fileTypes')}</p>
                </>
              )}
            </label>

            {/* Nombre */}
            <div className="mb-4">
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {t('fieldNameRequired')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder={t('fieldNamePlaceholder')}
                value={form.nombre}
                onChange={e => setForm(prev => ({ ...prev, nombre: e.target.value }))}
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500"
              />
            </div>

            {/* Descripción */}
            <div className="mb-4">
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {t('fieldDescription')}
              </label>
              <input
                type="text"
                placeholder={t('fieldDescriptionPlaceholder')}
                value={form.descripcion}
                onChange={e => setForm(prev => ({ ...prev, descripcion: e.target.value }))}
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500"
              />
            </div>

            {/* Categoría */}
            <div className="mb-6">
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {t('fieldCategory')}
              </label>
              <select
                value={form.categoria}
                onChange={e => setForm(prev => ({ ...prev, categoria: e.target.value }))}
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              >
                <option value="Actas">{t('categoryAcatas')}</option>
                <option value="Reglamentos">{t('categoryReglamentos')}</option>
                <option value="Informes">{t('categoryInformes')}</option>
                <option value="Contratos">{t('categoryContratos')}</option>
                <option value="Otros">{t('categoryOtros')}</option>
              </select>
            </div>

            {submitError && (
              <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/20 dark:text-red-400">
                {submitError}
              </div>
            )}

            {/* Botones */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={cerrarModal}
                disabled={submitting}
                className="rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                {t('cancelButton')}
              </button>
              <button
                type="button"
                onClick={handleSubir}
                disabled={submitting || !form.archivo || !form.nombre.trim()}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:opacity-60"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {t('uploadActionButton')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

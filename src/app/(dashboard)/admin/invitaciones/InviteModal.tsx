'use client';

import { useEffect, useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import {
  X,
  UserPlus,
  FileSpreadsheet,
  UploadCloud,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Mail,
  Loader2,
  Download,
} from 'lucide-react';
import { apiClient } from '@/lib/api';

interface Unit {
  id: string;
  unitNumber: string;
  block: string | null;
}

interface BulkRow {
  email: string;
  fullName?: string;
  phone?: string;
  unitNumber?: string;
  block?: string;
}

interface BulkError {
  row: number;
  email: string;
  reason: string;
}

interface Props {
  open: boolean;
  initialTab?: 'individual' | 'bulk';
  units: Unit[];
  onClose: () => void;
  onSuccess: (count: number, message: string) => void;
}

// Normaliza una clave: minúsculas, sin acentos, sin caracteres especiales
function normalizeKey(key: string): string {
  return key
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')  // quita acentos
    .replace(/[^a-z0-9\s]/g, ' ')     // reemplaza /, *, etc. por espacio
    .replace(/\s+/g, ' ')             // colapsa espacios múltiples
    .trim();
}

// Claves ya normalizadas (sin acentos, sin especiales)
const COLUMN_ALIASES: Record<string, keyof BulkRow> = {
  // email
  'email': 'email',
  'correo': 'email',
  'correo electronico': 'email',
  // fullName
  'fullname': 'fullName',
  'nombre': 'fullName',
  'nombre completo': 'fullName',
  'name': 'fullName',
  // phone
  'phone': 'phone',
  'celular': 'phone',
  'telefono': 'phone',
  // unitNumber
  'unitnumber': 'unitNumber',
  'unidad': 'unitNumber',
  'apartamento': 'unitNumber',
  'apto': 'unitNumber',
  'numero de unidad apto': 'unitNumber',
  'numero de unidad': 'unitNumber',
  // block
  'block': 'block',
  'torre': 'block',
  'bloque': 'block',
  'bloque torre': 'block',
};

function normalizeRows(rawRows: Record<string, string>[]): BulkRow[] {
  return rawRows
    .map(raw => {
      const row: BulkRow = { email: '' };
      for (const [key, value] of Object.entries(raw)) {
        const field = COLUMN_ALIASES[normalizeKey(key)];
        if (field && value) (row as any)[field] = String(value).trim();
      }
      return row;
    })
    .filter(r => r.email);
}

async function parseFile(file: File): Promise<BulkRow[]> {
  const isExcel = /\.(xlsx|xls)$/i.test(file.name);

  if (isExcel) {
    const buffer = await file.arrayBuffer();
    const wb = XLSX.read(buffer, { type: 'array' });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const raw = XLSX.utils.sheet_to_json<Record<string, string>>(ws, {
      defval: '',
    });
    return normalizeRows(raw);
  }

  // CSV / texto plano
  const text = await file.text();
  const lines = text.split(/\r?\n/).filter(l => l.trim() !== '');
  if (lines.length === 0) return [];

  const firstLine = lines[0].toLowerCase();
  const hasHeader = firstLine.includes('email') || firstLine.includes('correo');
  const headerLine = hasHeader
    ? lines[0]
    : 'email,fullName,phone,unitNumber,block';
  const headers = headerLine.split(/[,;\t]/).map(h => h.trim().toLowerCase());
  const dataLines = lines.slice(hasHeader ? 1 : 0);

  const rawRows: Record<string, string>[] = dataLines.map(line => {
    const cols = line.split(/[,;\t]/).map(c => c.trim().replace(/^"|"$/g, ''));
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => {
      obj[h] = cols[i] ?? '';
    });
    return obj;
  });

  return normalizeRows(rawRows);
}

// Encabezados que coinciden exactamente con los aliases registrados en COLUMN_ALIASES
const TEMPLATE_HEADERS = [
  'Correo Electrónico',
  'Nombre Completo',
  'Teléfono',
  'Número de Unidad/Apto',
  'Bloque/Torre',
];

const TEMPLATE_EXAMPLES = [
  ['juan.perez@ejemplo.com', 'Juan Pérez', '+573001234567', '101', 'Torre A'],
  ['maria.garcia@ejemplo.com', 'María García', '+573009876543', '202', 'Torre B'],
];

function downloadTemplate() {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([TEMPLATE_HEADERS, ...TEMPLATE_EXAMPLES]);

  ws['!cols'] = [{ wch: 30 }, { wch: 22 }, { wch: 18 }, { wch: 22 }, { wch: 14 }];

  const headerStyle = {
    font: { bold: true, color: { rgb: 'FFFFFF' } },
    fill: { fgColor: { rgb: '2563EB' } },
    alignment: { horizontal: 'center' },
  };

  TEMPLATE_HEADERS.forEach((_, col) => {
    const cellRef = XLSX.utils.encode_cell({ r: 0, c: col });
    if (ws[cellRef]) ws[cellRef].s = headerStyle;
  });

  XLSX.utils.book_append_sheet(wb, ws, 'Residentes');
  XLSX.writeFile(wb, 'plantilla-residentes.xlsx');
}

export default function InviteModal({
  open,
  initialTab = 'individual',
  units,
  onClose,
  onSuccess,
}: Props) {
  const [tab, setTab] = useState<'individual' | 'bulk'>(initialTab);

  useEffect(() => {
    if (open) setTab(initialTab);
  }, [open, initialTab]);

  // Individual
  const [indFullName, setIndFullName] = useState('');
  const [indEmail, setIndEmail] = useState('');
  const [indBlock, setIndBlock] = useState('');
  const [indUnitNumber, setIndUnitNumber] = useState('');
  const [indSending, setIndSending] = useState(false);
  const [indError, setIndError] = useState<string | null>(null);

  // Bulk
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [bulkProcessing, setBulkProcessing] = useState(false);
  const [bulkErrors, setBulkErrors] = useState<BulkError[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uniqueBlocks = Array.from(
    new Set(units.map(u => u.block).filter((b): b is string => b !== null))
  ).sort();

  const unitsByBlock = (block: string) =>
    units
      .filter(u => u.block === block)
      .map(u => u.unitNumber)
      .sort();

  const handleClose = () => {
    setIndFullName('');
    setIndEmail('');
    setIndBlock('');
    setIndUnitNumber('');
    setIndError(null);
    setFile(null);
    setBulkErrors(null);
    onClose();
  };

  const handleIndividual = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!indEmail.trim()) return;
    setIndSending(true);
    setIndError(null);
    try {
      await apiClient.createInvitation({
        email: indEmail.trim().toLowerCase(),
        fullName: indFullName.trim() || undefined,
        block: indBlock || undefined,
        unitNumber: indUnitNumber || undefined,
      });
      handleClose();
      onSuccess(1, '1 invitación enviada');
    } catch (err: any) {
      setIndError(err?.message ?? 'Error enviando invitación');
    } finally {
      setIndSending(false);
    }
  };

  const processBulk = async () => {
    if (!file) return;
    setBulkProcessing(true);
    setBulkErrors(null);
    try {
      const rows = await parseFile(file);
      if (rows.length === 0) {
        setBulkErrors([
          { row: 0, email: '', reason: 'El archivo no contiene filas válidas' },
        ]);
        return;
      }
      const result = await apiClient.createBulkInvitations(rows);
      if (result.failed && result.failed.length > 0) {
        setBulkErrors(result.failed);
      }
      if (result.sent > 0) {
        const msg = `${result.sent} invitación${result.sent !== 1 ? 'es' : ''} enviada${result.sent !== 1 ? 's' : ''}`;
        handleClose();
        onSuccess(result.sent, msg);
      } else if (!result.failed || result.failed.length === 0) {
        setBulkErrors([
          { row: 0, email: '', reason: 'No se enviaron invitaciones' },
        ]);
      }
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: any) {
      setBulkErrors([
        {
          row: 0,
          email: '',
          reason: err?.message ?? 'Error procesando archivo',
        },
      ]);
    } finally {
      setBulkProcessing(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl dark:bg-zinc-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4 dark:border-zinc-800">
          <h2 className="text-base font-bold text-zinc-900 dark:text-white">
            Nueva Invitación
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-zinc-100 px-6 pt-3 dark:border-zinc-800">
          <button
            type="button"
            onClick={() => setTab('individual')}
            className={`flex items-center gap-2 rounded-t-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
              tab === 'individual'
                ? 'border-primary text-primary border-b-2'
                : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
            }`}
          >
            <UserPlus className="h-4 w-4" />
            Individual
          </button>
          <button
            type="button"
            onClick={() => setTab('bulk')}
            className={`flex items-center gap-2 rounded-t-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
              tab === 'bulk'
                ? 'border-primary text-primary border-b-2'
                : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
            }`}
          >
            <FileSpreadsheet className="h-4 w-4" />
            Masivo Excel / CSV
          </button>
        </div>

        {/* Tab: Individual */}
        {tab === 'individual' && (
          <form onSubmit={handleIndividual} className="space-y-4 p-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                Nombre
              </label>
              <input
                type="text"
                value={indFullName}
                onChange={e => setIndFullName(e.target.value)}
                placeholder="Juan Pérez"
                className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 placeholder-zinc-400 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                Correo electrónico <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={indEmail}
                onChange={e => setIndEmail(e.target.value)}
                placeholder="juan@ejemplo.com"
                className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 placeholder-zinc-400 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  Torre
                </label>
                <select
                  value={indBlock}
                  onChange={e => {
                    setIndBlock(e.target.value);
                    setIndUnitNumber('');
                  }}
                  className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                >
                  <option value="">Sin torre</option>
                  {uniqueBlocks.map(block => (
                    <option key={block} value={block}>
                      {block}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  Apartamento
                </label>
                <select
                  value={indUnitNumber}
                  onChange={e => setIndUnitNumber(e.target.value)}
                  disabled={!indBlock}
                  className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 focus:border-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:disabled:bg-zinc-700"
                >
                  <option value="">Sin apartamento</option>
                  {indBlock &&
                    unitsByBlock(indBlock).map(unit => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {indError && (
              <div className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300">
                <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{indError}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-1">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={indSending || !indEmail.trim()}
                className="bg-primary inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {indSending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Mail className="h-4 w-4" />
                )}
                Enviar invitación
              </button>
            </div>
          </form>
        )}

        {/* Tab: Bulk CSV */}
        {tab === 'bulk' && (
          <div className="space-y-4 p-6">
            {/* Dropzone */}
            <div
              onDragOver={e => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={e => {
                e.preventDefault();
                setDragging(false);
                const f = e.dataTransfer.files[0];
                if (f) setFile(f);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 transition-colors ${
                dragging
                  ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/20'
                  : file
                    ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/20'
                    : 'border-zinc-300 bg-zinc-50 hover:border-blue-300 dark:border-zinc-700 dark:bg-zinc-800/40'
              }`}
            >
              {file ? (
                <>
                  <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                  <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                    {file.name}
                  </p>
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      setFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="text-xs text-zinc-500 underline"
                  >
                    Quitar archivo
                  </button>
                </>
              ) : (
                <>
                  <UploadCloud className="h-9 w-9 text-zinc-400" />
                  <p className="text-center text-sm text-zinc-600 dark:text-zinc-300">
                    Arrastra tu archivo o haz clic para seleccionar
                  </p>
                  <p className="text-xs text-zinc-400">
                    Excel (.xlsx, .xls) o CSV — máx. 500 filas
                  </p>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xls,.xlsx"
                className="hidden"
                onChange={e => setFile(e.target.files?.[0] ?? null)}
              />
            </div>

            {/* Errores de bulk */}
            {bulkErrors && (
              <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-4 dark:border-rose-900/60 dark:bg-rose-950/20">
                <div className="mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-rose-500" />
                  <span className="text-sm font-semibold text-rose-700 dark:text-rose-300">
                    {bulkErrors.length} fila{bulkErrors.length !== 1 ? 's' : ''}{' '}
                    con error
                  </span>
                </div>
                <ul className="max-h-36 space-y-1 overflow-y-auto">
                  {bulkErrors.map((err, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-xs text-rose-600 dark:text-rose-400"
                    >
                      <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      <span>
                        {err.row > 0 ? `Fila ${err.row}: ` : ''}
                        {err.reason}
                        {err.email ? ` — ${err.email}` : ''}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={downloadTemplate}
                className="text-primary inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"
              >
                <Download className="h-3.5 w-3.5" />
                Descargar plantilla .xlsx
              </button>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={processBulk}
                  disabled={!file || bulkProcessing}
                  className="bg-primary inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {bulkProcessing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <UploadCloud className="h-4 w-4" />
                  )}
                  Procesar archivo
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

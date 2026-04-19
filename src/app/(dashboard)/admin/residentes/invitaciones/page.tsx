'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  FileSpreadsheet,
  UserPlus,
  UploadCloud,
  Shield,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Mail,
  Search,
  Loader2,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { apiClient } from '@/lib/api';

type InvitationStatus = 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'CANCELLED';
type Tab = 'ALL' | 'PENDING' | 'EXPIRED';

interface Invitation {
  id: string;
  email: string;
  fullName: string | null;
  phone: string | null;
  status: InvitationStatus;
  effectiveStatus: InvitationStatus;
  expiresAt: string;
  createdAt: string;
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

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getInitials(nameOrEmail: string): string {
  const trimmed = nameOrEmail.trim();
  if (!trimmed) return '—';
  const [local] = trimmed.split('@');
  return local
    .split(/[\s._-]+/)
    .slice(0, 2)
    .map(p => p.charAt(0).toUpperCase())
    .filter(Boolean)
    .join('') || trimmed.charAt(0).toUpperCase();
}

const AVATAR_COLORS = [
  'bg-violet-400',
  'bg-sky-400',
  'bg-pink-400',
  'bg-emerald-400',
  'bg-amber-400',
  'bg-rose-400',
  'bg-teal-400',
  'bg-indigo-400',
];

function avatarColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function formatRelativeDate(iso: string, t: (k: string, values?: Record<string, string | number>) => string): string {
  const date = new Date(iso);
  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  const time = date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  if (sameDay) return t('today', { time });
  if (isYesterday) return t('yesterday', { time });
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

function parseCsv(text: string): BulkRow[] {
  const lines = text.split(/\r?\n/).filter(l => l.trim() !== '');
  if (lines.length === 0) return [];

  const firstLine = lines[0].toLowerCase();
  const hasHeader = firstLine.includes('email') || firstLine.includes('correo');
  const startIndex = hasHeader ? 1 : 0;
  const headers = hasHeader
    ? lines[0].split(/[,;\t]/).map(h => h.trim().toLowerCase())
    : ['email', 'fullname', 'phone', 'unitnumber', 'block'];

  const rows: BulkRow[] = [];
  for (let i = startIndex; i < lines.length; i++) {
    const cols = lines[i].split(/[,;\t]/).map(c => c.trim().replace(/^"|"$/g, ''));
    const row: BulkRow = { email: '' };
    headers.forEach((header, idx) => {
      const value = cols[idx] ?? '';
      if (['email', 'correo'].includes(header)) row.email = value;
      else if (['fullname', 'nombre', 'name'].includes(header)) row.fullName = value || undefined;
      else if (['phone', 'celular', 'telefono', 'teléfono'].includes(header)) row.phone = value || undefined;
      else if (['unitnumber', 'unidad', 'apartamento'].includes(header)) row.unitNumber = value || undefined;
      else if (['block', 'torre', 'bloque'].includes(header)) row.block = value || undefined;
    });
    if (row.email) rows.push(row);
  }
  return rows;
}

// ---------------------------------------------------------------------------
// Modales
// ---------------------------------------------------------------------------

function ModalExito({
  sent,
  onClose,
  t,
}: {
  sent: number;
  onClose: () => void;
  t: (k: string, values?: Record<string, string | number>) => string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl dark:bg-zinc-900">
        <div className="mb-5 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/40">
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
          </div>
        </div>
        <h3 className="text-center text-xl font-bold text-zinc-900 dark:text-white">
          {t('modalSuccessTitle')}
        </h3>
        <div className="mt-3 flex justify-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
            <UserPlus className="h-3.5 w-3.5" />
            {t('modalSuccessCount', { count: sent })}
          </span>
        </div>
        <p className="mt-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
          {t('modalSuccessDesc')}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-emerald-500 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
        >
          {t('modalSuccessCta')}
        </button>
        <p className="mt-3 text-center text-xs text-zinc-400">
          <Shield className="mr-1 inline h-3 w-3" />
          {t('modalSuccessFooter')}
        </p>
      </div>
    </div>
  );
}

function ModalErrorBulk({
  errors,
  onRetry,
  onClose,
  t,
}: {
  errors: BulkError[];
  onRetry: () => void;
  onClose: () => void;
  t: (k: string, values?: Record<string, string | number>) => string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900">
        <div className="mb-4 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-950/40">
            <AlertTriangle className="h-8 w-8 text-rose-500" />
          </div>
        </div>
        <h3 className="text-center text-lg font-bold text-zinc-900 dark:text-white">
          {t('modalErrorTitle')}
        </h3>
        <p className="mt-2 text-center text-sm text-zinc-500 dark:text-zinc-400">
          {t('modalErrorSummary', { count: errors.length })}
        </p>
        <ul className="mt-4 space-y-2 max-h-60 overflow-y-auto">
          {errors.map((err, idx) => (
            <li
              key={`${err.row}-${idx}`}
              className="flex items-start gap-3 rounded-lg border border-rose-200 bg-rose-50/60 p-3 text-xs dark:border-rose-900/60 dark:bg-rose-950/20"
            >
              <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
              <div>
                <p className="font-semibold text-rose-700 dark:text-rose-300">
                  {t('modalErrorRowLabel', { row: err.row })}: {err.reason}
                </p>
                {err.email && <p className="mt-0.5 text-rose-600/80 dark:text-rose-400/80">{err.email}</p>}
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-5 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            {t('modalErrorClose')}
          </button>
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white hover:opacity-90"
          >
            <UploadCloud className="h-4 w-4" />
            {t('modalErrorRetry')}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Página principal
// ---------------------------------------------------------------------------

export default function InvitacionesPage() {
  const t = useTranslations('admin.invitaciones');
  const [tab, setTab] = useState<Tab>('ALL');
  const [search, setSearch] = useState('');
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Individual
  const [indFullName, setIndFullName] = useState('');
  const [indEmail, setIndEmail] = useState('');
  const [indSending, setIndSending] = useState(false);
  const [indError, setIndError] = useState<string | null>(null);

  // Bulk
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [bulkProcessing, setBulkProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modales
  const [successSent, setSuccessSent] = useState<number | null>(null);
  const [bulkErrors, setBulkErrors] = useState<BulkError[] | null>(null);

  const loadInvitations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.getInvitations();
      setInvitations(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.message ?? 'Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvitations();
  }, []);

  const filtered = invitations.filter(i => {
    if (tab === 'PENDING' && i.effectiveStatus !== 'PENDING') return false;
    if (tab === 'EXPIRED' && i.effectiveStatus !== 'EXPIRED') return false;
    if (search) {
      const q = search.toLowerCase();
      const hay =
        i.email.toLowerCase().includes(q) ||
        (i.fullName ?? '').toLowerCase().includes(q);
      if (!hay) return false;
    }
    return true;
  });

  // Invitación individual
  const handleIndividual = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!indEmail.trim()) return;
    setIndSending(true);
    setIndError(null);
    try {
      await apiClient.createInvitation({
        email: indEmail.trim().toLowerCase(),
        fullName: indFullName.trim() || undefined,
      });
      setIndFullName('');
      setIndEmail('');
      setSuccessSent(1);
      await loadInvitations();
    } catch (err: any) {
      setIndError(err?.message ?? 'Error enviando invitación');
    } finally {
      setIndSending(false);
    }
  };

  // Carga masiva
  const handleFile = (f: File | null) => {
    setFile(f);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const processBulk = async () => {
    if (!file) return;
    setBulkProcessing(true);
    try {
      const text = await file.text();
      const rows = parseCsv(text);
      if (rows.length === 0) {
        setBulkErrors([{ row: 0, email: '', reason: t('bulkEmptyFile') }]);
        return;
      }
      const result = await apiClient.createBulkInvitations(rows);
      if (result.sent > 0) {
        setSuccessSent(result.sent);
        await loadInvitations();
      }
      if (result.failed && result.failed.length > 0) {
        setBulkErrors(result.failed);
      } else if (result.sent === 0) {
        setBulkErrors([{ row: 0, email: '', reason: t('bulkNoValidRows') }]);
      }
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: any) {
      setBulkErrors([{ row: 0, email: '', reason: err?.message ?? 'Error' }]);
    } finally {
      setBulkProcessing(false);
    }
  };

  const downloadTemplate = () => {
    const csv = 'email,fullName,phone,unitNumber,block\njuan@ejemplo.com,Juan Pérez,+573000000000,101,Torre A\n';
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plantilla-residentes.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // ------------------------------------------------------------------
  return (
    <div className="space-y-6">
      {/* Header con breadcrumb y botón */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <nav className="mb-1 flex items-center gap-1 text-sm text-zinc-400">
            <Link href="/admin" className="hover:text-zinc-600 dark:hover:text-zinc-300">
              {t('breadcrumbHome')}
            </Link>
            <span>/</span>
            <Link href="/admin/residentes" className="hover:text-zinc-600 dark:hover:text-zinc-300">
              {t('breadcrumbResidents')}
            </Link>
          </nav>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">{t('pageTitle')}</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-56 rounded-lg border border-zinc-200 bg-white py-2 pr-4 pl-9 text-sm text-zinc-700 shadow-sm focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
            />
          </div>
          <button
            type="button"
            onClick={() => document.getElementById('invitacion-individual')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white shadow-sm transition-opacity hover:opacity-90"
          >
            <UserPlus className="h-4 w-4" />
            {t('inviteButton')}
          </button>
        </div>
      </div>

      {/* Subtítulo / intro */}
      <div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{t('introTitle')}</h2>
        <p className="mt-1 max-w-2xl text-sm text-zinc-500 dark:text-zinc-400">{t('introDesc')}</p>
      </div>

      {/* Dos cards: Carga masiva + Invitación individual */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Carga masiva */}
        <Card>
          <div className="mb-4 flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">{t('bulkTitle')}</h3>
          </div>

          <div
            onDragOver={e => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-10 transition-colors ${
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
                <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">{file.name}</p>
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    handleFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="text-xs text-zinc-500 underline"
                >
                  {t('bulkClearFile')}
                </button>
              </>
            ) : (
              <>
                <UploadCloud className="h-10 w-10 text-zinc-400" />
                <p className="text-center text-sm text-zinc-600 dark:text-zinc-300">{t('bulkDropzone')}</p>
                <p className="text-xs text-zinc-400">{t('bulkMaxSize')}</p>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xls,.xlsx"
              className="hidden"
              onChange={e => handleFile(e.target.files?.[0] ?? null)}
            />
          </div>

          <div className="mt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={downloadTemplate}
              className="text-sm font-semibold text-primary hover:underline"
            >
              {t('bulkDownloadTemplate')}
            </button>
            <button
              type="button"
              onClick={processBulk}
              disabled={!file || bulkProcessing}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {bulkProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
              {t('bulkProcessButton')}
            </button>
          </div>
        </Card>

        {/* Invitación individual */}
        <Card>
          <div id="invitacion-individual" className="mb-4 flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">{t('individualTitle')}</h3>
          </div>
          <form onSubmit={handleIndividual} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                {t('individualNameLabel')}
              </label>
              <input
                type="text"
                value={indFullName}
                onChange={e => setIndFullName(e.target.value)}
                placeholder={t('individualNamePlaceholder')}
                className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 placeholder-zinc-400 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                {t('individualEmailLabel')}
                <span className="ml-0.5 text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={indEmail}
                onChange={e => setIndEmail(e.target.value)}
                placeholder={t('individualEmailPlaceholder')}
                className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 placeholder-zinc-400 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
              />
            </div>

            {indError && (
              <div className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300">
                <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{indError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={indSending || !indEmail.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {indSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
              {t('individualSendButton')}
            </button>
            <button
              type="button"
              className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
            >
              {t('individualAdvanced')}
            </button>
          </form>
        </Card>
      </div>

      {/* Lista de Invitaciones Recientes */}
      <Card padding="none">
        <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4 dark:border-zinc-800">
          <h3 className="text-base font-bold text-zinc-900 dark:text-white">{t('listTitle')}</h3>
          <div className="flex items-center gap-1 rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800/60">
            {(['ALL', 'PENDING', 'EXPIRED'] as Tab[]).map(tb => (
              <button
                key={tb}
                type="button"
                onClick={() => setTab(tb)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  tab === tb
                    ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white'
                    : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                }`}
              >
                {t(`tab${tb}`)}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          </div>
        )}

        {!loading && error && (
          <div className="px-5 py-8 text-center text-sm text-red-500">{error}</div>
        )}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-zinc-50 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:bg-zinc-800/50 dark:text-zinc-400">
                <tr>
                  <th className="px-5 py-3">{t('colResident')}</th>
                  <th className="px-5 py-3">{t('colEmail')}</th>
                  <th className="px-5 py-3">{t('colSentAt')}</th>
                  <th className="px-5 py-3">{t('colStatus')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-10 text-center text-sm text-zinc-400">
                      {t('noInvitations')}
                    </td>
                  </tr>
                ) : (
                  filtered.map(inv => {
                    const display = inv.fullName || inv.email;
                    return (
                      <tr key={inv.id} className="transition-colors hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${avatarColor(inv.id)}`}
                            >
                              {getInitials(display)}
                            </div>
                            <span className="font-semibold text-zinc-800 dark:text-zinc-100">{display}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-zinc-500 dark:text-zinc-400">{inv.email}</td>
                        <td className="px-5 py-4 text-zinc-500 dark:text-zinc-400">
                          {formatRelativeDate(inv.createdAt, t)}
                        </td>
                        <td className="px-5 py-4">
                          <StatusPill status={inv.effectiveStatus} t={t} />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="border-t border-zinc-100 px-5 py-3 text-xs text-zinc-400 dark:border-zinc-800">
            {t('showingCount', { visible: filtered.length, total: invitations.length })}
          </div>
        )}
      </Card>

      {/* Banner inferior */}
      <div className="flex items-center justify-center gap-3 rounded-xl bg-zinc-900 px-5 py-3 text-xs text-white">
        <Shield className="h-4 w-4 text-emerald-400" />
        <span className="font-semibold">{t('bannerSecurity')}</span>
        <span className="text-white/60">·</span>
        <span className="text-white/70">{t('bannerDesc')}</span>
      </div>

      {/* Modales */}
      {successSent !== null && (
        <ModalExito sent={successSent} onClose={() => setSuccessSent(null)} t={t} />
      )}
      {bulkErrors && (
        <ModalErrorBulk
          errors={bulkErrors}
          onRetry={() => {
            setBulkErrors(null);
            fileInputRef.current?.click();
          }}
          onClose={() => setBulkErrors(null)}
          t={t}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------

function StatusPill({ status, t }: { status: InvitationStatus; t: (k: string) => string }) {
  const config: Record<InvitationStatus, { label: string; className: string }> = {
    PENDING: {
      label: t('statusPending'),
      className: 'bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300',
    },
    ACCEPTED: {
      label: t('statusAccepted'),
      className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
    },
    EXPIRED: {
      label: t('statusExpired'),
      className: 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300',
    },
    CANCELLED: {
      label: t('statusCancelled'),
      className: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
    },
  };
  const cfg = config[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  UserPlus,
  FileSpreadsheet,
  Shield,
  AlertTriangle,
  Search,
  Loader2,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { apiClient } from '@/lib/api';
import InviteModal from './InviteModal';

type InvitationStatus = 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'CANCELLED';
type Tab = 'ALL' | 'PENDING' | 'EXPIRED';

interface Invitation {
  id: string;
  email: string;
  fullName: string | null;
  phone: string | null;
  unitNumber?: string;
  block?: string;
  status: InvitationStatus;
  effectiveStatus: InvitationStatus;
  expiresAt: string;
  createdAt: string;
}

interface Unit {
  id: string;
  unitNumber: string;
  block: string | null;
}

interface ToastState {
  message: string;
  type: 'success' | 'error';
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getInitials(nameOrEmail: string): string {
  const trimmed = nameOrEmail.trim();
  if (!trimmed) return '—';
  const [local] = trimmed.split('@');
  return (
    local
      .split(/[\s._-]+/)
      .slice(0, 2)
      .map(p => p.charAt(0).toUpperCase())
      .filter(Boolean)
      .join('') || trimmed.charAt(0).toUpperCase()
  );
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

function formatRelativeDate(
  iso: string,
  t: (k: string, values?: Record<string, string | number>) => string
): string {
  const date = new Date(iso);
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  const time = date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  if (date.toDateString() === now.toDateString()) return t('today', { time });
  if (date.toDateString() === yesterday.toDateString()) return t('yesterday', { time });
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

// ---------------------------------------------------------------------------
// Página principal
// ---------------------------------------------------------------------------

const ITEMS_PER_PAGE = 10;

export default function InvitacionesPage() {
  const t = useTranslations('admin.invitaciones');
  const [tab, setTab] = useState<Tab>('ALL');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1 });

  // Modal invitar
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteTab, setInviteTab] = useState<'individual' | 'bulk'>('individual');

  // Toast
  const [toast, setToast] = useState<ToastState | null>(null);

  // Edit modal
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFullName, setEditFullName] = useState('');
  const [editBlock, setEditBlock] = useState('');
  const [editUnitNumber, setEditUnitNumber] = useState('');
  const [editSaving, setEditSaving] = useState(false);

  // Delete modal
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteDeleting, setDeleteDeleting] = useState(false);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadInvitations = async (page = currentPage) => {
    setLoading(true);
    setError(null);
    try {
      const [result, unitsData] = await Promise.all([
        apiClient.getInvitations({
          status: tab === 'ALL' ? undefined : tab,
          search: search || undefined,
          page,
          limit: ITEMS_PER_PAGE,
        }),
        units.length === 0 ? apiClient.getUnits() : Promise.resolve(units),
      ]);
      setInvitations(result.data);
      setMeta({ total: result.meta.total, totalPages: result.meta.totalPages });
      if (units.length === 0) setUnits(Array.isArray(unitsData) ? unitsData as Unit[] : []);
    } catch (err: any) {
      setError(err?.message ?? 'Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvitations(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, search, currentPage]);

  // Debounce: actualiza `search` 400ms después del último keystroke
  useEffect(() => {
    const id = setTimeout(() => {
      setSearch(searchInput);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(id);
  }, [searchInput]);

  const uniqueBlocks = Array.from(
    new Set(units.map(u => u.block).filter((b): b is string => b !== null))
  ).sort();
  const unitsByBlock = (block: string) =>
    units.filter(u => u.block === block).map(u => u.unitNumber).sort();

  const openEdit = (inv: Invitation) => {
    setEditingId(inv.id);
    setEditFullName(inv.fullName || '');
    setEditBlock(inv.block || '');
    setEditUnitNumber(inv.unitNumber || '');
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    setEditSaving(true);
    try {
      await apiClient.updateInvitation(editingId, {
        fullName: editFullName || undefined,
        block: editBlock || undefined,
        unitNumber: editUnitNumber || undefined,
      });
      setEditingId(null);
      showToast('Invitación actualizada');
      await loadInvitations(currentPage);
    } catch (err: any) {
      showToast(err?.message ?? 'Error al actualizar', 'error');
    } finally {
      setEditSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setDeleteDeleting(true);
    try {
      await apiClient.cancelInvitation(deletingId);
      setDeletingId(null);
      showToast('Invitación eliminada');
      // Si era el único item de la página, retroceder una página
      const newPage = invitations.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
      setCurrentPage(newPage);
      await loadInvitations(newPage);
    } catch (err: any) {
      showToast(err?.message ?? 'Error al eliminar', 'error');
    } finally {
      setDeleteDeleting(false);
    }
  };

  // ------------------------------------------------------------------
  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed right-5 top-5 z-100 flex items-center gap-3 rounded-xl px-4 py-3 shadow-lg ${
            toast.type === 'success'
              ? 'bg-emerald-600 text-white'
              : 'bg-rose-600 text-white'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          ) : (
            <XCircle className="h-4 w-4 shrink-0" />
          )}
          <span className="text-sm font-semibold">{toast.message}</span>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="ml-1 rounded p-0.5 opacity-70 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <nav className="mb-1 flex items-center gap-1 text-sm text-zinc-400">
            <Link href="/admin" className="hover:text-zinc-600 dark:hover:text-zinc-300">
              {t('breadcrumbHome')}
            </Link>
            <span>/</span>
            <span className="text-zinc-700 dark:text-zinc-300">{t('pageTitle')}</span>
          </nav>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">{t('pageTitle')}</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-52 rounded-lg border border-zinc-200 bg-white py-2 pr-4 pl-9 text-sm text-zinc-700 shadow-sm focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
            />
          </div>
          <button
            type="button"
            onClick={() => { setInviteTab('bulk'); setInviteOpen(true); }}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Carga masiva
          </button>
          <button
            type="button"
            onClick={() => { setInviteTab('individual'); setInviteOpen(true); }}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white shadow-sm transition-opacity hover:opacity-90"
          >
            <UserPlus className="h-4 w-4" />
            {t('inviteButton')}
          </button>
        </div>
      </div>

      {/* Tabla */}
      <Card padding="none">
        <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4 dark:border-zinc-800">
          <h3 className="text-base font-bold text-zinc-900 dark:text-white">{t('listTitle')}</h3>
          <div className="flex items-center gap-1 rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800/60">
            {(['ALL', 'PENDING', 'EXPIRED'] as Tab[]).map(tb => (
              <button
                key={tb}
                type="button"
                onClick={() => { if (tab !== tb) { setTab(tb); setCurrentPage(1); } }}
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
                  <th className="px-5 py-3">Torre</th>
                  <th className="px-5 py-3">Apartamento</th>
                  <th className="px-5 py-3">{t('colSentAt')}</th>
                  <th className="px-5 py-3">{t('colStatus')}</th>
                  <th className="px-5 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {invitations.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-10 text-center text-sm text-zinc-400">
                      {t('noInvitations')}
                    </td>
                  </tr>
                ) : (
                  invitations.map(inv => {
                    const display = inv.fullName || inv.email;
                    return (
                      <tr
                        key={inv.id}
                        className="transition-colors hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${avatarColor(inv.id)}`}
                            >
                              {getInitials(display)}
                            </div>
                            <span className="font-semibold text-zinc-800 dark:text-zinc-100">
                              {display}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-zinc-500 dark:text-zinc-400">{inv.email}</td>
                        <td className="px-5 py-4 text-zinc-500 dark:text-zinc-400">
                          {inv.block || '—'}
                        </td>
                        <td className="px-5 py-4 text-zinc-500 dark:text-zinc-400">
                          {inv.unitNumber || '—'}
                        </td>
                        <td className="px-5 py-4 text-zinc-500 dark:text-zinc-400">
                          {formatRelativeDate(inv.createdAt, t)}
                        </td>
                        <td className="px-5 py-4">
                          <StatusPill status={inv.effectiveStatus} t={t} />
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openEdit(inv)}
                              className="inline-flex items-center justify-center rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                              title="Editar"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingId(inv.id)}
                              className="inline-flex items-center justify-center rounded-lg p-2 text-zinc-500 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30"
                              title="Eliminar"
                            >
                              <Trash2 className="h-4 w-4" />
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
        )}

        {!loading && !error && meta.total > 0 && (
          <div className="flex items-center justify-between border-t border-zinc-100 px-5 py-4 dark:border-zinc-800">
            <div className="text-xs text-zinc-400">
              {t('showingCount', { visible: invitations.length, total: meta.total })}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1 || loading}
                className="inline-flex items-center justify-center rounded-lg border border-zinc-200 p-2 text-zinc-600 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="min-w-24 text-center text-xs font-medium text-zinc-600 dark:text-zinc-400">
                Página {currentPage} de {meta.totalPages}
              </span>
              <button
                type="button"
                onClick={() => setCurrentPage(p => Math.min(meta.totalPages, p + 1))}
                disabled={currentPage === meta.totalPages || loading}
                className="inline-flex items-center justify-center rounded-lg border border-zinc-200 p-2 text-zinc-600 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* Banner seguridad */}
      <div className="flex items-center justify-center gap-3 rounded-xl bg-zinc-900 px-5 py-3 text-xs text-white">
        <Shield className="h-4 w-4 text-emerald-400" />
        <span className="font-semibold">{t('bannerSecurity')}</span>
        <span className="text-white/60">·</span>
        <span className="text-white/70">{t('bannerDesc')}</span>
      </div>

      {/* Modal: Nueva Invitación */}
      <InviteModal
        open={inviteOpen}
        initialTab={inviteTab}
        units={units}
        onClose={() => setInviteOpen(false)}
        onSuccess={(_, message) => {
          loadInvitations();
          showToast(message);
        }}
      />

      {/* Modal: Editar */}
      {editingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900">
            <h3 className="mb-4 text-lg font-bold text-zinc-900 dark:text-white">
              Editar Invitación
            </h3>
            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  Nombre
                </label>
                <input
                  type="text"
                  value={editFullName}
                  onChange={e => setEditFullName(e.target.value)}
                  placeholder="Juan Pérez"
                  className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 placeholder-zinc-400 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                    Torre
                  </label>
                  <select
                    value={editBlock}
                    onChange={e => { setEditBlock(e.target.value); setEditUnitNumber(''); }}
                    className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                  >
                    <option value="">Sin torre</option>
                    {uniqueBlocks.map(block => (
                      <option key={block} value={block}>{block}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                    Apartamento
                  </label>
                  <select
                    value={editUnitNumber}
                    onChange={e => setEditUnitNumber(e.target.value)}
                    disabled={!editBlock}
                    className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 focus:border-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:disabled:bg-zinc-800"
                  >
                    <option value="">Sin apartamento</option>
                    {editBlock &&
                      unitsByBlock(editBlock).map(unit => (
                        <option key={unit} value={unit}>{unit}</option>
                      ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditingId(null)}
                disabled={editSaving}
                className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                disabled={editSaving}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {editSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Confirmar eliminación */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900">
            <div className="mb-4 flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/40">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
            </div>
            <h3 className="text-center text-lg font-bold text-zinc-900 dark:text-white">
              Eliminar Invitación
            </h3>
            <p className="mt-2 text-center text-sm text-zinc-500 dark:text-zinc-400">
              ¿Estás seguro de que deseas eliminar esta invitación? Esta acción no se puede deshacer.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                disabled={deleteDeleting}
                className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteDeleting}
                className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-bold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleteDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------

function StatusPill({
  status,
  t,
}: {
  status: InvitationStatus;
  t: (k: string) => string;
}) {
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
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${cfg.className}`}
    >
      {cfg.label}
    </span>
  );
}

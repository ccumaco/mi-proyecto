'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  faBuilding,
  faHouse,
  faUser,
  faCheck,
  faDoorOpen,
  faChevronLeft,
  faMagnifyingGlass,
  faCircleInfo,
  faPlus,
  faPenToSquare,
  faTrash,
  faXmark,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { apiClient } from '@/lib/api';
import { generateUnitNumbers } from '@/lib/units';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface Resident {
  id: string;
  email: string;
  fullName?: string | null;
  phone?: string | null;
}

interface UnitDTO {
  id: string;
  unitNumber: string;
  block: string | null;
  residentId: string | null;
  resident?: Resident | null;
  propertyId: string;
}

interface Tower {
  name: string;
  units: UnitDTO[];
  occupied: number;
  total: number;
}

type FilterMode = 'ALL' | 'OCCUPIED' | 'FREE';

export default function TorresPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [units, setUnits] = useState<UnitDTO[]>([]);
  const [propertyId, setPropertyId] = useState<string>('');
  const [propertyName, setPropertyName] = useState<string>('');
  const [activeTower, setActiveTower] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterMode>('ALL');

  const [showCreateTower, setShowCreateTower] = useState(false);
  const [showAddUnit, setShowAddUnit] = useState(false);
  const [showCreateProperty, setShowCreateProperty] = useState(false);
  const [editingUnit, setEditingUnit] = useState<UnitDTO | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<UnitDTO | null>(null);
  const [toast, setToast] = useState<{ kind: 'ok' | 'err'; message: string } | null>(null);

  async function reload(propId?: string) {
    const id = propId ?? propertyId;
    if (!id) return;
    const us = await apiClient.getUnitsForProperty(id);
    setUnits(Array.isArray(us) ? us : (us as any)?.data ?? []);
  }

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const properties = await apiClient.getProperties();
        const list = Array.isArray(properties) ? properties : (properties as any)?.data ?? [];
        const property = list[0];
        if (!property) {
          setError('No tienes una propiedad asociada.');
          return;
        }
        setPropertyId(property.id);
        setPropertyName(property.name ?? 'Mi propiedad');
        await reload(property.id);
      } catch (e: any) {
        setError(e?.message || 'No se pudieron cargar las torres.');
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const towers = useMemo<Tower[]>(() => {
    const map = new Map<string, UnitDTO[]>();
    for (const u of units) {
      const key = u.block ?? 'Principal';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(u);
    }
    return Array.from(map.entries())
      .map(([name, list]) => {
        const occupied = list.filter(u => u.residentId).length;
        return {
          name,
          units: list.sort((a, b) => a.unitNumber.localeCompare(b.unitNumber, undefined, { numeric: true })),
          occupied,
          total: list.length,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [units]);

  const currentTower = useMemo(
    () => towers.find(t => t.name === activeTower) ?? towers[0] ?? null,
    [towers, activeTower],
  );

  const filteredUnits = useMemo(() => {
    if (!currentTower) return [];
    return currentTower.units.filter(u => {
      if (filter === 'OCCUPIED' && !u.residentId) return false;
      if (filter === 'FREE' && u.residentId) return false;
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const matchesUnit = u.unitNumber.toLowerCase().includes(q);
        const matchesResident =
          u.resident?.fullName?.toLowerCase().includes(q) ||
          u.resident?.email?.toLowerCase().includes(q);
        if (!matchesUnit && !matchesResident) return false;
      }
      return true;
    });
  }, [currentTower, filter, search]);

  const totalOccupied = units.filter(u => u.residentId).length;
  const totalUnits = units.length;
  const occupancyPct = totalUnits ? Math.round((totalOccupied / totalUnits) * 100) : 0;

  async function handleDelete() {
    if (!confirmDelete) return;
    try {
      await apiClient.deleteUnit(confirmDelete.id);
      setToast({ kind: 'ok', message: 'Apartamento eliminado' });
      setConfirmDelete(null);
      await reload();
    } catch (e: any) {
      setToast({ kind: 'err', message: e?.message || 'No se pudo eliminar' });
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          <p className="text-sm text-gray-600 dark:text-zinc-400">Cargando torres...</p>
        </div>
      </div>
    );
  }

  if (error && !error.includes('No tienes una propiedad')) {
    return (
      <div className="mx-auto max-w-2xl p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-300">
          {error}
        </div>
      </div>
    );
  }

  if (error && error.includes('No tienes una propiedad')) {
    return (
      <div className="mx-auto max-w-6xl p-4 sm:p-6">
        <nav className="mb-4 flex items-center gap-2 text-xs text-gray-500 dark:text-zinc-500">
          <Link href="/admin" className="hover:text-blue-600 dark:hover:text-blue-400">
            Admin
          </Link>
          <span>/</span>
          <span className="font-medium text-gray-900 dark:text-white">Propiedad</span>
        </nav>
        <div className="rounded-xl border-2 border-dashed border-blue-300 bg-linear-to-br from-blue-50 to-indigo-50 p-12 text-center dark:border-blue-900/40 dark:from-blue-950/30 dark:to-indigo-950/30">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40">
              <FontAwesomeIcon icon={faBuilding} className="text-2xl text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">
            Comienza creando tu propiedad
          </h3>
          <p className="mb-6 text-sm text-gray-600 dark:text-zinc-400">
            Primero debes crear tu propiedad para poder agregar torres y apartamentos.
          </p>
          <Button onClick={() => setShowCreateProperty(true)} size="lg">
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Crear propiedad
          </Button>
        </div>
        {showCreateProperty && (
          <CreatePropertyModal
            onClose={() => setShowCreateProperty(false)}
            onDone={async name => {
              setShowCreateProperty(false);
              setToast({ kind: 'ok', message: `Propiedad "${name}" creada` });
              await new Promise(r => setTimeout(r, 500));
              window.location.reload();
            }}
            onError={msg => setToast({ kind: 'err', message: msg })}
          />
        )}
        {toast && (
          <div
            className={`fixed bottom-6 right-6 z-50 rounded-lg px-4 py-3 text-sm shadow-lg ${
              toast.kind === 'ok'
                ? 'bg-emerald-600 text-white'
                : 'bg-red-600 text-white'
            }`}
          >
            {toast.message}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6">
      <nav className="mb-4 flex items-center gap-2 text-xs text-gray-500 dark:text-zinc-500">
        <Link href="/admin" className="hover:text-blue-600 dark:hover:text-blue-400">
          Admin
        </Link>
        <span>/</span>
        <span className="text-gray-700 dark:text-zinc-300">Propiedad</span>
        <span>/</span>
        <span className="font-medium text-gray-900 dark:text-white">Torres</span>
      </nav>

      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Torres y apartamentos
          </h1>
          <p className="text-sm text-gray-600 dark:text-zinc-400">
            {propertyName} — {totalUnits} apartamentos en {towers.length}{' '}
            {towers.length === 1 ? 'torre' : 'torres'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
            Volver
          </Link>
          <Button onClick={() => setShowCreateTower(true)}>
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Crear torre
          </Button>
        </div>
      </header>

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard icon={faBuilding} label="Torres" value={towers.length} tone="blue" />
        <StatCard
          icon={faCheck}
          label="Ocupados"
          value={`${totalOccupied} / ${totalUnits}`}
          subtitle={`${occupancyPct}% de ocupación`}
          tone="emerald"
        />
        <StatCard
          icon={faDoorOpen}
          label="Libres"
          value={totalUnits - totalOccupied}
          tone="amber"
        />
      </div>

      {towers.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {towers.map(t => (
            <button
              key={t.name}
              onClick={() => setActiveTower(t.name)}
              className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${
                (currentTower?.name ?? '') === t.name
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300'
              }`}
            >
              <FontAwesomeIcon icon={faBuilding} />
              {t.name}
              <span
                className={`ml-1 rounded-full px-2 py-0.5 text-[11px] ${
                  (currentTower?.name ?? '') === t.name
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-zinc-400'
                }`}
              >
                {t.occupied}/{t.total}
              </span>
            </button>
          ))}
        </div>
      )}

      {!currentTower ? (
        <div className="rounded-xl border-2 border-dashed border-blue-300 bg-linear-to-br from-blue-50 to-indigo-50 p-12 text-center dark:border-blue-900/40 dark:from-blue-950/30 dark:to-indigo-950/30">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40">
              <FontAwesomeIcon icon={faBuilding} className="text-2xl text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">
            Comienza creando tu primera torre
          </h3>
          <p className="mb-6 text-sm text-gray-600 dark:text-zinc-400">
            Define las torres y apartamentos de tu propiedad. Puedes agregar múltiples bloques con diferentes cantidades de pisos y apartamentos por piso.
          </p>
          <div className="mb-8 inline-block rounded-lg border border-blue-200 bg-white p-4 text-left dark:border-blue-900/40 dark:bg-zinc-900">
            <p className="mb-2 text-xs font-semibold text-gray-700 dark:text-zinc-300">Ejemplo:</p>
            <ul className="space-y-1 text-xs text-gray-600 dark:text-zinc-400">
              <li>✓ Torre A: 5 pisos × 4 apartamentos = 20 unidades</li>
              <li>✓ Torre B: 3 pisos × 2 apartamentos = 6 unidades</li>
              <li>✓ Bloque Principal: 2 pisos × 3 apartamentos = 6 unidades</li>
            </ul>
          </div>
          <Button onClick={() => setShowCreateTower(true)} size="lg">
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Crear primera torre
          </Button>
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
            <div>
              <h2 className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
                <FontAwesomeIcon icon={faBuilding} className="text-blue-600" />
                {currentTower.name}
              </h2>
              <p className="text-xs text-gray-500 dark:text-zinc-500">
                {currentTower.occupied} ocupados · {currentTower.total - currentTower.occupied} libres
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative">
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400"
                />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Buscar apto o residente..."
                  className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-8 pr-3 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
                />
              </div>
              <div className="flex rounded-lg border border-gray-200 p-0.5 dark:border-zinc-700">
                {(['ALL', 'OCCUPIED', 'FREE'] as FilterMode[]).map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                      filter === f
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-50 dark:text-zinc-400 dark:hover:bg-zinc-800'
                    }`}
                  >
                    {f === 'ALL' ? 'Todos' : f === 'OCCUPIED' ? 'Ocupados' : 'Libres'}
                  </button>
                ))}
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowAddUnit(true)}>
                <FontAwesomeIcon icon={faPlus} className="mr-1" />
                Agregar apto
              </Button>
            </div>
          </div>

          {filteredUnits.length === 0 ? (
            <div className="p-10 text-center">
              <FontAwesomeIcon icon={faCircleInfo} className="mb-2 text-2xl text-gray-400" />
              <p className="text-sm text-gray-600 dark:text-zinc-400">
                No hay apartamentos que coincidan con los filtros.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 lg:grid-cols-4">
              {filteredUnits.map(u => (
                <UnitCard
                  key={u.id}
                  unit={u}
                  onEdit={() => setEditingUnit(u)}
                  onDelete={() => setConfirmDelete(u)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {showCreateTower && (
        <CreateTowerModal
          propertyId={propertyId}
          existingTowers={towers.map(t => t.name)}
          onClose={() => setShowCreateTower(false)}
          onDone={async msg => {
            setShowCreateTower(false);
            setToast({ kind: 'ok', message: msg });
            await reload();
          }}
          onError={msg => setToast({ kind: 'err', message: msg })}
        />
      )}

      {showAddUnit && currentTower && (
        <AddUnitModal
          propertyId={propertyId}
          block={currentTower.name}
          existingNumbers={currentTower.units.map(u => u.unitNumber)}
          onClose={() => setShowAddUnit(false)}
          onDone={async msg => {
            setShowAddUnit(false);
            setToast({ kind: 'ok', message: msg });
            await reload();
          }}
          onError={msg => setToast({ kind: 'err', message: msg })}
        />
      )}

      {editingUnit && (
        <EditUnitModal
          unit={editingUnit}
          towers={towers.map(t => t.name)}
          onClose={() => setEditingUnit(null)}
          onDone={async msg => {
            setEditingUnit(null);
            setToast({ kind: 'ok', message: msg });
            await reload();
          }}
          onError={msg => setToast({ kind: 'err', message: msg })}
        />
      )}

      {confirmDelete && (
        <ConfirmDeleteModal
          unit={confirmDelete}
          onCancel={() => setConfirmDelete(null)}
          onConfirm={handleDelete}
        />
      )}

      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 rounded-lg px-4 py-3 text-sm shadow-lg ${
            toast.kind === 'ok'
              ? 'bg-emerald-600 text-white'
              : 'bg-red-600 text-white'
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  subtitle,
  tone,
}: {
  icon: any;
  label: string;
  value: string | number;
  subtitle?: string;
  tone: 'blue' | 'emerald' | 'amber';
}) {
  const tones = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
    amber: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  };
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${tones[tone]}`}>
          <FontAwesomeIcon icon={icon} />
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-zinc-500">{label}</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">{value}</p>
          {subtitle && (
            <p className="text-[11px] text-gray-500 dark:text-zinc-500">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function UnitCard({
  unit,
  onEdit,
  onDelete,
}: {
  unit: UnitDTO;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const occupied = !!unit.residentId;
  return (
    <div
      className={`group relative rounded-xl border p-3 transition ${
        occupied
          ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-900/40 dark:bg-emerald-900/10'
          : 'border-amber-200 bg-amber-50 dark:border-amber-900/40 dark:bg-amber-900/10'
      }`}
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon
            icon={faHouse}
            className={occupied ? 'text-emerald-600' : 'text-amber-600'}
          />
          <span className="text-sm font-bold text-gray-900 dark:text-white">
            Apto {unit.unitNumber}
          </span>
        </div>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
            occupied ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'
          }`}
        >
          {occupied ? 'Ocupado' : 'Libre'}
        </span>
      </div>

      {occupied && unit.resident ? (
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-xs text-gray-700 dark:text-zinc-300">
            <FontAwesomeIcon icon={faUser} className="text-gray-400" />
            <span className="truncate">
              {unit.resident.fullName || unit.resident.email}
            </span>
          </div>
          {unit.resident.fullName && unit.resident.email && (
            <p className="truncate text-[11px] text-gray-500 dark:text-zinc-500">
              {unit.resident.email}
            </p>
          )}
        </div>
      ) : (
        <p className="text-xs italic text-gray-500 dark:text-zinc-500">
          Sin residente asignado
        </p>
      )}

      <div className="mt-2 flex gap-1 opacity-0 transition group-hover:opacity-100">
        <button
          onClick={onEdit}
          title="Editar"
          className="flex-1 rounded-md bg-white/80 px-2 py-1 text-xs text-gray-700 hover:bg-white dark:bg-zinc-900/60 dark:text-zinc-300 dark:hover:bg-zinc-900"
        >
          <FontAwesomeIcon icon={faPenToSquare} className="mr-1" />
          Editar
        </button>
        {!occupied && (
          <button
            onClick={onDelete}
            title="Eliminar"
            className="rounded-md bg-red-500/90 px-2 py-1 text-xs text-white hover:bg-red-600"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        )}
      </div>
    </div>
  );
}

function ModalShell({
  title,
  onClose,
  children,
  size = 'md',
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  size?: 'md' | 'lg';
}) {
  const w = size === 'lg' ? 'max-w-2xl' : 'max-w-md';
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className={`w-full ${w} rounded-2xl bg-white shadow-xl dark:bg-zinc-900`}>
        <div className="flex items-center justify-between border-b border-gray-100 p-4 dark:border-zinc-800">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-zinc-800"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function CreateTowerModal({
  propertyId,
  existingTowers,
  onClose,
  onDone,
  onError,
}: {
  propertyId: string;
  existingTowers: string[];
  onClose: () => void;
  onDone: (msg: string) => void;
  onError: (msg: string) => void;
}) {
  const [name, setName] = useState('');
  const [floors, setFloors] = useState(3);
  const [unitsPerFloor, setUnitsPerFloor] = useState(2);
  const [submitting, setSubmitting] = useState(false);

  const preview = useMemo(
    () => generateUnitNumbers(Math.max(1, floors), Math.max(1, unitsPerFloor)),
    [floors, unitsPerFloor],
  );

  const save = async () => {
    if (!name.trim()) return onError('El nombre de la torre es requerido');
    if (existingTowers.includes(name.trim())) {
      return onError('Ya existe una torre con ese nombre');
    }
    if (preview.length === 0) return onError('Debes indicar al menos 1 piso y 1 apto por piso');

    const units = preview.map(u => ({
      unitNumber: u,
      block: name.trim(),
      propertyId,
    }));

    try {
      setSubmitting(true);
      await apiClient.createUnits(units);
      onDone(`Torre "${name.trim()}" creada con ${units.length} apartamentos`);
    } catch (e: any) {
      onError(e?.message || 'No se pudo crear la torre');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalShell title="Crear torre" onClose={onClose} size="lg">
      <div className="space-y-4">
        <Input
          label="Nombre de la torre / bloque"
          leftIcon={faBuilding}
          placeholder="Torre A"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Pisos"
            type="number"
            min={1}
            value={floors}
            onChange={e => setFloors(Number(e.target.value))}
          />
          <Input
            label="Aptos por piso"
            type="number"
            min={1}
            value={unitsPerFloor}
            onChange={e => setUnitsPerFloor(Number(e.target.value))}
          />
        </div>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-zinc-800 dark:bg-zinc-950">
          <p className="mb-2 text-xs font-medium text-gray-700 dark:text-zinc-300">
            Se crearán {preview.length} apartamentos:
          </p>
          <div className="flex flex-wrap gap-1">
            {preview.slice(0, 40).map(u => (
              <span
                key={u}
                className="rounded bg-white px-2 py-0.5 text-[11px] text-gray-700 dark:bg-zinc-900 dark:text-zinc-300"
              >
                {u}
              </span>
            ))}
            {preview.length > 40 && (
              <span className="text-[11px] text-gray-500">+{preview.length - 40} más</span>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button onClick={save} disabled={submitting}>
            {submitting ? 'Creando...' : 'Crear torre'}
          </Button>
        </div>
      </div>
    </ModalShell>
  );
}

function AddUnitModal({
  propertyId,
  block,
  existingNumbers,
  onClose,
  onDone,
  onError,
}: {
  propertyId: string;
  block: string;
  existingNumbers: string[];
  onClose: () => void;
  onDone: (msg: string) => void;
  onError: (msg: string) => void;
}) {
  const [unitNumber, setUnitNumber] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const save = async () => {
    const n = unitNumber.trim();
    if (!n) return onError('El número del apartamento es requerido');
    if (existingNumbers.includes(n)) {
      return onError(`Ya existe "${n}" en ${block}`);
    }
    try {
      setSubmitting(true);
      await apiClient.createUnit({ unitNumber: n, block, propertyId });
      onDone(`Apartamento ${n} agregado a ${block}`);
    } catch (e: any) {
      onError(e?.message || 'No se pudo crear el apartamento');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalShell title={`Agregar apartamento a ${block}`} onClose={onClose}>
      <div className="space-y-4">
        <Input
          label="Número del apartamento"
          leftIcon={faHouse}
          placeholder="Ej: 301"
          value={unitNumber}
          onChange={e => setUnitNumber(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button onClick={save} disabled={submitting}>
            {submitting ? 'Guardando...' : 'Agregar'}
          </Button>
        </div>
      </div>
    </ModalShell>
  );
}

function EditUnitModal({
  unit,
  towers,
  onClose,
  onDone,
  onError,
}: {
  unit: UnitDTO;
  towers: string[];
  onClose: () => void;
  onDone: (msg: string) => void;
  onError: (msg: string) => void;
}) {
  const [unitNumber, setUnitNumber] = useState(unit.unitNumber);
  const [block, setBlock] = useState(unit.block ?? '');
  const [submitting, setSubmitting] = useState(false);

  const save = async () => {
    if (!unitNumber.trim()) return onError('El número es requerido');
    try {
      setSubmitting(true);
      await apiClient.updateUnit(unit.id, {
        unitNumber: unitNumber.trim(),
        block: block.trim() || null,
      });
      onDone('Apartamento actualizado');
    } catch (e: any) {
      onError(e?.message || 'No se pudo actualizar');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalShell title="Editar apartamento" onClose={onClose}>
      <div className="space-y-4">
        <Input
          label="Número"
          leftIcon={faHouse}
          value={unitNumber}
          onChange={e => setUnitNumber(e.target.value)}
        />
        <div>
          <label className="mb-1 block text-sm font-semibold text-zinc-800 dark:text-zinc-200">
            Torre / bloque
          </label>
          <input
            list="towers-list"
            value={block}
            onChange={e => setBlock(e.target.value)}
            placeholder="Ej: Torre A"
            className="w-full rounded-xl border-2 border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
          />
          <datalist id="towers-list">
            {towers.map(t => (
              <option key={t} value={t} />
            ))}
          </datalist>
        </div>
        {unit.residentId && (
          <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-300">
            <FontAwesomeIcon icon={faTriangleExclamation} className="mt-0.5" />
            <span>
              Este apartamento tiene un residente asignado. Los cambios no afectan al residente.
            </span>
          </div>
        )}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button onClick={save} disabled={submitting}>
            {submitting ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </div>
      </div>
    </ModalShell>
  );
}

function CreatePropertyModal({
  onClose,
  onDone,
  onError,
}: {
  onClose: () => void;
  onDone: (name: string) => void;
  onError: (msg: string) => void;
}) {
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const save = async () => {
    if (!name.trim()) return onError('El nombre de la propiedad es requerido');
    try {
      setSubmitting(true);
      await apiClient.createProperty({ name: name.trim() });
      onDone(name.trim());
    } catch (e: any) {
      onError(e?.message || 'No se pudo crear la propiedad');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalShell title="Crear propiedad" onClose={onClose}>
      <div className="space-y-4">
        <Input
          label="Nombre de la propiedad"
          leftIcon={faBuilding}
          placeholder="Mi Edificio, Conjunto Residencial, etc."
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button onClick={save} disabled={submitting}>
            {submitting ? 'Creando...' : 'Crear propiedad'}
          </Button>
        </div>
      </div>
    </ModalShell>
  );
}

function ConfirmDeleteModal({
  unit,
  onCancel,
  onConfirm,
}: {
  unit: UnitDTO;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <ModalShell title="Eliminar apartamento" onClose={onCancel}>
      <div className="space-y-4">
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900/50 dark:bg-red-900/20">
          <FontAwesomeIcon icon={faTriangleExclamation} className="mt-0.5 text-red-600" />
          <p className="text-sm text-red-700 dark:text-red-300">
            ¿Seguro que quieres eliminar el apartamento{' '}
            <strong>{unit.unitNumber}</strong>
            {unit.block ? ` de ${unit.block}` : ''}? Esta acción no se puede deshacer.
          </p>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            <FontAwesomeIcon icon={faTrash} className="mr-2" />
            Eliminar
          </Button>
        </div>
      </div>
    </ModalShell>
  );
}

'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import {
  faBuilding,
  faUser,
  faPhone,
  faLock,
  faEye,
  faEyeSlash,
  faCar,
  faPaw,
  faHeart,
  faArrowRight,
  faArrowLeft,
  faCheckCircle,
  faPlus,
  faTrash,
  faShieldHeart,
  faHome,
  faCircleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { apiClient } from '@/lib/api';
import { setUser } from '@/lib/redux/slices/authSlice';
import { AppDispatch } from '@/lib/redux/store';

type PetTypeUi = 'DOG' | 'CAT' | 'BIRD' | 'FISH' | 'OTHER';

interface UnitOption {
  id: string;
  unitNumber: string;
  occupied: boolean;
}

interface Tower {
  name: string;
  units: UnitOption[];
}

interface InvitationData {
  email: string;
  fullName: string | null;
  phone: string | null;
  propertyId: string;
  propertyName: string;
  towers: Tower[];
  expiresAt: string;
}

interface VehicleForm {
  plate: string;
  brand: string;
  color: string;
}

interface PetForm {
  type: PetTypeUi;
  name: string;
}

const PET_TYPES: { value: PetTypeUi; label: string }[] = [
  { value: 'DOG', label: 'Perro' },
  { value: 'CAT', label: 'Gato' },
  { value: 'BIRD', label: 'Ave' },
  { value: 'FISH', label: 'Pez' },
  { value: 'OTHER', label: 'Otro' },
];

export default function AcceptInvitationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const token = searchParams.get('token') ?? '';

  const [loadingInv, setLoadingInv] = useState(true);
  const [invError, setInvError] = useState<string | null>(null);
  const [invitation, setInvitation] = useState<InvitationData | null>(null);

  const [step, setStep] = useState<1 | 2>(1);

  const [towerName, setTowerName] = useState('');
  const [unitId, setUnitId] = useState('');

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [dataAuthorization, setDataAuthorization] = useState(false);

  const [noVehicles, setNoVehicles] = useState(false);
  const [vehicles, setVehicles] = useState<VehicleForm[]>([
    { plate: '', brand: '', color: '' },
  ]);

  const [noPets, setNoPets] = useState(false);
  const [pets, setPets] = useState<PetForm[]>([{ type: 'DOG', name: '' }]);

  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setLoadingInv(false);
      setInvError('Falta el token de invitación en el enlace.');
      return;
    }
    (async () => {
      try {
        const data = await apiClient.getInvitationByToken(token);
        setInvitation(data);
        if (data.fullName) setFullName(data.fullName);
        if (data.phone) setPhone(data.phone);
      } catch (err: any) {
        setInvError(err?.message || 'No se pudo cargar la invitación.');
      } finally {
        setLoadingInv(false);
      }
    })();
  }, [token]);

  const availableUnits = useMemo<UnitOption[]>(() => {
    if (!invitation) return [];
    const tower = invitation.towers.find(t => t.name === towerName);
    return tower?.units.filter(u => !u.occupied) ?? [];
  }, [invitation, towerName]);

  const validateStep1 = (): string | null => {
    if (!towerName) return 'Selecciona la torre o bloque.';
    if (!unitId) return 'Selecciona el apartamento.';
    if (!fullName.trim()) return 'Ingresa tu nombre completo.';
    if (!phone.trim()) return 'Ingresa tu teléfono.';
    if (password.length < 8) return 'La contraseña debe tener al menos 8 caracteres.';
    if (password !== confirmPassword) return 'Las contraseñas no coinciden.';
    if (!dataAuthorization) return 'Debes autorizar el tratamiento de datos.';
    return null;
  };

  const goToStep2 = () => {
    const err = validateStep1();
    if (err) {
      setSubmitError(err);
      return;
    }
    setSubmitError(null);
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addVehicle = () =>
    setVehicles(v => [...v, { plate: '', brand: '', color: '' }]);
  const removeVehicle = (i: number) =>
    setVehicles(v => v.filter((_, idx) => idx !== i));
  const updateVehicle = (i: number, patch: Partial<VehicleForm>) =>
    setVehicles(v => v.map((item, idx) => (idx === i ? { ...item, ...patch } : item)));

  const addPet = () => setPets(p => [...p, { type: 'DOG', name: '' }]);
  const removePet = (i: number) => setPets(p => p.filter((_, idx) => idx !== i));
  const updatePet = (i: number, patch: Partial<PetForm>) =>
    setPets(p => p.map((item, idx) => (idx === i ? { ...item, ...patch } : item)));

  const handleSubmit = async () => {
    setSubmitError(null);
    const err = validateStep1();
    if (err) {
      setStep(1);
      setSubmitError(err);
      return;
    }

    const payloadVehicles = noVehicles
      ? []
      : vehicles.filter(v => v.plate.trim()).map(v => ({
          plate: v.plate.trim().toUpperCase(),
          brand: v.brand.trim() || undefined,
          color: v.color.trim() || undefined,
        }));

    const payloadPets = noPets
      ? []
      : pets.filter(p => p.name.trim()).map(p => ({ type: p.type, name: p.name.trim() }));

    const payloadEmergency =
      emergencyName.trim() && emergencyPhone.trim()
        ? { name: emergencyName.trim(), phone: emergencyPhone.trim() }
        : undefined;

    try {
      setSubmitting(true);
      const result = await apiClient.acceptInvitation({
        token,
        fullName: fullName.trim(),
        phone: phone.trim(),
        password,
        unitId,
        dataAuthorization,
        vehicles: payloadVehicles,
        pets: payloadPets,
        emergencyContact: payloadEmergency,
      });
      dispatch(setUser(result.user as any));
      setShowSuccess(true);
    } catch (e: any) {
      setSubmitError(e?.message || 'No se pudo crear la cuenta.');
    } finally {
      setSubmitting(false);
    }
  };

  const goToDashboard = () => {
    router.push('/dashboard');
  };

  if (loadingInv) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          <p className="text-sm text-gray-600 dark:text-zinc-400">Cargando invitación...</p>
        </div>
      </div>
    );
  }

  if (invError || !invitation) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm dark:border-red-900 dark:bg-zinc-900">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <FontAwesomeIcon icon={faCircleExclamation} className="text-2xl text-red-600 dark:text-red-400" />
          </div>
          <h1 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">Invitación no disponible</h1>
          <p className="mb-6 text-sm text-gray-600 dark:text-zinc-400">
            {invError || 'Tu enlace no es válido o ha expirado.'}
          </p>
          <Button onClick={() => router.push('/login')} className="w-full">
            Ir al inicio de sesión
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50 py-8 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-950">
      <div className="mx-auto w-full max-w-2xl px-4">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/30">
            <FontAwesomeIcon icon={faHome} className="text-xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Bienvenido a {invitation.propertyName}
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-zinc-400">
            Completa tu perfil para activar tu cuenta
          </p>
        </div>

        <div className="mb-6 flex items-center gap-2">
          <div className="flex-1">
            <div
              className={`h-2 rounded-full ${
                step >= 1 ? 'bg-blue-600' : 'bg-gray-200 dark:bg-zinc-800'
              }`}
            />
            <p
              className={`mt-1 text-xs font-medium ${
                step >= 1 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500'
              }`}
            >
              1. Vivienda y datos personales
            </p>
          </div>
          <div className="flex-1">
            <div
              className={`h-2 rounded-full ${
                step >= 2 ? 'bg-blue-600' : 'bg-gray-200 dark:bg-zinc-800'
              }`}
            />
            <p
              className={`mt-1 text-xs font-medium ${
                step >= 2 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500'
              }`}
            >
              2. Vehículos, mascotas y emergencia
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          {submitError && (
            <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-300">
              <FontAwesomeIcon icon={faCircleExclamation} className="mt-0.5" />
              <span>{submitError}</span>
            </div>
          )}

          {step === 1 ? (
            <div className="space-y-6">
              <section>
                <div className="mb-3 flex items-center gap-2">
                  <FontAwesomeIcon icon={faBuilding} className="text-blue-600" />
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                    Datos de vivienda
                  </h2>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-zinc-300">
                      Torre / Bloque
                    </label>
                    <select
                      value={towerName}
                      onChange={e => {
                        setTowerName(e.target.value);
                        setUnitId('');
                      }}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
                    >
                      <option value="">Selecciona una torre</option>
                      {invitation.towers.map(t => (
                        <option key={t.name} value={t.name}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-zinc-300">
                      Apartamento
                    </label>
                    <select
                      value={unitId}
                      onChange={e => setUnitId(e.target.value)}
                      disabled={!towerName}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
                    >
                      <option value="">
                        {towerName ? 'Selecciona un apartamento' : 'Selecciona la torre primero'}
                      </option>
                      {availableUnits.map(u => (
                        <option key={u.id} value={u.id}>
                          {u.unitNumber}
                        </option>
                      ))}
                    </select>
                    {towerName && availableUnits.length === 0 && (
                      <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                        No hay apartamentos disponibles en esta torre.
                      </p>
                    )}
                  </div>
                </div>
              </section>

              <section>
                <div className="mb-3 flex items-center gap-2">
                  <FontAwesomeIcon icon={faUser} className="text-blue-600" />
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                    Datos personales
                  </h2>
                </div>
                <div className="space-y-3">
                  <Input
                    leftIcon={faUser}
                    placeholder="Nombre completo"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                  />
                  <Input
                    leftIcon={faPhone}
                    placeholder="Teléfono"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                  />
                  <div className="relative">
                    <Input
                      leftIcon={faLock}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Crea una contraseña (mín. 8 caracteres)"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300"
                    >
                      <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      leftIcon={faLock}
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirma tu contraseña"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300"
                    >
                      <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                    </button>
                  </div>
                </div>
              </section>

              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-zinc-800 dark:bg-zinc-950">
                <input
                  type="checkbox"
                  checked={dataAuthorization}
                  onChange={e => setDataAuthorization(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs text-gray-700 dark:text-zinc-300">
                  Autorizo el tratamiento de mis datos personales según la política de privacidad de{' '}
                  <strong>{invitation.propertyName}</strong>.
                </span>
              </label>

              <div className="flex justify-end">
                <Button onClick={goToStep2}>
                  Siguiente
                  <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <section>
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faCar} className="text-blue-600" />
                    <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                      Vehículos
                    </h2>
                  </div>
                  <label className="flex cursor-pointer items-center gap-2 text-xs text-gray-600 dark:text-zinc-400">
                    <input
                      type="checkbox"
                      checked={noVehicles}
                      onChange={e => setNoVehicles(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600"
                    />
                    No tengo vehículo
                  </label>
                </div>
                {!noVehicles && (
                  <div className="space-y-3">
                    {vehicles.map((v, i) => (
                      <div
                        key={i}
                        className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-zinc-800 dark:bg-zinc-950"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-600 dark:text-zinc-400">
                            Vehículo {i + 1}
                          </span>
                          {vehicles.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeVehicle(i)}
                              className="text-xs text-red-600 hover:text-red-700"
                            >
                              <FontAwesomeIcon icon={faTrash} /> Quitar
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                          <Input
                            placeholder="Placa"
                            value={v.plate}
                            onChange={e => updateVehicle(i, { plate: e.target.value })}
                          />
                          <Input
                            placeholder="Marca"
                            value={v.brand}
                            onChange={e => updateVehicle(i, { brand: e.target.value })}
                          />
                          <Input
                            placeholder="Color"
                            value={v.color}
                            onChange={e => updateVehicle(i, { color: e.target.value })}
                          />
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addVehicle}
                      className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 py-2 text-sm text-gray-600 hover:border-blue-400 hover:text-blue-600 dark:border-zinc-700 dark:text-zinc-400"
                    >
                      <FontAwesomeIcon icon={faPlus} />
                      Agregar otro vehículo
                    </button>
                  </div>
                )}
              </section>

              <section>
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faPaw} className="text-blue-600" />
                    <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                      Mascotas
                    </h2>
                  </div>
                  <label className="flex cursor-pointer items-center gap-2 text-xs text-gray-600 dark:text-zinc-400">
                    <input
                      type="checkbox"
                      checked={noPets}
                      onChange={e => setNoPets(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600"
                    />
                    No tengo mascotas
                  </label>
                </div>
                {!noPets && (
                  <div className="space-y-3">
                    {pets.map((p, i) => (
                      <div
                        key={i}
                        className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-zinc-800 dark:bg-zinc-950"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-600 dark:text-zinc-400">
                            Mascota {i + 1}
                          </span>
                          {pets.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removePet(i)}
                              className="text-xs text-red-600 hover:text-red-700"
                            >
                              <FontAwesomeIcon icon={faTrash} /> Quitar
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                          <select
                            value={p.type}
                            onChange={e => updatePet(i, { type: e.target.value as PetTypeUi })}
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                          >
                            {PET_TYPES.map(t => (
                              <option key={t.value} value={t.value}>
                                {t.label}
                              </option>
                            ))}
                          </select>
                          <Input
                            placeholder="Nombre"
                            value={p.name}
                            onChange={e => updatePet(i, { name: e.target.value })}
                          />
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addPet}
                      className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 py-2 text-sm text-gray-600 hover:border-blue-400 hover:text-blue-600 dark:border-zinc-700 dark:text-zinc-400"
                    >
                      <FontAwesomeIcon icon={faPlus} />
                      Agregar otra mascota
                    </button>
                  </div>
                )}
              </section>

              <section>
                <div className="mb-3 flex items-center gap-2">
                  <FontAwesomeIcon icon={faHeart} className="text-blue-600" />
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                    Contacto de emergencia
                  </h2>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Input
                    leftIcon={faUser}
                    placeholder="Nombre completo"
                    value={emergencyName}
                    onChange={e => setEmergencyName(e.target.value)}
                  />
                  <Input
                    leftIcon={faPhone}
                    placeholder="Teléfono"
                    value={emergencyPhone}
                    onChange={e => setEmergencyPhone(e.target.value)}
                  />
                </div>
              </section>

              <div className="flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 p-3 text-xs text-blue-800 dark:border-blue-900/40 dark:bg-blue-900/20 dark:text-blue-300">
                <FontAwesomeIcon icon={faShieldHeart} />
                <span>Tus datos están protegidos y solo son visibles para la administración.</span>
              </div>

              <div className="flex justify-between gap-2">
                <Button variant="outline" onClick={() => setStep(1)} disabled={submitting}>
                  <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                  Atrás
                </Button>
                <Button onClick={handleSubmit} disabled={submitting}>
                  {submitting ? 'Creando cuenta...' : 'Crear cuenta'}
                  {!submitting && <FontAwesomeIcon icon={faCheckCircle} className="ml-2" />}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl dark:bg-zinc-900">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
              <FontAwesomeIcon icon={faCheckCircle} className="text-3xl text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
              ¡Cuenta creada con éxito!
            </h3>
            <p className="mb-6 text-sm text-gray-600 dark:text-zinc-400">
              Bienvenido a {invitation.propertyName}. Ya puedes acceder a tu panel de residente.
            </p>
            <Button onClick={goToDashboard} className="w-full">
              Ir al inicio
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

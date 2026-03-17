'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  faUser,
  faEnvelope,
  faBuilding,
  faLock,
  faPhone,
  faArrowRight,
  faArrowLeft,
  faMapMarkerAlt,
  faLayerGroup,
  faPlus,
  faFileExcel,
  faCheckCircle,
  faFileLines,
  faChevronDown,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import {
  signUpWithPassword,
  selectAuthStatus,
  selectAuthError,
} from '@/lib/redux/slices/authSlice';
import { AppDispatch } from '@/lib/redux/store';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { createClientBrowser } from '@/lib/supabase';

const supabase = createClientBrowser();

type Step = 1 | 2 | 3 | 4;

interface Tower {
  id: string;
  name: string;
  floors: number;
  unitsPerFloor: number;
}

const PAISES = [
  { value: 'colombia', label: 'Colombia' },
  { value: 'mexico', label: 'México' },
  { value: 'espana', label: 'España' },
  { value: 'argentina', label: 'Argentina' },
  { value: 'chile', label: 'Chile' },
  { value: 'peru', label: 'Perú' },
];

const CIUDADES: Record<string, string[]> = {
  colombia: ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena'],
  mexico: ['Ciudad de México', 'Guadalajara', 'Monterrey', 'Puebla', 'Tijuana'],
  espana: ['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Bilbao'],
  argentina: ['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'La Plata'],
  chile: ['Santiago', 'Valparaíso', 'Concepción', 'La Serena', 'Antofagasta'],
  peru: ['Lima', 'Arequipa', 'Trujillo', 'Cusco', 'Chiclayo'],
};

function generateUnitPreview(floors: number, unitsPerFloor: number): string[] {
  const units: string[] = [];
  for (let piso = floors; piso >= 1; piso--) {
    for (let u = 1; u <= unitsPerFloor; u++) {
      units.push(`${piso}${String(u).padStart(2, '0')}`);
    }
  }
  return units;
}

export default function RegisterPage() {
  const [step, setStep] = useState<Step>(1);
  const [fullName, setFullName] = useState('Administrador de Prueba');
  const [email, setEmail] = useState('admin@prueba.com');
  const [phone, setPhone] = useState('+573001234567');
  const [password, setPassword] = useState('Admin123456!');
  const [confirmPassword, setConfirmPassword] = useState('Admin123456!');
  const [acceptTerms, setAcceptTerms] = useState(true);

  const [complexName, setComplexName] = useState('Conjunto Residencial El Sol');
  const [nit, setNit] = useState('900123456-1');
  const [unitsCount, setUnitsCount] = useState('24');
  const [address, setAddress] = useState('Calle 123 # 45 - 67');
  const [country, setCountry] = useState('colombia');
  const [city, setCity] = useState('Bogotá');

  const [towers, setTowers] = useState<Tower[]>([
    { id: '1', name: 'Torre A', floors: 5, unitsPerFloor: 4 },
  ]);
  const [expandedTower, setExpandedTower] = useState<string>('1');

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const authStatus = useSelector(selectAuthStatus);
  const authError = useSelector(selectAuthError);

  const handleStep1 = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) return;
    if (!acceptTerms) return;

    const cleanPhone = phone.replace(/\s+/g, '');

    const result = await dispatch(signUpWithPassword({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          display_name: fullName,
          phone: cleanPhone,
          nit: nit,
          role: 'admin'
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    }));

    if (signUpWithPassword.fulfilled.match(result)) {
      setStep(2);
    }
  };

  const handleStep2 = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStep(3);
  };

  const handleStep3 = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setStep(4);
      return;
    }

    try {
      const { data: property, error: propError } = await supabase
        .from('properties')
        .insert({
          name: complexName,
          nit: nit,
          address: address,
          country: country,
          city: city,
          units_count: parseInt(unitsCount, 10) || 0,
          admin_id: user.id
        })
        .select()
        .single();

      if (propError) throw propError;

      const allUnits = towers.flatMap(tower => {
        const units = generateUnitPreview(tower.floors, tower.unitsPerFloor);
        return units.map(u => ({
          unit_number: u,
          block: tower.name,
          property_id: property.id
        }));
      });

      if (allUnits.length > 0) {
        const { error: unitsError } = await supabase
          .from('units')
          .insert(allUnits);

        if (unitsError) throw unitsError;
      }

      setStep(4);
    } catch (error: any) {
      console.error('Error saving registration data:', error.message);
    }
  };

  const goBack = () => {
    if (step > 1) setStep((s) => s - 1 as Step);
  };

  const addTower = () => {
    const next = towers.length + 1;
    setTowers((t) => [
      ...t,
      { id: String(Date.now()), name: `Torre ${String.fromCharCode(64 + next)}`, floors: 3, unitsPerFloor: 2 },
    ]);
  };

  const updateTower = (id: string, field: keyof Tower, value: string | number) => {
    setTowers((t) =>
      t.map((x) => (x.id === id ? { ...x, [field]: value } : x))
    );
  };

  const selectClass =
    'w-full rounded-xl border-2 border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-4 py-3 pl-11 text-sm text-zinc-900 dark:text-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/10';

  return (
    <div className="flex min-h-screen">
      {/* Left: Branding (PropAdmin PRO) */}
      <div className="relative hidden w-[40%] min-h-screen bg-slate-900 lg:flex flex-col justify-between p-10 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-slate-900/95 via-slate-900/90 to-slate-800/95 z-1" />
        <div className="relative z-10 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white">
            <FontAwesomeIcon icon={faBuilding} className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold text-white">PropAdmin PRO</span>
        </div>
        <div className="relative z-10 space-y-4">
          <h2 className="text-2xl lg:text-3xl font-bold text-white leading-tight">
            La gestión de propiedad horizontal, redefinida.
          </h2>
          <p className="text-sm text-white/80 max-w-sm">
            Únase a los administradores líderes que optimizan sus edificios con nuestra plataforma de alto rendimiento.
          </p>
        </div>
        <p className="relative z-10 text-xs text-white/60">
          © 2024 PropAdmin PRO. Excelencia en administración.
        </p>
      </div>

      {/* Right: Form */}
      <div className="flex flex-1 items-center justify-center bg-white dark:bg-zinc-900 p-6 sm:p-10 overflow-y-auto">
        <div className="w-full max-w-lg space-y-8">
          {/* ----- PASO 1: Crea tu cuenta ----- */}
          {step === 1 && (
            <>
              <div className="flex justify-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  ACCESO ADMINISTRATIVO
                </span>
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                  Crea tu cuenta
                </h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Empieza a gestionar tus copropiedades con eficiencia.
                </p>
              </div>
              <form onSubmit={handleStep1} className="space-y-4">
                <Input
                  label="Nombre Completo"
                  placeholder="Ej. Juan Pérez"
                  leftIcon={faUser}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
                <Input
                  label="Teléfono de Contacto"
                  type="tel"
                  placeholder="+57 300 000 0000"
                  leftIcon={faPhone}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
                <div>
                  <Input
                    label="Correo Electrónico Corporativo"
                    type="email"
                    placeholder="email@empresa.com"
                    leftIcon={faEnvelope}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={authStatus === 'loading'}
                    required
                  />
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    Preferiblemente tu email de trabajo
                  </p>
                </div>
                <Input
                  label="Contraseña"
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  leftIcon={faLock}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={authStatus === 'loading'}
                  required
                />
                <Input
                  label="Confirmar Contraseña"
                  type="password"
                  placeholder="Repite tu contraseña"
                  leftIcon={faLock}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={authStatus === 'loading'}
                  required
                />
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-zinc-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    Acepto los{' '}
                    <Link href="/terminos" className="font-medium text-primary hover:underline">
                      Términos de Servicio
                    </Link>{' '}
                    y la{' '}
                    <Link href="/privacidad" className="font-medium text-primary hover:underline">
                      Política de Privacidad
                    </Link>
                    .
                  </span>
                </label>
                {authError && (
                  <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-3 text-sm font-medium text-red-500">
                    {authError}
                  </div>
                )}
                {password !== confirmPassword && confirmPassword && (
                  <p className="text-sm text-red-500">Las contraseñas no coinciden.</p>
                )}
                <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-3 text-xs text-blue-700 dark:text-blue-300 flex items-start gap-2">
                  <FontAwesomeIcon icon={faCheckCircle} className="mt-0.5" />
                  <p>Te enviaremos un correo de confirmación para validar tu cuenta antes de continuar.</p>
                </div>
                <Button
                  type="submit"
                  className="w-full py-3.5 text-base font-bold"
                  isLoading={authStatus === 'loading'}
                  rightIcon={faArrowRight}
                >
                  Comenzar Prueba Gratuita
                </Button>
              </form>
              <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
                ¿Ya tienes cuenta?{' '}
                <Link href="/login" className="font-bold text-primary hover:underline">
                  Inicia Sesión
                </Link>
              </p>
            </>
          )}

          {/* ----- PASO 2: Registra tu Copropiedad ----- */}
          {step === 2 && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-primary uppercase">
                  Paso 2 de 3
                </span>
                <div className="h-1.5 w-24 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                  <div className="h-full w-2/3 bg-primary" />
                </div>
              </div>
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Registra tu propiedad
              </p>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                  Registra tu Copropiedad
                </h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Completa los datos básicos para iniciar la gestión administrativa.
                </p>
              </div>
              <form onSubmit={handleStep2} className="space-y-4">
                <Input
                  label="Nombre del Conjunto Residencial"
                  placeholder="Ej. Bosques de San Ángel"
                  leftIcon={faBuilding}
                  value={complexName}
                  onChange={(e) => setComplexName(e.target.value)}
                  required
                />
                <Input
                  label="NIT / ID Tributaria"
                  placeholder="900.000.000-1"
                  value={nit}
                  onChange={(e) => setNit(e.target.value)}
                />
                <Input
                  label="Número de Unidades / Apartamentos"
                  type="number"
                  min={0}
                  placeholder="0"
                  value={unitsCount}
                  onChange={(e) => setUnitsCount(e.target.value)}
                />
                <Input
                  label="Dirección Completa"
                  placeholder="Calle 100 # 45 - 23"
                  leftIcon={faMapMarkerAlt}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">País</label>
                    <div className="relative">
                      <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="h-4 w-4" />
                      </div>
                      <select
                        value={country}
                        onChange={(e) => {
                          setCountry(e.target.value);
                          const cities = CIUDADES[e.target.value] || [];
                          setCity(cities[0] || '');
                        }}
                        className={selectClass}
                      >
                        {PAISES.map((p) => (
                          <option key={p.value} value={p.value}>{p.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Ciudad</label>
                    <div className="relative">
                      <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="h-4 w-4" />
                      </div>
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className={selectClass}
                      >
                        {(CIUDADES[country] || []).map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={goBack} className="flex-1" leftIcon={faArrowLeft}>
                    Atrás
                  </Button>
                  <Button type="submit" className="flex-1" rightIcon={faArrowRight}>
                    Guardar y continuar →
                  </Button>
                </div>
              </form>
            </>
          )}

          {/* ----- PASO 3: Estructura Física ----- */}
          {step === 3 && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-primary uppercase">
                  Paso 3 de 3
                </span>
                <div className="h-1.5 w-24 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                  <div className="h-full w-full bg-primary" />
                </div>
              </div>
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Estructura Física
              </p>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                  ¿Cómo está organizado tu conjunto?
                </h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Configura las torres y unidades de tu propiedad manualmente o sube tu base de datos existente.
                </p>
              </div>
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                <FontAwesomeIcon icon={faLayerGroup} className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>
                  No te preocupes por los correos ahora. Puedes invitar residentes más tarde.
                </span>
              </div>
              <form onSubmit={handleStep3} className="space-y-6">
                {towers.map((tower) => {
                  const isExpanded = expandedTower === tower.id;
                  const preview = generateUnitPreview(tower.floors, tower.unitsPerFloor);
                  return (
                    <div
                      key={tower.id}
                      className="rounded-xl border-2 border-zinc-200 dark:border-zinc-700 overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedTower(isExpanded ? '' : tower.id)}
                        className="w-full flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                      >
                        <span className="font-bold text-zinc-900 dark:text-white">{tower.name}</span>
                        <span className="text-xs text-primary font-medium">Configuración Manual</span>
                        <FontAwesomeIcon
                          icon={faChevronDown}
                          className={`h-4 w-4 text-zinc-500 transition-transform ${isExpanded ? '' : '-rotate-90'}`}
                        />
                      </button>
                      {isExpanded && (
                        <div className="p-4 space-y-4 border-t border-zinc-200 dark:border-zinc-700">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Número de Pisos</label>
                              <input
                                type="number"
                                min={1}
                                value={tower.floors}
                                onChange={(e) => updateTower(tower.id, 'floors', parseInt(e.target.value, 10) || 1)}
                                className="mt-1 w-full rounded-lg border-2 border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white px-3 py-2 text-sm outline-none focus:border-primary"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Unidades por Piso</label>
                              <input
                                type="number"
                                min={1}
                                value={tower.unitsPerFloor}
                                onChange={(e) => updateTower(tower.id, 'unitsPerFloor', parseInt(e.target.value, 10) || 1)}
                                className="mt-1 w-full rounded-lg border-2 border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white px-3 py-2 text-sm outline-none focus:border-primary"
                              />
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                                Vista Previa de Unidades ({preview.length} Total)
                              </span>
                              <Button type="button" variant="ghost" size="sm">
                                Regenerar
                              </Button>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {preview.slice(0, 24).map((u) => (
                                <span
                                  key={u}
                                  className="inline-flex h-8 min-w-10 items-center justify-center rounded border border-zinc-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-2 text-xs font-medium text-zinc-700 dark:text-zinc-300"
                                >
                                  {u}
                                </span>
                              ))}
                              {preview.length > 24 && (
                                <span className="inline-flex h-8 items-center px-2 text-xs text-zinc-500 dark:text-zinc-400">
                                  +{preview.length - 24} más
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                <button
                  type="button"
                  onClick={addTower}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 py-4 text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:border-primary hover:text-primary"
                >
                  <FontAwesomeIcon icon={faPlus} className="h-4 w-4" />
                  Agregar otra torre
                </button>

                <div className="rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 p-6 text-center">
                  <FontAwesomeIcon icon={faFileExcel} className="h-10 w-10 text-zinc-400 mb-2" />
                  <p className="font-semibold text-zinc-900 dark:text-white">¿Tienes muchas unidades? Ahorra tiempo</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                    Arrastra tu archivo Excel aquí o haz clic para buscar en tu equipo.
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-3">
                    <Button type="button" variant="outline" size="sm">
                      Seleccionar Archivo
                    </Button>
                    <button type="button" className="text-sm font-medium text-primary hover:underline">
                      Descargar plantilla
                    </button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={goBack} className="flex-1" leftIcon={faArrowLeft}>
                    Atrás
                  </Button>
                  <Button type="submit" className="flex-1" rightIcon={faArrowRight}>
                    Siguiente →
                  </Button>
                </div>
              </form>
            </>
          )}

          {/* ----- PASO 4: ¡Todo listo! ----- */}
          {step === 4 && (
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-8 shadow-sm">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="h-20 w-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <FontAwesomeIcon icon={faBuilding} className="h-10 w-10 text-zinc-500 dark:text-zinc-400" />
                  </div>
                  <div className="absolute -top-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white">
                    <FontAwesomeIcon icon={faCheckCircle} className="h-5 w-5" />
                  </div>
                </div>
              </div>
              <h1 className="text-2xl font-bold text-center text-zinc-900 dark:text-white">
                ¡Todo listo!
              </h1>
              <p className="text-center text-zinc-500 dark:text-zinc-400 mt-2">
                Tu comunidad ya está en línea y lista para ser administrada.
              </p>
              <div className="mt-6 space-y-4">
                <Button
                  className="w-full py-3.5 text-base font-bold"
                  rightIcon={faArrowRight}
                  onClick={() => router.push('/profile')}
                >
                  Ir al Panel de Control →
                </Button>
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                >
                  <FontAwesomeIcon icon={faFileLines} className="h-4 w-4" />
                  Ver resumen de configuración
                </button>
              </div>
              <div className="mt-6 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 p-4 flex items-start gap-3">
                <FontAwesomeIcon icon={faCheckCircle} className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-emerald-800 dark:text-emerald-300">Prueba gratuita de 60 días iniciada</p>
                  <p className="text-emerald-700 dark:text-emerald-400 mt-0.5">
                    Tu cuenta Premium está activa sin costo hasta el 24 de Diciembre.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

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
  selectUser,
} from '@/lib/redux/slices/authSlice';
import { AppDispatch } from '@/lib/redux/store';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { apiClient } from '@/lib/api';
import { useTranslations } from 'next-intl';

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
  const t = useTranslations('register');
  const [step, setStep] = useState<Step>(1);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [complexName, setComplexName] = useState('');
  const [nit, setNit] = useState('');
  const [unitsCount, setUnitsCount] = useState('');
  const [address, setAddress] = useState('');
  const [country, setCountry] = useState('colombia');
  const [city, setCity] = useState('');

  const [towers, setTowers] = useState<Tower[]>([
    { id: '1', name: 'Torre A', floors: 3, unitsPerFloor: 2 },
  ]);
  const [expandedTower, setExpandedTower] = useState<string>('1');

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const authStatus = useSelector(selectAuthStatus);
  const authError = useSelector(selectAuthError);
  const user = useSelector(selectUser);

  const handleStep1 = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) return;
    if (!acceptTerms) return;

    const cleanPhone = phone.replace(/\s+/g, '');

    const result = await dispatch(
      signUpWithPassword({
        email,
        password,
        full_name: fullName,
        phone: cleanPhone,
        nit: nit,
        role: 'admin',
      })
    );

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

    if (!user) {
      setStep(4);
      return;
    }

    try {
      // Create property
      const property = await apiClient.createProperty({
        name: complexName,
        nit,
        address,
        country,
        city,
        unitsCount: parseInt(unitsCount, 10) || 0,
        adminId: user.id,
      });

      // Create units for each tower
      const allUnits = towers.flatMap(tower => {
        const units = generateUnitPreview(tower.floors, tower.unitsPerFloor);
        return units.map(u => ({
          unitNumber: u,
          block: tower.name,
          propertyId: property.id,
        }));
      });

      if (allUnits.length > 0) {
        await apiClient.createUnits(allUnits);
      }

      setStep(4);
    } catch (error: any) {
      console.error('Error saving registration data:', error.message);
    }
  };

  const goBack = () => {
    if (step > 1) setStep(s => (s - 1) as Step);
  };

  const addTower = () => {
    const next = towers.length + 1;
    setTowers(t => [
      ...t,
      {
        id: String(Date.now()),
        name: `Torre ${String.fromCharCode(64 + next)}`,
        floors: 3,
        unitsPerFloor: 2,
      },
    ]);
  };

  const updateTower = (
    id: string,
    field: keyof Tower,
    value: string | number
  ) => {
    setTowers(t => t.map(x => (x.id === id ? { ...x, [field]: value } : x)));
  };

  const selectClass =
    'w-full rounded-xl border-2 border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-4 py-3 pl-11 text-sm text-zinc-900 dark:text-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/10';

  return (
    <div className="flex min-h-screen">
      {/* Left: Branding (PropAdmin PRO) */}
      <div className="relative hidden min-h-screen w-[40%] flex-col justify-between overflow-hidden bg-slate-900 p-10 lg:flex">
        <div className="absolute inset-0 z-1 bg-linear-to-br from-slate-900/95 via-slate-900/90 to-slate-800/95" />
        <div className="relative z-10 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white">
            <FontAwesomeIcon icon={faBuilding} className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold text-white">{t('brandName')}</span>
        </div>
        <div className="relative z-10 space-y-4">
          <h2 className="text-2xl leading-tight font-bold text-white lg:text-3xl">
            {t('brandTagline')}
          </h2>
          <p className="max-w-sm text-sm text-white/80">
            {t('brandDescription')}
          </p>
        </div>
        <p className="relative z-10 text-xs text-white/60">
          {t('brandFooter')}
        </p>
      </div>

      {/* Right: Form */}
      <div className="flex flex-1 items-center justify-center overflow-y-auto bg-white p-6 sm:p-10 dark:bg-zinc-900">
        <div className="w-full max-w-lg space-y-8">
          {/* ----- PASO 1: Crea tu cuenta ----- */}
          {step === 1 && (
            <>
              <div className="flex justify-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
                  {t('accessBadge')}
                </span>
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                  {t('step1Title')}
                </h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {t('step1Subtitle')}
                </p>
              </div>
              <form onSubmit={handleStep1} className="space-y-4">
                <Input
                  label={t('fullNameLabel')}
                  placeholder={t('fullNamePlaceholder')}
                  leftIcon={faUser}
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  required
                />
                <Input
                  label={t('phoneLabel')}
                  type="tel"
                  placeholder={t('phonePlaceholder')}
                  leftIcon={faPhone}
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  required
                />
                <div>
                  <Input
                    label={t('emailLabel')}
                    type="email"
                    placeholder={t('emailPlaceholder')}
                    leftIcon={faEnvelope}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    disabled={authStatus === 'loading'}
                    required
                  />
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    {t('emailHint')}
                  </p>
                </div>
                <Input
                  label={t('passwordLabel')}
                  type="password"
                  placeholder={t('passwordPlaceholder')}
                  leftIcon={faLock}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={authStatus === 'loading'}
                  required
                />
                <Input
                  label={t('confirmPasswordLabel')}
                  type="password"
                  placeholder={t('confirmPasswordPlaceholder')}
                  leftIcon={faLock}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  disabled={authStatus === 'loading'}
                  required
                />
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={e => setAcceptTerms(e.target.checked)}
                    className="text-primary focus:ring-primary mt-1 h-4 w-4 rounded border-zinc-300"
                  />
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    {t('acceptTerms')}{' '}
                    <Link
                      href="/terminos"
                      className="text-primary font-medium hover:underline"
                    >
                      {t('termsLink')}
                    </Link>{' '}
                    {t('andThe')}{' '}
                    <Link
                      href="/privacidad"
                      className="text-primary font-medium hover:underline"
                    >
                      {t('privacyLink')}
                    </Link>
                    .
                  </span>
                </label>
                {authError && (
                  <div className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-500 dark:bg-red-900/20">
                    {authError}
                  </div>
                )}
                {password !== confirmPassword && confirmPassword && (
                  <p className="text-sm text-red-500">
                    {t('passwordMismatch')}
                  </p>
                )}
                <div className="flex items-start gap-2 rounded-lg bg-blue-50 p-3 text-xs text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                  <FontAwesomeIcon icon={faCheckCircle} className="mt-0.5" />
                  <p>
                    {t('confirmationNotice')}
                  </p>
                </div>
                <Button
                  type="submit"
                  className="w-full py-3.5 text-base font-bold"
                  isLoading={authStatus === 'loading'}
                  rightIcon={faArrowRight}
                >
                  {t('startTrialButton')}
                </Button>
              </form>
              <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
                {t('alreadyHaveAccount')}{' '}
                <Link
                  href="/login"
                  className="text-primary font-bold hover:underline"
                >
                  {t('signIn')}
                </Link>
              </p>
            </>
          )}

          {/* ----- PASO 2: Registra tu Copropiedad ----- */}
          {step === 2 && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-primary text-xs font-bold uppercase">
                  {t('step2Of3')}
                </span>
                <div className="h-1.5 w-24 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <div className="bg-primary h-full w-2/3" />
                </div>
              </div>
              <p className="text-xs font-medium tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                {t('registerPropertyBadge')}
              </p>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                  {t('step2Title')}
                </h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {t('step2Subtitle')}
                </p>
              </div>
              <form onSubmit={handleStep2} className="space-y-4">
                <Input
                  label={t('complexNameLabel')}
                  placeholder={t('complexNamePlaceholder')}
                  leftIcon={faBuilding}
                  value={complexName}
                  onChange={e => setComplexName(e.target.value)}
                  required
                />
                <Input
                  label={t('nitLabel')}
                  placeholder={t('nitPlaceholder')}
                  value={nit}
                  onChange={e => setNit(e.target.value)}
                />
                <Input
                  label={t('unitsCountLabel')}
                  type="number"
                  min={0}
                  placeholder="0"
                  value={unitsCount}
                  onChange={e => setUnitsCount(e.target.value)}
                />
                <Input
                  label={t('addressLabel')}
                  placeholder={t('addressPlaceholder')}
                  leftIcon={faMapMarkerAlt}
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                      {t('countryLabel')}
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-zinc-400">
                        <FontAwesomeIcon
                          icon={faMapMarkerAlt}
                          className="h-4 w-4"
                        />
                      </div>
                      <select
                        value={country}
                        onChange={e => {
                          setCountry(e.target.value);
                          const cities = CIUDADES[e.target.value] || [];
                          setCity(cities[0] || '');
                        }}
                        className={selectClass}
                      >
                        {PAISES.map(p => (
                          <option key={p.value} value={p.value}>
                            {p.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                      {t('cityLabel')}
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-zinc-400">
                        <FontAwesomeIcon
                          icon={faMapMarkerAlt}
                          className="h-4 w-4"
                        />
                      </div>
                      <select
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        className={selectClass}
                      >
                        {(CIUDADES[country] || []).map(c => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={goBack}
                    className="flex-1"
                    leftIcon={faArrowLeft}
                  >
                    {t('backButton')}
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    rightIcon={faArrowRight}
                  >
                    {t('saveAndContinue')}
                  </Button>
                </div>
              </form>
            </>
          )}

          {/* ----- PASO 3: Estructura Física ----- */}
          {step === 3 && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-primary text-xs font-bold uppercase">
                  {t('step3Of3')}
                </span>
                <div className="h-1.5 w-24 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <div className="bg-primary h-full w-full" />
                </div>
              </div>
              <p className="text-xs font-medium tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                {t('physicalStructureBadge')}
              </p>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                  {t('step3Title')}
                </h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {t('step3Subtitle')}
                </p>
              </div>
              <div className="border-primary/20 bg-primary/5 flex items-start gap-2 rounded-lg border p-3 text-sm text-zinc-700 dark:text-zinc-300">
                <FontAwesomeIcon
                  icon={faLayerGroup}
                  className="text-primary mt-0.5 h-4 w-4 shrink-0"
                />
                <span>
                  {t('inviteResidentsLater')}
                </span>
              </div>
              <form onSubmit={handleStep3} className="space-y-6">
                {towers.map(tower => {
                  const isExpanded = expandedTower === tower.id;
                  const preview = generateUnitPreview(
                    tower.floors,
                    tower.unitsPerFloor
                  );
                  return (
                    <div
                      key={tower.id}
                      className="overflow-hidden rounded-xl border-2 border-zinc-200 dark:border-zinc-700"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedTower(isExpanded ? '' : tower.id)
                        }
                        className="flex w-full items-center justify-between bg-zinc-50 p-4 hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                      >
                        <span className="font-bold text-zinc-900 dark:text-white">
                          {tower.name}
                        </span>
                        <span className="text-primary text-xs font-medium">
                          {t('manualConfig')}
                        </span>
                        <FontAwesomeIcon
                          icon={faChevronDown}
                          className={`h-4 w-4 text-zinc-500 transition-transform ${isExpanded ? '' : '-rotate-90'}`}
                        />
                      </button>
                      {isExpanded && (
                        <div className="space-y-4 border-t border-zinc-200 p-4 dark:border-zinc-700">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                                {t('floorsLabel')}
                              </label>
                              <input
                                type="number"
                                min={1}
                                value={tower.floors}
                                onChange={e =>
                                  updateTower(
                                    tower.id,
                                    'floors',
                                    parseInt(e.target.value, 10) || 1
                                  )
                                }
                                className="focus:border-primary mt-1 w-full rounded-lg border-2 border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                                {t('unitsPerFloorLabel')}
                              </label>
                              <input
                                type="number"
                                min={1}
                                value={tower.unitsPerFloor}
                                onChange={e =>
                                  updateTower(
                                    tower.id,
                                    'unitsPerFloor',
                                    parseInt(e.target.value, 10) || 1
                                  )
                                }
                                className="focus:border-primary mt-1 w-full rounded-lg border-2 border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
                              />
                            </div>
                          </div>
                          <div>
                            <div className="mb-2 flex items-center justify-between">
                              <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                                {t('unitsPreview', { count: preview.length })}
                              </span>
                              <Button type="button" variant="ghost" size="sm">
                                {t('regenerate')}
                              </Button>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {preview.slice(0, 24).map(u => (
                                <span
                                  key={u}
                                  className="inline-flex h-8 min-w-10 items-center justify-center rounded border border-zinc-200 bg-white px-2 text-xs font-medium text-zinc-700 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                                >
                                  {u}
                                </span>
                              ))}
                              {preview.length > 24 && (
                                <span className="inline-flex h-8 items-center px-2 text-xs text-zinc-500 dark:text-zinc-400">
                                  {t('moreUnits', { count: preview.length - 24 })}
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
                  className="hover:border-primary hover:text-primary flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-zinc-200 py-4 text-sm font-medium text-zinc-500 dark:border-zinc-700 dark:text-zinc-400"
                >
                  <FontAwesomeIcon icon={faPlus} className="h-4 w-4" />
                  {t('addAnotherTower')}
                </button>

                <div className="rounded-xl border-2 border-dashed border-zinc-200 p-6 text-center dark:border-zinc-700">
                  <FontAwesomeIcon
                    icon={faFileExcel}
                    className="mb-2 h-10 w-10 text-zinc-400"
                  />
                  <p className="font-semibold text-zinc-900 dark:text-white">
                    {t('manyUnitsTitle')}
                  </p>
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    {t('manyUnitsSubtitle')}
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-3">
                    <Button type="button" variant="outline" size="sm">
                      {t('selectFile')}
                    </Button>
                    <button
                      type="button"
                      className="text-primary text-sm font-medium hover:underline"
                    >
                      {t('downloadTemplate')}
                    </button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={goBack}
                    className="flex-1"
                    leftIcon={faArrowLeft}
                  >
                    {t('backButton')}
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    rightIcon={faArrowRight}
                  >
                    {t('nextButton')}
                  </Button>
                </div>
              </form>
            </>
          )}

          {/* ----- PASO 4: ¡Todo listo! ----- */}
          {step === 4 && (
            <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
              <div className="mb-6 flex justify-center">
                <div className="relative">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                    <FontAwesomeIcon
                      icon={faBuilding}
                      className="h-10 w-10 text-zinc-500 dark:text-zinc-400"
                    />
                  </div>
                  <div className="absolute -top-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white">
                    <FontAwesomeIcon icon={faCheckCircle} className="h-5 w-5" />
                  </div>
                </div>
              </div>
              <h1 className="text-center text-2xl font-bold text-zinc-900 dark:text-white">
                {t('step4Title')}
              </h1>
              <p className="mt-2 text-center text-zinc-500 dark:text-zinc-400">
                {t('step4Subtitle')}
              </p>
              <div className="mt-6 space-y-4">
                <Button
                  className="w-full py-3.5 text-base font-bold"
                  rightIcon={faArrowRight}
                  onClick={() => router.push('/profile')}
                >
                  {t('goToDashboard')}
                </Button>
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                >
                  <FontAwesomeIcon icon={faFileLines} className="h-4 w-4" />
                  {t('viewConfigSummary')}
                </button>
              </div>
              <div className="mt-6 flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-900/20">
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600"
                />
                <div className="text-sm">
                  <p className="font-semibold text-emerald-800 dark:text-emerald-300">
                    {t('trialStarted')}
                  </p>
                  <p className="mt-0.5 text-emerald-700 dark:text-emerald-400">
                    {t('trialDescription')}
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

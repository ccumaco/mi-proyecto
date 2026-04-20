'use client';

import { useState, useEffect, useRef } from 'react';
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
  faEye,
  faEyeSlash,
  faExclamationCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import {
  registerAdminWithProperty,
  selectAuthStatus,
  selectAuthError,
} from '@/lib/redux/slices/authSlice';
import { AppDispatch } from '@/lib/redux/store';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { validarNIT, parseNIT } from '@/components/ui/NITInput';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { generateUnitNumbers } from '@/lib/units';

type Step = 1 | 2 | 3 | 4;

interface Extension {
  value: string;
  label: string;
  flag: string;
}

interface Tower {
  id: string;
  name: string;
  floors: number;
  unitsPerFloor: number;
}

interface ValidationErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  complexName?: string;
  nit?: string;
  address?: string;
  country?: string;
  city?: string;
  towers?: string;
}

const validateEmail = (email: string): string | undefined => {
  if (!email) return 'El correo es requerido';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Correo inválido';
};

const validatePhone = (phoneNumber: string): string | undefined => {
  if (!phoneNumber) return 'El teléfono es requerido';
  const cleaned = phoneNumber.replace(/\D/g, '');
  if (cleaned.length < 7) return 'Teléfono debe tener al menos 7 dígitos';
};

const validatePassword = (password: string): string | undefined => {
  if (!password) return 'Contraseña requerida';
  if (password.length < 8) return 'Mínimo 8 caracteres';
};

const validateFullName = (name: string): string | undefined => {
  if (!name) return 'Nombre requerido';
  if (name.trim().length < 3) return 'Nombre debe tener al menos 3 caracteres';
};

const validateComplexName = (name: string): string | undefined => {
  if (!name) return 'Nombre de copropiedad requerido';
  if (name.trim().length < 3) return 'Debe tener al menos 3 caracteres';
};

const validateAddress = (address: string): string | undefined => {
  if (!address) return 'Dirección requerida';
  if (address.trim().length < 5) return 'Dirección debe ser más específica';
};

const validateNITExists = async (nit: string): Promise<string | undefined> => {
  if (!nit) return;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties/validate-nit/${encodeURIComponent(nit)}`);
    const data = await res.json();
    if (data.exists) {
      return 'Este NIT ya está registrado';
    }
  } catch (error) {
    console.error('Error validating NIT:', error);
  }
};

const EXTENSIONES: Extension[] = [
  { value: '+57', label: 'Colombia', flag: 'co' },
  { value: '+52', label: 'México', flag: 'mx' },
  { value: '+34', label: 'España', flag: 'es' },
  { value: '+54', label: 'Argentina', flag: 'ar' },
  { value: '+56', label: 'Chile', flag: 'cl' },
  { value: '+51', label: 'Perú', flag: 'pe' },
  { value: '+58', label: 'Venezuela', flag: 've' },
  { value: '+505', label: 'Nicaragua', flag: 'ni' },
  { value: '+506', label: 'Costa Rica', flag: 'cr' },
  { value: '+507', label: 'Panamá', flag: 'pa' },
  { value: '+591', label: 'Bolivia', flag: 'bo' },
  { value: '+55', label: 'Brasil', flag: 'br' },
  { value: '+595', label: 'Paraguay', flag: 'py' },
  { value: '+598', label: 'Uruguay', flag: 'uy' },
  { value: '+1', label: 'USA', flag: 'us' },
  { value: '+1', label: 'Canadá', flag: 'ca' },
];

const PAISES = [
  { value: 'colombia', label: 'Colombia' },
  { value: 'mexico', label: 'México' },
  { value: 'espana', label: 'España' },
  { value: 'argentina', label: 'Argentina' },
  { value: 'chile', label: 'Chile' },
  { value: 'peru', label: 'Perú' },
  { value: 'venezuela', label: 'Venezuela' },
  { value: 'nicaragua', label: 'Nicaragua' },
  { value: 'costarica', label: 'Costa Rica' },
  { value: 'panama', label: 'Panamá' },
  { value: 'bolivia', label: 'Bolivia' },
  { value: 'brasil', label: 'Brasil' },
  { value: 'paraguay', label: 'Paraguay' },
  { value: 'uruguay', label: 'Uruguay' },
  { value: 'usa', label: 'Estados Unidos' },
  { value: 'canada', label: 'Canadá' },
];

const CIUDADES: Record<string, string[]> = {
  colombia: ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Cúcuta', 'Bucaramanga', 'Santa Marta', 'Ibagué', 'Pereira'],
  mexico: ['Ciudad de México', 'Guadalajara', 'Monterrey', 'Puebla', 'Tijuana', 'Cancún', 'Playa del Carmen', 'León', 'Veracruz', 'Querétaro'],
  espana: ['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Bilbao', 'Málaga', 'Alicante', 'Córdoba', 'Palma', 'Murcia'],
  argentina: ['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'La Plata', 'San Juan', 'Salta', 'Tucumán', 'Mar del Plata', 'Bahía Blanca'],
  chile: ['Santiago', 'Valparaíso', 'Concepción', 'La Serena', 'Antofagasta', 'Temuco', 'Osorno', 'Valdivia', 'Coyhaique', 'Punta Arenas'],
  peru: ['Lima', 'Arequipa', 'Trujillo', 'Cusco', 'Chiclayo', 'Iquitos', 'Puno', 'Ayacucho', 'Huancayo', 'Chancay'],
  venezuela: ['Caracas', 'Maracaibo', 'Valencia', 'Barquisimeto', 'Maracay', 'Puerto La Cruz', 'Mérida', 'San Cristóbal', 'Cumaná', 'Cabimas'],
  nicaragua: ['Managua', 'León', 'Granada', 'Masaya', 'Jinotega', 'Estelí', 'Matagalpa', 'Chinandega', 'Bluefields', 'Big Corn Island'],
  costarica: ['San José', 'San Isidro', 'Alajuela', 'Cartago', 'Limón', 'Puntarenas', 'San Carlos', 'Liberia', 'Desamparados', 'Heredia'],
  panama: ['Panamá City', 'San Miguelito', 'Colón', 'La Chorrera', 'Arraiján', 'Tocumen', 'Taboga', 'Chitré', 'Penonomé', 'David'],
  bolivia: ['La Paz', 'Santa Cruz', 'Cochabamba', 'Oruro', 'Potosí', 'Sucre', 'Tarija', 'Riberalta', 'Guayaramerín', 'Trinida'],
  brasil: ['São Paulo', 'Río de Janeiro', 'Salvador', 'Brasília', 'Fortaleza', 'Belo Horizonte', 'Manaus', 'Curitiba', 'Recife', 'Porto Alegre'],
  paraguay: ['Asunción', 'Ciudad del Este', 'San Juan Bautista', 'Encarnación', 'Villarrica', 'Coronel Oviedo', 'Caaguazú', 'Pedro Juan Caballero', 'Iguazú', 'Caazapá'],
  uruguay: ['Montevideo', 'Salto', 'Paysandú', 'Rivera', 'Maldonado', 'Rocha', 'Soriano', 'Durazno', 'Florida', 'Cerro Largo'],
  usa: ['Nueva York', 'Los Ángeles', 'Chicago', 'Houston', 'Phoenix', 'Filadelfia', 'San Antonio', 'San Diego', 'Dallas', 'San José'],
  canada: ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa', 'Winnipeg', 'Quebec City', 'Hamilton', 'Kitchener', 'London'],
};

export default function RegisterPage() {
  const t = useTranslations('register');
  const [step, setStep] = useState<Step>(1);

  // Step 1: Account creation (with default values for testing)
  const [fullName, setFullName] = useState('Test User');
  const [email, setEmail] = useState(`test${Date.now()}@example.com`);
  const [phoneExtension, setPhoneExtension] = useState('+57');
  const [phoneNumber, setPhoneNumber] = useState('300 000 0000');
  const [password, setPassword] = useState('Test@1234');
  const [confirmPassword, setConfirmPassword] = useState('Test@1234');
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [extensionOpen, setExtensionOpen] = useState(false);
  const extensionRef = useRef<HTMLDivElement>(null);

  // Step 2: Property registration (with default values)
  const [complexName, setComplexName] = useState('Condominio Sunset');
  const [nit, setNit] = useState('900218578-7');
  const [address, setAddress] = useState('Cra 5 # 45-67, Bogotá');
  const [country, setCountry] = useState('colombia');
  const [city, setCity] = useState('Bogotá');

  // Step 3: Physical structure
  const [towers, setTowers] = useState<Tower[]>([
    { id: '1', name: 'Torre A', floors: 3, unitsPerFloor: 2 },
  ]);
  const [expandedTower, setExpandedTower] = useState<string>('1');

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const authStatus = useSelector(selectAuthStatus);
  const authError = useSelector(selectAuthError);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (extensionRef.current && !extensionRef.current.contains(e.target as Node)) {
        setExtensionOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const validateStep1 = (): boolean => {
    const newErrors: ValidationErrors = {};

    const fullNameError = validateFullName(fullName);
    if (fullNameError) newErrors.fullName = fullNameError;

    const emailError = validateEmail(email);
    if (emailError) newErrors.email = emailError;

    const phoneError = validatePhone(phoneNumber);
    if (phoneError) newErrors.phone = phoneError;

    const passwordError = validatePassword(password);
    if (passwordError) newErrors.password = passwordError;

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (!acceptTerms) {
      newErrors.confirmPassword = 'Debes aceptar los términos y condiciones';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const EXTENSION_TO_COUNTRY: Record<string, string> = {
    '+57': 'colombia',
    '+52': 'mexico',
    '+34': 'espana',
    '+54': 'argentina',
    '+56': 'chile',
    '+51': 'peru',
    '+58': 'venezuela',
    '+505': 'nicaragua',
    '+506': 'costarica',
    '+507': 'panama',
    '+591': 'bolivia',
    '+55': 'brasil',
    '+595': 'paraguay',
    '+598': 'uruguay',
    '+1': 'usa',
  };

  const handleStep1 = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateStep1()) return;
    setErrors({});
    const inferredCountry = EXTENSION_TO_COUNTRY[phoneExtension];
    if (inferredCountry) {
      setCountry(inferredCountry);
      setCity('');
    }
    setStep(2);
  };

  const validateStep2 = (): boolean => {
    const newErrors: ValidationErrors = {};

    const complexNameError = validateComplexName(complexName);
    if (complexNameError) newErrors.complexName = complexNameError;

    if (!nit) {
      newErrors.nit = 'NIT es requerido';
    } else {
      const parsed = parseNIT(nit);
      if (!parsed || !validarNIT(parsed.nit, parsed.dv)) {
        newErrors.nit =
          'NIT inválido. Verifique formato y dígito de verificación.';
      }
    }

    const addressError = validateAddress(address);
    if (addressError) newErrors.address = addressError;

    if (!country) newErrors.country = 'País requerido';
    if (!city) newErrors.city = 'Ciudad requerida';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStep2 = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateStep2()) return;

    // Validar si el NIT ya existe en la base de datos
    const parsed = parseNIT(nit);
    if (parsed && validarNIT(parsed.nit, parsed.dv)) {
      const nitExists = await validateNITExists(nit);
      if (nitExists) {
        setErrors(prev => ({ ...prev, nit: nitExists }));
        return;
      }
    }

    setStep(3);
  };

  const validateStep3 = (): boolean => {
    for (const tower of towers) {
      if (tower.floors < 1) {
        setErrors({ towers: `Torre ${tower.name}: mínimo 1 piso` });
        return false;
      }
      if (tower.unitsPerFloor < 1) {
        setErrors({ towers: `Torre ${tower.name}: mínimo 1 unidad por piso` });
        return false;
      }
    }
    setErrors({});
    return true;
  };

  const submitRegistration = async (skipTowers: boolean) => {
    if (!skipTowers && !validateStep3()) return;

    const payload = {
      user: {
        email,
        password,
        fullName,
        phone: `${phoneExtension} ${phoneNumber}`,
      },
      property: {
        name: complexName,
        nit,
        address,
        country,
        city,
      },
      towers: skipTowers
        ? []
        : towers.map(t => ({
            name: t.name,
            floors: t.floors,
            unitsPerFloor: t.unitsPerFloor,
          })),
    };

    try {
      setSubmitting(true);
      await dispatch(registerAdminWithProperty(payload)).unwrap();
      setErrors({});
      setStep(4);
    } catch (err: any) {
      const message = typeof err === 'string' ? err : err?.message || 'No se pudo completar el registro.';
      const lower = message.toLowerCase();
      if (lower.includes('correo') || lower.includes('email')) {
        setErrors({ email: message });
        setStep(1);
      } else if (lower.includes('nit')) {
        setErrors({ nit: message });
        setStep(2);
      } else {
        setErrors({ towers: message });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleStep3 = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await submitRegistration(false);
  };

  const handleSkipTowers = async () => {
    await submitRegistration(true);
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
    'w-full rounded-xl border-2 border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-4 py-3 pl-11 pr-10 text-sm text-zinc-900 dark:text-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/10';

  const getInputClass = (hasError: boolean) => {
    const base =
      'w-full rounded-xl border-2 bg-white px-4 py-3 pl-11 pr-11 text-sm text-zinc-900 transition-all duration-200 outline-none placeholder:text-zinc-400 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-500';
    if (hasError) {
      return `${base} border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100 dark:border-red-500 dark:focus:border-red-500 dark:focus:ring-red-900/30`;
    }
    return `${base} border-zinc-300 focus:border-primary focus:ring-4 focus:ring-primary/10 dark:border-zinc-600 dark:focus:border-primary/70 dark:focus:ring-primary/10`;
  };

  const isStep1Complete =
    !errors.fullName &&
    !errors.email &&
    !errors.phone &&
    !errors.password &&
    !errors.confirmPassword &&
    fullName &&
    email &&
    phoneNumber &&
    password &&
    confirmPassword &&
    acceptTerms;

  const isStep2Complete =
    !errors.complexName &&
    !errors.nit &&
    !errors.address &&
    !errors.country &&
    !errors.city &&
    complexName &&
    nit &&
    address &&
    country &&
    city;

  const isStep3Complete =
    towers.length > 0 &&
    towers.every(t => t.floors >= 1 && t.unitsPerFloor >= 1) &&
    !errors.towers;

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
                <div className="flex w-full flex-col gap-1.5">
                  <label className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                    {t('fullNameLabel')}
                  </label>
                  <div className="group relative flex items-center">
                    <div className="group-focus-within:text-primary pointer-events-none absolute left-3.5 text-zinc-400 transition-colors">
                      <FontAwesomeIcon icon={faUser} className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      placeholder={t('fullNamePlaceholder')}
                      value={fullName}
                      onChange={e => {
                        setFullName(e.target.value);
                        if (e.target.value) {
                          const err = validateFullName(e.target.value);
                          setErrors(prev => ({ ...prev, fullName: err }));
                        }
                      }}
                      disabled={authStatus === 'loading'}
                      required
                      className={getInputClass(!!errors.fullName)}
                    />
                  </div>
                  {errors.fullName && (
                    <span className="animate-in fade-in slide-in-from-top-1 flex items-center gap-1 text-xs font-medium text-red-500">
                      <FontAwesomeIcon
                        icon={faExclamationCircle}
                        className="h-3 w-3"
                      />
                      {errors.fullName}
                    </span>
                  )}
                </div>

                <div className="flex w-full flex-col gap-1.5">
                  <label className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                    {t('phoneLabel')}
                  </label>
                  <div className="flex gap-2">
                    <div ref={extensionRef} className="relative">
                      <button
                        type="button"
                        disabled={authStatus === 'loading'}
                        onClick={() => setExtensionOpen(o => !o)}
                        className="flex h-11.5 min-w-30 items-center gap-2 rounded-xl border-2 border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
                      >
                        {(() => {
                          const sel = EXTENSIONES.find(e => e.value === phoneExtension && e.flag === EXTENSIONES.find(x => x.value === phoneExtension)?.flag) ?? EXTENSIONES.find(e => e.value === phoneExtension) ?? EXTENSIONES[0];
                          return (
                            <>
                              <img
                                src={`https://flagcdn.com/20x15/${sel.flag}.png`}
                                width={20}
                                height={15}
                                alt={sel.label}
                                className="rounded-xs object-cover"
                              />
                              <span className="font-medium">{sel.value}</span>
                              <FontAwesomeIcon icon={faChevronDown} className={`h-3 w-3 text-zinc-400 transition-transform ${extensionOpen ? 'rotate-180' : ''}`} />
                            </>
                          );
                        })()}
                      </button>
                      {extensionOpen && (
                        <div className="absolute top-full left-0 z-50 mt-1 max-h-60 w-64 overflow-y-auto rounded-xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
                          {EXTENSIONES.map((ext, idx) => (
                            <button
                              key={`${ext.value}-${idx}`}
                              type="button"
                              onClick={() => {
                                setPhoneExtension(ext.value);
                                setErrors(prev => ({ ...prev, phone: undefined }));
                                setExtensionOpen(false);
                              }}
                              className={`flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-700 ${phoneExtension === ext.value ? 'bg-primary/5 font-semibold text-primary' : 'text-zinc-800 dark:text-zinc-200'}`}
                            >
                              <img
                                src={`https://flagcdn.com/20x15/${ext.flag}.png`}
                                width={20}
                                height={15}
                                alt={ext.label}
                                className="rounded-xs object-cover"
                              />
                              <span className="flex-1">{ext.label}</span>
                              <span className="text-zinc-400">{ext.value}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="group relative flex flex-1 items-center">
                      <input
                        type="tel"
                        placeholder="300 000 0000"
                        value={phoneNumber}
                        onChange={e => {
                          setPhoneNumber(e.target.value);
                          if (e.target.value) {
                            const err = validatePhone(e.target.value);
                            setErrors(prev => ({ ...prev, phone: err }));
                          }
                        }}
                        disabled={authStatus === 'loading'}
                        required
                        className={getInputClass(!!errors.phone)}
                      />
                    </div>
                  </div>
                  {errors.phone && (
                    <span className="animate-in fade-in slide-in-from-top-1 flex items-center gap-1 text-xs font-medium text-red-500">
                      <FontAwesomeIcon
                        icon={faExclamationCircle}
                        className="h-3 w-3"
                      />
                      {errors.phone}
                    </span>
                  )}
                </div>

                <div className="flex w-full flex-col gap-1.5">
                  <label className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                    {t('emailLabel')}
                  </label>
                  <div className="group relative flex items-center">
                    <div className="group-focus-within:text-primary pointer-events-none absolute left-3.5 text-zinc-400 transition-colors">
                      <FontAwesomeIcon icon={faEnvelope} className="h-4 w-4" />
                    </div>
                    <input
                      type="email"
                      placeholder={t('emailPlaceholder')}
                      value={email}
                      onChange={e => {
                        setEmail(e.target.value);
                        if (e.target.value) {
                          const err = validateEmail(e.target.value);
                          setErrors(prev => ({ ...prev, email: err }));
                        }
                      }}
                      disabled={authStatus === 'loading'}
                      required
                      className={getInputClass(!!errors.email)}
                    />
                  </div>
                  {errors.email && (
                    <span className="animate-in fade-in slide-in-from-top-1 flex items-center gap-1 text-xs font-medium text-red-500">
                      <FontAwesomeIcon
                        icon={faExclamationCircle}
                        className="h-3 w-3"
                      />
                      {errors.email}
                    </span>
                  )}
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    {t('emailHint')}
                  </p>
                </div>

                <div className="flex w-full flex-col gap-1.5">
                  <label className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                    Contraseña
                  </label>
                  <div className="group relative flex items-center">
                    <div className="group-focus-within:text-primary pointer-events-none absolute left-3.5 text-zinc-400 transition-colors">
                      <FontAwesomeIcon icon={faLock} className="h-4 w-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Mínimo 8 caracteres"
                      value={password}
                      onChange={e => {
                        setPassword(e.target.value);
                        if (e.target.value) {
                          const err = validatePassword(e.target.value);
                          setErrors(prev => ({ ...prev, password: err }));
                        }
                      }}
                      disabled={authStatus === 'loading'}
                      required
                      className={getInputClass(!!errors.password)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 text-zinc-400 transition-colors hover:text-zinc-600 dark:hover:text-zinc-300"
                      aria-label={
                        showPassword
                          ? 'Ocultar contraseña'
                          : 'Mostrar contraseña'
                      }
                    >
                      <FontAwesomeIcon
                        icon={showPassword ? faEyeSlash : faEye}
                        className="h-4 w-4"
                      />
                    </button>
                  </div>
                  {errors.password && (
                    <span className="animate-in fade-in slide-in-from-top-1 flex items-center gap-1 text-xs font-medium text-red-500">
                      <FontAwesomeIcon
                        icon={faExclamationCircle}
                        className="h-3 w-3"
                      />
                      {errors.password}
                    </span>
                  )}
                </div>

                <div className="flex w-full flex-col gap-1.5">
                  <label className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                    Confirmar Contraseña
                  </label>
                  <div className="group relative flex items-center">
                    <div className="group-focus-within:text-primary pointer-events-none absolute left-3.5 text-zinc-400 transition-colors">
                      <FontAwesomeIcon icon={faLock} className="h-4 w-4" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Repite tu contraseña"
                      value={confirmPassword}
                      onChange={e => {
                        setConfirmPassword(e.target.value);
                        if (e.target.value !== password) {
                          setErrors(prev => ({
                            ...prev,
                            confirmPassword: 'Las contraseñas no coinciden',
                          }));
                        } else {
                          setErrors(prev => ({
                            ...prev,
                            confirmPassword: undefined,
                          }));
                        }
                      }}
                      disabled={authStatus === 'loading'}
                      required
                      className={getInputClass(!!errors.confirmPassword)}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3.5 text-zinc-400 transition-colors hover:text-zinc-600 dark:hover:text-zinc-300"
                      aria-label={
                        showConfirmPassword
                          ? 'Ocultar contraseña'
                          : 'Mostrar contraseña'
                      }
                    >
                      <FontAwesomeIcon
                        icon={showConfirmPassword ? faEyeSlash : faEye}
                        className="h-4 w-4"
                      />
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <span className="animate-in fade-in slide-in-from-top-1 flex items-center gap-1 text-xs font-medium text-red-500">
                      <FontAwesomeIcon
                        icon={faExclamationCircle}
                        className="h-3 w-3"
                      />
                      {errors.confirmPassword}
                    </span>
                  )}
                </div>

                <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-zinc-200 p-3 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800/50">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={e => {
                      setAcceptTerms(e.target.checked);
                      if (e.target.checked) {
                        setErrors(prev => ({
                          ...prev,
                          confirmPassword: undefined,
                        }));
                      }
                    }}
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
                  <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm font-medium text-red-500 dark:bg-red-900/20">
                    <FontAwesomeIcon
                      icon={faExclamationCircle}
                      className="mt-0.5 h-4 w-4 shrink-0"
                    />
                    {authError}
                  </div>
                )}

                <div className="flex items-start gap-2 rounded-lg bg-blue-50 p-3 text-xs text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="mt-0.5 h-3 w-3 shrink-0"
                  />
                  <p>{t('confirmationNotice')}</p>
                </div>

                <Button
                  type="submit"
                  className="w-full py-3.5 text-base font-bold"
                  isLoading={authStatus === 'loading'}
                  rightIcon={faArrowRight}
                  disabled={!isStep1Complete || authStatus === 'loading'}
                >
                  {t('startTrialButton')}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full py-3.5 text-base font-bold"
                  leftIcon={faArrowLeft}
                  onClick={() => router.push('/login')}
                >
                  Volver
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
                <div className="flex w-full flex-col gap-1.5">
                  <label className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                    {t('complexNameLabel')}
                  </label>
                  <div className="group relative flex items-center">
                    <div className="group-focus-within:text-primary pointer-events-none absolute left-3.5 text-zinc-400 transition-colors">
                      <FontAwesomeIcon icon={faBuilding} className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      placeholder={t('complexNamePlaceholder')}
                      value={complexName}
                      onChange={e => {
                        setComplexName(e.target.value);
                        if (e.target.value) {
                          const err = validateComplexName(e.target.value);
                          setErrors(prev => ({ ...prev, complexName: err }));
                        }
                      }}
                      required
                      className={getInputClass(!!errors.complexName)}
                    />
                  </div>
                  {errors.complexName && (
                    <span className="animate-in fade-in slide-in-from-top-1 flex items-center gap-1 text-xs font-medium text-red-500">
                      <FontAwesomeIcon
                        icon={faExclamationCircle}
                        className="h-3 w-3"
                      />
                      {errors.complexName}
                    </span>
                  )}
                </div>

                <div className="flex w-full flex-col gap-1.5">
                  <label className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                    NIT / ID Tributaria
                  </label>
                  <div className="group relative flex items-center">
                    <div className="group-focus-within:text-primary pointer-events-none absolute left-3.5 text-zinc-400 transition-colors">
                      <FontAwesomeIcon icon={faBuilding} className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      placeholder="900000000-1"
                      value={nit}
                      onChange={e => {
                        setNit(e.target.value);
                        if (e.target.value) {
                          const parsed = parseNIT(e.target.value);
                          if (!parsed) {
                            setErrors(prev => ({
                              ...prev,
                              nit: 'Formato inválido. Debe ser 8-10 dígitos con guion.',
                            }));
                          } else if (!validarNIT(parsed.nit, parsed.dv)) {
                            setErrors(prev => ({
                              ...prev,
                              nit: 'Dígito de verificación incorrecto.',
                            }));
                          } else {
                            setErrors(prev => ({ ...prev, nit: undefined }));
                          }
                        }
                      }}
                      onBlur={async (e) => {
                        if (e.target.value) {
                          const parsed = parseNIT(e.target.value);
                          if (parsed && validarNIT(parsed.nit, parsed.dv)) {
                            const existsError = await validateNITExists(e.target.value);
                            if (existsError) {
                              setErrors(prev => ({ ...prev, nit: existsError }));
                            }
                          }
                        }
                      }}
                      required
                      className={getInputClass(!!errors.nit)}
                    />
                  </div>
                  {errors.nit && (
                    <span className="animate-in fade-in slide-in-from-top-1 flex items-center gap-1 text-xs font-medium text-red-500">
                      <FontAwesomeIcon
                        icon={faExclamationCircle}
                        className="h-3 w-3"
                      />
                      {errors.nit}
                    </span>
                  )}
                </div>

                <div className="flex w-full flex-col gap-1.5">
                  <label className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                    {t('addressLabel')}
                  </label>
                  <div className="group relative flex items-center">
                    <div className="group-focus-within:text-primary pointer-events-none absolute left-3.5 text-zinc-400 transition-colors">
                      <FontAwesomeIcon
                        icon={faMapMarkerAlt}
                        className="h-4 w-4"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder={t('addressPlaceholder')}
                      value={address}
                      onChange={e => {
                        setAddress(e.target.value);
                        if (e.target.value) {
                          const err = validateAddress(e.target.value);
                          setErrors(prev => ({ ...prev, address: err }));
                        }
                      }}
                      required
                      className={getInputClass(!!errors.address)}
                    />
                  </div>
                  {errors.address && (
                    <span className="animate-in fade-in slide-in-from-top-1 flex items-center gap-1 text-xs font-medium text-red-500">
                      <FontAwesomeIcon
                        icon={faExclamationCircle}
                        className="h-3 w-3"
                      />
                      {errors.address}
                    </span>
                  )}
                </div>

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
                          setErrors(prev => ({ ...prev, country: undefined }));
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
                    {errors.country && (
                      <span className="animate-in fade-in slide-in-from-top-1 text-xs font-medium text-red-500">
                        {errors.country}
                      </span>
                    )}
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
                        onChange={e => {
                          setCity(e.target.value);
                          setErrors(prev => ({ ...prev, city: undefined }));
                        }}
                        className={selectClass}
                      >
                        {(CIUDADES[country] || []).map(c => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.city && (
                      <span className="animate-in fade-in slide-in-from-top-1 text-xs font-medium text-red-500">
                        {errors.city}
                      </span>
                    )}
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
                    disabled={!isStep2Complete}
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
                <span>{t('inviteResidentsLater')}</span>
              </div>
              {errors.towers && (
                <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-500 dark:bg-red-900/20">
                  <FontAwesomeIcon
                    icon={faExclamationCircle}
                    className="mt-0.5 h-4 w-4 shrink-0"
                  />
                  {errors.towers}
                </div>
              )}

              <form onSubmit={handleStep3} className="space-y-6">
                {towers.map(tower => {
                  const isExpanded = expandedTower === tower.id;
                  const preview = generateUnitNumbers(
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
                                onChange={e => {
                                  const val = parseInt(e.target.value, 10) || 1;
                                  updateTower(tower.id, 'floors', val);
                                  if (val < 1) {
                                    setErrors(prev => ({
                                      ...prev,
                                      towers: `Torre ${tower.name}: mínimo 1 piso`,
                                    }));
                                  } else {
                                    setErrors(prev => ({
                                      ...prev,
                                      towers: undefined,
                                    }));
                                  }
                                }}
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
                                onChange={e => {
                                  const val = parseInt(e.target.value, 10) || 1;
                                  updateTower(tower.id, 'unitsPerFloor', val);
                                  if (val < 1) {
                                    setErrors(prev => ({
                                      ...prev,
                                      towers: `Torre ${tower.name}: mínimo 1 unidad por piso`,
                                    }));
                                  } else {
                                    setErrors(prev => ({
                                      ...prev,
                                      towers: undefined,
                                    }));
                                  }
                                }}
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
                                  {t('moreUnits', {
                                    count: preview.length - 24,
                                  })}
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

                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={goBack}
                      className="flex-1"
                      leftIcon={faArrowLeft}
                      disabled={submitting}
                    >
                      {t('backButton')}
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1"
                      rightIcon={faArrowRight}
                      isLoading={submitting}
                      disabled={!isStep3Complete || submitting}
                    >
                      {t('nextButton')}
                    </Button>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full"
                    onClick={handleSkipTowers}
                    disabled={submitting}
                  >
                    Omitir y terminar
                  </Button>
                  <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
                    Podrás configurar las torres más adelante desde tu panel de administración.
                  </p>
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
                  onClick={() => router.push('/admin')}
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

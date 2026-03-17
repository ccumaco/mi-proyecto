'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  faEnvelope,
  faLock,
  faBuilding,
  faArrowLeft,
  faKey,
  faPhone,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import {
  loginWithPassword,
  sendOtpToPhone,
  verifyPhoneOtp,
  selectAuthStatus,
  selectAuthError,
  selectIsAuthenticated,
} from '@/lib/redux/slices/authSlice';
import { AppDispatch } from '@/lib/redux/store';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { createClientBrowser } from '@/lib/supabase';

const supabase = createClientBrowser();

type Step = 1 | 2 | 3;
type LoginMethod = 'otp' | 'password';

function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return 'u*******@correo.com';
  const [local, domain] = email.split('@');
  if (local.length <= 1) return `${local}*******@${domain}`;
  return `${local[0]}*******@${domain}`;
}

function maskPhone(phone: string): string {
  if (!phone) return '*******000';
  return `*******${phone.slice(-3)}`;
}

export default function LoginPage() {
  const [step, setStep] = useState<Step>(1);
  const [email, setEmail] = useState('admin@prueba.com');
  const [phone, setPhone] = useState('');
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('password');
  const [password, setPassword] = useState('Admin123456!');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [localError, setLocalError] = useState<string | null>(null);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const authStatus = useSelector(selectAuthStatus);
  const authError = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/profile');
    }
  }, [isAuthenticated, router]);

  const handleStep1Next = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError(null);
    setStep(2);
  };

  const handleStep2Next = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError(null);

    if (loginMethod === 'otp') {
      const { data, error } = await supabase
        .from('profiles')
        .select('phone')
        .eq('email', email.toLowerCase().trim())
        .single();

      if (error || !data?.phone) {
        setLocalError('No encontramos un teléfono asociado a este correo.');
        return;
      }

      setPhone(data.phone);

      dispatch(sendOtpToPhone(data.phone)).then(result => {
        if (sendOtpToPhone.fulfilled.match(result)) {
          setStep(3);
          setOtpCode(['', '', '', '', '', '']);
        }
      });
    } else {
      setStep(3);
    }
  };

  const handleLoginWithPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(loginWithPassword({ email, password }));
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      const digits = value.replace(/\D/g, '').slice(0, 6).split('');
      const next = [...otpCode];
      digits.forEach((d, i) => {
        if (index + i < 6) next[index + i] = d;
      });
      setOtpCode(next);
      const nextFocus = Math.min(index + digits.length, 5);
      otpInputRefs.current[nextFocus]?.focus();
      return;
    }
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...otpCode];
    next[index] = digit;
    setOtpCode(next);
    if (digit && index < 5) otpInputRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const code = otpCode.join('');
    if (code.length !== 6) return;
    dispatch(verifyPhoneOtp({ phone, token: code }));
  };

  const handleResendOtp = () => {
    if (phone) dispatch(sendOtpToPhone(phone));
  };

  const goBack = () => {
    setLocalError(null);
    if (step === 2) setStep(1);
    if (step === 3) setStep(2);
  };

  const isLoading = authStatus === 'loading';

  return (
    <div className="flex min-h-screen">
      {/* Left: Branding */}
      <div className="relative hidden w-[40%] min-h-screen bg-slate-900 lg:flex flex-col justify-between p-10 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-slate-900/95 via-slate-900/90 to-slate-800/95 z-1" />
        <div className="relative z-10 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white">
            <FontAwesomeIcon icon={faBuilding} className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold text-white">Residencia PRO</span>
        </div>
        <div className="relative z-10 space-y-4">
          <h2 className="text-2xl lg:text-3xl font-bold text-white leading-tight">
            Tu hogar, conectado y seguro
          </h2>
          <p className="text-sm text-white/80 max-w-sm">
            Verificamos tu identidad para asegurar que solo tú tengas acceso a la información de tu residencia.
          </p>
        </div>
        <p className="relative z-10 text-xs text-white/60">
          © 2024 Residencia Global Services. Todos los derechos reservados.
        </p>
      </div>

      {/* Right: Form */}
      <div className="flex flex-1 items-center justify-center bg-white dark:bg-zinc-900 p-6 sm:p-10">
        <div className="w-full max-w-md space-y-8">
          {/* Paso 1: Email */}
          {step === 1 && (
            <>
              <div className="space-y-2 text-center sm:text-left">
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                  Bienvenido de nuevo
                </h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Ingresa tus datos para acceder a tu panel
                </p>
              </div>
              <form onSubmit={handleStep1Next} className="space-y-5">
                <Input
                  label="Correo Electrónico"
                  type="email"
                  placeholder="ejemplo@admin.com"
                  leftIcon={faEnvelope}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
                <Button type="submit" className="w-full py-3.5 text-base font-bold">
                  Continuar
                </Button>
              </form>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-zinc-200 dark:border-zinc-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white dark:bg-zinc-900 px-3 text-zinc-500 dark:text-zinc-400">
                    ¿Eres nuevo aquí?{' '}
                    <Link
                      href="/register"
                      className="font-bold text-primary hover:underline"
                    >
                      Crea una cuenta de administrador
                    </Link>
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Paso 2: Método */}
          {step === 2 && (
            <>
              <div className="flex justify-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  <FontAwesomeIcon icon={faLock} className="h-3.5 w-3.5" />
                  SEGURIDAD DE CUENTA
                </span>
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                  Elige un método de ingreso
                </h1>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Estás ingresando con{' '}
                  <span className="font-medium text-primary">{maskEmail(email)}</span>
                </p>
              </div>
              <form onSubmit={handleStep2Next} className="space-y-4">
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => setLoginMethod('otp')}
                    className={`w-full rounded-xl border-2 p-4 text-left transition-all ${
                      loginMethod === 'otp'
                        ? 'border-primary bg-primary/5'
                        : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 bg-white dark:bg-zinc-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <FontAwesomeIcon icon={faPhone} className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-zinc-900 dark:text-white">Código por SMS</p>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                          Lo enviaremos a tu celular registrado
                        </p>
                      </div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginMethod('password')}
                    className={`w-full rounded-xl border-2 p-4 text-left transition-all ${
                      loginMethod === 'password'
                        ? 'border-primary bg-primary/5'
                        : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 bg-white dark:bg-zinc-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <FontAwesomeIcon icon={faKey} className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-zinc-900 dark:text-white">Contraseña</p>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                          Ingresa con tu clave personal
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
                {(authError || localError) && (
                  <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-3 text-sm font-medium text-red-500">
                    {authError || localError}
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full py-3.5 text-base font-bold"
                  isLoading={isLoading}
                >
                  Siguiente
                </Button>
              </form>
              <button
                type="button"
                onClick={goBack}
                className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" />
                Volver
              </button>
            </>
          )}

          {/* Paso 3: Contraseña o OTP */}
          {step === 3 && (
            <>
              {loginMethod === 'password' ? (
                <>
                  <div className="space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Contraseña</h1>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">Para: <span className="font-medium text-primary">{maskEmail(email)}</span></p>
                  </div>
                  <form onSubmit={handleLoginWithPassword} className="space-y-4 mt-6">
                    <Input
                      type="password"
                      placeholder="••••••••"
                      leftIcon={faLock}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                    />
                    {authError && <p className="text-sm text-red-500">{authError}</p>}
                    <Button type="submit" className="w-full py-3.5" isLoading={isLoading}>Iniciar sesión</Button>
                  </form>
                </>
              ) : (
                <>
                  <div className="space-y-2 text-center">
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Verificación SMS</h1>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">Enviamos un código al celular <span className="font-medium text-primary">{maskPhone(phone)}</span></p>
                  </div>
                  <form onSubmit={handleVerifyOtp} className="space-y-6 mt-6">
                    <div className="flex justify-center gap-2">
                      {otpCode.map((digit, i) => (
                        <input
                          key={i}
                          ref={el => { otpInputRefs.current[i] = el; }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={e => handleOtpChange(i, e.target.value)}
                          onKeyDown={e => handleOtpKeyDown(i, e)}
                          className="h-12 w-11 rounded-lg border-2 border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-center text-lg font-bold focus:border-primary outline-none"
                        />
                      ))}
                    </div>
                    {authError && <p className="text-sm text-red-500 text-center">{authError}</p>}
                    <Button type="submit" className="w-full py-3.5" isLoading={isLoading}>Verificar e Ingresar</Button>
                    <button type="button" onClick={handleResendOtp} className="w-full text-center text-sm font-bold text-primary hover:underline">Reenviar código</button>
                  </form>
                </>
              )}
              <button onClick={goBack} className="mt-6 flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200">
                <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" /> Volver
              </button>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

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
  faEye,
  faEyeSlash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import {
  loginWithPassword,
  sendOtpToEmail,
  verifyOtp,
  selectAuthStatus,
  selectAuthError,
  selectIsAuthenticated,
} from '@/lib/redux/slices/authSlice';
import { AppDispatch } from '@/lib/redux/store';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

type Step = 1 | 2 | 3;
type LoginMethod = 'otp' | 'password';

function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return 'u*******@correo.com';
  const [local, domain] = email.split('@');
  if (local.length <= 1) return `${local}*******@${domain}`;
  return `${local[0]}*******@${domain}`;
}

export default function LoginPage() {
  const t = useTranslations('login');

  const [step, setStep] = useState<Step>(1);
  const [email, setEmail] = useState('admin@propadmin.local');
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('password');
  const [password, setPassword] = useState('SuperAdmin123!');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [maskedPhone, setMaskedPhone] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
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
      dispatch(sendOtpToEmail(email)).then(result => {
        if (sendOtpToEmail.fulfilled.match(result)) {
          setMaskedPhone(result.payload.maskedPhone);
          setStep(3);
          setOtpCode(['', '', '', '', '', '']);
        } else if (sendOtpToEmail.rejected.match(result)) {
          setLocalError((result.payload as string) ?? t('otpSendError'));
        }
      });
    } else {
      setStep(3);
    }
  };

  const handleLoginWithPassword = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
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

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const code = otpCode.join('');
    if (code.length !== 6) return;
    dispatch(verifyOtp({ email, token: code }));
  };

  const handleResendOtp = () => {
    dispatch(sendOtpToEmail(email));
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
      <div className="flex flex-1 items-center justify-center bg-white p-6 sm:p-10 dark:bg-zinc-900">
        <div className="w-full max-w-md space-y-8">
          {/* Paso 1: Email */}
          {step === 1 && (
            <>
              <div className="space-y-2 text-center sm:text-left">
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                  {t('step1Title')}
                </h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {t('step1Subtitle')}
                </p>
              </div>
              <form onSubmit={handleStep1Next} className="space-y-5">
                <Input
                  label={t('emailLabel')}
                  type="email"
                  autoComplete="true"
                  placeholder={t('emailPlaceholder')}
                  leftIcon={faEnvelope}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
                <Button
                  type="submit"
                  className="w-full py-3.5 text-base font-bold"
                >
                  {t('continueButton')}
                </Button>
              </form>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-zinc-200 dark:border-zinc-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-3 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
                    {t('newHere')}{' '}
                    <Link
                      href="/register"
                      className="text-primary font-bold hover:underline"
                    >
                      {t('createAccount')}
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
                <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
                  <FontAwesomeIcon icon={faLock} className="h-3.5 w-3.5" />
                  {t('accountSecurity')}
                </span>
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                  {t('step2Title')}
                </h1>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {t('step2Subtitle')}{' '}
                  <span className="text-primary font-medium">
                    {maskEmail(email)}
                  </span>
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
                        : 'border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-lg">
                        <FontAwesomeIcon icon={faPhone} className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-zinc-900 dark:text-white">
                          {t('otpMethodTitle')}
                        </p>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                          {t('otpMethodDesc')}
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
                        : 'border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-lg">
                        <FontAwesomeIcon icon={faKey} className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-zinc-900 dark:text-white">
                          {t('passwordMethodTitle')}
                        </p>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                          {t('passwordMethodDesc')}
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
                {(authError || localError) && (
                  <div className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-500 dark:bg-red-900/20">
                    {authError || localError}
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full py-3.5 text-base font-bold"
                  isLoading={isLoading}
                >
                  {t('nextButton')}
                </Button>
              </form>
              <button
                type="button"
                onClick={goBack}
                className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" />
                {t('backButton')}
              </button>
            </>
          )}

          {/* Paso 3: Contraseña o OTP */}
          {step === 3 && (
            <>
              {loginMethod === 'password' ? (
                <>
                  <div className="space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                      {t('step3PasswordTitle')}
                    </h1>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {t('step3PasswordFor')}{' '}
                      <span className="text-primary font-medium">
                        {maskEmail(email)}
                      </span>
                    </p>
                  </div>
                  <form
                    onSubmit={handleLoginWithPassword}
                    className="mt-6 space-y-4"
                  >
                    <div className="flex w-full flex-col gap-1.5">
                      <label className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                        {t('passwordLabel')}
                      </label>
                      <div className="group relative flex items-center">
                        <div className="group-focus-within:text-primary pointer-events-none absolute left-3.5 text-zinc-400 transition-colors">
                          <FontAwesomeIcon icon={faLock} className="h-4 w-4" />
                        </div>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder={t('passwordPlaceholder')}
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          required
                          className="focus:border-primary focus:ring-primary/10 dark:focus:border-primary/70 dark:focus:ring-primary/10 w-full rounded-xl border-2 border-zinc-300 bg-white px-4 py-3 pr-11 pl-11 text-sm text-zinc-900 transition-all duration-200 outline-none placeholder:text-zinc-400 focus:ring-4 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-500"
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
                    </div>
                    {authError && (
                      <p className="text-sm text-red-500">{authError}</p>
                    )}
                    <Button
                      type="submit"
                      className="w-full py-3.5"
                      isLoading={isLoading}
                    >
                      {t('loginButton')}
                    </Button>
                  </form>
                </>
              ) : (
                <>
                  <div className="space-y-2 text-center">
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
                      {t('step3OtpTitle')}
                    </h1>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {t('step3OtpSubtitle')}{' '}
                      <span className="text-primary font-medium">
                        {maskedPhone}
                      </span>
                    </p>
                  </div>
                  <form onSubmit={handleVerifyOtp} className="mt-6 space-y-6">
                    <div className="flex justify-center gap-2">
                      {otpCode.map((digit, i) => (
                        <input
                          key={i}
                          ref={el => {
                            otpInputRefs.current[i] = el;
                          }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={e => handleOtpChange(i, e.target.value)}
                          onKeyDown={e => handleOtpKeyDown(i, e)}
                          className="focus:border-primary h-12 w-11 rounded-lg border-2 border-zinc-300 bg-white text-center text-lg font-bold text-zinc-900 outline-none dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
                        />
                      ))}
                    </div>
                    {authError && (
                      <p className="text-center text-sm text-red-500">
                        {authError}
                      </p>
                    )}
                    <Button
                      type="submit"
                      className="w-full py-3.5"
                      isLoading={isLoading}
                    >
                      {t('verifyButton')}
                    </Button>
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="text-primary w-full text-center text-sm font-bold hover:underline"
                    >
                      {t('resendCode')}
                    </button>
                  </form>
                </>
              )}
              <button
                onClick={goBack}
                className="mt-6 flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" />{' '}
                {t('backButton')}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

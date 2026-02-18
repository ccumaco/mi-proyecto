'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faEye } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  loginWithPassword,
  selectAuthStatus,
  selectAuthError,
  selectIsAuthenticated,
} from '@/lib/redux/slices/authSlice';
import { AppDispatch } from '@/lib/redux/store';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const authStatus = useSelector(selectAuthStatus);
  const authError = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(loginWithPassword({ email, password }));
  };

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/profile');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="bg-background-light dark:bg-background-dark font-display relative flex min-h-screen flex-col">
      {/* Background Pattern Overlay */}
      <div className="arch-pattern pointer-events-none fixed inset-0"></div>
      <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-4">
        {/* Main Card Container */}
        <div className="z-10 w-full max-w-120 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl dark:border-gray-800 dark:bg-[#1a242f]">
          {/* Branding Header */}
          <div className="flex flex-col items-center px-8 pt-10 pb-6">
            <div className="text-primary mb-4 flex size-12 items-center justify-center">
              <FontAwesomeIcon icon={faBuilding} className="h-10 w-10" />
            </div>
            <h2 className="text-2xl leading-tight font-bold tracking-tight text-[#111418] dark:text-white">
              Property Management
            </h2>
            <p className="mt-2 text-sm text-[#617589] dark:text-gray-400">
              Bienvenido al Portal de Administración
            </p>
          </div>
          {/* Login Form Area */}
          <div className="px-8 pb-10">
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email Field */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="email"
                  className="text-sm font-semibold text-[#111418] dark:text-gray-200"
                >
                  Correo electrónico
                </label>
                <input
                  id="email"
                  className="form-input focus:border-primary focus:ring-primary h-12 w-full rounded-lg border-[#dbe0e6] bg-white px-4 text-base text-[#111418] transition-colors placeholder:text-[#617589] focus:ring-1 dark:border-gray-700 dark:bg-[#24303f] dark:text-white"
                  placeholder="correo@ejemplo.com"
                  required
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={authStatus === 'loading'}
                />
              </div>
              {/* Password Field */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-semibold text-[#111418] dark:text-gray-200"
                  >
                    Contraseña
                  </label>
                  <a
                    className="text-primary text-xs font-semibold hover:underline"
                    href="#"
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
                <div className="relative flex items-center">
                  <input
                    id="password"
                    className="form-input focus:border-primary focus:ring-primary h-12 w-full rounded-lg border-[#dbe0e6] bg-white pr-12 pl-4 text-base text-[#111418] transition-colors placeholder:text-[#617589] focus:ring-1 dark:border-gray-700 dark:bg-[#24303f] dark:text-white"
                    placeholder="••••••••"
                    required
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    disabled={authStatus === 'loading'}
                  />
                  <button
                    className="hover:text-primary absolute right-3 text-[#617589] transition-colors"
                    type="button"
                  >
                    <FontAwesomeIcon icon={faEye} className="h-5 w-5" />
                  </button>
                </div>
              </div>
              {authError && <p className="text-sm text-red-500">{authError}</p>}
              {/* Login Button */}
              <button
                className="bg-primary hover:bg-primary/90 mt-2 w-full rounded-lg py-3.5 font-bold text-white shadow-md transition-all active:scale-[0.98] disabled:opacity-50"
                type="submit"
                disabled={authStatus === 'loading'}
              >
                {authStatus === 'loading'
                  ? 'Iniciando sesión...'
                  : 'Iniciar sesión'}
              </button>
            </form>
            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#dbe0e6] dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-[#617589] dark:bg-[#1a242f]">
                  Acceso para residentes
                </span>
              </div>
            </div>
            {/* Footer Links */}
            <div className="text-center">
              <p className="text-sm text-[#617589] dark:text-gray-400">
                ¿No tienes una cuenta?
                <a
                  className="text-primary ml-1 font-bold hover:underline"
                  href="/auth/register"
                >
                  Crear cuenta
                </a>
              </p>
            </div>
          </div>
        </div>
        {/* Extra Info / Help */}
        <div className="z-10 mt-8 text-center text-xs text-[#617589] dark:text-gray-500">
          <p>
            © 2024 Property Management Solutions. Todos los derechos reservados.
          </p>
          <div className="mt-2 space-x-4">
            <a className="hover:text-primary" href="#">
              Términos
            </a>
            <a className="hover:text-primary" href="#">
              Privacidad
            </a>
            <a className="hover:text-primary" href="#">
              Soporte
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

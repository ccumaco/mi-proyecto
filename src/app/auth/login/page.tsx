'use client';

import { useState } from 'react';
import { createClientBrowser } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientBrowser(); // Initialize cookie-based Supabase client

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
      } else {
        router.push('/');
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display relative flex min-h-screen flex-col">
      {/* Background Pattern Overlay */}
      <div className="arch-pattern pointer-events-none fixed inset-0"></div>
      <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-4">
        {/* Main Card Container */}
        <div className="z-10 w-full max-w-120 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl dark:border-gray-800 dark:bg-[#1a242f]">
          {/* Branding Header */}
          <div className="flex flex-col items-center px-8 pt-10 pb-6">
            <div className="text-primary mb-4 size-12">
              <svg
                fill="currentColor"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  d="M24 4H42V17.3333V30.6667H24V44H6V30.6667V17.3333H24V4Z"
                  fillRule="evenodd"
                ></path>
              </svg>
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
                  />
                  <button
                    className="hover:text-primary absolute right-3 text-[#617589] transition-colors"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-xl">
                      visibility
                    </span>
                  </button>
                </div>
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              {/* Login Button */}
              <button
                className="bg-primary hover:bg-primary/90 mt-2 w-full rounded-lg py-3.5 font-bold text-white shadow-md transition-all active:scale-[0.98]"
                type="submit"
              >
                Iniciar sesión
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

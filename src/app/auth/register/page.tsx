'use client';

import { useState } from 'react';
import { createClientBrowser } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientBrowser(); // Initialize cookie-based Supabase client

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) {
        setError(error.message);
      } else {
        setSuccess(
          'Registration successful! Please check your email to confirm your account.'
        );
        setTimeout(() => {
          router.push('/auth/login');
        }, 3000);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="flex h-full min-h-screen flex-col">
      {/* Top Navigation */}
      <header className="dark:bg-background-dark sticky top-0 z-50 flex items-center justify-between border-b border-solid border-[#dbe0e6] bg-white px-6 py-3 whitespace-nowrap md:px-20 dark:border-[#2d394a]">
        <div className="flex items-center gap-4">
          <div className="text-primary size-8">
            <svg
              fill="currentColor"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z"></path>
            </svg>
          </div>
          <h2 className="text-lg leading-tight font-bold tracking-[-0.015em]">
            PropManage
          </h2>
        </div>
        <div className="flex items-center gap-6">
          <a
            className="hover:text-primary hidden text-sm font-medium transition-colors sm:block"
            href="#"
          >
            ¿Necesitas ayuda?
          </a>
          <button className="flex h-10 min-w-21 cursor-pointer items-center justify-center rounded-lg bg-[#f0f2f4] px-4 text-sm font-bold text-[#111418] transition-colors hover:bg-[#e0e3e7] dark:bg-[#2d394a] dark:text-white dark:hover:bg-[#3d4b5c]">
            <span>Iniciar Sesión</span>
          </button>
        </div>
      </header>
      {/* Main Content Area */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-104 overflow-hidden rounded-xl border border-[#dbe0e6] bg-white shadow-xl dark:border-[#2d394a] dark:bg-[#1a2632]">
          {/* Progress Header */}
          <div className="bg-primary/5 dark:bg-primary/10 border-b border-[#dbe0e6] px-8 py-6 dark:border-[#2d394a]">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-primary text-xs font-bold tracking-wider uppercase">
                  Paso 1 de 3
                </span>
                <span className="text-sm font-medium">
                  Información Personal
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-[#dbe0e6] dark:bg-[#2d394a]">
                <div
                  className="bg-primary h-full transition-all duration-500"
                  style={{ width: '33.33%' }}
                ></div>
              </div>
              <p className="text-xs font-normal text-[#617589]">
                Siguiente: Detalles de Propiedad
              </p>
            </div>
          </div>
          {/* Registration Form */}
          <div className="space-y-8 p-8">
            <div className="text-center">
              <h1 className="mb-2 text-2xl font-bold tracking-tight">
                Crear Tu Cuenta
              </h1>
              <p className="text-sm text-[#617589] dark:text-[#a0acb9]">
                Regístrate para comenzar a gestionar tu residencia.
              </p>
            </div>
            <form className="space-y-6" onSubmit={handleRegister}>
              {/* User Type Selection */}
              <div className="space-y-3">
                <label className="text-sm font-semibold">Soy un...</label>
                <div className="flex h-12 items-center justify-center rounded-lg bg-[#f0f2f4] p-1 dark:bg-[#2d394a]">
                  <label className="has-[:checked]:text-primary flex h-full grow cursor-pointer items-center justify-center rounded-lg px-2 text-sm font-bold text-[#617589] transition-all has-[:checked]:bg-white has-[:checked]:shadow-sm dark:has-[:checked]:bg-[#1a2632]">
                    <span className="truncate">Administrador</span>
                    <input
                      className="invisible w-0"
                      name="user_type"
                      type="radio"
                      value="admin"
                    />
                  </label>
                  <label className="has-[:checked]:text-primary flex h-full grow cursor-pointer items-center justify-center rounded-lg px-2 text-sm font-bold text-[#617589] transition-all has-[:checked]:bg-white has-[:checked]:shadow-sm dark:has-[:checked]:bg-[#1a2632]">
                    <span className="truncate">Residente</span>
                    <input
                      defaultChecked
                      className="invisible w-0"
                      name="user_type"
                      type="radio"
                      value="resident"
                    />
                  </label>
                </div>
              </div>
              {/* Name & Contact */}
              <div className="grid grid-cols-1 gap-6">
                <label className="group block">
                  <span className="group-focus-within:text-primary mb-2 block text-sm font-semibold transition-colors">
                    Nombre Completo
                  </span>
                  <div className="relative">
                    <input
                      className="focus:border-primary focus:ring-primary/20 h-12 w-full rounded-lg border-[#dbe0e6] bg-white px-4 transition-all placeholder:text-[#617589]/50 focus:ring-2 dark:border-[#2d394a] dark:bg-[#1a2632]"
                      placeholder="Ej. Juan Pérez"
                      required
                      type="text"
                    />
                    <span className="material-symbols-outlined absolute top-1/2 right-3 -translate-y-1/2 text-xl text-green-500">
                      check_circle
                    </span>
                  </div>
                </label>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <label className="group block">
                    <span className="group-focus-within:text-primary mb-2 block text-sm font-semibold transition-colors">
                      Correo Electrónico
                    </span>
                    <input
                      className="focus:border-primary focus:ring-primary/20 h-12 w-full rounded-lg border-[#dbe0e6] bg-white px-4 transition-all placeholder:text-[#617589]/50 focus:ring-2 dark:border-[#2d394a] dark:bg-[#1a2632]"
                      placeholder="juan@ejemplo.com"
                      required
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </label>
                  <label className="group block">
                    <span className="group-focus-within:text-primary mb-2 block text-sm font-semibold transition-colors">
                      Teléfono
                    </span>
                    <input
                      className="focus:border-primary h-12 w-full rounded-lg border-[#dbe0e6] bg-white px-4 transition-all placeholder:text-[#617589]/50 focus:ring-2 focus:ring-20 dark:border-[#2d394a] dark:bg-[#1a2632]"
                      placeholder="+34 600 000 000"
                      required
                      type="tel"
                    />
                  </label>
                </div>
              </div>
              {/* Property Selection */}
              <label className="group block">
                <div className="mb-2 flex items-center gap-2">
                  <span className="group-focus-within:text-primary text-sm font-semibold transition-colors">
                    Nombre de la Propiedad
                  </span>
                  <span
                    className="material-symbols-outlined cursor-help text-base text-[#617589]"
                    title="Busca el nombre de tu edificio o condominio"
                  >
                    info
                  </span>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute top-1/2 left-3 -translate-y-1/2 text-[#617589]">
                    apartment
                  </span>
                  <input
                    className="focus:border-primary focus:ring-primary/20 h-12 w-full rounded-lg border-[#dbe0e6] bg-white pr-4 pl-11 transition-all placeholder:text-[#617589]/50 focus:ring-2 dark:border-[#2d394a] dark:bg-[#1a2632]"
                    placeholder="Buscar edificio..."
                    type="text"
                  />
                </div>
              </label>
              {/* Security */}
              <div className="space-y-4">
                <label className="group block">
                  <span className="group-focus-within:text-primary mb-2 block text-sm font-semibold transition-colors">
                    Contraseña
                  </span>
                  <div className="relative">
                    <input
                      className="focus:border-primary focus:ring-primary/20 h-12 w-full rounded-lg border-[#dbe0e6] bg-white px-4 transition-all placeholder:text-[#617589]/50 focus:ring-2 dark:border-[#2d394a] dark:bg-[#1a2632]"
                      placeholder="Mínimo 8 caracteres"
                      required
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                    <button
                      className="material-symbols-outlined hover:text-primary absolute top-1/2 right-3 -translate-y-1/2 text-[#617589]"
                      type="button"
                    >
                      visibility
                    </button>
                  </div>
                </label>
                {/* Password Strength Meter */}
                <div className="space-y-1">
                  <div className="flex h-1.5 gap-1">
                    <div className="flex-1 rounded-full bg-green-500"></div>
                    <div className="flex-1 rounded-full bg-green-500"></div>
                    <div className="flex-1 rounded-full bg-[#dbe0e6] dark:bg-[#2d394a]"></div>
                    <div className="flex-1 rounded-full bg-[#dbe0e6] dark:bg-[#2d394a]"></div>
                  </div>
                  <p className="text-right text-[10px] font-bold text-green-600 uppercase dark:text-green-400">
                    Fuerza: Media
                  </p>
                </div>
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              {success && <p className="text-sm text-green-500">{success}</p>}
              {/* Action Button */}
              <button
                className="bg-primary shadow-primary/20 hover:bg-primary/90 flex h-14 w-full transform items-center justify-center gap-2 rounded-lg font-bold text-white shadow-lg transition-all active:scale-[0.98]"
                type="submit"
              >
                <span>Continuar</span>
                <span className="material-symbols-outlined text-xl">
                  arrow_forward
                </span>
              </button>
              <div className="text-center">
                <p className="text-sm text-[#617589]">
                  ¿Ya tienes una cuenta?
                  <a
                    className="text-primary font-bold decoration-2 underline-offset-4 transition-all hover:underline"
                    href="/auth/login"
                  >
                    Inicia sesión
                  </a>
                </p>
              </div>
            </form>
          </div>
          {/* Footer Info */}
          <div className="flex items-center justify-center gap-4 border-t border-[#dbe0e6] bg-[#f8f9fa] px-8 py-4 text-[11px] text-[#617589] dark:border-[#2d394a] dark:bg-[#101922]">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined">lock</span> Datos
              encriptados
            </span>
            <span className="h-1 w-1 rounded-full bg-[#617589]"></span>
            <a className="hover:text-primary" href="#">
              Términos y Condiciones
            </a>
          </div>
        </div>
        {/* Trust Badges */}
        <div className="mt-12 flex flex-wrap justify-center gap-8 opacity-50 grayscale transition-all duration-500 hover:grayscale-0">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined">verified_user</span>
            <span className="text-sm font-bold tracking-widest uppercase">
              ISO 27001 Certified
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined">security</span>
            <span className="text-sm font-bold tracking-widest uppercase">
              GDPR Compliant
            </span>
          </div>
        </div>
      </main>
      {/* Aesthetic Decoration (Optional for visual flair) */}
      <div className="bg-primary/5 fixed bottom-0 left-0 -z-10 h-64 w-64 -translate-x-1/2 translate-y-1/2 rounded-full blur-[100px]"></div>
      <div className="bg-primary/5 fixed top-0 right-0 -z-10 h-96 w-96 translate-x-1/4 -translate-y-1/4 rounded-full blur-[120px]"></div>
    </div>
  );
}

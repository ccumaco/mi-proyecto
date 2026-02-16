'use client';

import { useState } from 'react';
import { createClientBrowser } from '@/lib/supabase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBuilding,
  faUnlockKeyhole,
  faEnvelope,
  faArrowLeft,
  faShieldHalved,
} from '@fortawesome/free-solid-svg-icons';

export default function Recovery() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const supabase = createClientBrowser();

  const handleRecovery = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      if (error) {
        setError(error.message);
      } else {
        setSuccess('Password reset email sent! Please check your inbox.');
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display flex min-h-screen flex-col">
      {/* Top Navigation Bar */}
      <header className="flex items-center justify-between border-b border-solid border-[#dbe0e6] bg-white px-10 py-3 whitespace-nowrap dark:border-[#343d48] dark:bg-[#1a242f]">
        <div className="flex items-center gap-4 text-[#111418] dark:text-white">
          <div className="text-primary flex size-6 items-center justify-center">
            <FontAwesomeIcon icon={faBuilding} className="h-5 w-5" />
          </div>
          <h2 className="text-lg leading-tight font-bold tracking-[-0.015em]">
            PropiedadAdmin
          </h2>
        </div>
        <div className="flex flex-1 justify-end gap-8">
          <div className="flex items-center gap-9">
            <a
              className="hover:text-primary text-sm leading-normal font-medium text-[#111418] transition-colors dark:text-gray-200"
              href="#"
            >
              Inicio
            </a>
            <a
              className="hover:text-primary text-sm leading-normal font-medium text-[#111418] transition-colors dark:text-gray-200"
              href="#"
            >
              Sobre nosotros
            </a>
            <a
              className="hover:text-primary text-sm leading-normal font-medium text-[#111418] transition-colors dark:text-gray-200"
              href="#"
            >
              Contacto
            </a>
          </div>
        </div>
      </header>
      {/* Main Content Area */}
      <main className="flex flex-grow items-center justify-center px-4 py-12">
        <div className="w-full max-w-[480px] overflow-hidden rounded-xl border border-[#dbe0e6] bg-white shadow-xl dark:border-[#343d48] dark:bg-[#1a242f]">
          <div className="flex flex-col items-center p-8 md:p-10">
            {/* Icon Header */}
            <div className="bg-primary/10 mb-6 flex h-16 w-16 items-center justify-center rounded-full">
              <FontAwesomeIcon
                icon={faUnlockKeyhole}
                className="text-primary h-8 w-8"
              />
            </div>
            {/* HeadlineText */}
            <h1 className="tracking-light pb-3 text-center text-[28px] leading-tight font-bold text-[#111418] md:text-[32px] dark:text-white">
              Recuperar Contraseña
            </h1>
            {/* BodyText */}
            <p className="max-w-[380px] pb-8 text-center text-base leading-relaxed font-normal text-[#4f5b6b] dark:text-gray-400">
              Ingresa tu correo para recibir un enlace de recuperación. Te
              enviaremos las instrucciones para restablecer tu acceso de forma
              segura.
            </p>
            {/* Recovery Form */}
            <form onSubmit={handleRecovery} className="w-full space-y-6">
              {/* TextField Component */}
              <div className="flex flex-col gap-2">
                <label className="flex w-full flex-col">
                  <p className="pb-2 text-sm leading-normal font-semibold text-[#111418] dark:text-white">
                    Correo electrónico
                  </p>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <FontAwesomeIcon
                        icon={faEnvelope}
                        className="h-5 w-5 text-gray-400"
                      />
                    </div>
                    <input
                      className="form-input focus:ring-primary/50 flex h-14 w-full rounded-lg border border-[#dbe0e6] bg-white pr-4 pl-11 text-base font-normal text-[#111418] transition-all placeholder:text-[#617589] focus:ring-2 focus:outline-0 dark:border-[#343d48] dark:bg-[#101922] dark:text-white"
                      placeholder="ejemplo@correo.com"
                      required
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>
                </label>
              </div>
              {/* Error and Success messages */}
              {(error || success) && (
                <div className="space-y-2">
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  {success && (
                    <p className="text-sm text-green-500">{success}</p>
                  )}
                </div>
              )}
              {/* SingleButton Component */}
              <div className="flex pt-2">
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 shadow-primary/20 flex h-14 w-full cursor-pointer items-center justify-center rounded-lg px-5 text-base leading-normal font-bold tracking-[0.015em] text-white shadow-lg transition-all"
                >
                  <span className="truncate">
                    Enviar enlace de recuperación
                  </span>
                </button>
              </div>
            </form>
            {/* Footer Navigation */}
            <div className="mt-8 flex flex-col items-center gap-4">
              <a
                className="text-primary flex items-center gap-2 text-sm font-medium hover:underline"
                href="/auth/login"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="h-3 w-3" />
                Volver al inicio de sesión
              </a>
              <div className="mt-4 flex items-center gap-2 text-xs text-[#617589] dark:text-gray-500">
                <FontAwesomeIcon icon={faShieldHalved} className="h-3 w-3" />
                <span>Conexión segura y cifrada</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Footer */}
      <footer className="py-6 text-center text-xs text-[#617589] dark:text-gray-500">
        © 2024 PropiedadAdmin. Todos los derechos reservados.
      </footer>
    </div>
  );
}

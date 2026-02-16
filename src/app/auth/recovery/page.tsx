'use client'

import { useState } from 'react'
import { createClientBrowser } from '@/lib/supabase'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBuilding,
  faUnlockKeyhole,
  faEnvelope,
  faArrowLeft,
  faShieldHalved,
} from '@fortawesome/free-solid-svg-icons'

export default function Recovery() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const supabase = createClientBrowser()

  const handleRecovery = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })
      if (error) {
        setError(error.message)
      } else {
        setSuccess('Password reset email sent! Please check your inbox.')
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError(error.message)
    }
  }

  return (
    <div className="bg-background-light dark:bg-background-dark font-display min-h-screen flex flex-col">
      {/* Top Navigation Bar */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#dbe0e6] dark:border-[#343d48] bg-white dark:bg-[#1a242f] px-10 py-3">
        <div className="flex items-center gap-4 text-[#111418] dark:text-white">
          <div className="size-6 text-primary flex items-center justify-center">
            <FontAwesomeIcon icon={faBuilding} className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">PropiedadAdmin</h2>
        </div>
        <div className="flex flex-1 justify-end gap-8">
          <div className="flex items-center gap-9">
            <a className="text-[#111418] dark:text-gray-200 text-sm font-medium leading-normal hover:text-primary transition-colors" href="#">Inicio</a>
            <a className="text-[#111418] dark:text-gray-200 text-sm font-medium leading-normal hover:text-primary transition-colors" href="#">Sobre nosotros</a>
            <a className="text-[#111418] dark:text-gray-200 text-sm font-medium leading-normal hover:text-primary transition-colors" href="#">Contacto</a>
          </div>
        </div>
      </header>
      {/* Main Content Area */}
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[480px] bg-white dark:bg-[#1a242f] shadow-xl rounded-xl overflow-hidden border border-[#dbe0e6] dark:border-[#343d48]">
          <div className="p-8 md:p-10 flex flex-col items-center">
            {/* Icon Header */}
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <FontAwesomeIcon icon={faUnlockKeyhole} className="text-primary h-8 w-8" />
            </div>
            {/* HeadlineText */}
            <h1 className="text-[#111418] dark:text-white tracking-light text-[28px] md:text-[32px] font-bold leading-tight text-center pb-3">
              Recuperar Contraseña
            </h1>
            {/* BodyText */}
            <p className="text-[#4f5b6b] dark:text-gray-400 text-base font-normal leading-relaxed pb-8 text-center max-w-[380px]">
              Ingresa tu correo para recibir un enlace de recuperación. Te enviaremos las instrucciones para restablecer tu acceso de forma segura.
            </p>
            {/* Recovery Form */}
            <form onSubmit={handleRecovery} className="w-full space-y-6">
              {/* TextField Component */}
              <div className="flex flex-col gap-2">
                <label className="flex flex-col w-full">
                  <p className="text-[#111418] dark:text-white text-sm font-semibold leading-normal pb-2">Correo electrónico</p>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FontAwesomeIcon icon={faEnvelope} className="text-gray-400 h-5 w-5" />
                    </div>
                    <input
                      className="form-input flex w-full rounded-lg text-[#111418] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbe0e6] dark:border-[#343d48] bg-white dark:bg-[#101922] h-14 placeholder:text-[#617589] pl-11 pr-4 text-base font-normal transition-all"
                      placeholder="ejemplo@correo.com"
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </label>
              </div>
              {/* Error and Success messages */}
              {(error || success) && (
                <div className="space-y-2">
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  {success && <p className="text-sm text-green-500">{success}</p>}
                </div>
              )}
              {/* SingleButton Component */}
              <div className="flex pt-2">
                <button type="submit" className="flex w-full cursor-pointer items-center justify-center rounded-lg h-14 px-5 bg-primary hover:bg-primary/90 text-white text-base font-bold leading-normal tracking-[0.015em] transition-all shadow-lg shadow-primary/20">
                  <span className="truncate">Enviar enlace de recuperación</span>
                </button>
              </div>
            </form>
            {/* Footer Navigation */}
            <div className="mt-8 flex flex-col items-center gap-4">
              <a className="flex items-center gap-2 text-primary font-medium text-sm hover:underline" href="/auth/login">
                <FontAwesomeIcon icon={faArrowLeft} className="h-3 w-3" />
                Volver al inicio de sesión
              </a>
              <div className="flex items-center gap-2 text-xs text-[#617589] dark:text-gray-500 mt-4">
                <FontAwesomeIcon icon={faShieldHalved} className="h-3 w-3" />
                <span>Conexión segura y cifrada</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Footer */}
      <footer className="py-6 text-center text-[#617589] dark:text-gray-500 text-xs">
        © 2024 PropiedadAdmin. Todos los derechos reservados.
      </footer>
    </div>
  )
}
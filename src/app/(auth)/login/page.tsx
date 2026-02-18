'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { faEnvelope, faLock, faBuilding } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import {
  loginWithPassword,
  selectAuthStatus,
  selectAuthError,
  selectIsAuthenticated,
} from '@/lib/redux/slices/authSlice';
import { AppDispatch } from '@/lib/redux/store';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function LoginPage() {
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
    <div className="w-full space-y-6">
      {/* Branding Header */}
      <div className="text-center space-y-2">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <FontAwesomeIcon icon={faBuilding} className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Bienvenido de nuevo
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Ingresa tus credenciales para acceder al portal
        </p>
      </div>

      {/* Form Area */}
      <form onSubmit={handleLogin} className="space-y-4">
        <Input
          label="Correo Electrónico"
          type="email"
          placeholder="tu@ejemplo.com"
          leftIcon={faEnvelope}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={authStatus === 'loading'}
          required
        />
        
        <div className="space-y-1">
          <div className="flex items-center justify-between px-1">
            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Contraseña
            </label>
            <Link 
              href="/recovery" 
              className="text-xs font-semibold text-primary hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <Input
            type="password"
            placeholder="••••••••"
            leftIcon={faLock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={authStatus === 'loading'}
            required
          />
        </div>

        {authError && (
          <div className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-500 dark:bg-red-900/20">
            {authError}
          </div>
        )}

        <Button
          type="submit"
          className="w-full py-6 text-base"
          isLoading={authStatus === 'loading'}
        >
          Iniciar Sesión
        </Button>
      </form>

      {/* Footer Links */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-zinc-100 dark:border-zinc-800" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white dark:bg-zinc-900 px-2 text-zinc-500">
            ¿Eres nuevo aquí?
          </span>
        </div>
      </div>

      <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
        ¿No tienes una cuenta?{' '}
        <Link
          href="/register"
          className="font-bold text-primary hover:underline"
        >
          Regístrate ahora
        </Link>
      </p>
    </div>
  );
}

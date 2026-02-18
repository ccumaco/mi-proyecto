'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  faUser, 
  faEnvelope, 
  faPhone, 
  faBuilding, 
  faLock,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  signUpWithPassword,
  selectAuthStatus,
  selectAuthError,
} from '@/lib/redux/slices/authSlice';
import { AppDispatch } from '@/lib/redux/store';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [property, setProperty] = useState('');
  const [userType, setUserType] = useState<'resident' | 'admin'>('resident');
  
  const [success, setSuccess] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const authStatus = useSelector(selectAuthStatus);
  const authError = useSelector(selectAuthError);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccess(null);
    const resultAction = await dispatch(signUpWithPassword({ email, password }));
    
    if (signUpWithPassword.fulfilled.match(resultAction)) {
      setSuccess('¡Registro exitoso! Por favor, verifica tu correo electrónico.');
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Crea tu cuenta
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Únete a la plataforma de gestión residencial
        </p>
      </div>

      {/* Stepper Placeholder (Simplificado) */}
      <div className="flex items-center justify-between px-2">
        <span className="text-xs font-bold text-primary uppercase">Paso 1 de 2</span>
        <div className="h-1.5 w-24 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
          <div className="h-full w-1/2 bg-primary" />
        </div>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        {/* User Type Toggle */}
        <div className="flex p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
          <button
            type="button"
            onClick={() => setUserType('resident')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
              userType === 'resident' 
                ? 'bg-white dark:bg-zinc-700 text-primary shadow-sm' 
                : 'text-zinc-500'
            }`}
          >
            Residente
          </button>
          <button
            type="button"
            onClick={() => setUserType('admin')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
              userType === 'admin' 
                ? 'bg-white dark:bg-zinc-700 text-primary shadow-sm' 
                : 'text-zinc-500'
            }`}
          >
            Administrador
          </button>
        </div>

        <Input
          label="Nombre Completo"
          placeholder="Ej. Juan Pérez"
          leftIcon={faUser}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Email"
            type="email"
            placeholder="juan@ejemplo.com"
            leftIcon={faEnvelope}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={authStatus === 'loading'}
            required
          />
          <Input
            label="Teléfono"
            type="tel"
            placeholder="+34 600..."
            leftIcon={faPhone}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        <Input
          label="Propiedad / Conjunto"
          placeholder="Nombre del edificio..."
          leftIcon={faBuilding}
          value={property}
          onChange={(e) => setProperty(e.target.value)}
          required
        />

        <Input
          label="Contraseña"
          type="password"
          placeholder="Mínimo 8 caracteres"
          leftIcon={faLock}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={authStatus === 'loading'}
          required
        />

        {authError && (
          <div className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-500 dark:bg-red-900/20">
            {authError}
          </div>
        )}

        {success && (
          <div className="rounded-lg bg-green-50 p-3 text-sm font-medium text-green-600 dark:bg-green-900/20">
            {success}
          </div>
        )}

        <Button
          type="submit"
          className="w-full py-6 text-base"
          isLoading={authStatus === 'loading'}
          rightIcon={faArrowRight}
        >
          Crear Cuenta
        </Button>
      </form>

      <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
        ¿Ya tienes una cuenta?{' '}
        <Link
          href="/login"
          className="font-bold text-primary hover:underline"
        >
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}

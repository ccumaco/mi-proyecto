'use client';

import { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, setUser, uploadUserAvatar } from '@/lib/redux/slices/authSlice';
import type { User } from '@/lib/api';
import {
  faUser,
  faEnvelope,
  faPhone,
  faLock,
  faCheckCircle,
  faCamera,
  faArrowLeft,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import type { AppDispatch } from '@/lib/redux/store';

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:4000';

function getAvatarUrl(avatarUrl?: string): string | null {
  if (!avatarUrl) return null;
  if (avatarUrl.startsWith('http')) return avatarUrl;
  return `${BACKEND_URL}${avatarUrl}`;
}

function getInitials(name?: string, email?: string): string {
  const source = name || email || 'U';
  const parts = source.split(/[\s@]+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return source.slice(0, 2).toUpperCase();
}

export default function ProfileEditPage() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch<AppDispatch>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estados del formulario
  const [fullName, setFullName] = useState(user?.displayName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Estados del avatar
  const [pendingAvatarFile, setPendingAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarLoading, setAvatarLoading] = useState(false);

  // Estados para cambio de contraseña
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setMessage(null);

    try {
      // Si hay un archivo de avatar pendiente, subirlo primero
      if (pendingAvatarFile) {
        setAvatarLoading(true);
        await dispatch(uploadUserAvatar(pendingAvatarFile)).unwrap();
        setAvatarLoading(false);
        setPendingAvatarFile(null);
        setAvatarPreview(null);
      }

      // TODO: Implementar endpoint de actualización de perfil en el backend
      // Por ahora, solo actualizamos localmente
      const updatedUser: User = { ...user, fullName, phone };
      dispatch(setUser(updatedUser));
      setMessage({
        type: 'success',
        text: '¡Perfil actualizado correctamente!',
      });
    } catch (error: any) {
      setAvatarLoading(false);
      setMessage({
        type: 'error',
        text: error.message || 'Error al actualizar el perfil',
      });
    }
    setLoading(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Las contraseñas no coinciden.' });
      return;
    }

    setPasswordLoading(true);
    setMessage(null);

    try {
      // TODO: Implementar endpoint de cambio de contraseña en el backend
      setMessage({
        type: 'success',
        text: '¡Contraseña actualizada con éxito!',
      });
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Error al cambiar la contraseña',
      });
    }
    setPasswordLoading(false);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Link
            href="/profile"
            className="text-primary mb-2 flex items-center gap-2 text-sm font-bold hover:underline"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="h-3 w-3" />
            Volver a mi resumen
          </Link>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            Configuración del Perfil
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Gestiona tu información personal y seguridad de la cuenta.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Left Column: Avatar & Quick Info */}
        <div className="space-y-6">
          <Card className="text-center" padding="lg">
            <div className="relative mx-auto mb-4 inline-block">
              {/* Input file oculto */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarFileChange}
              />

              {/* Avatar: previsualización local, luego guardado, luego iniciales */}
              {(() => {
                const src = avatarPreview || getAvatarUrl(user?.avatarUrl);
                const initials = getInitials(fullName || user?.displayName, user?.email);
                return src ? (
                  <img
                    src={src}
                    alt="Foto de perfil"
                    className="size-32 rounded-full border-4 border-zinc-100 object-cover shadow-lg dark:border-zinc-800"
                  />
                ) : (
                  <div className="flex size-32 items-center justify-center rounded-full border-4 border-zinc-100 bg-zinc-200 text-3xl font-bold text-zinc-600 shadow-lg dark:border-zinc-800 dark:bg-zinc-700 dark:text-zinc-200">
                    {initials}
                  </div>
                );
              })()}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={avatarLoading}
                className="bg-primary absolute right-0 bottom-0 rounded-full p-2.5 text-white shadow-lg transition-transform hover:scale-110 disabled:opacity-60"
                title="Cambiar foto de perfil"
              >
                <FontAwesomeIcon
                  icon={avatarLoading ? faSpinner : faCamera}
                  className={`h-4 w-4 ${avatarLoading ? 'animate-spin' : ''}`}
                />
              </button>
            </div>

            {pendingAvatarFile && (
              <p className="mb-2 text-xs text-blue-600 dark:text-blue-400">
                Nueva foto seleccionada — se subirá al guardar
              </p>
            )}

            <h3 className="font-bold text-zinc-900 dark:text-white">
              {fullName || 'Usuario'}
            </h3>
            <p className="text-xs font-medium tracking-wider text-zinc-500 uppercase">
              {user?.email}
            </p>
          </Card>

          <Card padding="md" className="space-y-4">
            <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
              <FontAwesomeIcon
                icon={faCheckCircle}
                className="h-4 w-4 text-green-500"
              />
              <span>Cuenta Verificada</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
              <FontAwesomeIcon icon={faUser} className="text-primary h-4 w-4" />
              <span>Miembro desde Ene 2023</span>
            </div>
          </Card>
        </div>

        {/* Right Column: Forms */}
        <div className="space-y-6 md:col-span-2">
          {/* Feedback Message */}
          {message && (
            <div
              className={`animate-in fade-in slide-in-from-top-2 rounded-xl p-4 text-sm font-medium ${
                message.type === 'success'
                  ? 'border border-green-100 bg-green-50 text-green-600 dark:border-green-900/30 dark:bg-green-950/20'
                  : 'border border-red-100 bg-red-50 text-red-600 dark:border-red-900/30 dark:bg-red-950/20'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Personal Info Form */}
          <Card>
            <CardTitle className="mb-1">Información Personal</CardTitle>
            <CardDescription className="mb-6">
              Actualiza tus datos de contacto básicos.
            </CardDescription>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <Input
                label="Nombre Completo"
                placeholder="Ej. Juan Pérez"
                leftIcon={faUser}
                value={fullName}
                onChange={e => setFullName(e.target.value)}
              />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Input
                  label="Correo Electrónico"
                  type="email"
                  value={user?.email || ''}
                  disabled
                  leftIcon={faEnvelope}
                  className="cursor-not-allowed opacity-60 grayscale"
                  title="El email no puede ser cambiado directamente"
                />
                <Input
                  label="Teléfono"
                  placeholder="+34 600..."
                  leftIcon={faPhone}
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                />
              </div>
              <div className="flex justify-end pt-2">
                <Button type="submit" isLoading={loading}>
                  Guardar Cambios
                </Button>
              </div>
            </form>
          </Card>

          {/* Security Form */}
          <Card>
            <CardTitle className="mb-1">Seguridad</CardTitle>
            <CardDescription className="mb-6">
              Cambia tu contraseña periódicamente para mayor seguridad.
            </CardDescription>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Input
                  label="Nueva Contraseña"
                  type="password"
                  placeholder="••••••••"
                  leftIcon={faLock}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                />
                <Input
                  label="Confirmar Nueva Contraseña"
                  type="password"
                  placeholder="••••••••"
                  leftIcon={faCheckCircle}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  variant="secondary"
                  isLoading={passwordLoading}
                >
                  Actualizar Contraseña
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}

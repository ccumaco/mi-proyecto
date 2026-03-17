'use client';

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, setUser } from '@/lib/redux/slices/authSlice';
import type { User } from '@/lib/api';
import {
  faUser,
  faEnvelope,
  faPhone,
  faLock,
  faCheckCircle,
  faCamera,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { apiClient } from '@/lib/api';
import Link from 'next/link';

export default function ProfileEditPage() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  // Estados del formulario
  const [fullName, setFullName] = useState(user?.displayName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Estados para cambio de contraseña
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setMessage(null);

    try {
      // TODO: Implementar endpoint de actualización de perfil en el backend
      // Por ahora, solo actualizamos localmente
      const updatedUser: User = { ...user, fullName, phone };
      dispatch(setUser(updatedUser));
      setMessage({
        type: 'success',
        text: '¡Perfil actualizado correctamente!',
      });
    } catch (error: any) {
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
              <div
                className="size-32 rounded-full border-4 border-zinc-100 bg-cover bg-center shadow-lg dark:border-zinc-800"
                style={{
                  backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDY2JGQqcIfcWNjD0odXNmEE2jWBOjLj7IPnr11DBocAlkG7CYeqChlW-ugxIO_w_UAEH-9TTy_dl5wQ326vZkYeT5PgUEWEydAH9uB_-0yI3M5gUqif7-vwx6-MVl7_lws_j43dCkrYed6bLuhuNGujjxeMbCHGjcYabn-apkAEoubY8LzxxW7RlMf2X4GP7KBbCgp23QJzJJh56c5uE5QRPZf-nyv8zcwuGTSEqgreEorWHzC0_S6xODl2tlAVKGTmR7Cfk-YjMzF")`,
                }}
              />
              <button className="bg-primary absolute right-0 bottom-0 rounded-full p-2.5 text-white shadow-lg transition-transform hover:scale-110">
                <FontAwesomeIcon icon={faCamera} className="h-4 w-4" />
              </button>
            </div>
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

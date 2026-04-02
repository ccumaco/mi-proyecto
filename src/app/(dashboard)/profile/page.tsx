'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope,
  faMapMarkerAlt,
  faPhone,
  faCamera,
  faLock,
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { selectUser } from '@/lib/redux/slices/authSlice';
import { getRoleLabel } from '@/lib/roles';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useState } from 'react';


export default function Profile() {
  const user = useSelector(selectUser);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSavePassword = async () => {
    setIsSaving(true);
    // TODO: call API to change password
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsSaving(false);
    setCurrentPassword('');
    setNewPassword('');
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8">
      {/* Header */}
      <header>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Configuración de Perfil
        </h1>
      </header>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Panel - User Info */}
        <Card className="space-y-6 lg:col-span-1">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div
                className="h-32 w-32 rounded-full border-4 border-zinc-200 bg-cover bg-center shadow-lg dark:border-zinc-700"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1550525811-e5869dd03032?auto=format&fit=crop&w=400&q=80')`,
                }}
              />
              <button className="bg-primary hover:bg-primary/90 absolute right-0 bottom-0 flex h-10 w-10 items-center justify-center rounded-full text-white shadow-lg">
                <FontAwesomeIcon icon={faCamera} className="h-4 w-4" />
              </button>
              <div className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white shadow">
                <FontAwesomeIcon icon={faCheckCircle} className="h-4 w-4" />
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
                {user?.displayName || user?.email || 'Usuario'}
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {getRoleLabel(user?.role)}
              </p>
            </div>

            <button className="mt-2 rounded-lg bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-800 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700">
              <FontAwesomeIcon icon={faCamera} className="mr-2" />
              Editar Foto
            </button>
          </div>

          <div className="space-y-4 border-t border-zinc-200 pt-6 dark:border-zinc-700">
            <div>
              <label className="text-xs font-bold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                Email
              </label>
              <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-white">
                {user?.email || 'correo@example.com'}
              </p>
            </div>

            <div>
              <label className="text-xs font-bold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                Teléfono
              </label>
              <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-white">
                {user?.phone || '+57 300 000 0000'}
              </p>
            </div>

            <div>
              <label className="text-xs font-bold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                Ciudad
              </label>
              <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-white">
                Madrid, España
              </p>
            </div>
          </div>
        </Card>

        {/* Right Panel - Security Settings */}
        <div className="lg:col-span-2">
          <Card className="space-y-6">
            <div className="flex items-center gap-3 border-b border-zinc-200 pb-4 dark:border-zinc-700">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400">
                <FontAwesomeIcon icon={faLock} className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                Seguridad
              </h3>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  Contraseña Actual
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  className="focus:border-primary mt-2 w-full rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900 placeholder-zinc-400 shadow-sm focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:placeholder-zinc-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  Nueva Contraseña
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  className="focus:border-primary mt-2 w-full rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900 placeholder-zinc-400 shadow-sm focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:placeholder-zinc-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button className="rounded-lg border border-zinc-200 px-6 py-2 font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800">
                  Descartar
                </button>
                <button
                  onClick={handleSavePassword}
                  disabled={isSaving}
                  className="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700 disabled:bg-zinc-300 dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                  {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

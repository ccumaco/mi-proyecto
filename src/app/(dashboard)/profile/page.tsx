'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCamera,
  faLock,
  faCheckCircle,
  faSpinner,
  faEye,
  faEyeSlash,
  faBuilding,
  faMapMarkerAlt,
  faFileLines,
} from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, uploadUserAvatar } from '@/lib/redux/slices/authSlice';
import { getRoleLabel } from '@/lib/roles';
import { Card } from '@/components/ui/Card';
import { useState, useRef, useEffect } from 'react';
import type { AppDispatch } from '@/lib/redux/store';
import { useTranslations } from 'next-intl';
import { apiClient } from '@/lib/api';

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

interface Property {
  id: string;
  name: string;
  nit: string;
  address: string;
  country: string;
  city: string;
}

export default function Profile() {
  const t = useTranslations('profile');
  const user = useSelector(selectUser);
  const dispatch = useDispatch<AppDispatch>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [property, setProperty] = useState<Property | null>(null);
  const [propertyLoading, setPropertyLoading] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      if (user?.role !== 'ADMIN') return;
      setPropertyLoading(true);
      try {
        const response = await apiClient.getProperties();
        const properties = Array.isArray(response) ? response : response?.data || [];
        if (properties.length > 0) {
          setProperty(properties[0]);
        }
      } catch (error) {
        console.error('Error fetching property:', error);
      } finally {
        setPropertyLoading(false);
      }
    };

    fetchProperty();
  }, [user?.role]);

  const handleSavePassword = async () => {
    setIsSaving(true);
    // TODO: call API to change password
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsSaving(false);
    setCurrentPassword('');
    setNewPassword('');
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarError(null);
    setAvatarLoading(true);
    try {
      await dispatch(uploadUserAvatar(file)).unwrap();
    } catch (err: any) {
      setAvatarError(err || 'Error al subir la foto');
    } finally {
      setAvatarLoading(false);
      // Limpiar el input para permitir re-seleccionar el mismo archivo
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const avatarSrc = getAvatarUrl(user?.avatarUrl);
  const initials = getInitials(user?.displayName || user?.fullName, user?.email);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8">
      {/* Header */}
      <header>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          {t('title')}
        </h1>
      </header>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Panel - User Info */}
        <Card className="space-y-6 lg:col-span-1">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              {/* Input file oculto */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />

              {/* Avatar */}
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt={t('profilePicAlt')}
                  className="h-32 w-32 rounded-full border-4 border-zinc-200 object-cover shadow-lg dark:border-zinc-700"
                />
              ) : (
                <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-zinc-200 bg-zinc-200 text-3xl font-bold text-zinc-600 shadow-lg dark:border-zinc-700 dark:bg-zinc-700 dark:text-zinc-200">
                  {initials}
                </div>
              )}

              {/* Botón cámara */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={avatarLoading}
                className="bg-primary hover:bg-primary/90 absolute right-0 bottom-0 flex h-10 w-10 items-center justify-center rounded-full text-white shadow-lg disabled:opacity-60"
                title="Cambiar foto de perfil"
              >
                <FontAwesomeIcon
                  icon={avatarLoading ? faSpinner : faCamera}
                  className={`h-4 w-4 ${avatarLoading ? 'animate-spin' : ''}`}
                />
              </button>

              <div className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white shadow">
                <FontAwesomeIcon icon={faCheckCircle} className="h-4 w-4" />
              </div>
            </div>

            {/* Error de avatar */}
            {avatarError && (
              <p className="text-center text-xs text-red-500">{avatarError}</p>
            )}

            <div className="text-center">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
                {user?.displayName || user?.email || t('defaultUser')}
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {getRoleLabel(user?.role)}
              </p>
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={avatarLoading}
              className="mt-2 rounded-lg bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-800 hover:bg-zinc-200 disabled:opacity-60 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
            >
              <FontAwesomeIcon icon={faCamera} className="mr-2" />
              {avatarLoading ? t('uploadingPhoto') : t('editPhoto')}
            </button>
          </div>

          <div className="space-y-4 border-t border-zinc-200 pt-6 dark:border-zinc-700">
            <div>
              <label className="text-xs font-bold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                {t('emailLabel')}
              </label>
              <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-white">
                {user?.email}
              </p>
            </div>

            <div>
              <label className="text-xs font-bold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                {t('phoneLabel')}
              </label>
              <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-white">
                {user?.phone || '—'}
              </p>
            </div>

            {user?.nit && (
              <div>
                <label className="text-xs font-bold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                  NIT / ID Tributaria
                </label>
                <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-white">
                  {user.nit}
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Right Panel - Property Info + Security Settings */}
        <div className="lg:col-span-2 space-y-8">
          {/* Property Information - Only for ADMIN */}
          {user?.role === 'ADMIN' && (
            <Card className="space-y-6">
              <div className="flex items-center gap-3 border-b border-zinc-200 pb-4 dark:border-zinc-700">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-950/30 dark:text-green-400">
                  <FontAwesomeIcon icon={faBuilding} className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                  Información de la Copropiedad
                </h3>
              </div>

              {propertyLoading ? (
                <div className="flex items-center justify-center py-8">
                  <FontAwesomeIcon
                    icon={faSpinner}
                    className="h-6 w-6 animate-spin text-zinc-400"
                  />
                </div>
              ) : property ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                      Nombre de la Copropiedad
                    </label>
                    <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-white">
                      {property.name}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-bold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                      NIT Tributario
                    </label>
                    <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-white font-mono">
                      {property.nit}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-bold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                      Dirección
                    </label>
                    <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-white">
                      {property.address}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                        País
                      </label>
                      <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-white capitalize">
                        {property.country}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-bold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                        Ciudad
                      </label>
                      <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-white">
                        {property.city}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 py-4">
                  No hay información de copropiedad disponible
                </p>
              )}
            </Card>
          )}

          <Card className="space-y-6">
            <div className="flex items-center gap-3 border-b border-zinc-200 pb-4 dark:border-zinc-700">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400">
                <FontAwesomeIcon icon={faLock} className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                {t('securityTitle')}
              </h3>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  {t('currentPasswordLabel')}
                </label>
                <div className="group relative mt-2">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    className="focus:border-primary w-full rounded-lg border border-zinc-200 bg-white px-4 py-2 pr-11 text-sm text-zinc-900 placeholder-zinc-400 shadow-sm focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:placeholder-zinc-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-zinc-400 transition-colors hover:text-zinc-600 dark:hover:text-zinc-300"
                    aria-label={showCurrentPassword ? 'Ocultar contraseña actual' : 'Mostrar contraseña actual'}
                  >
                    <FontAwesomeIcon
                      icon={showCurrentPassword ? faEyeSlash : faEye}
                      className="h-5 w-5"
                    />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  {t('newPasswordLabel')}
                </label>
                <div className="group relative mt-2">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    className="focus:border-primary w-full rounded-lg border border-zinc-200 bg-white px-4 py-2 pr-11 text-sm text-zinc-900 placeholder-zinc-400 shadow-sm focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:placeholder-zinc-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-zinc-400 transition-colors hover:text-zinc-600 dark:hover:text-zinc-300"
                    aria-label={showNewPassword ? 'Ocultar nueva contraseña' : 'Mostrar nueva contraseña'}
                  >
                    <FontAwesomeIcon
                      icon={showNewPassword ? faEyeSlash : faEye}
                      className="h-5 w-5"
                    />
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button className="rounded-lg border border-zinc-200 px-6 py-2 font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800">
                  {t('discardButton')}
                </button>
                <button
                  onClick={handleSavePassword}
                  disabled={isSaving}
                  className="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700 disabled:bg-zinc-300 dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                  {isSaving ? t('savingButton') : t('saveChangesButton')}
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

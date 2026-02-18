'use client';

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, setUser } from '@/lib/redux/slices/authSlice';
import { 
  faUser, 
  faEnvelope, 
  faPhone, 
  faLock, 
  faCheckCircle,
  faCamera,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { createClientBrowser } from '@/lib/supabase';
import Link from 'next/link';

export default function ProfileEditPage() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const supabase = createClientBrowser();

  // Estados del formulario
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
  const [phone, setPhone] = useState(user?.user_metadata?.phone || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Estados para cambio de contraseña
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { data, error } = await supabase.auth.updateUser({
      data: { 
        full_name: fullName,
        phone: phone 
      }
    });

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: '¡Perfil actualizado correctamente!' });
      dispatch(setUser(data.user));
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
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: '¡Contraseña actualizada con éxito!' });
      setNewPassword('');
      setConfirmPassword('');
    }
    setPasswordLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Link href="/profile" className="text-primary text-sm font-bold flex items-center gap-2 hover:underline mb-2">
            <FontAwesomeIcon icon={faArrowLeft} className="h-3 w-3" />
            Volver a mi resumen
          </Link>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Configuración del Perfil</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Gestiona tu información personal y seguridad de la cuenta.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Quick Info */}
        <div className="space-y-6">
          <Card className="text-center" padding="lg">
            <div className="relative inline-block mx-auto mb-4">
              <div 
                className="size-32 rounded-full border-4 border-zinc-100 dark:border-zinc-800 bg-cover bg-center shadow-lg"
                style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDY2JGQqcIfcWNjD0odXNmEE2jWBOjLj7IPnr11DBocAlkG7CYeqChlW-ugxIO_w_UAEH-9TTy_dl5wQ326vZkYeT5PgUEWEydAH9uB_-0yI3M5gUqif7-vwx6-MVl7_lws_j43dCkrYed6bLuhuNGujjxeMbCHGjcYabn-apkAEoubY8LzxxW7RlMf2X4GP7KBbCgp23QJzJJh56c5uE5QRPZf-nyv8zcwuGTSEqgreEorWHzC0_S6xODl2tlAVKGTmR7Cfk-YjMzF")` }}
              />
              <button className="absolute bottom-0 right-0 bg-primary text-white p-2.5 rounded-full shadow-lg hover:scale-110 transition-transform">
                <FontAwesomeIcon icon={faCamera} className="h-4 w-4" />
              </button>
            </div>
            <h3 className="font-bold text-zinc-900 dark:text-white">{fullName || 'Usuario'}</h3>
            <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">{user?.email}</p>
          </Card>
          
          <Card padding="md" className="space-y-4">
            <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
              <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 h-4 w-4" />
              <span>Cuenta Verificada</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
              <FontAwesomeIcon icon={faUser} className="text-primary h-4 w-4" />
              <span>Miembro desde Ene 2023</span>
            </div>
          </Card>
        </div>

        {/* Right Column: Forms */}
        <div className="md:col-span-2 space-y-6">
          {/* Feedback Message */}
          {message && (
            <div className={`p-4 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-top-2 ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-600 border border-green-100 dark:bg-green-950/20 dark:border-green-900/30' 
                : 'bg-red-50 text-red-600 border border-red-100 dark:bg-red-950/20 dark:border-red-900/30'
            }`}>
              {message.text}
            </div>
          )}

          {/* Personal Info Form */}
          <Card>
            <CardTitle className="mb-1">Información Personal</CardTitle>
            <CardDescription className="mb-6">Actualiza tus datos de contacto básicos.</CardDescription>
            
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <Input 
                label="Nombre Completo"
                placeholder="Ej. Juan Pérez"
                leftIcon={faUser}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  label="Correo Electrónico"
                  type="email"
                  value={user?.email || ''}
                  disabled
                  leftIcon={faEnvelope}
                  className="opacity-60 grayscale cursor-not-allowed"
                  title="El email no puede ser cambiado directamente"
                />
                <Input 
                  label="Teléfono"
                  placeholder="+34 600..."
                  leftIcon={faPhone}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="pt-2 flex justify-end">
                <Button type="submit" isLoading={loading}>
                  Guardar Cambios
                </Button>
              </div>
            </form>
          </Card>

          {/* Security Form */}
          <Card>
            <CardTitle className="mb-1">Seguridad</CardTitle>
            <CardDescription className="mb-6">Cambia tu contraseña periódicamente para mayor seguridad.</CardDescription>
            
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  label="Nueva Contraseña"
                  type="password"
                  placeholder="••••••••"
                  leftIcon={faLock}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <Input 
                  label="Confirmar Nueva Contraseña"
                  type="password"
                  placeholder="••••••••"
                  leftIcon={faCheckCircle}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <div className="pt-2 flex justify-end">
                <Button type="submit" variant="secondary" isLoading={passwordLoading}>
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

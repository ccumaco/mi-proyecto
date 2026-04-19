'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  faCog, 
  faServer, 
  faBell, 
  faShieldAlt,
  faEnvelope,
  faSms,
  faSave,
  faToggleOn,
  faToggleOff
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslations } from 'next-intl';

export default function SystemSettingsPage() {
  const t = useTranslations('superAdmin');
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">{t('settings')}</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Control maestro de la plataforma y servicios externos.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* General System Status */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-500 dark:bg-blue-950/20 flex items-center justify-center">
              <FontAwesomeIcon icon={faServer} />
            </div>
            <h3 className="font-bold text-zinc-900 dark:text-white">Estado del Sistema</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800">
              <div>
                <p className="font-bold text-zinc-900 dark:text-white text-sm">Modo Mantenimiento</p>
                <p className="text-xs text-zinc-500">Muestra una pantalla de espera y bloquea accesos no-admin.</p>
              </div>
              <button 
                onClick={() => setMaintenanceMode(!maintenanceMode)}
                className={`text-2xl transition-colors ${maintenanceMode ? 'text-red-500' : 'text-zinc-300 dark:text-zinc-600'}`}
              >
                <FontAwesomeIcon icon={maintenanceMode ? faToggleOn : faToggleOff} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800">
              <div>
                <p className="font-bold text-zinc-900 dark:text-white text-sm">Nuevos Registros</p>
                <p className="text-xs text-zinc-500">Permitir que nuevos administradores creen cuentas.</p>
              </div>
              <button className="text-2xl text-primary">
                <FontAwesomeIcon icon={faToggleOn} />
              </button>
            </div>
          </div>
        </Card>

        {/* External Services Configuration */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-purple-50 text-purple-500 dark:bg-purple-950/20 flex items-center justify-center">
              <FontAwesomeIcon icon={faCog} />
            </div>
            <h3 className="font-bold text-zinc-900 dark:text-white">Servicios Externos</h3>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-2">
                  <FontAwesomeIcon icon={faEnvelope} /> Email (SendGrid/SMTP)
                </label>
                <Input placeholder="API Key" type="password" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-2">
                  <FontAwesomeIcon icon={faSms} /> SMS (Inalambria)
                </label>
                <Input placeholder="Token de Acceso" type="password" />
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
              <Button className="gap-2">
                <FontAwesomeIcon icon={faSave} /> Guardar Cambios Globales
              </Button>
            </div>
          </div>
        </Card>

        {/* Global Notifications */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-amber-50 text-amber-500 dark:bg-amber-950/20 flex items-center justify-center">
              <FontAwesomeIcon icon={faBell} />
            </div>
            <h3 className="font-bold text-zinc-900 dark:text-white">Anuncio Global</h3>
          </div>
          
          <div className="space-y-4">
            <p className="text-sm text-zinc-500 italic">Muestra un banner informativo a todos los usuarios de la plataforma.</p>
            <textarea 
              className="w-full p-4 bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary min-h-[100px]"
              placeholder="Ej: Estaremos en mantenimiento el domingo de 2am a 4am..."
            />
            <div className="flex justify-end">
              <Button variant="outline">Publicar Banner</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

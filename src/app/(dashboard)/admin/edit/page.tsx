'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface ProfileForm {
  fullname: string;
  email: string;
  phone: string;
  nit: string;
}

export default function EditProfilePage() {
  const [form, setForm] = useState<ProfileForm>({
    fullname: 'Alejandro Torres',
    email: 'admin@propadmin.test',
    phone: '+57 300 000 0000',
    nit: '900123456-7',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (saved) {
      const timeout = window.setTimeout(() => setSaved(false), 2500);
      return () => window.clearTimeout(timeout);
    }
  }, [saved]);

  function onChange(field: keyof ProfileForm) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm(prev => ({ ...prev, [field]: event.target.value }));
    };
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsSaving(true);

    // TODO: call API to update profile
    await new Promise(resolve => setTimeout(resolve, 700));

    setIsSaving(false);
    setSaved(true);
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Editar perfil
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Actualiza tu información de contacto y los datos de la comunidad.
          </p>
        </div>
      </header>

      <Card>
        <form onSubmit={onSubmit} className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Nombre completo
            </label>
            <Input value={form.fullname} onChange={onChange('fullname')} />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Correo electrónico
            </label>
            <Input
              value={form.email}
              onChange={onChange('email')}
              type="email"
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Teléfono
            </label>
            <Input value={form.phone} onChange={onChange('phone')} type="tel" />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              NIT / Identificación
            </label>
            <Input value={form.nit} onChange={onChange('nit')} />
          </div>

          <div className="flex flex-col gap-3 md:col-span-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isSaving}
            >
              {isSaving ? 'Guardando...' : 'Guardar cambios'}
            </Button>
            {saved ? (
              <p className="text-sm text-emerald-600 dark:text-emerald-300">
                Cambios guardados correctamente.
              </p>
            ) : null}
          </div>
        </form>
      </Card>
    </div>
  );
}

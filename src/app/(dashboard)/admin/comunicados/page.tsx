'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  faNewspaper,
  faPlus,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function CommunicationsPage() {
  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Gestión de Comunicados
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Publica anuncios y mantén informada a tu comunidad.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute top-1/2 left-3 -translate-y-1/2 text-zinc-400"
            />
            <input
              className="focus:border-primary w-full rounded-xl border border-zinc-200 bg-white py-2 pr-4 pl-10 text-sm text-zinc-700 shadow-sm focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
              placeholder="Buscar comunicados..."
            />
          </div>
          <Button variant="primary" size="lg">
            <FontAwesomeIcon icon={faPlus} className="mr-2" /> Nuevo Comunicado
          </Button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
              Últimos Comunicados
            </h2>
            <Button variant="outline" size="sm">
              Ver todos
            </Button>
          </div>
          <div className="mt-6 space-y-4">
            <AnnouncementCard
              title="Mantenimiento de Elevadores"
              category="Mantenimiento"
              date="15 Oct 2023"
              summary="Se realizará mantenimiento preventivo en los elevadores durante la noche."
            />
            <AnnouncementCard
              title="Asamblea General Anual"
              category="Evento"
              date="10 Oct 2023"
              summary="Invitamos a todos los propietarios a participar en la asamblea anual."
            />
            <AnnouncementCard
              title="Actualización del Reglamento"
              category="General"
              date="05 Oct 2023"
              summary="Se han actualizado las normas de convivencia, revisa los cambios importantes."
            />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
              Estadísticas
            </h2>
            <Button variant="ghost" size="sm">
              Ver más
            </Button>
          </div>
          <div className="mt-6 space-y-4">
            <StatRow label="Publicados" value="24" />
            <StatRow label="Pendientes" value="3" />
            <StatRow label="Vistos" value="1.2K" />
          </div>
        </Card>
      </div>
    </div>
  );
}

function AnnouncementCard({
  title,
  category,
  date,
  summary,
}: {
  title: string;
  category: string;
  date: string;
  summary: string;
}) {
  return (
    <div className="hover:border-primary/30 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
          {category}
        </p>
        <span className="text-xs font-medium text-zinc-400">{date}</span>
      </div>
      <h3 className="mt-2 text-lg font-semibold text-zinc-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        {summary}
      </p>
      <div className="mt-4 flex justify-end">
        <Button variant="ghost" size="sm">
          Leer más
        </Button>
      </div>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-zinc-50 px-4 py-3 dark:bg-zinc-900">
      <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
        {label}
      </span>
      <span className="text-lg font-bold text-zinc-900 dark:text-white">
        {value}
      </span>
    </div>
  );
}

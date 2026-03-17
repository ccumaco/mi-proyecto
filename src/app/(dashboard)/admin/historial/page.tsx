'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { faHistory, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const historyItems = [
  {
    user: 'Carlos Méndez',
    action: 'Ingreso al sistema',
    date: '16 Mar 2026',
    time: '10:32',
  },
  {
    user: 'María García',
    action: 'Creó comunicado',
    date: '16 Mar 2026',
    time: '09:55',
  },
  {
    user: 'Juan Pérez',
    action: 'Editó perfil',
    date: '15 Mar 2026',
    time: '18:15',
  },
  {
    user: 'Sofía Valencia',
    action: 'Subió documento',
    date: '15 Mar 2026',
    time: '16:10',
  },
];

export default function HistoryPage() {
  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Historial de Acceso
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Revisa quién accedió y qué acciones se han realizado recientemente.
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
              placeholder="Buscar acciones..."
            />
          </div>
          <Button variant="primary" size="lg">
            <FontAwesomeIcon icon={faHistory} className="mr-2" /> Exportar
          </Button>
        </div>
      </header>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-200 text-left text-sm text-zinc-600 dark:divide-zinc-800 dark:text-zinc-300">
            <thead className="bg-zinc-50 text-xs tracking-wide uppercase dark:bg-zinc-900">
              <tr>
                <th className="px-4 py-3">Usuario</th>
                <th className="px-4 py-3">Acción</th>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Hora</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {historyItems.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 font-semibold text-zinc-900 dark:text-white">
                    {item.user}
                  </td>
                  <td className="px-4 py-3">{item.action}</td>
                  <td className="px-4 py-3">{item.date}</td>
                  <td className="px-4 py-3">{item.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { faFolderOpen, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const documents = [
  { name: 'Reglamento Interno.pdf', date: '12 Oct 2023', size: '1.2 MB' },
  { name: 'Acta Asamblea 2023.pdf', date: '03 Sep 2023', size: '2.4 MB' },
  { name: 'Política de Privacidad.pdf', date: '20 Ago 2023', size: '900 KB' },
];

export default function DocumentsPage() {
  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Documentos
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Gestiona archivos y actas públicas para los residentes.
          </p>
        </div>
        <Button variant="primary" size="lg">
          <FontAwesomeIcon icon={faPlus} className="mr-2" /> Subir documento
        </Button>
      </header>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-200 text-left text-sm text-zinc-600 dark:divide-zinc-800 dark:text-zinc-300">
            <thead className="bg-zinc-50 text-xs tracking-wide uppercase dark:bg-zinc-900">
              <tr>
                <th className="px-4 py-3">Documento</th>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Tamaño</th>
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {documents.map(doc => (
                <tr key={doc.name}>
                  <td className="flex items-center gap-3 px-4 py-3">
                    <div className="bg-primary/10 text-primary inline-flex h-9 w-9 items-center justify-center rounded-lg">
                      <FontAwesomeIcon
                        icon={faFolderOpen}
                        className="h-4 w-4"
                      />
                    </div>
                    <span className="font-semibold text-zinc-900 dark:text-white">
                      {doc.name}
                    </span>
                  </td>
                  <td className="px-4 py-3">{doc.date}</td>
                  <td className="px-4 py-3">{doc.size}</td>
                  <td className="px-4 py-3">
                    <Button variant="outline" size="sm">
                      Descargar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

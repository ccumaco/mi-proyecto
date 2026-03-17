'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBuilding,
  faCalendarDay,
  faCampground,
  faCheckCircle,
  faDownload,
  faFilePdf,
  faWallet,
} from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { selectUser } from '@/lib/redux/slices/authSlice';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import Link from 'next/link';

export default function Profile() {
  const user = useSelector(selectUser);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8">
      {/* Profile Header */}
      <Card padding="lg" className="border-l-primary border-l-4 shadow-md">
        <div className="flex flex-col items-center gap-6 md:flex-row">
          <div
            className="size-24 rounded-full border-4 border-zinc-100 bg-cover bg-center shadow-lg dark:border-zinc-800"
            style={{
              backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDY2JGQqcIfcWNjD0odXNmEE2jWBOjLj7IPnr11DBocAlkG7CYeqChlW-ugxIO_w_UAEH-9TTy_dl5wQ326vZkYeT5PgUEWEydAH9uB_-0yI3M5gUqif7-vwx6-MVl7_lws_j43dCkrYed6bLuhuNGujjxeMbCHGjcYabn-apkAEoubY8LzxxW7RlMf2X4GP7KBbCgp23QJzJJh56c5uE5QRPZf-nyv8zcwuGTSEqgreEorWHzC0_S6xODl2tlAVKGTmR7Cfk-YjMzF")`,
            }}
          ></div>
          <div className="flex-1 space-y-2 text-center md:text-left">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">
              {user?.displayName || user?.email || 'Usuario'}
            </h2>
            <div className="flex flex-wrap justify-center gap-3 md:justify-start">
              <Badge variant="success">
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="mr-1.5 h-3 w-3"
                />
                Miembro Verificado
              </Badge>
              <Badge variant="info">
                <FontAwesomeIcon
                  icon={faCalendarDay}
                  className="mr-1.5 h-3 w-3"
                />
                {user?.role === 'admin'
                  ? 'Administrador'
                  : user?.role === 'super-admin'
                    ? 'Super Admin'
                    : 'Residente'}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/profile/edit">
              <Button variant="secondary" size="md" className="font-bold">
                Editar Perfil
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* Section Title */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
          Resumen de Actividad
        </h3>
        <p className="text-sm text-zinc-500">
          Última actualización: Hoy, 10:45 AM
        </p>
      </div>

      {/* Summary Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Announcement Card */}
        <Card isHoverable className="flex h-full flex-col">
          <div className="mb-4 flex items-center justify-between">
            <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-xl">
              <FontAwesomeIcon icon={faCampground} className="h-5 w-5" />
            </div>
            <Badge variant="info">3 NUEVOS</Badge>
          </div>
          <CardTitle className="mb-1">Últimos Comunicados</CardTitle>
          <CardDescription className="mb-4">
            Mantente al tanto de lo que sucede en tu comunidad.
          </CardDescription>
          <div className="mt-auto space-y-4">
            <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
              <p className="mb-1 text-xs text-zinc-500">Hace 2 horas</p>
              <p className="truncate text-sm font-semibold text-zinc-900 dark:text-white">
                Mantenimiento de Elevadores
              </p>
            </div>
            <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
              <p className="mb-1 text-xs text-zinc-500">Ayer</p>
              <p className="truncate text-sm font-semibold text-zinc-900 dark:text-white">
                Fumigación de Áreas Verdes
              </p>
            </div>
            <Link href="/announcements">
              <Button
                variant="ghost"
                className="text-primary w-full font-bold"
                size="sm"
              >
                Ver todos los anuncios
              </Button>
            </Link>
          </div>
        </Card>

        {/* Payment Card */}
        <Card
          isHoverable
          className="flex h-full flex-col border-t-4 border-t-green-500"
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-600 dark:bg-green-950/30">
              <FontAwesomeIcon icon={faWallet} className="h-5 w-5" />
            </div>
            <Badge variant="success">Al día</Badge>
          </div>
          <CardTitle className="mb-1">Estado de Cuenta</CardTitle>
          <CardDescription className="mb-4">
            Tu balance actual y próximos vencimientos.
          </CardDescription>
          <div className="mb-4 flex flex-1 flex-col items-center justify-center rounded-xl bg-zinc-50 py-6 dark:bg-zinc-800/50">
            <p className="text-4xl font-black text-zinc-900 dark:text-white">
              $0.00
            </p>
            <p className="mt-1 text-xs font-medium tracking-wider text-zinc-500 uppercase">
              Saldo pendiente
            </p>
          </div>
          <div className="mt-auto space-y-3">
            <div className="flex justify-between px-1 text-sm">
              <span className="text-zinc-500">Próximo pago:</span>
              <span className="font-bold text-zinc-900 dark:text-white">
                01 Nov, 2023
              </span>
            </div>
            <Link href="/profile/payments">
              <Button variant="primary" className="w-full" size="md">
                Historial de Pagos
              </Button>
            </Link>
          </div>
        </Card>

        {/* Maintenance Card */}
        <Card isHoverable className="flex h-full flex-col">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-950/30">
              <FontAwesomeIcon icon={faBuilding} className="h-5 w-5" />
            </div>
            <Badge variant="warning">2 Activas</Badge>
          </div>
          <CardTitle className="mb-1">Solicitudes Activas</CardTitle>
          <CardDescription className="mb-4">
            Seguimiento de tickets de mantenimiento y servicios.
          </CardDescription>
          <div className="mt-auto space-y-3">
            <div className="flex items-center gap-3 rounded-xl border border-zinc-100 p-3 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/30">
              <div className="size-2.5 animate-pulse rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]"></div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-zinc-900 dark:text-white">
                  Fuga de agua baño principal
                </p>
                <p className="text-[10px] font-medium text-zinc-500 uppercase">
                  En proceso - Tallerista asignado
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-zinc-100 p-3 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/30">
              <div className="size-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-zinc-900 dark:text-white">
                  Copia de llaves acceso
                </p>
                <p className="text-[10px] font-medium text-zinc-500 uppercase">
                  Recibida - Pendiente aprobación
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="text-primary mt-2 w-full font-bold"
              size="sm"
            >
              Ver todas mis solicitudes
            </Button>
          </div>
        </Card>
      </div>

      {/* Secondary Data Table Placeholder */}
      <Card padding="none" className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-5 dark:border-zinc-800">
          <CardTitle className="text-lg">Documentos Recientes</CardTitle>
          <Button variant="ghost" size="sm" className="text-primary font-bold">
            Ver Carpeta
          </Button>
        </div>
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          <DocumentItem
            name="Reglamento_Interno_2023.pdf"
            info="2.4 MB • Subido hace 5 días"
          />
          <DocumentItem
            name="Estado_Gastos_Comunes_Agosto.pdf"
            info="1.1 MB • Subido hace 12 días"
          />
        </div>
      </Card>
    </div>
  );
}

function DocumentItem({ name, info }: { name: string; info: string }) {
  return (
    <div className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/30">
      <div className="rounded-xl bg-red-50 p-2.5 text-red-500 dark:bg-red-950/20">
        <FontAwesomeIcon icon={faFilePdf} className="h-6 w-6" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold text-zinc-900 dark:text-white">
          {name}
        </p>
        <p className="text-xs text-zinc-500">{info}</p>
      </div>
      <Button variant="ghost" size="sm" className="h-10 w-10 rounded-full p-0">
        <FontAwesomeIcon icon={faDownload} className="h-4 w-4" />
      </Button>
    </div>
  );
}

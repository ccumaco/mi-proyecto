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

export default function Profile() {
  const user = useSelector(selectUser);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 p-8">
      {/* Profile Header */}
      <div className="dark:bg-background-dark rounded-xl border border-[#dbe0e6] p-6 shadow-sm dark:border-gray-800">
        <div className="flex flex-col items-center gap-6 md:flex-row">
          <div
            className="border-primary/10 size-24 rounded-full border-4 bg-cover bg-center"
            data-alt="Avatar detallado del residente"
            style={{
              backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDY2JGQqcIfcWNjD0odXNmEE2jWBOjLj7IPnr11DBocAlkG7CYeqChlW-ugxIO_w_UAEH-9TTy_dl5wQ326vZkYeT5PgUEWEydAH9uB_-0yI3M5gUqif7-vwx6-MVl7_lws_j43dCkrYed6bLuhuNGujjxeMbCHGjcYabn-apkAEoubY8LzxxW7RlMf2X4GP7KBbCgp23QJzJJh56c5uE5QRPZf-nyv8zcwuGTSEqgreEorWHzC0_S6xODl2tlAVKGTmR7Cfk-YjMzF")`,
            }}
          ></div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold text-[#111418] dark:text-white">
              {user?.user_metadata?.full_name || user?.email || 'Usuario'}
            </h2>
            {/* Role display removed as it's now managed by DashboardLayout and passed to SidebarDashboard */}
            <p className="font-medium text-[#617589]">
              {/* Placeholder or access via context if role is needed here */}
              Rol gestionado centralmente
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-4 md:justify-start">
              <span className="flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                <FontAwesomeIcon icon={faCheckCircle} className="h-3 w-3" />
                Miembro Verificado
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                <FontAwesomeIcon icon={faCalendarDay} className="h-3 w-3" />
                Desde Ene 2023
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="rounded-lg bg-[#f0f2f4] px-5 py-2.5 text-sm font-bold text-[#111418] transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700">
              Editar Perfil
            </button>
          </div>
        </div>
      </div>
      {/* Section Title */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-[#111418] dark:text-white">
          Resumen de Actividad
        </h3>
        <p className="text-sm text-[#617589]">
          Última actualización: Hoy, 10:45 AM
        </p>
      </div>
      {/* Summary Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Announcement Card */}
        <div className="dark:bg-background-dark hover:border-primary/50 flex h-full flex-col rounded-xl border border-[#dbe0e6] p-5 shadow-sm transition-colors dark:border-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
              <FontAwesomeIcon icon={faCampground} className="h-4 w-4" />
            </div>
            <span className="bg-primary/10 text-primary rounded px-2 py-1 text-xs font-bold">
              3 NUEVOS
            </span>
          </div>
          <h4 className="mb-1 text-lg font-bold">Últimos Comunicados</h4>
          <p className="mb-4 text-sm text-[#617589]">
            Mantente al tanto de lo que sucede en tu comunidad.
          </p>
          <div className="mt-auto space-y-4">
            <div className="bg-background-light rounded-lg p-3 dark:bg-gray-800/50">
              <p className="mb-1 text-xs text-[#617589]">Hace 2 horas</p>
              <p className="truncate text-sm font-semibold">
                Mantenimiento de Elevadores
              </p>
            </div>
            <div className="bg-background-light rounded-lg p-3 dark:bg-gray-800/50">
              <p className="mb-1 text-xs text-[#617589]">Ayer</p>
              <p className="truncate text-sm font-semibold">
                Fumigación de Áreas Verdes
              </p>
            </div>
            <button className="text-primary w-full py-2 text-center text-sm font-bold hover:underline">
              Ver todos los anuncios
            </button>
          </div>
        </div>
        {/* Payment Card */}
        <div className="dark:bg-background-dark hover:border-primary/50 flex h-full flex-col rounded-xl border border-[#dbe0e6] p-5 shadow-sm transition-colors dark:border-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex size-10 items-center justify-center rounded-lg bg-green-100 text-green-600">
              <FontAwesomeIcon icon={faWallet} className="h-4 w-4" />
            </div>
            <span className="rounded bg-green-100 px-2 py-1 text-xs font-bold tracking-wider text-green-600 uppercase">
              Al día
            </span>
          </div>
          <h4 className="mb-1 text-lg font-bold">Estado de Cuenta</h4>
          <p className="mb-4 text-sm text-[#617589]">
            Tu balance actual y próximos vencimientos.
          </p>
          <div className="bg-background-light mb-4 flex flex-1 flex-col items-center justify-center rounded-xl py-4 dark:bg-gray-800/50">
            <p className="text-3xl font-black text-[#111418] dark:text-white">
              $0.00
            </p>
            <p className="mt-1 text-xs font-medium text-[#617589]">
              Saldo pendiente
            </p>
          </div>
          <div className="mt-auto space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-[#617589]">Próximo pago:</span>
              <span className="font-bold text-[#111418] dark:text-white">
                01 Oct, 2023
              </span>
            </div>
            <button className="dark:bg-primary w-full rounded-lg bg-[#111418] py-3 text-sm font-bold text-white transition-opacity hover:opacity-90">
              Historial de Pagos
            </button>
          </div>
        </div>
        {/* Maintenance Card */}
        <div className="dark:bg-background-dark hover:border-primary/50 flex h-full flex-col rounded-xl border border-[#dbe0e6] p-5 shadow-sm transition-colors dark:border-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex size-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
              <FontAwesomeIcon icon={faBuilding} className="h-4 w-4" />
            </div>
            <span className="rounded bg-orange-100 px-2 py-1 text-xs font-bold tracking-wider text-orange-600 uppercase">
              2 Activas
            </span>
          </div>
          <h4 className="mb-1 text-lg font-bold">Solicitudes Activas</h4>
          <p className="mb-4 text-sm text-[#617589]">
            Seguimiento de tickets de mantenimiento y servicios.
          </p>
          <div className="mt-auto space-y-3">
            <div className="flex items-center gap-3 rounded-lg border border-[#dbe0e6] p-3 dark:border-gray-700">
              <div className="size-2 animate-pulse rounded-full bg-orange-500"></div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">
                  Fuga de agua baño principal
                </p>
                <p className="text-[11px] text-[#617589]">
                  En proceso - Tallerista asignado
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-[#dbe0e6] p-3 dark:border-gray-700">
              <div className="size-2 rounded-full bg-blue-500"></div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">
                  Copia de llaves acceso
                </p>
                <p className="text-[11px] text-[#617589]">
                  Recibida - Pendiente aprobación
                </p>
              </div>
            </div>
            <button className="text-primary w-full py-2 text-center text-sm font-bold hover:underline">
              Ver todas mis solicitudes
            </button>
          </div>
        </div>
      </div>
      {/* Secondary Data Table Placeholder */}
      <div className="dark:bg-background-dark overflow-hidden rounded-xl border border-[#dbe0e6] shadow-sm dark:border-gray-800">
        <div className="flex items-center justify-between border-b border-[#dbe0e6] px-6 py-4 dark:border-gray-800">
          <h4 className="text-lg font-bold">Documentos Recientes</h4>
          <button className="text-primary text-sm font-bold">
            Ver Carpeta
          </button>
        </div>
        <div className="divide-y divide-[#dbe0e6] dark:divide-gray-800">
          <div className="hover:bg-background-light flex items-center gap-4 px-6 py-4 transition-colors dark:hover:bg-gray-800/30">
            <FontAwesomeIcon icon={faFilePdf} className="h-9 w-9" />
            <div className="flex-1">
              <p className="text-sm font-bold">Reglamento_Interno_2023.pdf</p>
              <p className="text-xs text-[#617589]">
                2.4 MB • Subido hace 5 días
              </p>
            </div>
            <button className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
              <FontAwesomeIcon icon={faDownload} className="h-4 w-4" />
            </button>
          </div>
          <div className="hover:bg-background-light flex items-center gap-4 px-6 py-4 transition-colors dark:hover:bg-gray-800/30">
            <FontAwesomeIcon icon={faFilePdf} className="h-9 w-9" />
            <div className="flex-1">
              <p className="text-sm font-bold">
                Estado_Gastos_Comunes_Agosto.pdf
              </p>
              <p className="text-xs text-[#617589]">
                1.1 MB • Subido hace 12 días
              </p>
            </div>
            <button className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
              <FontAwesomeIcon icon={faDownload} className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

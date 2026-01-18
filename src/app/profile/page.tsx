'use client';

import { useState, useEffect } from 'react';
import { createClientBrowser } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientBrowser(); // Initialize cookie-based Supabase client

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        if (error) {
          console.error('Error fetching profile:', error);
        } else {
          setRole(profile.role);
        }
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar Navigation */}
      <aside className="border-[#dbe0e6] dark:border-gray-800 dark:bg-background-dark fixed top-0 hidden h-screen w-64 flex-col border-r bg-white lg:flex">
        <div className="flex h-full flex-col justify-between p-6">
          <div className="flex flex-col gap-8">
            {/* Logo / Brand */}
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary p-2 text-white">
                <span className="material-symbols-outlined">domain</span>
              </div>
              <div className="flex flex-col">
                <h1 className="text-base font-bold leading-tight text-[#111418] dark:text-white">
                  Gestión Residencial
                </h1>
                <p className="text-xs font-normal text-[#617589]">Admin Central</p>
              </div>
            </div>
            {/* Nav Links */}
            <nav className="flex flex-col gap-2">
              <a
                className="flex items-center gap-3 rounded-lg bg-primary/10 px-3 py-2.5 text-primary"
                href="#"
              >
                <span className="material-symbols-outlined">dashboard</span>
                <span className="text-sm font-semibold">Inicio</span>
              </a>
              <a
                className="hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-3 rounded-lg px-3 py-2.5 text-[#617589] transition-colors"
                href="#"
              >
                <span className="material-symbols-outlined">campaign</span>
                <span className="text-sm font-medium">Comunicados</span>
              </a>
              <a
                className="hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-3 rounded-lg px-3 py-2.5 text-[#617589] transition-colors"
                href="#"
              >
                <span className="material-symbols-outlined">payments</span>
                <span className="text-sm font-medium">Pagos</span>
              </a>
              <a
                className="hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-3 rounded-lg px-3 py-2.5 text-[#617589] transition-colors"
                href="#"
              >
                <span className="material-symbols-outlined">description</span>
                <span className="text-sm font-medium">Documentos</span>
              </a>
            </nav>
          </div>
          {/* Bottom User Nav */}
          <div className="border-t border-[#dbe0e6] pt-6 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div
                className="size-10 rounded-full bg-cover bg-center"
                data-alt="Avatar de usuario perfil"
                style={{
                  backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBfKYSguiT6CNTnJ2v_7Bo7e1q1u5bQNw789Vnv66y8po_rY-4Cg7SlkrJTCXEpCW7-7uCPq3BFwSKAAfZw65OvVWpaDjCa_LJluUvJmfgnOlVooG6xufFTPZDssi20RlggiBObR3W1jdHxcqsVqpO7WEzGIJ7K_dO0K68mgKhxzRbQhZQTStQ5yO2tVauuJuRzjJ-OCnnEg9Gq-flU7cddB0pmkzwhvcXwl4kq-GRvylprrSAI6zJ9-gU95qgyyJwsUsmwXp5ZSSG5")`,
                }}
              ></div>
              <div className="flex flex-col">
                <p className="text-sm font-bold dark:text-white">
                  {user?.user_metadata?.full_name || user?.email || 'Usuario'}
                </p>
                <p className="text-xs text-[#617589]">{role || 'Rol Desconocido'}</p>
              </div>
              <button className="ml-auto text-[#617589]" onClick={handleLogout}>
                <span className="material-symbols-outlined">logout</span>
              </button>
            </div>
          </div>
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex flex-1 flex-col">
        {/* Top Navigation Bar */}
        <header className="dark:bg-background-dark sticky top-0 z-10 flex h-16 items-center justify-between border-b border-[#dbe0e6] bg-white px-8 dark:border-gray-800">
          <div className="flex max-w-xl flex-1 items-center gap-4">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#617589]">
                search
              </span>
              <input
                className="focus:ring-primary dark:focus:bg-gray-700 w-full rounded-lg border-none bg-[#f0f2f4] py-2 pl-10 pr-4 text-sm placeholder:text-[#617589] transition-all focus:bg-white focus:ring-2 dark:bg-gray-800"
                placeholder="Buscar comunicados, pagos o documentos..."
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="bg-primary shadow-sm hover:bg-primary/90 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold text-white transition-colors">
              <span className="material-symbols-outlined text-sm">add_circle</span>
              <span>Nueva Solicitud</span>
            </button>
            <div className="mx-2 h-6 w-[1px] bg-[#dbe0e6] dark:bg-gray-800"></div>
            <button className="relative rounded-lg p-2 text-[#617589] hover:bg-[#f0f2f4] dark:hover:bg-gray-800">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-red-500 dark:border-background-dark"></span>
            </button>
            <button className="rounded-lg p-2 text-[#617589] hover:bg-[#f0f2f4] dark:hover:bg-gray-800">
              <span className="material-symbols-outlined">settings</span>
            </button>
          </div>
        </header>
        {/* Dashboard Content */}
        <div className="mx-auto w-full max-w-7xl space-y-8 p-8">
          {/* Profile Header */}
          <div className="dark:bg-background-dark rounded-xl border border-[#dbe0e6] p-6 shadow-sm dark:border-gray-800">
            <div className="flex flex-col items-center gap-6 md:flex-row">
              <div
                className="size-24 rounded-full border-4 border-primary/10 bg-cover bg-center"
                data-alt="Avatar detallado del residente"
                style={{
                  backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDY2JGQqcIfcWNjD0odXNmEE2jWBOjLj7IPnr11DBocAlkG7CYeqChlW-ugxIO_w_UAEH-9TTy_dl5wQ326vZkYeT5PgUEWEydAH9uB_-0yI3M5gUqif7-vwx6-MVl7_lws_j43dCkrYed6bLuhuNGujjxeMbCHGjcYabn-apkAEoubY8LzxxW7RlMf2X4GP7KBbCgp23QJzJJh56c5uE5QRPZf-nyv8zcwuGTSEqgreEorWHzC0_S6xODl2tlAVKGTmR7Cfk-YjMzF")`,
                }}
              ></div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold text-[#111418] dark:text-white">
                  {user?.user_metadata?.full_name || user?.email || 'Usuario'}
                </h2>
                <p className="font-medium text-[#617589]">
                  {role ? (role === 'resident' ? 'Residente' : role) : 'Rol Desconocido'}
                </p>
                <div className="mt-3 flex flex-wrap justify-center gap-4 md:justify-start">
                  <span className="flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                    <span className="material-symbols-outlined text-[14px]">
                      verified
                    </span>{' '}
                    Miembro Verificado
                  </span>
                  <span className="flex items-center gap-1.5 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                    <span className="material-symbols-outlined text-[14px]">
                      calendar_today
                    </span>{' '}
                    Desde Ene 2023
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg bg-[#f0f2f4] px-5 py-2.5 text-sm font-bold text-[#111418] transition-colors dark:bg-gray-800 dark:text-white">
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
            <p className="text-sm text-[#617589]">Última actualización: Hoy, 10:45 AM</p>
          </div>
          {/* Summary Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Announcement Card */}
            <div className="dark:bg-background-dark hover:border-primary/50 flex h-full flex-col rounded-xl border border-[#dbe0e6] p-5 shadow-sm transition-colors dark:border-gray-800">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <span className="material-symbols-outlined">campaign</span>
                </div>
                <span className="rounded bg-primary/10 px-2 py-1 text-xs font-bold text-primary">
                  3 NUEVOS
                </span>
              </div>
              <h4 className="mb-1 text-lg font-bold">Últimos Comunicados</h4>
              <p className="mb-4 text-sm text-[#617589]">
                Mantente al tanto de lo que sucede en tu comunidad.
              </p>
              <div className="mt-auto space-y-4">
                <div className="dark:bg-gray-800/50 rounded-lg bg-background-light p-3">
                  <p className="mb-1 text-xs text-[#617589]">Hace 2 horas</p>
                  <p className="truncate text-sm font-semibold">
                    Mantenimiento de Elevadores
                  </p>
                </div>
                <div className="dark:bg-gray-800/50 rounded-lg bg-background-light p-3">
                  <p className="mb-1 text-xs text-[#617589]">Ayer</p>
                  <p className="truncate text-sm font-semibold">
                    Fumigación de Áreas Verdes
                  </p>
                </div>
                <button className="hover:underline w-full py-2 text-center text-sm font-bold text-primary">
                  Ver todos los anuncios
                </button>
              </div>
            </div>
            {/* Payment Card */}
            <div className="dark:bg-background-dark hover:border-primary/50 flex h-full flex-col rounded-xl border border-[#dbe0e6] p-5 shadow-sm transition-colors dark:border-gray-800">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex size-10 items-center justify-center rounded-lg bg-green-100 text-green-600">
                  <span className="material-symbols-outlined">
                    account_balance_wallet
                  </span>
                </div>
                <span className="rounded bg-green-100 px-2 py-1 text-xs font-bold uppercase tracking-wider text-green-600">
                  Al día
                </span>
              </div>
              <h4 className="mb-1 text-lg font-bold">Estado de Cuenta</h4>
              <p className="mb-4 text-sm text-[#617589]">
                Tu balance actual y próximos vencimientos.
              </p>
              <div className="dark:bg-gray-800/50 mb-4 flex flex-1 flex-col items-center justify-center rounded-xl bg-background-light py-4">
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
                <button className="dark:bg-primary hover:opacity-90 w-full rounded-lg bg-[#111418] py-3 text-sm font-bold text-white transition-opacity">
                  Historial de Pagos
                </button>
              </div>
            </div>
            {/* Maintenance Card */}
            <div className="dark:bg-background-dark hover:border-primary/50 flex h-full flex-col rounded-xl border border-[#dbe0e6] p-5 shadow-sm transition-colors dark:border-gray-800">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex size-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                  <span className="material-symbols-outlined">build</span>
                </div>
                <span className="rounded bg-orange-100 px-2 py-1 text-xs font-bold uppercase tracking-wider text-orange-600">
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
                <button className="hover:underline w-full py-2 text-center text-sm font-bold text-primary">
                  Ver todas mis solicitudes
                </button>
              </div>
            </div>
          </div>
          {/* Secondary Data Table Placeholder */}
          <div className="dark:bg-background-dark overflow-hidden rounded-xl border border-[#dbe0e6] shadow-sm dark:border-gray-800">
            <div className="flex items-center justify-between border-b border-[#dbe0e6] px-6 py-4 dark:border-gray-800">
              <h4 className="text-lg font-bold">Documentos Recientes</h4>
              <button className="text-sm font-bold text-primary">Ver Carpeta</button>
            </div>
            <div className="divide-y divide-[#dbe0e6] dark:divide-gray-800">
              <div className="hover:bg-background-light dark:hover:bg-gray-800/30 flex items-center gap-4 px-6 py-4 transition-colors">
                <span className="material-symbols-outlined text-red-500">
                  picture_as_pdf
                </span>
                <div className="flex-1">
                  <p className="text-sm font-bold">Reglamento_Interno_2023.pdf</p>
                  <p className="text-xs text-[#617589]">2.4 MB • Subido hace 5 días</p>
                </div>
                <button className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full p-2">
                  <span className="material-symbols-outlined text-xl">
                    download
                  </span>
                </button>
              </div>
              <div className="hover:bg-background-light dark:hover:bg-gray-800/30 flex items-center gap-4 px-6 py-4 transition-colors">
                <span className="material-symbols-outlined text-primary">
                  description
                </span>
                <div className="flex-1">
                  <p className="text-sm font-bold">
                    Estado_Gastos_Comunes_Agosto.pdf
                  </p>
                  <p className="text-xs text-[#617589]">1.1 MB • Subido hace 12 días</p>
                </div>
                <button className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full p-2">
                  <span className="material-symbols-outlined text-xl">
                    download
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

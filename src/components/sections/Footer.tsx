export default function Footer() {
  return (
    <footer className="dark:bg-background-dark border-t border-slate-200 bg-white px-4 pt-16 pb-8 sm:px-6 lg:px-8 dark:border-slate-800">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <div className="bg-primary rounded-lg p-1.5">
                <span className="material-symbols-outlined text-xl text-white">
                  domain
                </span>
              </div>
              <h2 className="text-navy text-lg font-bold dark:text-white">
                PropManagement
              </h2>
            </div>
            <p className="text-slate-gray text-sm leading-relaxed dark:text-slate-400">
              Líderes en el mercado de administración inmobiliaria digital en
              Latinoamérica. Transformando comunidades desde 2014.
            </p>
            <div className="flex gap-4">
              <a
                className="text-slate-gray hover:bg-primary flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 transition-all hover:text-white dark:bg-slate-800"
                href="#"
              >
                <span className="material-symbols-outlined text-base">
                  share
                </span>
              </a>
              <a
                className="text-slate-gray hover:bg-primary flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 transition-all hover:text-white dark:bg-slate-800"
                href="#"
              >
                <span className="material-symbols-outlined text-base">
                  alternate_email
                </span>
              </a>
              <a
                className="text-slate-gray hover:bg-primary flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 transition-all hover:text-white dark:bg-slate-800"
                href="#"
              >
                <span className="material-symbols-outlined text-base">
                  public
                </span>
              </a>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <h4 className="text-navy font-bold dark:text-white">Compañía</h4>
            <ul className="flex flex-col gap-3">
              <li>
                <a
                  className="text-slate-gray hover:text-primary text-sm transition-colors dark:text-slate-400"
                  href="#"
                >
                  Sobre nosotros
                </a>
              </li>
              <li>
                <a
                  className="text-slate-gray hover:text-primary text-sm transition-colors dark:text-slate-400"
                  href="#"
                >
                  Carreras
                </a>
              </li>
              <li>
                <a
                  className="text-slate-gray hover:text-primary text-sm transition-colors dark:text-slate-400"
                  href="#"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  className="text-slate-gray hover:text-primary text-sm transition-colors dark:text-slate-400"
                  href="#"
                >
                  Prensa
                </a>
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-6">
            <h4 className="text-navy font-bold dark:text-white">Soporte</h4>
            <ul className="flex flex-col gap-3">
              <li>
                <a
                  className="text-slate-gray hover:text-primary text-sm transition-colors dark:text-slate-400"
                  href="#"
                >
                  Centro de ayuda
                </a>
              </li>
              <li>
                <a
                  className="text-slate-gray hover:text-primary text-sm transition-colors dark:text-slate-400"
                  href="#"
                >
                  Términos de servicio
                </a>
              </li>
              <li>
                <a
                  className="text-slate-gray hover:text-primary text-sm transition-colors dark:text-slate-400"
                  href="#"
                >
                  Privacidad
                </a>
              </li>
              <li>
                <a
                  className="text-slate-gray hover:text-primary text-sm transition-colors dark:text-slate-400"
                  href="#"
                >
                  Estado del sistema
                </a>
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-6">
            <h4 className="text-navy font-bold dark:text-white">Contacto</h4>
            <ul className="flex flex-col gap-4">
              <li className="text-slate-gray flex gap-3 text-sm dark:text-slate-400">
                <span className="material-symbols-outlined text-primary text-xl">
                  location_on
                </span>
                <span>Calle 100 #15-32, Bogotá, Colombia</span>
              </li>
              <li className="text-slate-gray flex gap-3 text-sm dark:text-slate-400">
                <span className="material-symbols-outlined text-primary text-xl">
                  call
                </span>
                <span>+57 (601) 456-7890</span>
              </li>
              <li className="text-slate-gray flex gap-3 text-sm dark:text-slate-400">
                <span className="material-symbols-outlined text-primary text-xl">
                  mail
                </span>
                <span>contacto@propmanagement.com</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 md:flex-row dark:border-slate-800">
          <p className="text-slate-gray text-center text-xs md:text-left dark:text-slate-500">
            © 2024 PropManagement Inc. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            <a
              className="text-slate-gray text-xs hover:underline dark:text-slate-500"
              href="#"
            >
              Privacidad
            </a>
            <a
              className="text-slate-gray text-xs hover:underline dark:text-slate-500"
              href="#"
            >
              Cookies
            </a>
            <a
              className="text-slate-gray text-xs hover:underline dark:text-slate-500"
              href="#"
            >
              Seguridad
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

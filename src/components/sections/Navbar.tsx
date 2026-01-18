export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md dark:border-white/10 dark:bg-[#191919]/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <span className="text-primary text-2xl font-bold">
            PropManagement
          </span>
        </div>

        <nav className="hidden space-x-8 text-sm font-medium md:flex">
          <a href="#nosotros" className="hover:text-primary transition-colors">
            ¿Quiénes somos?
          </a>
          <a href="#servicios" className="hover:text-primary transition-colors">
            Servicios
          </a>
          <a
            href="#beneficios"
            className="hover:text-primary transition-colors"
          >
            Beneficios
          </a>
          <a href="#contacto" className="hover:text-primary transition-colors">
            Contacto
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <button className="hover:text-primary text-sm font-medium">
            Iniciar sesión
          </button>
          <button className="bg-primary rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-700">
            Solicitar información
          </button>
        </div>
      </div>
    </header>
  );
}

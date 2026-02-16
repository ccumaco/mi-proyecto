import { faCirclePlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const HeaderDashboard = () => {
  return (
    <header className="dark:bg-background-dark sticky top-0 z-10 flex h-16 items-center justify-between border-b border-[#dbe0e6] bg-white px-8 dark:border-gray-800">
      <div className="flex max-w-xl flex-1 items-center gap-4">
        <div className="relative w-full">
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute top-1/2 left-3 -translate-y-1/2 text-[#617589]"
          />
          <input
            className="focus:ring-primary w-full rounded-lg border-none bg-[#f0f2f4] py-2 pr-4 pl-10 text-sm transition-all placeholder:text-[#617589] focus:bg-white focus:ring-2 dark:bg-gray-800 dark:focus:bg-gray-700"
            placeholder="Buscar comunicados, pagos o documentos..."
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="bg-primary hover:bg-primary/90 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors">
          <FontAwesomeIcon icon={faCirclePlus} className="h-4 w-4" />
          <span>Nueva Solicitud</span>
        </button>
        <div className="mx-2 h-6 w-[1px] bg-[#dbe0e6] dark:bg-gray-800"></div>
        <button className="relative rounded-lg p-2 text-[#617589] hover:bg-[#f0f2f4] dark:hover:bg-gray-800">
          <span className="material-symbols-outlined">notifications</span>
          <span className="dark:border-background-dark absolute top-2 right-2 h-2 w-2 rounded-full border-2 border-white bg-red-500"></span>
        </button>
        <button className="rounded-lg p-2 text-[#617589] hover:bg-[#f0f2f4] dark:hover:bg-gray-800">
          <span className="material-symbols-outlined">settings</span>
        </button>
      </div>
    </header>
  );
};

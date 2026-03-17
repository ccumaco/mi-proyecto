'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faDesktop } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/components/ui/Button';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Evitar errores de hidratación asegurando que el cliente esté montado
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className="w-9 px-0">
        <div className="h-4 w-4 rounded-full bg-zinc-200 animate-pulse" />
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-full border border-zinc-200 dark:border-zinc-700">
      <ThemeButton 
        active={theme === 'light'} 
        icon={faSun} 
        onClick={() => setTheme('light')} 
        title="Modo Claro"
      />
      <ThemeButton 
        active={theme === 'dark'} 
        icon={faMoon} 
        onClick={() => setTheme('dark')} 
        title="Modo Oscuro"
      />
      <ThemeButton 
        active={theme === 'system'} 
        icon={faDesktop} 
        onClick={() => setTheme('system')} 
        title="Sincronizar con Sistema"
      />
    </div>
  );
}

function ThemeButton({ active, icon, onClick, title }: { active: boolean, icon: any, onClick: () => void, title: string }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`
        flex h-7 w-7 items-center justify-center rounded-full transition-all duration-200
        ${active 
          ? 'bg-white text-primary shadow-sm dark:bg-zinc-700 dark:text-white' 
          : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
        }
      `}
    >
      <FontAwesomeIcon icon={icon} className="h-3.5 w-3.5" />
    </button>
  );
}

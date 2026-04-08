import React, { useState } from 'react';

/**
 * Valida un NIT colombiano usando el algoritmo de Módulo 11.
 * @param nit La parte numérica del NIT (7-9 dígitos).
 * @param dv El dígito de verificación (0-9).
 * @returns true si es válido, false en caso contrario.
 */
export function validarNIT(nit: string, dv: string): boolean {
  // Verificar que nit sea solo dígitos y longitud 7-9
  if (!/^\d{7,9}$/.test(nit)) return false;
  // Verificar que dv sea un dígito
  if (!/^\d$/.test(dv)) return false;

  const pesos = [3, 7, 13, 17, 19, 23, 29, 37, 41, 43, 47]; // Más pesos por si acaso
  const digitos = nit.split('').map(Number).reverse(); // Invertir para multiplicar desde el final
  let suma = 0;
  for (let i = 0; i < digitos.length; i++) {
    suma += digitos[i] * pesos[i];
  }
  const residuo = suma % 11;
  let dvEsperado: number;
  if (residuo === 0) {
    dvEsperado = 0;
  } else if (residuo === 1) {
    dvEsperado = 1;
  } else {
    dvEsperado = 11 - residuo;
  }
  // Si dvEsperado es 10, no es válido
  if (dvEsperado === 10) return false;
  return dvEsperado === parseInt(dv);
}

/**
 * Parsea un string de NIT completo (con o sin guion) y devuelve {nit, dv} o null si inválido.
 */
export function parseNIT(input: string): { nit: string; dv: string } | null {
  const cleaned = input.replace(/\s+/g, '').replace(/-/g, '');
  if (!/^\d{8,10}$/.test(cleaned)) return null;
  const len = cleaned.length;
  if (len === 8) {
    // Asumir 7 dígitos + 1 DV
    return { nit: cleaned.slice(0, 7), dv: cleaned.slice(7) };
  } else if (len === 9) {
    // 8 dígitos + 1 DV
    return { nit: cleaned.slice(0, 8), dv: cleaned.slice(8) };
  } else if (len === 10) {
    // 9 dígitos + 1 DV
    return { nit: cleaned.slice(0, 9), dv: cleaned.slice(9) };
  }
  return null;
}

interface NITInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export const NITInput: React.FC<NITInputProps> = ({
  value,
  onChange,
  placeholder = '900000000-1',
  required = false,
  className = '',
}) => {
  const [error, setError] = useState<string>('');

  const handleBlur = () => {
    const parsed = parseNIT(value);
    if (!parsed) {
      setError('Formato inválido. Debe ser 8-10 dígitos, opcionalmente con guion.');
    } else if (!validarNIT(parsed.nit, parsed.dv)) {
      setError('Dígito de verificación incorrecto.');
    } else {
      setError('');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    // Limpiar error mientras escribe
    if (error) setError('');
  };

  return (
    <div className={`flex w-full flex-col gap-1.5 ${className}`}>
      <label className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
        NIT / ID Tributaria
      </label>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        required={required}
        className={`w-full rounded-xl border-2 bg-white px-4 py-3 text-sm text-zinc-900 transition-all duration-200 outline-none placeholder:text-zinc-400 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-500 ${
          error
            ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100 dark:border-red-500 dark:focus:ring-red-900/30'
            : 'border-zinc-300 focus:border-primary focus:ring-4 focus:ring-primary/10 dark:border-zinc-600 dark:focus:border-primary/70 dark:focus:ring-primary/10'
        }`}
      />
      {error && (
        <span className="animate-in fade-in slide-in-from-top-1 mt-1 text-xs font-medium text-red-500">
          {error}
        </span>
      )}
    </div>
  );
};
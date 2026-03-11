import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: any;
  rightIcon?: any;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightIcon, className = '', ...props }, ref) => {
    return (
      <div className="flex w-full flex-col gap-1.5">
        {label && (
          <label className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
            {label}
          </label>
        )}

        <div className="group relative flex items-center">
          {leftIcon && (
            <div className="group-focus-within:text-primary pointer-events-none absolute left-3.5 text-zinc-400 transition-colors">
              <FontAwesomeIcon icon={leftIcon} className="h-4 w-4" />
            </div>
          )}

          <input
            ref={ref}
            className={`w-full rounded-xl border-2 bg-white px-4 py-3 text-sm text-zinc-900 transition-all duration-200 outline-none placeholder:text-zinc-400 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-500 ${leftIcon ? 'pl-11' : ''} ${rightIcon ? 'pr-11' : ''} ${
              error
                ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100 dark:border-red-500 dark:focus:ring-red-900/30'
                : 'border-zinc-300 focus:border-primary focus:ring-4 focus:ring-primary/10 dark:border-zinc-600 dark:focus:border-primary/70 dark:focus:ring-primary/10'
            } ${className} `}
            {...props}
          />

          {rightIcon && (
            <div className="group-focus-within:text-primary pointer-events-none absolute right-3.5 text-zinc-400 transition-colors">
              <FontAwesomeIcon icon={rightIcon} className="h-4 w-4" />
            </div>
          )}
        </div>

        {error && (
          <span className="animate-in fade-in slide-in-from-top-1 mt-1 text-xs font-medium text-red-500">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

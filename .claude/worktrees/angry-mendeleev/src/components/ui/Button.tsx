import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: any;
  rightIcon?: any;
}

export const Button = ({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}: ButtonProps) => {
  // Base Styles
  const baseStyles =
    'inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]';

  // Variant Styles
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90 focus:ring-primary/50',
    secondary:
      'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 focus:ring-zinc-500 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700',
    outline:
      'border-2 border-zinc-200 bg-transparent text-zinc-700 hover:bg-zinc-50 focus:ring-zinc-500 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost:
      'bg-transparent text-zinc-600 hover:bg-zinc-100 focus:ring-zinc-500 dark:text-zinc-400 dark:hover:bg-zinc-800',
  };

  // Size Styles
  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3.5 text-base gap-2.5',
  };

  const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button
      className={combinedClassName}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && (
        <FontAwesomeIcon
          icon={faCircleNotch}
          className="h-4 w-4 animate-spin"
        />
      )}
      {!isLoading && leftIcon && (
        <FontAwesomeIcon icon={leftIcon} className="h-4 w-4" />
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && (
        <FontAwesomeIcon icon={rightIcon} className="h-4 w-4" />
      )}
    </button>
  );
};

import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  isHoverable?: boolean;
}

export const Card = ({
  children,
  className = '',
  padding = 'md',
  isHoverable = false,
  ...props
}: CardProps) => {
  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const baseStyles =
    'rounded-2xl border border-zinc-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 transition-all duration-300 overflow-hidden';
  const hoverStyles = isHoverable
    ? 'hover:shadow-md hover:border-zinc-200 dark:hover:border-zinc-700 hover:-translate-y-1'
    : '';

  return (
    <div
      className={`${baseStyles} ${paddings[padding]} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`mb-4 flex items-center justify-between ${className}`}>
    {children}
  </div>
);

export const CardTitle = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <h3
    className={`text-lg font-bold text-zinc-900 dark:text-white ${className}`}
  >
    {children}
  </h3>
);

export const CardDescription = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <h3 className={`text-sm text-zinc-500 dark:text-zinc-400 ${className}`}>
    {children}
  </h3>
);

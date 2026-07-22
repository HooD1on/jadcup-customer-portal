import type { ReactNode } from 'react';

interface PageShellProps {
  children: ReactNode;
  className?: string;
  narrow?: boolean;
}

export function PageShell({ children, className = '', narrow = false }: PageShellProps) {
  return (
    <main
      className={`flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 ${
        narrow ? 'max-w-4xl' : 'max-w-7xl'
      } ${className}`}
    >
      {children}
    </main>
  );
}

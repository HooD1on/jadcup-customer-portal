import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'light';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-jade-700 text-white hover:bg-jade-800 active:bg-jade-900 shadow-sm',
  secondary:
    'bg-jade-50 text-jade-700 hover:bg-jade-100 active:bg-jade-200',
  outline:
    'border border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100',
  ghost:
    'text-gray-600 hover:bg-gray-100 active:bg-gray-200',
  light:
    'bg-jade-100 text-jade-900 border border-jade-200 hover:bg-jade-50 active:bg-jade-200 shadow-sm',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-medium rounded-(--radius-button) transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  title?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-purple-600 text-white hover:bg-purple-500 active:bg-purple-700 focus:ring-purple-600 cursor-pointer shadow-md shadow-purple-600/10',
  secondary:
    'border border-border-dark bg-bg-card text-white hover:bg-border-dark hover:border-border-hover active:bg-gray-800 focus:ring-purple-600 cursor-pointer',
  danger:
    'bg-red-600 text-white hover:bg-red-500 active:bg-red-700 focus:ring-red-600 cursor-pointer shadow-md shadow-red-600/10',
  ghost:
    'bg-transparent text-purple-400 border border-purple-500/20 hover:bg-purple-950/30 hover:border-purple-500/40 focus:ring-purple-600 cursor-pointer',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs rounded',
  md: 'px-4 py-2 text-sm rounded-md',
  lg: 'px-6 py-3 text-base rounded-lg',
};

function Buttons({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  title,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      title={title}
      disabled={disabled || isLoading}
      className={`
        inline-flex items-center justify-center font-medium tracking-wide
        transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black
        disabled:cursor-not-allowed disabled:opacity-40
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="h-4 w-4 animate-spin text-current" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Cargando
        </span>
      ) : (
        children
      )}
    </button>
  );
}

export default Buttons;
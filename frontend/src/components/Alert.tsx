import type { ReactNode } from 'react';

export type AlertVariant = 'default' | 'info' | 'success' | 'warning' | 'danger';

interface AlertProps {
  title?: ReactNode;
  description?: ReactNode;
  variant?: AlertVariant;
  className?: string;
  onClose?: () => void;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
  closable?: boolean;
}

const variantStyles: Record<AlertVariant, { shell: string; title: string; description: string; accent: string; icon: string }> = {
  default: {
    shell: 'border-purple-900/30 bg-bg-card text-white',
    title: 'text-white',
    description: 'text-gray-400',
    accent: 'bg-purple-600',
    icon: 'text-purple-400',
  },
  info: {
    shell: 'border-blue-900/30 bg-bg-card text-white',
    title: 'text-white',
    description: 'text-gray-400',
    accent: 'bg-blue-600',
    icon: 'text-blue-400',
  },
  success: {
    shell: 'border-emerald-900/30 bg-bg-card text-white',
    title: 'text-white',
    description: 'text-gray-400',
    accent: 'bg-emerald-600',
    icon: 'text-emerald-400',
  },
  warning: {
    shell: 'border-amber-900/30 bg-bg-card text-white',
    title: 'text-white',
    description: 'text-gray-400',
    accent: 'bg-amber-600',
    icon: 'text-amber-400',
  },
  danger: {
    shell: 'border-red-900/30 bg-bg-card text-white',
    title: 'text-white',
    description: 'text-gray-400',
    accent: 'bg-red-600',
    icon: 'text-red-400',
  },
};

const defaultIcons: Record<AlertVariant, ReactNode> = {
  default: <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-purple-900/20 text-[10px] font-bold">!</span>,
  info: <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-900/20 text-[10px] font-bold">i</span>,
  success: <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-900/20 text-[10px] font-bold">✓</span>,
  warning: <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber-900/20 text-[10px] font-bold">!</span>,
  danger: <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-900/20 text-[10px] font-bold">!</span>,
};

function Alert({
  title,
  description,
  variant = 'default',
  className = '',
  onClose,
  actionLabel,
  onAction,
  icon,
  closable = true,
}: AlertProps) {
  const styles = variantStyles[variant];

  return (
    <div className={`w-full rounded-lg border px-4 py-3 shadow-lg backdrop-blur ${styles.shell} ${className}`}>
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 rounded-full p-0.5 ${styles.icon}`}>{icon ?? defaultIcons[variant]}</div>

        <div className="min-w-0 flex-1">
          {title && (
            typeof title === 'string' ? (
              <p className={`text-sm font-semibold ${styles.title}`}>{title}</p>
            ) : (
              title
            )
          )}

          {description && (
            typeof description === 'string' ? (
              <p className={`mt-1 text-xs ${styles.description}`}>{description}</p>
            ) : (
              description
            )
          )}

          {actionLabel && onAction && (
            <button
              type="button"
              onClick={onAction}
              className={`mt-2.5 inline-flex rounded px-2.5 py-1 text-xs font-semibold transition ${styles.accent} text-white hover:brightness-110 cursor-pointer`}
            >
              {actionLabel}
            </button>
          )}
        </div>

        {closable && (
          <button
            type="button"
            onClick={onClose}
            className="ml-2 rounded px-1 text-base leading-none text-gray-400 transition hover:bg-gray-800 hover:text-white cursor-pointer"
            aria-label="Cerrar alerta"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}

export default Alert;

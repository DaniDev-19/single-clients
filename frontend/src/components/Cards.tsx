import type { ReactNode } from 'react';

export type CardVariant = 'default' | 'soft' | 'accent' | 'success' | 'warning' | 'danger';

interface CardsProps {
  title?: ReactNode;
  subtitle?: ReactNode;
  description?: ReactNode;
  value?: ReactNode;
  secondaryValue?: ReactNode;
  badge?: ReactNode;
  image?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  variant?: CardVariant;
  className?: string;
  onClick?: () => void;
  clickable?: boolean;
  actionLabel?: string;
  onActionClick?: () => void;
  actionVariant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  showAction?: boolean;
}

const variantStyles: Record<CardVariant, { shell: string; header: string; value: string; secondary: string; accent: string; badge: string }> = {
  default: {
    shell: 'border-border-dark bg-bg-card shadow-md',
    header: 'bg-black/30 border-b border-border-dark',
    value: 'text-white',
    secondary: 'text-purple-400',
    accent: 'from-purple-600 to-purple-400',
    badge: 'bg-purple-950/40 text-purple-400 border-purple-900/30',
  },
  soft: {
    shell: 'border-border-dark bg-bg-card shadow-md',
    header: 'bg-black/30 border-b border-border-dark',
    value: 'text-white',
    secondary: 'text-gray-400',
    accent: 'from-gray-600 to-gray-500',
    badge: 'bg-gray-800 text-gray-400 border-gray-700/60',
  },
  accent: {
    shell: 'border-purple-900/30 bg-bg-card shadow-md',
    header: 'bg-purple-950/20 border-b border-purple-900/20',
    value: 'text-purple-300',
    secondary: 'text-purple-400',
    accent: 'from-purple-500 to-purple-300',
    badge: 'bg-purple-950/40 text-purple-400 border-purple-900/30',
  },
  success: {
    shell: 'border-emerald-900/30 bg-bg-card shadow-md',
    header: 'bg-emerald-950/20 border-b border-emerald-900/20',
    value: 'text-emerald-300',
    secondary: 'text-emerald-400',
    accent: 'from-emerald-600 to-emerald-400',
    badge: 'bg-emerald-950/40 text-emerald-400 border-emerald-900/30',
  },
  warning: {
    shell: 'border-amber-900/30 bg-bg-card shadow-md',
    header: 'bg-amber-950/20 border-b border-amber-900/20',
    value: 'text-amber-300',
    secondary: 'text-amber-400',
    accent: 'from-amber-600 to-amber-400',
    badge: 'bg-amber-950/40 text-amber-400 border-amber-900/30',
  },
  danger: {
    shell: 'border-red-900/30 bg-bg-card shadow-md',
    header: 'bg-red-950/20 border-b border-red-900/20',
    value: 'text-red-300',
    secondary: 'text-red-400',
    accent: 'from-red-600 to-red-400',
    badge: 'bg-red-950/40 text-red-400 border-red-900/30',
  },
};

const actionStyles: Record<NonNullable<CardsProps['actionVariant']>, string> = {
  primary: 'bg-purple-600 text-white hover:bg-purple-500 focus:ring-purple-600 cursor-pointer',
  secondary: 'border border-border-dark bg-bg-card text-white hover:bg-border-dark focus:ring-purple-600 cursor-pointer',
  ghost: 'bg-transparent text-purple-400 border border-purple-500/20 hover:bg-purple-950/30 focus:ring-purple-600 cursor-pointer',
  danger: 'bg-red-600 text-white hover:bg-red-500 focus:ring-red-600 cursor-pointer',
};

function Cards({
  title,
  subtitle,
  description,
  value,
  secondaryValue,
  badge,
  image,
  footer,
  children,
  variant = 'default',
  className = '',
  onClick,
  clickable = false,
  actionLabel,
  onActionClick,
  actionVariant = 'primary',
  showAction = false,
}: CardsProps) {
  const styles = variantStyles[variant];

  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-lg border transition-all duration-150 ${styles.shell} ${clickable ? 'cursor-pointer hover:border-purple-500/40 hover:-translate-y-0.5' : ''} ${className}`}
      onClick={clickable ? onClick : undefined}
    >
      {image && (
        <div className="overflow-hidden border-b border-border-dark bg-black/20">
          <div className="relative flex items-center justify-center p-4">
            {image}
          </div>
        </div>
      )}

      {(title || subtitle || badge) && (
        <div className={`px-4 py-3.5 flex items-center justify-between gap-3 ${styles.header}`}>
          <div className="min-w-0">
            {title && (
              typeof title === 'string' ? (
                <h3 className="text-sm font-semibold tracking-wide text-white">{title}</h3>
              ) : (
                title
              )
            )}

            {subtitle && (
              typeof subtitle === 'string' ? (
                <p className="mt-0.5 text-xs text-gray-400">{subtitle}</p>
              ) : (
                subtitle
              )
            )}
          </div>

          {badge && (
            <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${styles.badge}`}>
              {badge}
            </span>
          )}
        </div>
      )}

      <div className="flex flex-1 flex-col gap-4 p-4">
        {description && (
          typeof description === 'string' ? (
            <p className="text-xs text-gray-400 leading-relaxed">{description}</p>
          ) : (
            description
          )
        )}

        {(value !== undefined || secondaryValue !== undefined) && (
          <div className="rounded border border-border-dark bg-black/20 p-3">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-gray-500">Métrica</p>
                <div className={`mt-1 text-xl font-bold tracking-tight ${styles.value}`}>{value}</div>
              </div>

              {secondaryValue !== undefined && (
                <div className={`rounded px-2 py-0.5 text-xs font-semibold ${styles.secondary} bg-bg-panel`}>
                  {secondaryValue}
                </div>
              )}
            </div>
          </div>
        )}

        {children && <div className="text-xs text-gray-300">{children}</div>}
      </div>

      {(showAction || footer || onActionClick) && (
        <div className="border-t border-border-dark/60 p-4 bg-black/10">
          {footer ? (
            footer
          ) : (
            <div className="flex items-center justify-between gap-3">
              <div className="text-[10px] text-gray-500">Activo</div>

              {showAction && actionLabel && (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onActionClick?.();
                  }}
                  className={`rounded px-2.5 py-1.5 text-xs font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black ${actionStyles[actionVariant]}`}
                >
                  {actionLabel}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </article>
  );
}

export default Cards;

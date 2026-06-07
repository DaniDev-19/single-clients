import React, { useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';

export type ModalVariant = 'default' | 'soft' | 'danger' | 'success' | 'warning';
export type ModalActionVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

export interface ModalAction {
  label: string;
  onClick?: () => void;
  variant?: ModalActionVariant;
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>['type'];
  isLoading?: boolean;
  disabled?: boolean;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  variant?: ModalVariant;
  icon?: React.ReactNode;
  showActions?: boolean;
  actions?: ModalAction[];
  footer?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  headerClassName?: string;
  footerClassName?: string;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  primaryButtonText?: string;
  onPrimaryAction?: () => void;
  isPrimaryLoading?: boolean;
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
}

const sizeClasses: Record<NonNullable<ModalProps['size']>, string> = {
  sm: 'max-w-md',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
  xl: 'max-w-5xl',
  full: 'max-w-[95vw] h-[calc(100vh-2rem)]',
};

const modalVariantStyles: Record<ModalVariant, { shell: string; header: string; body: string; footer: string }> = {
  default: {
    shell: 'border border-border-dark bg-bg-card shadow-2xl',
    header: 'border-border-dark',
    body: 'text-gray-200',
    footer: 'border-border-dark bg-black/30',
  },
  soft: {
    shell: 'border border-border-dark bg-bg-card shadow-2xl',
    header: 'border-border-dark',
    body: 'text-gray-200',
    footer: 'border-border-dark bg-black/30',
  },
  danger: {
    shell: 'border border-red-900/30 bg-bg-card shadow-2xl',
    header: 'border-red-900/20',
    body: 'text-red-100',
    footer: 'border-red-900/20 bg-red-950/10',
  },
  success: {
    shell: 'border border-emerald-900/30 bg-bg-card shadow-2xl',
    header: 'border-emerald-900/20',
    body: 'text-emerald-100',
    footer: 'border-emerald-900/20 bg-emerald-950/10',
  },
  warning: {
    shell: 'border border-amber-900/30 bg-bg-card shadow-2xl',
    header: 'border-amber-900/20',
    body: 'text-amber-100',
    footer: 'border-amber-900/20 bg-amber-950/10',
  },
};

const actionVariantStyles: Record<ModalActionVariant, string> = {
  primary: 'bg-purple-600 text-white hover:bg-purple-500 active:bg-purple-700 focus:ring-purple-600 disabled:opacity-40 cursor-pointer',
  secondary: 'border border-border-dark bg-bg-card text-white hover:bg-border-dark active:bg-gray-800 focus:ring-purple-600 disabled:opacity-40 cursor-pointer',
  danger: 'bg-red-600 text-white hover:bg-red-500 active:bg-red-700 focus:ring-red-600 disabled:opacity-40 cursor-pointer',
  ghost: 'bg-transparent text-purple-400 border border-purple-500/20 hover:bg-purple-950/30 focus:ring-purple-600 disabled:opacity-40 cursor-pointer',
};

const ActionLoader = () => (
  <svg className="mr-2 h-4 w-4 animate-spin text-current" viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  variant = 'default',
  icon,
  showActions = true,
  actions = [],
  footer,
  className = '',
  bodyClassName = '',
  headerClassName = '',
  footerClassName = '',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  primaryButtonText = 'Guardar',
  onPrimaryAction,
  isPrimaryLoading = false,
  onSubmit,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousActiveElement = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && closeOnEscape) {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusableElements = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );

      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    requestAnimationFrame(() => {
      const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements && focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      } else {
        dialogRef.current?.focus();
      }
    });

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      previousActiveElement?.focus();
    };
  }, [closeOnEscape, isOpen, onClose]);

  const resolvedActions: ModalAction[] = useMemo(() => {
    if (showActions && actions.length > 0) return actions;

    if (!showActions) return [];

    if (!onPrimaryAction && !onSubmit) return [];

    return [
      {
        label: 'Cancelar',
        onClick: onClose,
        variant: 'secondary',
        type: 'button',
      },
      {
        label: primaryButtonText,
        onClick: onPrimaryAction,
        variant: 'primary',
        type: onSubmit ? 'submit' : 'button',
        isLoading: isPrimaryLoading,
      },
    ];
  }, [actions, isPrimaryLoading, onClose, onPrimaryAction, onSubmit, primaryButtonText, showActions]);

  const modalStyles = modalVariantStyles[variant];

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => closeOnOverlayClick && onClose()}
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby={description ? 'modal-description' : undefined}
        tabIndex={-1}
        className={`relative z-50 my-4 mx-auto w-full ${sizeClasses[size]} ${className}`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={`flex h-full max-h-[calc(100vh-2rem)] w-full flex-col overflow-hidden rounded-lg border shadow-2xl ${modalStyles.shell}`}>
          <div className={`flex items-start justify-between gap-4 border-b px-5 py-4 ${modalStyles.header} ${headerClassName}`}>
            <div className="flex min-w-0 items-start gap-3">
              {icon && <div className="mt-0.5 rounded-full bg-purple-900/10 p-2 text-purple-400">{icon}</div>}
              <div className="min-w-0">
                <h2 id="modal-title" className="text-base font-semibold tracking-wide text-white">
                  {title}
                </h2>
                {description && (
                  <p id="modal-description" className="mt-1 text-xs text-gray-400">
                    {description}
                  </p>
                )}
              </div>
            </div>

            {showCloseButton && (
              <button
                type="button"
                className="inline-flex h-7 w-7 items-center justify-center rounded border border-border-dark bg-bg-card text-base leading-none text-gray-400 transition hover:bg-border-dark hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-600 cursor-pointer"
                onClick={onClose}
                aria-label="Cerrar modal"
              >
                ×
              </button>
            )}
          </div>

          {onSubmit ? (
            <form
              onSubmit={onSubmit}
              className="flex min-h-0 flex-1 flex-col overflow-hidden"
            >
              <div className={`relative flex-1 overflow-y-auto px-5 py-5 text-gray-200 custom-scrollbar ${modalStyles.body} ${bodyClassName}`}>
                {children}
              </div>

              {(resolvedActions.length > 0 || footer) && (
                <div className={`border-t px-5 py-3 flex items-center justify-end gap-2 ${modalStyles.footer} ${footerClassName}`}>
                  {footer ? (
                    footer
                  ) : (
                    <div className="flex flex-row-reverse gap-2 w-full sm:w-auto">
                      {resolvedActions.map((action, index) => (
                        <button
                          key={`${action.label}-${index}`}
                          type={action.type ?? 'button'}
                          onClick={action.onClick}
                          disabled={action.disabled || action.isLoading}
                          className={`inline-flex items-center justify-center rounded px-4 py-2 text-xs font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black w-full sm:w-auto ${actionVariantStyles[action.variant ?? 'secondary']}`}
                        >
                          {action.isLoading ? <ActionLoader /> : null}
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </form>
          ) : (
            <div className="flex min-h-0 flex-1 flex-col">
              <div className={`relative flex-1 overflow-y-auto px-5 py-5 text-gray-200 custom-scrollbar ${modalStyles.body} ${bodyClassName}`}>
                {children}
              </div>

              {(resolvedActions.length > 0 || footer) && (
                <div className={`border-t px-5 py-3 flex items-center justify-end gap-2 ${modalStyles.footer} ${footerClassName}`}>
                  {footer ? (
                    footer
                  ) : (
                    <div className="flex flex-row-reverse gap-2 w-full sm:w-auto">
                      {resolvedActions.map((action, index) => (
                        <button
                          key={`${action.label}-${index}`}
                          type={action.type ?? 'button'}
                          onClick={action.onClick}
                          disabled={action.disabled || action.isLoading}
                          className={`inline-flex items-center justify-center rounded px-4 py-2 text-xs font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black w-full sm:w-auto ${actionVariantStyles[action.variant ?? 'secondary']}`}
                        >
                          {action.isLoading ? <ActionLoader /> : null}
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

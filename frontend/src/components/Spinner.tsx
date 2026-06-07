import { useEffect, useMemo, useState } from 'react';

export type SpinnerVariant = 'default' | 'soft' | 'success' | 'warning' | 'danger';
export type SpinnerSize = 'sm' | 'md' | 'lg';

interface SpinnerProps {
    title?: string;
    subtitle?: string;
    className?: string;
    variant?: SpinnerVariant;
    size?: SpinnerSize;
    progress?: number;
    autoProgress?: boolean;
    showProgressBar?: boolean;
}

const variantStyles: Record<SpinnerVariant, { spinner: string; glow: string; track: string; accent: string }> = {
    default: {
        spinner: 'border-purple-500/80',
        glow: 'shadow-[0_0_20px_rgba(124,58,237,0.3)]',
        track: 'bg-purple-950/40 border border-purple-900/20',
        accent: 'from-purple-600 to-purple-400',
    },
    soft: {
        spinner: 'border-gray-500/80',
        glow: 'shadow-none',
        track: 'bg-gray-800/40 border border-gray-700/20',
        accent: 'from-gray-500 to-gray-400',
    },
    success: {
        spinner: 'border-emerald-500/80',
        glow: 'shadow-[0_0_20px_rgba(16,185,129,0.3)]',
        track: 'bg-emerald-950/40 border border-emerald-900/20',
        accent: 'from-emerald-600 to-emerald-400',
    },
    warning: {
        spinner: 'border-amber-500/80',
        glow: 'shadow-[0_0_20px_rgba(245,158,11,0.3)]',
        track: 'bg-amber-950/40 border border-amber-900/20',
        accent: 'from-amber-600 to-amber-400',
    },
    danger: {
        spinner: 'border-rose-500/80',
        glow: 'shadow-[0_0_20px_rgba(244,63,94,0.3)]',
        track: 'bg-rose-950/40 border border-rose-900/20',
        accent: 'from-rose-600 to-rose-400',
    },
};

const sizeStyles: Record<SpinnerSize, { spinner: string; title: string; subtitle: string }> = {
    sm: {
        spinner: 'h-10 w-10 border-[3px]',
        title: 'text-sm',
        subtitle: 'text-xs',
    },
    md: {
        spinner: 'h-12 w-12 border-[3px]',
        title: 'text-base',
        subtitle: 'text-sm',
    },
    lg: {
        spinner: 'h-14 w-14 border-[4px]',
        title: 'text-lg',
        subtitle: 'text-sm',
    },
};

function Spinner({
    title = 'Cargando...',
    subtitle = 'Procesando la información',
    className = '',
    variant = 'default',
    size = 'md',
    progress,
    autoProgress = true,
    showProgressBar = true,
}: SpinnerProps) {
    const [internalProgress, setInternalProgress] = useState(12);
    const styles = variantStyles[variant];
    const sizeClasses = sizeStyles[size];

    useEffect(() => {
        if (typeof progress === 'number' || !autoProgress) return;

        const interval = window.setInterval(() => {
            setInternalProgress((current) => (current >= 88 ? 88 : current + 4));
        }, 280);

        return () => window.clearInterval(interval);
    }, [autoProgress, progress]);

    const displayProgress = useMemo(() => {
        if (typeof progress === 'number') return Math.min(Math.max(progress, 0), 100);
        return internalProgress;
    }, [internalProgress, progress]);

    return (
        <div
            className={`flex w-full max-w-sm flex-col items-center justify-center rounded-lg border border-border-dark bg-bg-card px-6 py-6 text-center shadow-2xl ${className}`}
            role="status"
            aria-live="polite"
            aria-label={title}
        >
            <div className={`relative ${sizeClasses.spinner}`}>
                <div className={`absolute inset-0 rounded-full border-2 border-transparent ${styles.spinner} ${styles.glow}`} />
                <div className={`absolute inset-0 rounded-full border-2 border-transparent border-t-current ${styles.spinner} animate-spin`} />
                <div className="absolute inset-1 rounded-full bg-bg-card" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[9px] font-bold text-gray-300">{displayProgress}%</span>
                </div>
            </div>

            <div className="mt-4 flex w-full flex-col items-center gap-1">
                <span className={`font-semibold text-white tracking-wide ${sizeClasses.title}`}>{title}</span>
                <span className={`text-gray-400 ${sizeClasses.subtitle}`}>{subtitle}</span>
            </div>

            {showProgressBar && (
                <div className="mt-4 w-full">
                    <div className={`h-1.5 w-full overflow-hidden rounded-full ${styles.track}`}>
                        <div
                            className={`h-full rounded-full bg-gradient-to-r ${styles.accent} transition-all duration-300 ease-out`}
                            style={{ width: `${displayProgress}%` }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default Spinner;

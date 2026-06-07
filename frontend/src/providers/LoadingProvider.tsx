import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import Spinner from '../components/Spinner';
import { LoadingContext, type LoadingConfig } from '../context/loadingContext';

interface LoadingProviderProps {
  children: ReactNode;
}

function LoadingProvider({ children }: LoadingProviderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingConfig, setLoadingConfig] = useState<LoadingConfig | null>(null);

  const showLoading = (config: LoadingConfig = {}) => {
    setLoadingConfig(config);
    setIsLoading(true);
  };

  const hideLoading = () => {
    setIsLoading(false);
    setLoadingConfig(null);
  };

  const setLoading = (value: boolean, config: LoadingConfig = {}) => {
    setLoadingConfig(value ? config : null);
    setIsLoading(value);
  };

  useEffect(() => {
    document.body.style.overflow = isLoading ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isLoading]);

  const value = useMemo(() => ({
    isLoading,
    loadingConfig,
    showLoading,
    hideLoading,
    setLoading,
  }), [isLoading, loadingConfig]);

  return (
    <LoadingContext.Provider value={value}>
      {children}
      {isLoading && loadingConfig && createPortal(
        <div className="fixed inset-0 z-70 flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur-sm">
          <div className="rounded-3xl border border-slate-700/70 bg-[#07090f]/95 p-5 shadow-2xl">
            <Spinner
              title={loadingConfig.title ?? 'Cargando...'}
              subtitle={loadingConfig.subtitle ?? 'Procesando la información'}
              variant={loadingConfig.variant ?? 'default'}
              size={loadingConfig.size ?? 'md'}
              progress={loadingConfig.progress}
              autoProgress={loadingConfig.autoProgress ?? true}
              showProgressBar={loadingConfig.showProgressBar ?? true}
              className={loadingConfig.className ?? ''}
            />
          </div>
        </div>,
        document.body
      )}
    </LoadingContext.Provider>
  );
}

export default LoadingProvider;

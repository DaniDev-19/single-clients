import { createContext } from 'react';
import type { SpinnerSize, SpinnerVariant } from '../components/Spinner';

export interface LoadingConfig {
  title?: string;
  subtitle?: string;
  variant?: SpinnerVariant;
  size?: SpinnerSize;
  progress?: number;
  autoProgress?: boolean;
  showProgressBar?: boolean;
  className?: string;
}

export interface LoadingContextValue {
  isLoading: boolean;
  loadingConfig: LoadingConfig | null;
  showLoading: (config?: LoadingConfig) => void;
  hideLoading: () => void;
  setLoading: (value: boolean, config?: LoadingConfig) => void;
}

export const LoadingContext = createContext<LoadingContextValue | null>(null);

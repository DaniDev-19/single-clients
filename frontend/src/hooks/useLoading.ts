import { useContext } from 'react';
import { LoadingContext } from '../context/loadingContext';

export function useLoading() {
  const context = useContext(LoadingContext);

  if (!context) {
    throw new Error('useLoading debe usarse dentro de LoadingProvider');
  }

  return context;
}

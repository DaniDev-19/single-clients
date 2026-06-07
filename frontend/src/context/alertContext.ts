import { createContext } from 'react';
import type { AlertItem } from '../providers/AlertasProvider';

interface AlertContextValue {
  showAlert: (alert: Omit<AlertItem, 'id'>) => void;
  dismissAlert: (id: number) => void;
  dismissAll: () => void;
}

export const AlertContext = createContext<AlertContextValue | null>(null);

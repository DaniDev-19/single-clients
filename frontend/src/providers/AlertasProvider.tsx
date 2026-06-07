import { useCallback, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import Alert, { type AlertVariant } from '../components/Alert';
import { AlertContext } from '../context/alertContext';

export interface AlertItem {
  id: number;
  title: ReactNode;
  description?: ReactNode;
  variant?: AlertVariant;
  duration?: number;
  closable?: boolean;
  actionLabel?: string;
  onAction?: () => void;
}

let alertId = 0;

function AlertasProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  const dismissAlert = useCallback((id: number) => {
    setAlerts((current) => current.filter((alert) => alert.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setAlerts([]);
  }, []);

  const showAlert = useCallback((alert: Omit<AlertItem, 'id'>) => {
    const id = ++alertId;
    const item: AlertItem = {
      id,
      duration: alert.duration ?? 5000,
      closable: alert.closable ?? true,
      variant: alert.variant ?? 'default',
      ...alert,
    };

    setAlerts((current) => [...current, item]);

    if (item.duration && item.duration > 0) {
      window.setTimeout(() => {
        dismissAlert(id);
      }, item.duration);
    }
  }, [dismissAlert]);

  const value = useMemo(() => ({
    showAlert,
    dismissAlert,
    dismissAll,
  }), [dismissAlert, dismissAll, showAlert]);

  return (
    <AlertContext.Provider value={value}>
      {children}
      {createPortal(
        <div className="pointer-events-none fixed inset-0 z-60 flex items-end justify-center px-4 py-4 sm:items-start sm:justify-end">
          <div className="flex w-full max-w-md flex-col gap-2">
            {alerts.map((alert) => (
              <div key={alert.id} className="pointer-events-auto">
                <Alert
                  title={alert.title}
                  description={alert.description}
                  variant={alert.variant}
                  onClose={() => dismissAlert(alert.id)}
                  onAction={() => {
                    alert.onAction?.();
                    dismissAlert(alert.id);
                  }}
                  actionLabel={alert.actionLabel}
                  closable={alert.closable}
                />
              </div>
            ))}
          </div>
        </div>,
        document.body
      )}
    </AlertContext.Provider>
  );
}

export default AlertasProvider;

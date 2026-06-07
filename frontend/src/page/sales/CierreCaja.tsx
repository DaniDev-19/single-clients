import { useState, useMemo } from 'react';
import Buttons from '../../components/ui/Buttons';
import Inputs from '../../components/ui/Inputs';
import TextArea from '../../components/ui/TextArea';
import Cards from '../../components/Cards';
import { Modal } from '../../components/Modal';
import { useAlert } from '../../hooks/useAlert';
import { useLoading } from '../../hooks/useLoading';

function CierreCaja() {
  const { showAlert } = useAlert();
  const { showLoading, hideLoading } = useLoading();

  const initialStats = {
    expectedCash: 1250.00,
    cardSales: 820.00,
    expenses: 140.00,
  };

  const expectedDrawerCash = initialStats.expectedCash - initialStats.expenses;

  const [realCashInput, setRealCashInput] = useState('');
  const [notes, setNotes] = useState('');
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [closedSummary, setClosedSummary] = useState<{ realCash: number; difference: number } | null>(null);
  const [isDrawerClosed, setIsDrawerClosed] = useState(false);

  const realCashAmount = useMemo(() => {
    const parsed = parseFloat(realCashInput);
    return isNaN(parsed) ? 0 : parsed;
  }, [realCashInput]);

  const difference = useMemo(() => {
    if (!realCashInput) return 0;
    return realCashAmount - expectedDrawerCash;
  }, [realCashInput, realCashAmount, expectedDrawerCash]);

  const differenceStatus = useMemo(() => {
    if (!realCashInput) return 'idle';
    if (difference === 0) return 'balanced';
    if (difference > 0) return 'surplus';
    return 'shortage';
  }, [realCashInput, difference]);

  const handleCloseDrawer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!realCashInput) {
      showAlert({ title: 'Error', description: 'Por favor ingrese el monto real contado en caja.', variant: 'danger' });
      return;
    }

    showLoading({ title: 'Conciliando caja', subtitle: 'Verificando cuadratura e imprimiendo arqueo...' });

    setTimeout(() => {
      hideLoading();
      setClosedSummary({
        realCash: realCashAmount,
        difference: difference,
      });
      setIsDrawerClosed(true);
      setIsSuccessOpen(true);
      showAlert({ title: 'Caja Cerrada', description: 'El arqueo de caja se registró exitosamente.', variant: 'success' });
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-white uppercase">Cierre de Caja</h1>
        <p className="mt-1 text-xs text-gray-400">Conciliación de arqueo diario, flujo de egresos en efectivo y reporte de diferencias.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Cards title="Ventas Efectivo Esperadas" value={`$${initialStats.expectedCash.toFixed(2)}`} variant="soft" />
        <Cards title="Ventas Tarjeta / Transf." value={`$${initialStats.cardSales.toFixed(2)}`} variant="soft" />
        <Cards title="Egresos / Gastos Caja" value={`$${initialStats.expenses.toFixed(2)}`} variant="danger" />
        <Cards title="Efectivo Neto Esperado" value={`$${expectedDrawerCash.toFixed(2)}`} variant="accent" />
      </div>

      {isDrawerClosed ? (
        <section className="rounded-lg border border-emerald-950 bg-emerald-950/10 p-6 text-center space-y-4 max-w-lg mx-auto">
          <div className="h-12 w-12 rounded-full bg-emerald-900/30 text-emerald-400 flex items-center justify-center text-xl font-bold mx-auto">✓</div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">Caja Cerrada para este Turno</h2>
            <p className="text-xs text-gray-400 mt-1">El proceso de conciliación del día se ha completado con éxito.</p>
          </div>
          <div className="border border-border-dark bg-bg-card p-4 rounded text-left space-y-2 text-xs">
            <div className="flex justify-between"><span className="text-gray-400">Efectivo Contado:</span><span className="text-white font-bold">${closedSummary?.realCash.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Diferencia:</span><span className={`font-bold ${closedSummary && closedSummary.difference >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{closedSummary && closedSummary.difference >= 0 ? '+' : ''}${closedSummary?.difference.toFixed(2)}</span></div>
          </div>
          <Buttons variant="secondary" onClick={() => setIsDrawerClosed(false)}>
            Reabrir Turno (Simulación)
          </Buttons>
        </section>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="rounded-lg border border-border-dark bg-bg-card p-4 sm:p-6 shadow-md">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white border-b border-border-dark/60 pb-3 mb-4">Registro de Arqueo</h2>
            <form onSubmit={handleCloseDrawer} className="space-y-4">
              <Inputs
                label="Efectivo Real en Caja ($)"
                type="number"
                step="0.01"
                value={realCashInput}
                onChange={setRealCashInput}
                placeholder="Ej. 1110.00"
                required
              />
              <TextArea
                label="Notas / Observaciones del Cierre"
                value={notes}
                onChange={setNotes}
                placeholder="Describa si hubo gastos no registrados o motivos de discrepancia..."
              />
              <Buttons type="submit" variant="primary" className="w-full justify-center">
                Realizar Cierre de Caja
              </Buttons>
            </form>
          </section>

          <section className="rounded-lg border border-border-dark bg-bg-card p-4 sm:p-6 shadow-md flex flex-col justify-between">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-white border-b border-border-dark/60 pb-3 mb-4">Resultado de Conciliación</h2>
              <div className="space-y-4 text-xs">
                <div className="flex justify-between py-1.5 border-b border-border-dark/30">
                  <span className="text-gray-400">Total Esperado:</span>
                  <span className="text-white font-bold">${expectedDrawerCash.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border-dark/30">
                  <span className="text-gray-400">Total Contado:</span>
                  <span className="text-white font-bold">${realCashAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border-dark/30">
                  <span className="text-gray-400">Diferencia:</span>
                  <span className={`font-bold ${difference >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {difference >= 0 ? '+' : ''}${difference.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              {differenceStatus === 'idle' && (
                <div className="border border-border-dark bg-bg-panel/40 p-4 rounded text-xs text-center text-gray-500">
                  Ingrese el efectivo contado para evaluar el cuadre de caja.
                </div>
              )}

              {differenceStatus === 'balanced' && (
                <div className="border border-emerald-950 bg-emerald-950/10 p-4 rounded text-xs text-center text-emerald-400 font-semibold">
                  Caja cuadradada perfectamente. El saldo reportado coincide con el esperado.
                </div>
              )}

              {differenceStatus === 'surplus' && (
                <div className="border border-amber-950 bg-amber-950/10 p-4 rounded text-xs text-center text-amber-400">
                  Sobrante de <strong className="text-white">${difference.toFixed(2)}</strong> detectado en caja. Revise si hay cobros en efectivo omitidos.
                </div>
              )}

              {differenceStatus === 'shortage' && (
                <div className="border border-red-950 bg-red-950/10 p-4 rounded text-xs text-center text-red-400">
                  Faltante de <strong className="text-white">${Math.abs(difference).toFixed(2)}</strong> detectado en caja. Verifique salidas de efectivo no registradas.
                </div>
              )}
            </div>
          </section>
        </div>
      )}

      <Modal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        title="Arqueo Guardado con Éxito"
        variant="success"
        showActions={true}
        actions={[
          { label: 'Cerrar ventana', onClick: () => setIsSuccessOpen(false), variant: 'primary' },
        ]}
      >
        <div className="space-y-3 text-xs">
          <p>Se ha registrado el cierre de caja de manera exitosa en el libro contable de la empresa.</p>
          <div className="border border-border-dark bg-bg-panel p-3 rounded space-y-1">
            <div className="flex justify-between"><span className="text-gray-400">Fecha y Hora:</span><span className="text-white">2026-06-07 09:56</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Cajero:</span><span className="text-white">Usuario de Turno</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Diferencia Final:</span><span className={`font-bold ${closedSummary && closedSummary.difference >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{closedSummary && closedSummary.difference >= 0 ? 'Balanced' : 'Discrepancia'}</span></div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default CierreCaja;

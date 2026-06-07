import { useState, useMemo } from 'react';
import Table from '../../components/Table';
import Cards from '../../components/Cards';
import SearchInput from '../../components/ui/SearchInput';
import Buttons from '../../components/ui/Buttons';
import Inputs from '../../components/ui/Inputs';
import Selects from '../../components/ui/Selects';
import { Modal } from '../../components/Modal';
import { useAlert } from '../../hooks/useAlert';
import { useLoading } from '../../hooks/useLoading';

interface Installment {
  number: number;
  dueDate: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  paymentDate?: string;
  paymentMethod?: string;
}

interface CreditAccount {
  id: number;
  clientName: string;
  clientRif: string;
  totalDebt: number;
  paidAmount: number;
  status: 'pending' | 'overdue' | 'settled';
  installments: Installment[];
}

function Creditos() {
  const { showAlert } = useAlert();
  const { showLoading, hideLoading } = useLoading();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'overdue' | 'settled'>('all');
  const [exchangeRate] = useState(530.00);

  const [activeAccount, setActiveAccount] = useState<CreditAccount | null>(null);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState('Efectivo Divisa ($)');
  const [payRef, setPayRef] = useState('');

  const [accounts, setAccounts] = useState<CreditAccount[]>([
    {
      id: 1,
      clientName: 'Carlos Ruiz',
      clientRif: 'V-12948192-3',
      totalDebt: 400.00,
      paidAmount: 200.00,
      status: 'pending',
      installments: [
        { number: 1, dueDate: '2026-05-15', amount: 100.00, status: 'paid', paymentDate: '2026-05-14', paymentMethod: 'Pago Móvil' },
        { number: 2, dueDate: '2026-06-01', amount: 100.00, status: 'paid', paymentDate: '2026-06-01', paymentMethod: 'Efectivo Divisa ($)' },
        { number: 3, dueDate: '2026-06-15', amount: 100.00, status: 'pending' },
        { number: 4, dueDate: '2026-07-01', amount: 100.00, status: 'pending' },
      ],
    },
    {
      id: 2,
      clientName: 'Ana García',
      clientRif: 'V-18491823-1',
      totalDebt: 150.00,
      paidAmount: 50.00,
      status: 'overdue',
      installments: [
        { number: 1, dueDate: '2026-05-20', amount: 50.00, status: 'paid', paymentDate: '2026-05-20', paymentMethod: 'Cashea' },
        { number: 2, dueDate: '2026-06-05', amount: 50.00, status: 'overdue' },
        { number: 3, dueDate: '2026-06-20', amount: 50.00, status: 'pending' },
      ],
    },
    {
      id: 3,
      clientName: 'Distribuidora Fénix C.A.',
      clientRif: 'J-30948192-9',
      totalDebt: 1200.00,
      paidAmount: 1200.00,
      status: 'settled',
      installments: [
        { number: 1, dueDate: '2026-05-10', amount: 600.00, status: 'paid', paymentDate: '2026-05-09', paymentMethod: 'Transferencia' },
        { number: 2, dueDate: '2026-05-25', amount: 600.00, status: 'paid', paymentDate: '2026-05-25', paymentMethod: 'Transferencia' },
      ],
    },
    {
      id: 4,
      clientName: 'Pedro López',
      clientRif: 'V-9234812-4',
      totalDebt: 300.00,
      paidAmount: 0,
      status: 'pending',
      installments: [
        { number: 1, dueDate: '2026-06-15', amount: 150.00, status: 'pending' },
        { number: 2, dueDate: '2026-06-30', amount: 150.00, status: 'pending' },
      ],
    },
  ]);

  const stats = useMemo(() => {
    let pendingSum = 0;
    let overdueSum = 0;
    let accountsCount = 0;

    accounts.forEach((acc) => {
      const remaining = acc.totalDebt - acc.paidAmount;
      if (acc.status === 'overdue') {
        overdueSum += remaining;
      } else if (acc.status === 'pending') {
        pendingSum += remaining;
      }
      if (remaining > 0) {
        accountsCount++;
      }
    });

    return {
      pendingDebt: pendingSum,
      overdueDebt: overdueSum,
      activeClients: accountsCount,
    };
  }, [accounts]);

  const filteredAccounts = useMemo(() => {
    return accounts.filter((acc) => {
      const matchesSearch = acc.clientName.toLowerCase().includes(searchQuery.toLowerCase()) || acc.clientRif.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = selectedStatus === 'all' || acc.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [accounts, searchQuery, selectedStatus]);

  const handleRegisterPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAccount) return;

    const amount = parseFloat(payAmount);
    if (isNaN(amount) || amount <= 0) {
      showAlert({ title: 'Monto inválido', description: 'Por favor ingrese un monto superior a 0.', variant: 'warning' });
      return;
    }

    const remaining = activeAccount.totalDebt - activeAccount.paidAmount;
    if (amount > remaining) {
      showAlert({ title: 'Exceso de pago', description: `El abono supera el balance de deuda pendiente de $${remaining.toFixed(2)}.`, variant: 'danger' });
      return;
    }

    showLoading({ title: 'Registrando Abono', subtitle: 'Procesando pago de cuota y actualizando saldos...' });

    setTimeout(() => {
      hideLoading();

      setAccounts((prev) =>
        prev.map((acc) => {
          if (acc.id === activeAccount.id) {
            const updatedPaid = acc.paidAmount + amount;
            const isSettled = updatedPaid >= acc.totalDebt;
            let updatedStatus: 'pending' | 'overdue' | 'settled' = isSettled ? 'settled' : acc.status;

            let remainingPayment = amount;
            const updatedInstallments = acc.installments.map((inst) => {
              if (inst.status !== 'paid' && remainingPayment > 0) {
                if (remainingPayment >= inst.amount) {
                  remainingPayment -= inst.amount;
                  return { ...inst, status: 'paid' as const, paymentDate: '2026-06-07', paymentMethod: payMethod };
                } else {
                  inst.amount -= remainingPayment;
                  remainingPayment = 0;
                  return inst;
                }
              }
              return inst;
            });

            const hasOverdue = updatedInstallments.some(i => i.status === 'overdue');
            if (!isSettled) {
              updatedStatus = hasOverdue ? 'overdue' : 'pending';
            }

            const updatedAcc = {
              ...acc,
              paidAmount: updatedPaid,
              status: updatedStatus,
              installments: updatedInstallments,
            };

            setActiveAccount(updatedAcc);
            return updatedAcc;
          }
          return acc;
        })
      );

      showAlert({
        title: 'Pago registrado',
        description: `Se registró correctamente el abono de $${amount.toFixed(2)} (${(amount * exchangeRate).toLocaleString()} Bs) vía ${payMethod}.`,
        variant: 'success',
      });

      setPayAmount('');
      setPayRef('');
      setIsPayModalOpen(false);
    }, 1200);
  };

  const tableRows = filteredAccounts.map((acc) => {
    const remaining = acc.totalDebt - acc.paidAmount;
    const paidInstallments = acc.installments.filter((i) => i.status === 'paid').length;
    const totalInstallments = acc.installments.length;

    return {
      client: (
        <div>
          <span className="text-white font-semibold block">{acc.clientName}</span>
          <span className="text-[10px] text-gray-500 font-mono">{acc.clientRif}</span>
        </div>
      ),
      totals: (
        <div>
          <span className="text-gray-400 font-medium block">Total: ${acc.totalDebt.toFixed(2)}</span>
          <span className="text-[10px] text-purple-400 font-semibold">Bs: {(acc.totalDebt * exchangeRate).toLocaleString()} Bs</span>
        </div>
      ),
      balances: (
        <div>
          <span className="text-emerald-400 font-bold block">Abonado: ${acc.paidAmount.toFixed(2)}</span>
          <span className="text-red-400 font-bold block">Resta: ${remaining.toFixed(2)}</span>
        </div>
      ),
      installments: (
        <span className="text-xs text-gray-300 font-semibold">
          {paidInstallments} / {totalInstallments} cuotas
        </span>
      ),
      status: (
        <span
          className={`inline-block border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded ${
            acc.status === 'settled'
              ? 'border-emerald-900 bg-emerald-950/20 text-emerald-400'
              : acc.status === 'overdue'
              ? 'border-red-900 bg-red-950/20 text-red-400'
              : 'border-yellow-900 bg-yellow-950/20 text-yellow-400'
          }`}
        >
          {acc.status === 'settled' ? 'Saldado' : acc.status === 'overdue' ? 'Vencido' : 'Pendiente'}
        </span>
      ),
      actions: (
        <Buttons
          variant="secondary"
          className="text-[10px] uppercase font-bold py-1 px-2.5 cursor-pointer"
          onClick={() => setActiveAccount(acc)}
        >
          Detalle / Abono
        </Buttons>
      ),
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-white uppercase">Créditos & Fiados</h1>
        <p className="mt-1 text-xs text-gray-400">Control de deudas de clientes, amortización en cuotas y registro de abonos en multividisa.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Cards title="Por Cobrar (Pendiente)" value={`$${stats.pendingDebt.toFixed(2)}`} variant="default" />
        <Cards title="Cartera Vencida (Alerta)" value={`$${stats.overdueDebt.toFixed(2)}`} variant="accent" />
        <Cards title="Clientes con Deuda Activa" value={stats.activeClients.toString()} variant="soft" />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border-dark/60 pb-4">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Buscar cliente por nombre o RIF..."
          className="max-w-xs"
        />

        <div className="flex flex-wrap gap-1">
          {[
            { key: 'all', label: 'Todos' },
            { key: 'pending', label: 'Pendientes' },
            { key: 'overdue', label: 'Vencidos' },
            { key: 'settled', label: 'Saldados' },
          ].map((statusTab) => (
            <button
              key={statusTab.key}
              type="button"
              onClick={() => setSelectedStatus(statusTab.key as any)}
              className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded border transition cursor-pointer ${
                selectedStatus === statusTab.key
                  ? 'border-purple-600 bg-purple-950/20 text-purple-400'
                  : 'border-border-dark bg-bg-card text-gray-400 hover:text-white'
              }`}
            >
              {statusTab.label}
            </button>
          ))}
        </div>
      </div>

      <Table
        title="Cuentas por Cobrar"
        button={
          <Buttons
            variant="primary"
            className="text-[10px] uppercase font-bold py-1.5 px-3 cursor-pointer"
            onClick={() => showAlert({ title: 'Exportar Datos', description: 'Simulando exportación de cartera de clientes fiados en formato CSV/Excel.', variant: 'success' })}
          >
            Exportar Reporte
          </Buttons>
        }
        data={tableRows}
        columns={['client', 'totals', 'balances', 'installments', 'status', 'actions']}
      />

      <Modal
        isOpen={activeAccount !== null}
        onClose={() => setActiveAccount(null)}
        title="Historial de Cuotas y Amortizaciones"
        showActions={true}
        actions={[
          ...(activeAccount && activeAccount.totalDebt - activeAccount.paidAmount > 0
            ? [{ label: 'Registrar Abono', onClick: () => setIsPayModalOpen(true), variant: 'primary' as const }]
            : []),
          { label: 'Cerrar', onClick: () => setActiveAccount(null), variant: 'secondary' as const }
        ]}
      >
        {activeAccount && (
          <div className="space-y-4 text-xs text-gray-300">
            <div className="grid grid-cols-2 gap-4 border-b border-border-dark pb-3">
              <div>
                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Deudor</span>
                <p className="text-white font-bold">{activeAccount.clientName}</p>
                <p className="text-[9px] text-gray-500 font-mono mt-0.5">{activeAccount.clientRif}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Saldo Pendiente</span>
                <p className="text-red-400 font-black text-sm">${(activeAccount.totalDebt - activeAccount.paidAmount).toFixed(2)}</p>
                <p className="text-[10px] text-gray-500 mt-0.5">Bs: {((activeAccount.totalDebt - activeAccount.paidAmount) * exchangeRate).toLocaleString()} Bs</p>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] text-purple-400 uppercase font-bold tracking-wider block">Cronograma de Cuotas</span>
              <div className="border border-border-dark bg-bg-panel/20 rounded-md overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border-dark text-gray-500 uppercase text-[9px] font-bold bg-black/10">
                      <th className="p-2.5">Cuota</th>
                      <th className="p-2.5">Vence</th>
                      <th className="p-2.5 text-right">Monto</th>
                      <th className="p-2.5 text-center">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-dark/40 text-gray-300">
                    {activeAccount.installments.map((inst) => (
                      <tr key={inst.number}>
                        <td className="p-2.5 font-bold">Cuota #{inst.number}</td>
                        <td className="p-2.5">{inst.dueDate}</td>
                        <td className="p-2.5 text-right font-semibold">
                          <div>${inst.amount.toFixed(2)}</div>
                          <div className="text-[9px] text-gray-500">{(inst.amount * exchangeRate).toLocaleString()} Bs</div>
                        </td>
                        <td className="p-2.5 text-center">
                          <span
                            className={`inline-block border px-1.5 py-0.5 text-[8px] font-bold uppercase rounded ${
                              inst.status === 'paid'
                                ? 'border-emerald-900 bg-emerald-950/20 text-emerald-400'
                                : inst.status === 'overdue'
                                ? 'border-red-900 bg-red-950/20 text-red-400'
                                : 'border-yellow-900 bg-yellow-950/20 text-yellow-400'
                            }`}
                          >
                            {inst.status === 'paid' ? 'Pagada' : inst.status === 'overdue' ? 'Vencida' : 'Pendiente'}
                          </span>
                          {inst.paymentDate && (
                            <span className="block text-[8px] text-gray-500 mt-0.5 font-sans">
                              {inst.paymentDate} ({inst.paymentMethod})
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        title="Registrar Abono a Crédito"
        showActions={false}
      >
        {activeAccount && (
          <form onSubmit={handleRegisterPayment} className="space-y-4">
            <div className="bg-bg-panel/40 border border-border-dark p-3 rounded text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-gray-400">Deuda Restante:</span>
                <span className="text-white font-bold">${(activeAccount.totalDebt - activeAccount.paidAmount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total en Bolívares:</span>
                <span className="text-purple-400 font-bold">{((activeAccount.totalDebt - activeAccount.paidAmount) * exchangeRate).toLocaleString()} Bs</span>
              </div>
            </div>

            <Inputs
              label="Monto del Abono ($)"
              type="number"
              step="0.01"
              value={payAmount}
              onChange={setPayAmount}
              placeholder="0.00"
              required
            />

            {payAmount && !isNaN(parseFloat(payAmount)) && (
              <div className="text-[10px] text-purple-400 font-bold uppercase tracking-wider pl-1">
                Equivalente: {(parseFloat(payAmount) * exchangeRate).toLocaleString()} Bs.
              </div>
            )}

            <Selects
              label="Método de Pago"
              value={payMethod}
              onChange={setPayMethod}
              options={['Efectivo Divisa ($)', 'Efectivo Bs.', 'Pago Móvil', 'Transferencia', 'Cashea', 'Tarjeta Débito/Crédito']}
            />

            <Inputs
              label="Referencia / Comentarios"
              value={payRef}
              onChange={setPayRef}
              placeholder="Ej. Pago móvil ref 92838 o Efectivo"
            />

            <div className="flex gap-2 justify-end pt-3">
              <Buttons type="button" variant="secondary" onClick={() => setIsPayModalOpen(false)}>
                Cancelar
              </Buttons>
              <Buttons type="submit" variant="primary">
                Confirmar Abono
              </Buttons>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}

export default Creditos;

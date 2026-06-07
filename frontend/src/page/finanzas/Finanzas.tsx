import { useState } from 'react';
import Table from '../../components/Table';
import Buttons from '../../components/ui/Buttons';
import Inputs from '../../components/ui/Inputs';
import Selects from '../../components/ui/Selects';
import { Modal } from '../../components/Modal';
import { useAlert } from '../../hooks/useAlert';
import { useLoading } from '../../hooks/useLoading';

interface FinancialRecord {
  id: number;
  concept: string;
  type: 'income' | 'expense';
  amount: number;
  date: string;
  status: 'completed' | 'pending';
}

function Finanzas() {
  const { showAlert } = useAlert();
  const { showLoading, hideLoading } = useLoading();

  const [records, setRecords] = useState<FinancialRecord[]>([
    { id: 1, concept: 'Cobro Factura - Acme Corp (SaaS)', type: 'income', amount: 3500.0, date: '2026-06-05', status: 'completed' },
    { id: 2, concept: 'Servicios de Infraestructura AWS', type: 'expense', amount: 840.0, date: '2026-06-04', status: 'completed' },
    { id: 3, concept: 'Cobro Factura - Globex Inc', type: 'income', amount: 4800.0, date: '2026-06-03', status: 'completed' },
    { id: 4, concept: 'Compra Equipamiento Laptop IT', type: 'expense', amount: 1200.0, date: '2026-06-02', status: 'completed' },
    { id: 5, concept: 'Licencias de Software de Diseño', type: 'expense', amount: 150.0, date: '2026-06-01', status: 'pending' },
    { id: 6, concept: 'Cobro Consultoría - Stark Industries', type: 'income', amount: 7500.0, date: '2026-05-28', status: 'completed' },
  ]);

  const [isAddOpen, setIsAddOpen] = useState(false);

  const [conceptInput, setConceptInput] = useState('');
  const [typeInput, setTypeInput] = useState('income');
  const [amountInput, setAmountInput] = useState('');
  const [statusInput, setStatusInput] = useState('completed');

  const handleOpenAdd = () => {
    setConceptInput('');
    setTypeInput('income');
    setAmountInput('');
    setStatusInput('completed');
    setIsAddOpen(true);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(amountInput);

    if (!conceptInput || isNaN(amountVal)) {
      showAlert({ title: 'Error', description: 'Por favor complete todos los campos válidamente', variant: 'danger' });
      return;
    }

    setIsAddOpen(false);
    showLoading({ title: 'Registrando flujo financiero', subtitle: 'Guardando transacción en el libro diario...' });

    setTimeout(() => {
      const newRecord: FinancialRecord = {
        id: records.length ? Math.max(...records.map((r) => r.id)) + 1 : 1,
        concept: conceptInput,
        type: typeInput as any,
        amount: amountVal,
        date: new Date().toISOString().split('T')[0],
        status: statusInput as any,
      };
      setRecords((prev) => [newRecord, ...prev]);
      hideLoading();
      showAlert({ title: 'Registro completado', description: `Se guardó el registro de "${conceptInput}" exitosamente.`, variant: 'success' });
    }, 1200);
  };

  const getTypeBadge = (type: 'income' | 'expense') => {
    const styles = {
      income: 'border-emerald-900/30 bg-emerald-950/20 text-emerald-400',
      expense: 'border-red-900/30 bg-red-950/20 text-red-400',
    };
    return (
      <span className={`inline-block border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full ${styles[type]}`}>
        {type === 'income' ? 'Ingreso' : 'Egreso'}
      </span>
    );
  };

  const getStatusBadge = (status: 'completed' | 'pending') => {
    const styles = {
      completed: 'border-emerald-900/30 bg-emerald-950/20 text-emerald-400',
      pending: 'border-amber-900/30 bg-amber-950/20 text-amber-400',
    };
    return (
      <span className={`inline-block border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full ${styles[status]}`}>
        {status === 'completed' ? 'Completado' : 'Pendiente'}
      </span>
    );
  };

  const tableRows = records.map((rec) => ({
    id: <span className="font-semibold text-purple-400">#{rec.id}</span>,
    concept: <span className="font-semibold text-white">{rec.concept}</span>,
    type: getTypeBadge(rec.type),
    amount: (
      <span className={`font-bold ${rec.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
        {rec.type === 'income' ? '+' : '-'}${rec.amount.toFixed(2)}
      </span>
    ),
    date: <span className="text-gray-400">{rec.date}</span>,
    status: getStatusBadge(rec.status),
  }));

  const totalIncomes = records
    .filter((r) => r.type === 'income' && r.status === 'completed')
    .reduce((sum, r) => sum + r.amount, 0);

  const totalExpenses = records
    .filter((r) => r.type === 'expense' && r.status === 'completed')
    .reduce((sum, r) => sum + r.amount, 0);

  const balance = totalIncomes - totalExpenses;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white uppercase">Finanzas</h1>
          <p className="mt-1 text-xs text-gray-400">Contabilidad general, egresos, cobros facturados e ingresos acumulados.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="border border-border-dark bg-bg-card p-4 rounded-lg">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Ingresos Totales</span>
          <div className="text-lg font-bold text-emerald-400 mt-0.5">${totalIncomes.toFixed(2)}</div>
        </div>
        <div className="border border-border-dark bg-bg-card p-4 rounded-lg">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Egresos Totales</span>
          <div className="text-lg font-bold text-red-400 mt-0.5">${totalExpenses.toFixed(2)}</div>
        </div>
        <div className="border border-border-dark bg-bg-card p-4 rounded-lg">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Balance Contable</span>
          <div className={`text-lg font-bold mt-0.5 ${balance >= 0 ? 'text-purple-400' : 'text-red-400'}`}>
            ${balance.toFixed(2)}
          </div>
        </div>
      </div>

      <Table
        title="Libro Contable Diario"
        button={
          <Buttons variant="primary" size="sm" onClick={handleOpenAdd}>
            Registrar Operación
          </Buttons>
        }
        data={tableRows}
        columns={['id', 'concept', 'type', 'amount', 'date', 'status']}
      />

      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Registrar Movimiento Financiero"
        onSubmit={handleAddSubmit}
        primaryButtonText="Guardar Movimiento"
      >
        <div className="space-y-4">
          <Inputs
            label="Concepto / Descripción"
            value={conceptInput}
            onChange={setConceptInput}
            placeholder="Ej. Compra de Servidor"
            required
          />
          <Selects
            label="Tipo de Movimiento"
            value={typeInput}
            onChange={setTypeInput}
            options={['income', 'expense']}
            placeholder="Seleccione el tipo"
          />
          <Inputs
            label="Monto Total ($)"
            type="number"
            step="0.01"
            value={amountInput}
            onChange={setAmountInput}
            placeholder="Ej. 150.00"
            required
          />
          <Selects
            label="Estado Inicial"
            value={statusInput}
            onChange={setStatusInput}
            options={['completed', 'pending']}
            placeholder="Seleccione el estado"
          />
        </div>
      </Modal>
    </div>
  );
}

export default Finanzas;

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

interface Expense {
  id: number;
  date: string;
  category: string;
  description: string;
  amount: number;
  currency: 'USD' | 'Bs';
  reference?: string;
}

function Egresos() {
  const { showAlert } = useAlert();
  const { showLoading, hideLoading } = useLoading();

  const [expenses, setExpenses] = useState<Expense[]>([
    { id: 1, date: '2026-06-01', category: 'Inventario', description: 'Compra de víveres al mayor (Harina, Queso)', amount: 150.00, currency: 'USD', reference: 'Efectivo' },
    { id: 2, date: '2026-06-02', category: 'Servicios', description: 'Renovación de Hosting VPS (Servidor)', amount: 45.00, currency: 'USD', reference: 'Pago móvil' },
    { id: 3, date: '2026-06-04', category: 'Infraestructura', description: 'Alquiler mensual oficina técnica', amount: 300.00, currency: 'USD', reference: 'Transferencia' },
    { id: 4, date: '2026-06-05', category: 'Transporte', description: 'Combustible despacho delivery', amount: 7950.00, currency: 'Bs', reference: 'Biopago' },
    { id: 5, date: '2026-06-06', category: 'Suministros', description: 'Papel térmico para impresora de tickets (10 rollos)', amount: 12.00, currency: 'USD', reference: 'Efectivo' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [exchangeRate] = useState(530.00);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [descInput, setDescInput] = useState('');
  const [catInput, setCatInput] = useState('Inventario');
  const [amountInput, setAmountInput] = useState('');
  const [currInput, setCurrInput] = useState('USD');
  const [refInput, setRefInput] = useState('');

  const stats = useMemo(() => {
    let usdTotal = 0;
    let bsTotal = 0;

    expenses.forEach((ex) => {
      if (ex.currency === 'USD') {
        usdTotal += ex.amount;
        bsTotal += ex.amount * exchangeRate;
      } else {
        bsTotal += ex.amount;
        usdTotal += ex.amount / exchangeRate;
      }
    });

    return {
      usdTotal,
      bsTotal,
      count: expenses.length,
    };
  }, [expenses, exchangeRate]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((ex) => {
      const matchesSearch = ex.description.toLowerCase().includes(searchQuery.toLowerCase()) || ex.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = selectedCategory === 'all' || ex.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [expenses, searchQuery, selectedCategory]);

  const handleAddExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(amountInput);

    if (!descInput.trim() || isNaN(amountVal) || amountVal <= 0) {
      showAlert({ title: 'Campos inválidos', description: 'Por favor complete la descripción y especifique un monto correcto.', variant: 'warning' });
      return;
    }

    setIsAddOpen(false);
    showLoading({ title: 'Registrando Egreso', subtitle: 'Guardando registro de gasto administrativo...' });

    setTimeout(() => {
      const newExp: Expense = {
        id: expenses.length ? Math.max(...expenses.map((e) => e.id)) + 1 : 1,
        date: new Date().toISOString().split('T')[0],
        category: catInput,
        description: descInput,
        amount: amountVal,
        currency: currInput as any,
        reference: refInput || undefined,
      };

      setExpenses((prev) => [newExp, ...prev]);
      hideLoading();
      showAlert({
        title: 'Gasto Registrado',
        description: `Se guardó correctamente el egreso por $${currInput === 'USD' ? amountVal.toFixed(2) : (amountVal / exchangeRate).toFixed(2)}.`,
        variant: 'success',
      });

      setDescInput('');
      setAmountInput('');
      setRefInput('');
    }, 1200);
  };

  const tableRows = filteredExpenses.map((ex) => {
    const isUsd = ex.currency === 'USD';
    const usdEquivalent = isUsd ? ex.amount : ex.amount / exchangeRate;
    const bsEquivalent = isUsd ? ex.amount * exchangeRate : ex.amount;

    return {
      date: <span className="text-gray-400 font-mono">{ex.date}</span>,
      category: (
        <span className="inline-block border border-border-dark bg-bg-panel px-2 py-0.5 text-[9px] font-bold uppercase rounded text-gray-300">
          {ex.category}
        </span>
      ),
      description: <span className="text-white font-medium">{ex.description}</span>,
      totals: (
        <div>
          <span className="text-red-400 font-bold block">
            {isUsd ? `$${ex.amount.toFixed(2)}` : `${ex.amount.toLocaleString()} Bs`}
          </span>
          <span className="text-[10px] text-gray-500 block">
            {isUsd ? `${bsEquivalent.toLocaleString()} Bs` : `$${usdEquivalent.toFixed(2)}`}
          </span>
        </div>
      ),
      reference: <span className="text-gray-400 font-semibold">{ex.reference || '-'}</span>,
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white uppercase">Control de Egresos & Gastos</h1>
          <p className="mt-1 text-xs text-gray-400">Control de egresos operativos, adquisiciones y gastos del negocio en multividisa.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Cards title="Gasto Acumulado ($)" value={`$${stats.usdTotal.toFixed(2)}`} variant="accent" />
        <Cards title="Gasto Acumulado (Bs)" value={`${stats.bsTotal.toLocaleString()} Bs`} variant="default" />
        <Cards title="Transacciones de Egreso" value={stats.count.toString()} variant="soft" />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border-dark/60 pb-4">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Buscar gastos..."
          className="max-w-xs"
        />

        <div className="flex flex-wrap gap-1">
          {[
            { key: 'all', label: 'Todas las Categorías' },
            { key: 'Inventario', label: 'Inventario' },
            { key: 'Servicios', label: 'Servicios' },
            { key: 'Infraestructura', label: 'Alquiler/Oficina' },
            { key: 'Transporte', label: 'Transporte' },
          ].map((catTab) => (
            <button
              key={catTab.key}
              type="button"
              onClick={() => setSelectedCategory(catTab.key)}
              className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded border transition cursor-pointer ${
                selectedCategory === catTab.key
                  ? 'border-purple-600 bg-purple-950/20 text-purple-400'
                  : 'border-border-dark bg-bg-card text-gray-400 hover:text-white'
              }`}
            >
              {catTab.label}
            </button>
          ))}
        </div>
      </div>

      <Table
        title="Gastos Registrados"
        button={
          <Buttons variant="primary" size="sm" onClick={() => setIsAddOpen(true)}>
            Registrar Gasto
          </Buttons>
        }
        data={tableRows}
        columns={['date', 'category', 'description', 'totals', 'reference']}
      />

      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Registrar Gasto Administrativo"
        onSubmit={handleAddExpenseSubmit}
        primaryButtonText="Guardar Egreso"
      >
        <div className="space-y-4">
          <Inputs
            label="Descripción del Gasto"
            value={descInput}
            onChange={setDescInput}
            placeholder="Ej. Compra de resmas de papel para oficina o Repuestos de red"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Selects
              label="Categoría"
              value={catInput}
              onChange={setCatInput}
              options={['Inventario', 'Servicios', 'Infraestructura', 'Transporte', 'Suministros', 'Otros']}
            />
            <Selects
              label="Moneda"
              value={currInput}
              onChange={setCurrInput}
              options={['USD', 'Bs']}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Inputs
              label="Monto del Egreso"
              type="number"
              step="0.01"
              value={amountInput}
              onChange={setAmountInput}
              placeholder="0.00"
              required
            />
            <Inputs
              label="Referencia / Método"
              value={refInput}
              onChange={setRefInput}
              placeholder="Ej. Efectivo, Pago móvil ref 1928"
            />
          </div>

          {amountInput && !isNaN(parseFloat(amountInput)) && (
            <div className="text-[10px] text-purple-400 font-bold uppercase tracking-wider pl-1">
              Conversión estimada:{' '}
              {currInput === 'USD'
                ? `${(parseFloat(amountInput) * exchangeRate).toLocaleString()} Bs.`
                : `$${(parseFloat(amountInput) / exchangeRate).toFixed(2)} USD.`}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}

export default Egresos;

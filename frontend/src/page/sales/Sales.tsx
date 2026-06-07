import { useState, useMemo } from 'react';
import Table from '../../components/Table';
import Buttons from '../../components/ui/Buttons';
import Inputs from '../../components/ui/Inputs';
import Selects from '../../components/ui/Selects';
import SearchInput from '../../components/ui/SearchInput';
import { Modal } from '../../components/Modal';
import { useAlert } from '../../hooks/useAlert';
import { useLoading } from '../../hooks/useLoading';

interface SaleTransaction {
  id: number;
  txId: string;
  clientName: string;
  productName: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending' | 'refunded';
  paymentMethod?: string;
}

function Sales() {
  const { showAlert } = useAlert();
  const { showLoading, hideLoading } = useLoading();

  const [sales, setSales] = useState<SaleTransaction[]>([
    { id: 1, txId: 'TX-1092', clientName: 'John Doe', productName: 'Servidor VPS Linux Pro', amount: 199.0, date: '2026-06-05', status: 'paid', paymentMethod: 'Efectivo Divisas' },
    { id: 2, txId: 'TX-1093', clientName: 'Jane Smith', productName: 'Licencia SaaS Corporativa', amount: 49.0, date: '2026-06-04', status: 'paid', paymentMethod: 'Transferencia Bancaria' },
    { id: 3, txId: 'TX-1094', clientName: 'Carlos Ruiz', productName: 'Consultoría Especializada TI', amount: 1200.0, date: '2026-06-03', status: 'pending', paymentMethod: 'Pago Móvil' },
    { id: 4, txId: 'TX-1095', clientName: 'Ana García', productName: 'Soporte Cloud 24/7 Anual', amount: 599.0, date: '2026-06-02', status: 'paid', paymentMethod: 'Efectivo BS' },
    { id: 5, txId: 'TX-1096', clientName: 'Laura Pérez', productName: 'Firewall Hardware Enterprise', amount: 2499.0, date: '2026-05-28', status: 'refunded', paymentMethod: 'Cashea' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isRefundOpen, setIsRefundOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<SaleTransaction | null>(null);

  const [clientInput, setClientInput] = useState('');
  const [productInput, setProductInput] = useState('');
  const [amountInput, setAmountInput] = useState('');
  const [statusInput, setStatusInput] = useState('paid');
  const [methodInput, setMethodInput] = useState('Efectivo Divisas');

  const handleOpenAdd = () => {
    setClientInput('');
    setProductInput('');
    setAmountInput('');
    setStatusInput('paid');
    setMethodInput('Efectivo Divisas');
    setIsAddOpen(true);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(amountInput);

    if (!clientInput || !productInput || isNaN(amountVal)) {
      showAlert({ title: 'Error', description: 'Por favor complete todos los campos válidamente', variant: 'danger' });
      return;
    }

    setIsAddOpen(false);
    showLoading({ title: 'Registrando venta', subtitle: 'Procesando transacción...' });

    setTimeout(() => {
      const newSale: SaleTransaction = {
        id: sales.length ? Math.max(...sales.map((s) => s.id)) + 1 : 1,
        txId: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
        clientName: clientInput,
        productName: productInput,
        amount: amountVal,
        date: new Date().toISOString().split('T')[0],
        status: statusInput as any,
        paymentMethod: methodInput,
      };
      setSales((prev) => [newSale, ...prev]);
      hideLoading();
      showAlert({ title: 'Transacción exitosa', description: `Se registró la venta para ${clientInput} por $${amountVal.toFixed(2)}.`, variant: 'success' });
    }, 1200);
  };

  const handleOpenRefund = (sale: SaleTransaction) => {
    setSelectedSale(sale);
    setIsRefundOpen(true);
  };

  const handleRefundConfirm = () => {
    if (!selectedSale) return;
    setIsRefundOpen(false);
    showLoading({ title: 'Procesando reembolso', subtitle: 'Actualizando estado de la transacción...' });

    setTimeout(() => {
      setSales((prev) =>
        prev.map((s) =>
          s.id === selectedSale.id ? { ...s, status: 'refunded' } : s
        )
      );
      hideLoading();
      showAlert({ title: 'Reembolso completado', description: 'La transacción fue marcada como reembolsada.', variant: 'warning' });
    }, 1200);
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      paid: 'border-emerald-900/30 bg-emerald-950/20 text-emerald-400',
      pending: 'border-amber-900/30 bg-amber-950/20 text-amber-400',
      refunded: 'border-red-900/30 bg-red-950/20 text-red-400',
    };
    const labels: Record<string, string> = {
      paid: 'Pagado',
      pending: 'Pendiente',
      refunded: 'Reembolsado',
    };
    return (
      <span className={`inline-block border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full ${styles[status] ?? styles.pending}`}>
        {labels[status] ?? 'Pendiente'}
      </span>
    );
  };

  const filteredSales = useMemo(() => {
    return sales.filter((sale) => {
      const matchesSearch =
        sale.txId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sale.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sale.productName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || sale.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [sales, searchQuery, statusFilter]);

  const tableRows = filteredSales.map((sale) => ({
    txId: <span className="font-semibold text-purple-400">{sale.txId}</span>,
    client: <span className="font-semibold text-white">{sale.clientName}</span>,
    product: <span className="text-gray-300">{sale.productName}</span>,
    amount: <span className="font-bold text-white">${sale.amount.toFixed(2)}</span>,
    date: <span className="text-gray-400">{sale.date}</span>,
    status: getStatusBadge(sale.status),
    acciones: (
      <div className="flex items-center gap-1.5 justify-start">
        <button
          type="button"
          onClick={() => {
            setSelectedSale(sale);
            setIsDetailOpen(true);
          }}
          className="p-1 rounded border border-border-dark bg-bg-card text-gray-400 hover:text-white hover:border-purple-500/50 transition cursor-pointer"
          title="Ver Detalle Transacción (ID)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>

        {sale.status !== 'refunded' && (
          <Buttons
            variant="danger"
            size="sm"
            onClick={() => handleOpenRefund(sale)}
            title={`Refund sale ${sale.txId}`}
          >
            Reembolso
          </Buttons>
        )}
      </div>
    ),
  }));

  const totalRevenue = sales
    .filter((s) => s.status === 'paid')
    .reduce((sum, s) => sum + s.amount, 0);

  const filtersNode = (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between w-full">
      <SearchInput
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Buscar por ID, cliente o producto..."
      />

      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mr-1.5">Estado:</span>
        {[
          { key: 'all', label: 'Todos' },
          { key: 'paid', label: 'Pagado' },
          { key: 'pending', label: 'Pendiente' },
          { key: 'refunded', label: 'Reembolsado' },
        ].map((btn) => (
          <button
            key={btn.key}
            type="button"
            onClick={() => setStatusFilter(btn.key)}
            className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded border transition cursor-pointer ${
              statusFilter === btn.key
                ? 'border-purple-600 bg-purple-950/20 text-purple-400'
                : 'border-border-dark bg-bg-card text-gray-400 hover:text-white'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white uppercase">Historial de Ventas</h1>
          <p className="mt-1 text-xs text-gray-400">Historial de facturación y facturas registradas en la aplicación.</p>
        </div>
        <div className="border border-border-dark bg-bg-card p-4 rounded-lg flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Ingresos Totales (Pagados)</span>
            <div className="text-lg font-bold text-emerald-400 mt-0.5">${totalRevenue.toFixed(2)}</div>
          </div>
        </div>
      </div>

      <Table
        title="Historial de Transacciones"
        button={
          <Buttons variant="primary" size="sm" onClick={handleOpenAdd}>
            Registrar Venta
          </Buttons>
        }
        filters={filtersNode}
        data={tableRows}
        columns={['txId', 'client', 'product', 'amount', 'date', 'status', 'acciones']}
      />

      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Registrar Nueva Venta"
        onSubmit={handleAddSubmit}
        primaryButtonText="Registrar Venta"
      >
        <div className="space-y-4">
          <Inputs
            label="Cliente"
            value={clientInput}
            onChange={setClientInput}
            placeholder="Nombre del cliente"
            required
          />
          <Inputs
            label="Producto o Servicio"
            value={productInput}
            onChange={setProductInput}
            placeholder="Ej. Servidor VPS Linux Pro"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Inputs
              label="Monto Total ($)"
              type="number"
              step="0.01"
              value={amountInput}
              onChange={setAmountInput}
              placeholder="Ej. 199.00"
              required
            />
            <Selects
              label="Método de Pago"
              value={methodInput}
              onChange={setMethodInput}
              options={['Efectivo Divisas', 'Efectivo BS', 'Transferencia Bancaria', 'Pago Móvil', 'Cashea']}
              placeholder="Seleccionar método"
            />
          </div>
          <Selects
            label="Estado del Pago"
            value={statusInput}
            onChange={setStatusInput}
            options={['paid', 'pending']}
            placeholder="Seleccione el estado"
          />
        </div>
      </Modal>

      <Modal
        isOpen={isRefundOpen}
        onClose={() => setIsRefundOpen(false)}
        title="Confirmar Reembolso"
        variant="danger"
        showActions={true}
        actions={[
          { label: 'Cancelar', onClick: () => setIsRefundOpen(false), variant: 'secondary' },
          { label: 'Reembolsar Transacción', onClick: handleRefundConfirm, variant: 'danger' },
        ]}
      >
        <p className="text-sm">
          ¿Está seguro que desea reembolsar la transacción <strong className="text-white">{selectedSale?.txId}</strong> del cliente <strong className="text-white">{selectedSale?.clientName}</strong>? Esto marcará el pago como anulado.
        </p>
      </Modal>

      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title="Ficha Detallada de Venta (ID)"
        showActions={true}
        actions={[{ label: 'Cerrar', onClick: () => setIsDetailOpen(false), variant: 'secondary' }]}
      >
        {selectedSale && (
          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-border-dark pb-3">
              <div>
                <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider block">{selectedSale.txId}</span>
                <h4 className="text-sm font-bold text-white mt-0.5">{selectedSale.clientName}</h4>
              </div>
              {getStatusBadge(selectedSale.status)}
            </div>

            <div className="space-y-2.5">
              <div className="flex justify-between"><span className="text-gray-500 font-medium">Producto / Servicio:</span><span className="text-white font-semibold">{selectedSale.productName}</span></div>
              <div className="flex justify-between"><span className="text-gray-500 font-medium">Fecha Facturación:</span><span className="text-gray-300">{selectedSale.date}</span></div>
              <div className="flex justify-between"><span className="text-gray-500 font-medium">Método de Pago:</span><span className="text-purple-400 font-bold">{selectedSale.paymentMethod || 'Efectivo Divisas'}</span></div>
              <div className="flex justify-between border-t border-border-dark/60 pt-2"><span className="text-gray-500 font-medium">Subtotal:</span><span className="text-white font-semibold">${(selectedSale.amount / 1.16).toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500 font-medium">Impuesto IVA (16%):</span><span className="text-white font-semibold">${(selectedSale.amount - (selectedSale.amount / 1.16)).toFixed(2)}</span></div>
              <div className="flex justify-between border-t border-border-dark/60 pt-2 text-sm"><span className="text-gray-500 font-bold">Total Factura:</span><span className="text-purple-400 font-black">${selectedSale.amount.toFixed(2)}</span></div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Sales;

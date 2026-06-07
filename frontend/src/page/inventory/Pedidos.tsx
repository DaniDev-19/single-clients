import { useState, useMemo } from 'react';
import Table from '../../components/Table';
import Buttons from '../../components/ui/Buttons';
import Inputs from '../../components/ui/Inputs';
import Selects from '../../components/ui/Selects';
import TextArea from '../../components/ui/TextArea';
import SearchInput from '../../components/ui/SearchInput';
import { Modal } from '../../components/Modal';
import { useAlert } from '../../hooks/useAlert';
import { useLoading } from '../../hooks/useLoading';

interface OrderItem {
  id: number;
  orderId: string;
  partnerName: string;
  type: 'purchase' | 'sale';
  itemsSummary: string;
  totalAmount: number;
  date: string;
  status: 'pending' | 'shipped' | 'delivered';
}

function Pedidos() {
  const { showAlert } = useAlert();
  const { showLoading, hideLoading } = useLoading();

  const [orders, setOrders] = useState<OrderItem[]>([
    { id: 1, orderId: 'PED-8911', partnerName: 'Distribuidora Mayorista Alimentos', type: 'purchase', itemsSummary: 'Arroz (x100), Aceite (x50)', totalAmount: 480.0, date: '2026-06-05', status: 'pending' },
    { id: 2, orderId: 'PED-8912', partnerName: 'John Doe', type: 'sale', itemsSummary: 'Sistema ERP Single-Client (x1)', totalAmount: 500.0, date: '2026-06-04', status: 'delivered' },
    { id: 3, orderId: 'PED-8913', partnerName: 'Proveedor Hardware Redes', type: 'purchase', itemsSummary: 'Switch Cisco 24 Puertos (x2)', totalAmount: 320.0, date: '2026-06-03', status: 'shipped' },
    { id: 4, orderId: 'PED-8914', partnerName: 'Súper Mercado Express', type: 'sale', itemsSummary: 'Licencia App POS Lite (x2)', totalAmount: 240.0, date: '2026-06-02', status: 'delivered' },
    { id: 5, orderId: 'PED-8915', partnerName: 'Jane Smith', type: 'sale', itemsSummary: 'Soporte Técnico de Redes (x5 horas)', totalAmount: 175.0, date: '2026-05-28', status: 'pending' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [partnerInput, setPartnerInput] = useState('');
  const [typeInput, setTypeInput] = useState('purchase');
  const [summaryInput, setSummaryInput] = useState('');
  const [amountInput, setAmountInput] = useState('');

  const handleOpenAdd = () => {
    setPartnerInput('');
    setTypeInput('purchase');
    setSummaryInput('');
    setAmountInput('');
    setIsAddOpen(true);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(amountInput);

    if (!partnerInput || !summaryInput || isNaN(amountVal)) {
      showAlert({ title: 'Error', description: 'Por favor complete todos los campos válidamente.', variant: 'danger' });
      return;
    }

    setIsAddOpen(false);
    showLoading({ title: 'Registrando pedido', subtitle: 'Guardando datos en el sistema...' });

    setTimeout(() => {
      const newOrder: OrderItem = {
        id: orders.length ? Math.max(...orders.map((o) => o.id)) + 1 : 1,
        orderId: `PED-${Math.floor(1000 + Math.random() * 9000)}`,
        partnerName: partnerInput,
        type: typeInput as any,
        itemsSummary: summaryInput,
        totalAmount: amountVal,
        date: new Date().toISOString().split('T')[0],
        status: 'pending',
      };
      setOrders((prev) => [newOrder, ...prev]);
      hideLoading();
      showAlert({ title: 'Pedido registrado', description: `Se guardó el pedido ${newOrder.orderId} exitosamente.`, variant: 'success' });
    }, 1200);
  };

  const handleUpdateStatus = (order: OrderItem, newStatus: 'pending' | 'shipped' | 'delivered') => {
    showLoading({ title: 'Actualizando estado', subtitle: 'Modificando logística de entrega...' });
    setTimeout(() => {
      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, status: newStatus } : o))
      );
      hideLoading();
      showAlert({ title: 'Pedido Actualizado', description: `Estado del pedido cambiado a ${newStatus}.`, variant: 'info' });
    }, 800);
  };

  const getTypeBadge = (type: 'purchase' | 'sale') => {
    const styles = {
      purchase: 'border-blue-900/30 bg-blue-950/20 text-blue-400',
      sale: 'border-purple-900/30 bg-purple-950/20 text-purple-400',
    };
    return (
      <span className={`inline-block border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full ${styles[type]}`}>
        {type === 'purchase' ? 'Compra / Entrada' : 'Venta / Salida'}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'border-amber-900/30 bg-amber-950/20 text-amber-400',
      shipped: 'border-blue-900/30 bg-blue-950/20 text-blue-400',
      delivered: 'border-emerald-900/30 bg-emerald-950/20 text-emerald-400',
    };
    const labels: Record<string, string> = {
      pending: 'Pendiente',
      shipped: 'Enviado',
      delivered: 'Entregado',
    };
    return (
      <span className={`inline-block border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full ${styles[status] ?? styles.pending}`}>
        {labels[status] ?? 'Pendiente'}
      </span>
    );
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        o.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.partnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.itemsSummary.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || o.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  const tableRows = filteredOrders.map((o) => ({
    orderId: <span className="font-semibold text-purple-400">{o.orderId}</span>,
    partner: <span className="font-semibold text-white">{o.partnerName}</span>,
    type: getTypeBadge(o.type),
    summary: <span className="text-gray-300 truncate max-w-[200px] block">{o.itemsSummary}</span>,
    total: <span className="font-bold text-white">${o.totalAmount.toFixed(2)}</span>,
    status: getStatusBadge(o.status),
    acciones: (
      <div className="flex items-center gap-1.5 justify-start">
        {o.status === 'pending' && (
          <Buttons
            variant="secondary"
            size="sm"
            onClick={() => handleUpdateStatus(o, 'shipped')}
          >
            Enviar
          </Buttons>
        )}
        {o.status === 'shipped' && (
          <Buttons
            variant="primary"
            size="sm"
            onClick={() => handleUpdateStatus(o, 'delivered')}
          >
            Entregar
          </Buttons>
        )}
      </div>
    ),
  }));

  const filtersNode = (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between w-full">
      <SearchInput
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Buscar por ID, proveedor o resumen..."
      />

      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mr-1.5">Estado:</span>
        {[
          { key: 'all', label: 'Todos' },
          { key: 'pending', label: 'Pendientes' },
          { key: 'shipped', label: 'Enviados' },
          { key: 'delivered', label: 'Entregados' },
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
      <div>
        <h1 className="text-xl font-bold tracking-tight text-white uppercase">Pedidos de Productos</h1>
        <p className="mt-1 text-xs text-gray-400">Logística de adquisiciones a proveedores o despachos especiales de ventas.</p>
      </div>

      <Table
        title="Registro de Pedidos Activos"
        button={
          <Buttons variant="primary" size="sm" onClick={handleOpenAdd}>
            Registrar Pedido
          </Buttons>
        }
        filters={filtersNode}
        data={tableRows}
        columns={['orderId', 'partner', 'type', 'summary', 'total', 'status', 'acciones']}
      />

      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Registrar Nuevo Pedido"
        onSubmit={handleAddSubmit}
        primaryButtonText="Registrar"
      >
        <div className="space-y-4">
          <Inputs
            label="Proveedor / Cliente Destino"
            value={partnerInput}
            onChange={setPartnerInput}
            placeholder="Ej. Distribuidora Mayorista"
            required
          />
          <Selects
            label="Tipo de Pedido"
            value={typeInput}
            onChange={setTypeInput}
            options={['purchase', 'sale']}
            placeholder="Seleccione el tipo"
          />
          <TextArea
            label="Resumen de Artículos (Detallado)"
            value={summaryInput}
            onChange={setSummaryInput}
            placeholder="Ej. Arroz (x100 bolsas), Aceite (x50 botellas)..."
            required
          />
          <Inputs
            label="Monto Estimado Total ($)"
            type="number"
            step="0.01"
            value={amountInput}
            onChange={setAmountInput}
            placeholder="Ej. 480.00"
            required
          />
        </div>
      </Modal>
    </div>
  );
}

export default Pedidos;

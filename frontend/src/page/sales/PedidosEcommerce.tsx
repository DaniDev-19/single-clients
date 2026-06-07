import { useState } from 'react';
import Table from '../../components/Table';
import Inputs from '../../components/ui/Inputs';
import Selects from '../../components/ui/Selects';
import { Modal } from '../../components/Modal';
import { useAlert } from '../../hooks/useAlert';
import { useLoading } from '../../hooks/useLoading';
import loginIllustration from '../../assets/login_illustration.png';

interface WebOrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

interface WebOrder {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  date: string;
  items: WebOrderItem[];
  paymentMethod: 'pago_movil' | 'paypal' | 'binance' | 'transferencia';
  total: number;
  paymentStatus: 'pendiente' | 'pagado';
  deliveryType: 'retiro' | 'delivery';
  deliveryStatus: 'pendiente' | 'pagado' | 'en_camino' | 'entregado';
  deliveryDriver?: string;
  deliveryCost?: number;
  captureUrl?: string;
}

function PedidosEcommerce() {
  const { showAlert } = useAlert();
  const { showLoading, hideLoading } = useLoading();

  const [orders, setOrders] = useState<WebOrder[]>([
    {
      id: 'WEB-4821',
      customerName: 'Jesús Silva',
      email: 'jesus.silva@gmail.com',
      phone: '0424-7771122',
      date: '2026-06-07 13:45',
      items: [
        { productId: 1, productName: 'Arroz Premium (1kg)', quantity: 4, price: 1.80 },
        { productId: 3, productName: 'Café Molido Gourmet (500g)', quantity: 2, price: 4.20 },
      ],
      paymentMethod: 'pago_movil',
      total: 15.60,
      paymentStatus: 'pendiente',
      deliveryType: 'delivery',
      deliveryStatus: 'pendiente',
      captureUrl: loginIllustration,
    },
    {
      id: 'WEB-4822',
      customerName: 'Andrea Torres',
      email: 'andrea.t@hotmail.com',
      phone: '0412-4448899',
      date: '2026-06-07 11:20',
      items: [
        { productId: 5, productName: 'Pizza Pepperoni Familiar', quantity: 1, price: 12.00 },
      ],
      paymentMethod: 'paypal',
      total: 12.00,
      paymentStatus: 'pagado',
      deliveryType: 'retiro',
      deliveryStatus: 'pagado',
    },
  ]);

  const [selectedOrder, setSelectedOrder] = useState<WebOrder | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDispatchOpen, setIsDispatchOpen] = useState(false);
  const [isCaptureOpen, setIsCaptureOpen] = useState(false);

  const [driverInput, setDriverInput] = useState('');
  const [zoneInput, setZoneInput] = useState('cercano');
  const [customCostInput, setCustomCostInput] = useState('3.00');

  const zoneRates: Record<string, number> = {
    cercano: 3.00,
    medio: 5.00,
    lejano: 8.00,
    extra_urbano: 12.00,
  };

  const handleZoneChange = (zone: string) => {
    setZoneInput(zone);
    const cost = zoneRates[zone] || 3.00;
    setCustomCostInput(cost.toFixed(2));
  };

  const handleConfirmPayment = (orderId: string) => {
    showLoading({ title: 'Conciliando Pago', subtitle: 'Verificando firmas bancarias...' });
    setTimeout(() => {
      hideLoading();
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? { ...o, paymentStatus: 'pagado', deliveryStatus: o.deliveryStatus === 'pendiente' ? 'pagado' : o.deliveryStatus }
            : o
        )
      );
      showAlert({ title: 'Pago Conciliado', description: `La orden ${orderId} fue marcada como PAGADA con éxito.`, variant: 'success' });
    }, 1000);
  };

  const handleOpenDispatch = (order: WebOrder) => {
    setSelectedOrder(order);
    setDriverInput('');
    setZoneInput('cercano');
    setCustomCostInput('3.00');
    setIsDispatchOpen(true);
  };

  const handleDispatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || !driverInput.trim()) {
      showAlert({ title: 'Error', description: 'Por favor asigne un motorizado para el despacho.', variant: 'warning' });
      return;
    }

    const costVal = parseFloat(customCostInput) || 0;
    showLoading({ title: 'Despachando Pedido', subtitle: 'Asignando ruta al motorizado y notificando al cliente...' });

    setTimeout(() => {
      hideLoading();
      setOrders((prev) =>
        prev.map((o) =>
          o.id === selectedOrder.id
            ? { ...o, deliveryStatus: 'en_camino', deliveryDriver: driverInput.trim(), deliveryCost: costVal }
            : o
        )
      );
      setIsDispatchOpen(false);
      showAlert({ title: 'Pedido en Camino', description: `Despachado con ${driverInput.trim()}. Costo de delivery: $${costVal.toFixed(2)}.`, variant: 'success' });
    }, 1200);
  };

  const handleMarkAsDelivered = (orderId: string) => {
    showLoading({ title: 'Finalizando Orden', subtitle: 'Completando entrega en sistema...' });
    setTimeout(() => {
      hideLoading();
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, deliveryStatus: 'entregado' } : o))
      );
      showAlert({ title: 'Entrega Realizada', description: `La orden ${orderId} fue completada y entregada con éxito.`, variant: 'success' });
    }, 1000);
  };

  const getPaymentBadge = (status: string) => {
    return status === 'pagado' ? (
      <span className="border border-emerald-900/35 bg-emerald-950/25 text-emerald-400 text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-wider">
        Confirmado
      </span>
    ) : (
      <span className="border border-amber-900/35 bg-amber-950/25 text-amber-400 text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-wider">
        Por Confirmar
      </span>
    );
  };

  const getDeliveryBadge = (status: string) => {
    const styles: Record<string, string> = {
      pendiente: 'border-gray-900/40 bg-gray-950/20 text-gray-400',
      pagado: 'border-blue-900/30 bg-blue-950/20 text-blue-400',
      en_camino: 'border-purple-900/35 bg-purple-950/25 text-purple-400 animate-pulse',
      entregado: 'border-emerald-900/35 bg-emerald-950/25 text-emerald-400',
    };
    return (
      <span className={`inline-block border px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded ${styles[status] ?? styles.pendiente}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  const tableRows = orders.map((o) => ({
    id: <strong className="text-white font-mono text-xs">{o.id}</strong>,
    customer: (
      <div>
        <span className="text-white font-bold block">{o.customerName}</span>
        <span className="text-[9px] text-gray-550 block font-mono">{o.phone}</span>
      </div>
    ),
    date: <span className="text-gray-400 font-mono">{o.date}</span>,
    method: <span className="text-purple-400 font-bold uppercase tracking-wider text-[10px]">{o.paymentMethod.replace('_', ' ')}</span>,
    delivery: (
      <div>
        <span className="text-white uppercase font-bold text-[9px] block">
          {o.deliveryType === 'delivery' ? 'Delivery 🏍️' : 'Retiro Tienda 🏢'}
        </span>
        {o.deliveryDriver && <span className="text-[8px] text-gray-500 block">Ruta: {o.deliveryDriver}</span>}
      </div>
    ),
    total: <strong className="text-white font-bold font-mono">${o.total.toFixed(2)}</strong>,
    payment: getPaymentBadge(o.paymentStatus),
    deliveryStatus: getDeliveryBadge(o.deliveryStatus),
    acciones: (
      <div className="flex gap-1.5 justify-end">
        {o.captureUrl && (
          <button
            type="button"
            onClick={() => {
              setSelectedOrder(o);
              setIsCaptureOpen(true);
            }}
            className="p-1 rounded bg-black/40 border border-border-dark text-gray-400 hover:text-emerald-400 cursor-pointer"
            title="Ver Capture Pago"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            setSelectedOrder(o);
            setIsDetailOpen(true);
          }}
          className="p-1 rounded bg-black/40 border border-border-dark text-gray-450 hover:text-white cursor-pointer"
          title="Ver Artículos"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        </button>

        {o.paymentStatus === 'pendiente' && (
          <button
            type="button"
            onClick={() => handleConfirmPayment(o.id)}
            className="px-2 py-0.5 rounded bg-emerald-950/20 text-emerald-400 hover:bg-emerald-900/35 border border-emerald-900/30 font-bold uppercase text-[9px] cursor-pointer"
          >
            Confirmar Pago
          </button>
        )}

        {o.paymentStatus === 'pagado' && o.deliveryType === 'delivery' && o.deliveryStatus === 'pagado' && (
          <button
            type="button"
            onClick={() => handleOpenDispatch(o)}
            className="px-2 py-0.5 rounded bg-purple-950/20 text-purple-400 hover:bg-purple-900/35 border border-purple-900/30 font-bold uppercase text-[9px] cursor-pointer"
          >
            Despachar
          </button>
        )}

        {o.deliveryStatus === 'en_camino' && (
          <button
            type="button"
            onClick={() => handleMarkAsDelivered(o.id)}
            className="px-2 py-0.5 rounded bg-emerald-950/20 text-emerald-400 hover:bg-emerald-900/35 border border-emerald-900/30 font-bold uppercase text-[9px] cursor-pointer"
          >
            Entregado
          </button>
        )}
      </div>
    ),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-white uppercase">Pedidos Web E-Commerce</h1>
        <p className="mt-1 text-xs text-gray-400">Canalización de pedidos originados desde la web pública del comercio, gestión de delivery y validación de transferencias.</p>
      </div>

      <div className="border border-border-dark bg-bg-card rounded-lg overflow-hidden shadow-lg">
        <Table
          title="Pedidos Recibidos E-Commerce"
          button={<span className="text-[10px] text-gray-500 font-mono">Total {orders.length} pedidos</span>}
          data={tableRows}
          columns={['id', 'customer', 'date', 'method', 'delivery', 'total', 'payment', 'deliveryStatus', 'acciones']}
        />
      </div>

      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title={`Detalle de Pedido ${selectedOrder?.id}`}
        showActions={true}
        actions={[{ label: 'Cerrar', onClick: () => setIsDetailOpen(false), variant: 'secondary' }]}
      >
        {selectedOrder && (
          <div className="space-y-4 text-xs">
            <div className="border-b border-border-dark pb-3">
              <span className="text-[9px] text-purple-400 uppercase font-black block">Información del Cliente</span>
              <h4 className="text-sm font-bold text-white mt-1">{selectedOrder.customerName}</h4>
              <p className="text-[10px] text-gray-500 font-mono mt-0.5">{selectedOrder.email} • {selectedOrder.phone}</p>
            </div>

            <div className="space-y-2">
              <span className="text-[9px] text-gray-500 uppercase font-black tracking-wider block">Artículos Solicitados</span>
              <div className="space-y-1.5">
                {selectedOrder.items.map((item) => (
                  <div key={item.productId} className="flex justify-between items-center bg-bg-panel border border-border-dark p-2.5 rounded">
                    <div>
                      <span className="font-bold text-white block">{item.productName}</span>
                      <span className="text-[9px] text-gray-500 mt-0.5">Precio Unitario: ${item.price.toFixed(2)}</span>
                    </div>
                    <span className="text-purple-400 font-extrabold">{item.quantity} u. • ${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-border-dark/60 pt-3">
              <div className="bg-black/10 border border-border-dark/40 p-2.5 rounded text-center">
                <span className="text-[8px] text-gray-550 block">MÉTODO PAGO</span>
                <strong className="text-white font-extrabold block mt-0.5 uppercase">{selectedOrder.paymentMethod.replace('_', ' ')}</strong>
              </div>
              <div className="bg-black/10 border border-border-dark/40 p-2.5 rounded text-center">
                <span className="text-[8px] text-gray-550 block">MONTO TOTAL NETO</span>
                <strong className="text-emerald-400 font-extrabold block mt-0.5">${selectedOrder.total.toFixed(2)}</strong>
              </div>
            </div>

            {selectedOrder.deliveryDriver && (
              <div className="bg-purple-950/10 border border-purple-900/30 p-2.5 rounded text-[10px] space-y-1">
                <div className="flex justify-between"><span className="text-purple-400 font-bold">Motorizado Asignado:</span><span className="text-white font-bold">{selectedOrder.deliveryDriver}</span></div>
                {selectedOrder.deliveryCost !== undefined && (
                  <div className="flex justify-between"><span className="text-purple-400 font-bold">Tarifa de Delivery:</span><span className="text-white font-mono">${selectedOrder.deliveryCost.toFixed(2)}</span></div>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isDispatchOpen}
        onClose={() => setIsDispatchOpen(false)}
        title="Despachar Pedido E-Commerce"
        onSubmit={handleDispatchSubmit}
        primaryButtonText="Despachar Ruta"
      >
        <div className="space-y-4">
          <p className="text-xs text-gray-400">Asigne el delivery para la orden <strong className="text-white">{selectedOrder?.id}</strong>.</p>
          
          <Inputs
            label="Nombre del Motorizado / Conductor"
            value={driverInput}
            onChange={setDriverInput}
            placeholder="Ej. Carlos Mendoza"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Selects
              label="Zona de Despacho"
              value={zoneInput}
              onChange={handleZoneChange}
              options={['cercano', 'medio', 'lejano', 'extra_urbano']}
            />
            <Inputs
              label="Monto Delivery ($)"
              type="number"
              step="0.01"
              value={customCostInput}
              onChange={setCustomCostInput}
              placeholder="3.00"
              required
            />
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isCaptureOpen}
        onClose={() => setIsCaptureOpen(false)}
        title={`Comprobante de Pago ${selectedOrder?.id}`}
        showActions={true}
        actions={[{ label: 'Cerrar', onClick: () => setIsCaptureOpen(false), variant: 'secondary' }]}
      >
        {selectedOrder && (
          <div className="space-y-4 text-center text-xs">
            <h4 className="text-sm font-bold text-white">Capture Enviado por Cliente</h4>
            <div className="rounded-lg border border-border-dark bg-[#0a0a10] p-3 shadow-xl max-h-[350px] flex items-center justify-center overflow-hidden">
              <img src={selectedOrder.captureUrl || loginIllustration} alt="Comprobante" className="rounded max-h-[320px] object-contain" />
            </div>
            <p className="text-[10px] text-gray-550 uppercase font-semibold">Validar contra cuenta receptora antes de conciliar.</p>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default PedidosEcommerce;

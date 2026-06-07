import { useState } from 'react';
import Buttons from '../../components/ui/Buttons';
import Inputs from '../../components/ui/Inputs';
import Selects from '../../components/ui/Selects';
import TextArea from '../../components/ui/TextArea';
import { Modal } from '../../components/Modal';
import { useAlert } from '../../hooks/useAlert';
import { useLoading } from '../../hooks/useLoading';

interface TechOrder {
  id: number;
  clientName: string;
  deviceInfo: string;
  problemDescription: string;
  status: 'received' | 'diagnostic' | 'ready' | 'delivered';
  priority: 'low' | 'medium' | 'high';
  assignedTech: string;
  totalBudget: number;
  advancePayment: number;
  dateAdded: string;
}

function OrdenesServicio() {
  const { showAlert } = useAlert();
  const { showLoading, hideLoading } = useLoading();

  const [orders, setOrders] = useState<TechOrder[]>([
    {
      id: 1,
      clientName: 'Alejandro Mendoza',
      deviceInfo: 'Laptop ASUS ROG Strix G15',
      problemDescription: 'Limpieza interna y cambio de pasta térmica por metal líquido.',
      status: 'diagnostic',
      priority: 'high',
      assignedTech: 'DaniDev',
      totalBudget: 60.00,
      advancePayment: 20.00,
      dateAdded: '2026-06-05',
    },
    {
      id: 2,
      clientName: 'Carla Espinoza',
      deviceInfo: 'Servidor Local HP ProLiant',
      problemDescription: 'Configuración de arreglos RAID 5 y respaldo de base de datos Postgres.',
      status: 'received',
      priority: 'medium',
      assignedTech: 'Marcos Pérez',
      totalBudget: 250.00,
      advancePayment: 100.00,
      dateAdded: '2026-06-06',
    },
    {
      id: 3,
      clientName: 'Distribuidora del Sur',
      deviceInfo: 'Red de Datos (Oficina Chacao)',
      problemDescription: 'Cables de red Categoría 6, ponchado de patch panels y configuración de Switch Mikrotik.',
      status: 'ready',
      priority: 'high',
      assignedTech: 'DaniDev',
      totalBudget: 400.00,
      advancePayment: 200.00,
      dateAdded: '2026-06-04',
    },
    {
      id: 4,
      clientName: 'Juan Pérez',
      deviceInfo: 'PC de Escritorio Dell OptiPlex',
      problemDescription: 'Reemplazo de disco duro HDD mecánico por Unidad de Estado Sólido SSD 480GB e instalación de Windows.',
      status: 'delivered',
      priority: 'low',
      assignedTech: 'Marcos Pérez',
      totalBudget: 75.00,
      advancePayment: 75.00,
      dateAdded: '2026-06-01',
    },
    {
      id: 5,
      clientName: 'María Rodríguez',
      deviceInfo: 'Impresora Epson L3150',
      problemDescription: 'Limpieza de cabezales y purgado de sistema de tinta continua.',
      status: 'received',
      priority: 'low',
      assignedTech: 'Marcos Pérez',
      totalBudget: 35.00,
      advancePayment: 10.00,
      dateAdded: '2026-06-06',
    },
    {
      id: 6,
      clientName: 'Ferretería El Tornillo',
      deviceInfo: 'Red WiFi y Access Points UniFi',
      problemDescription: 'Instalación y configuración de 3 APs de largo alcance para galpón de almacén.',
      status: 'received',
      priority: 'high',
      assignedTech: 'DaniDev',
      totalBudget: 320.00,
      advancePayment: 150.00,
      dateAdded: '2026-06-07',
    },
  ]);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [clientInput, setClientInput] = useState('');
  const [deviceInput, setDeviceInput] = useState('');
  const [problemInput, setProblemInput] = useState('');
  const [priorityInput, setPriorityInput] = useState('medium');
  const [techInput, setTechInput] = useState('DaniDev');
  const [budgetInput, setBudgetInput] = useState('');
  const [advanceInput, setAdvanceInput] = useState('');

  const [selectedOrder, setSelectedOrder] = useState<TechOrder | null>(null);

  const [stagePages, setStagePages] = useState<Record<string, number>>({
    received: 1,
    diagnostic: 1,
    ready: 1,
    delivered: 1,
  });
  const itemsPerPage = 2;

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const budgetVal = parseFloat(budgetInput) || 0;
    const advanceVal = parseFloat(advanceInput) || 0;

    if (!clientInput.trim() || !deviceInput.trim()) {
      showAlert({ title: 'Campos vacíos', description: 'Por favor complete el cliente y el dispositivo.', variant: 'warning' });
      return;
    }

    setIsAddOpen(false);
    showLoading({ title: 'Creando Orden Técnica', subtitle: 'Registrando ficha de ingreso en base de datos...' });

    setTimeout(() => {
      const newOrder: TechOrder = {
        id: orders.length ? Math.max(...orders.map((o) => o.id)) + 1 : 1,
        clientName: clientInput,
        deviceInfo: deviceInput,
        problemDescription: problemInput,
        status: 'received',
        priority: priorityInput as any,
        assignedTech: techInput,
        totalBudget: budgetVal,
        advancePayment: advanceVal,
        dateAdded: new Date().toISOString().split('T')[0],
      };

      setOrders((prev) => [newOrder, ...prev]);
      hideLoading();
      showAlert({
        title: 'Orden Creada',
        description: `Se registró el ingreso de servicio para ${clientInput} bajo la orden #${newOrder.id}.`,
        variant: 'success',
      });

      setClientInput('');
      setDeviceInput('');
      setProblemInput('');
      setBudgetInput('');
      setAdvanceInput('');
    }, 1200);
  };

  const advanceOrderStatus = (order: TechOrder, nextStatus: 'received' | 'diagnostic' | 'ready' | 'delivered') => {
    showLoading({ title: 'Actualizando Estado', subtitle: 'Registrando cambio en el flujo técnico...' });
    setTimeout(() => {
      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, status: nextStatus } : o))
      );
      if (selectedOrder && selectedOrder.id === order.id) {
        setSelectedOrder((prev) => prev ? { ...prev, status: nextStatus } : null);
      }
      hideLoading();
      showAlert({ title: 'Estado actualizado', description: `Orden #${order.id} cambió a estado ${nextStatus.toUpperCase()}.`, variant: 'info' });
    }, 800);
  };

  const stages = [
    { key: 'received', label: 'Recibidos', bg: 'bg-blue-950/10 border-blue-900/40 text-blue-400' },
    { key: 'diagnostic', label: 'En Diagnóstico', bg: 'bg-amber-950/10 border-amber-900/40 text-amber-400' },
    { key: 'ready', label: 'Listo para Entrega', bg: 'bg-purple-950/10 border-purple-900/40 text-purple-400' },
    { key: 'delivered', label: 'Entregados', bg: 'bg-emerald-950/10 border-emerald-900/40 text-emerald-400' },
  ] as const;

  const handlePrevPage = (stageKey: string) => {
    setStagePages((prev) => ({
      ...prev,
      [stageKey]: Math.max(1, (prev[stageKey] || 1) - 1),
    }));
  };

  const handleNextPage = (stageKey: string, totalStagePages: number) => {
    setStagePages((prev) => ({
      ...prev,
      [stageKey]: Math.min(totalStagePages, (prev[stageKey] || 1) + 1),
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white uppercase">Gestión de Soporte & Órdenes de Servicio</h1>
          <p className="mt-1 text-xs text-gray-400">Control de reparaciones técnicas, instalaciones físicas y flujo de avance técnico.</p>
        </div>
        <Buttons variant="primary" size="sm" onClick={() => setIsAddOpen(true)} className="self-start sm:self-auto cursor-pointer">
          Nueva Orden Técnica
        </Buttons>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
        {stages.map((stage) => {
          const stageOrders = orders.filter((o) => o.status === stage.key);
          const currentPage = stagePages[stage.key] || 1;
          const totalStagePages = Math.max(1, Math.ceil(stageOrders.length / itemsPerPage));
          
          const paginatedStageOrders = stageOrders.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
          );

          return (
            <div key={stage.key} className="rounded-lg border border-border-dark bg-bg-card p-4 space-y-4 flex flex-col justify-between min-h-[350px]">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-border-dark/60 pb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-white">
                    {stage.label}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-bg-panel text-gray-400 border border-border-dark">
                    {stageOrders.length}
                  </span>
                </div>

                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
                  {paginatedStageOrders.length === 0 ? (
                    <div className="text-center text-[10px] text-gray-600 py-6">
                      Sin órdenes activas
                    </div>
                  ) : (
                    paginatedStageOrders.map((order) => (
                      <div
                        key={order.id}
                        onClick={() => setSelectedOrder(order)}
                        className="p-3 rounded border border-border-dark bg-bg-panel/40 hover:border-purple-600/50 hover:bg-bg-panel/80 transition cursor-pointer space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] text-gray-500 font-mono">Orden #{order.id}</span>
                          <span className={`inline-block border px-1.5 py-0.5 text-[8px] font-black uppercase rounded ${
                            order.priority === 'high' ? 'border-red-900 bg-red-950/20 text-red-400' :
                            order.priority === 'medium' ? 'border-amber-900 bg-amber-950/20 text-amber-400' :
                            'border-gray-800 bg-gray-900 text-gray-400'
                          }`}>
                            {order.priority}
                          </span>
                        </div>

                        <div>
                          <span className="text-white font-bold block text-xs">{order.clientName}</span>
                          <span className="text-[10px] text-purple-400 block font-semibold mt-0.5">{order.deviceInfo}</span>
                        </div>

                        <div className="flex justify-between border-t border-border-dark/30 pt-2 text-[10px]">
                          <span className="text-gray-500">Monto: <strong className="text-gray-300">${order.totalBudget}</strong></span>
                          <span className="text-gray-500">Resta: <strong className="text-red-400">${order.totalBudget - order.advancePayment}</strong></span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {totalStagePages > 1 && (
                <div className="flex items-center justify-between border-t border-border-dark/30 pt-3 text-[10px] text-gray-450 mt-2">
                  <button
                    type="button"
                    onClick={() => handlePrevPage(stage.key)}
                    disabled={currentPage === 1}
                    className="px-2 py-1 rounded bg-bg-panel border border-border-dark text-gray-400 hover:text-white disabled:opacity-40 disabled:hover:text-gray-400 cursor-pointer"
                  >
                    Anterior
                  </button>
                  <span className="font-bold text-gray-400">
                    {currentPage} / {totalStagePages}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleNextPage(stage.key, totalStagePages)}
                    disabled={currentPage === totalStagePages}
                    className="px-2 py-1 rounded bg-bg-panel border border-border-dark text-gray-400 hover:text-white disabled:opacity-40 disabled:hover:text-gray-400 cursor-pointer"
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Ingresar Orden de Servicio Técnico"
        onSubmit={handleCreateOrder}
        primaryButtonText="Registrar Ingreso"
      >
        <div className="space-y-4">
          <Inputs label="Nombre del Cliente" value={clientInput} onChange={setClientInput} placeholder="Ej. Alejandro Mendoza" required />
          <Inputs label="Equipo / Sistema / Módulo" value={deviceInput} onChange={setDeviceInput} placeholder="Ej. Laptop ASUS ROG Strix o Red Local Oficina" required />
          
          <TextArea
            label="Descripción del Diagnóstico / Tarea"
            value={problemInput}
            onChange={setProblemInput}
            placeholder="Escriba los detalles de lo que reporta el cliente..."
          />

          <div className="grid grid-cols-2 gap-4">
            <Selects label="Prioridad" value={priorityInput} onChange={setPriorityInput} options={['low', 'medium', 'high']} />
            <Inputs label="Técnico Responsable" value={techInput} onChange={setTechInput} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Inputs label="Presupuesto Inicial ($)" type="number" step="0.01" value={budgetInput} onChange={setBudgetInput} required />
            <Inputs label="Abono / Anticipo ($)" type="number" step="0.01" value={advanceInput} onChange={setAdvanceInput} required />
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={selectedOrder !== null}
        onClose={() => setSelectedOrder(null)}
        title={selectedOrder ? `Detalle de Orden de Servicio #${selectedOrder.id}` : ''}
        showActions={true}
        actions={[
          ...(selectedOrder && selectedOrder.status === 'received' ? [{ label: 'Iniciar Diagnóstico', onClick: () => advanceOrderStatus(selectedOrder, 'diagnostic'), variant: 'primary' as const }] : []),
          ...(selectedOrder && selectedOrder.status === 'diagnostic' ? [{ label: 'Marcar como Listo', onClick: () => advanceOrderStatus(selectedOrder, 'ready'), variant: 'primary' as const }] : []),
          ...(selectedOrder && selectedOrder.status === 'ready' ? [{ label: 'Marcar como Entregado', onClick: () => advanceOrderStatus(selectedOrder, 'delivered'), variant: 'primary' as const }] : []),
          { label: 'Cerrar', onClick: () => setSelectedOrder(null), variant: 'secondary' as const }
        ]}
      >
        {selectedOrder && (
          <div className="space-y-4 text-xs text-gray-300">
            <div>
              <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Cliente / Solicitante</span>
              <p className="text-white font-bold text-sm">{selectedOrder.clientName}</p>
            </div>
            <div>
              <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Equipo o Servicio</span>
              <p className="text-purple-400 font-semibold">{selectedOrder.deviceInfo}</p>
            </div>
            <div>
              <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Detalles de Tarea</span>
              <p className="text-gray-300 leading-relaxed bg-bg-panel/40 border border-border-dark p-2.5 rounded-md">{selectedOrder.problemDescription}</p>
            </div>
            <div className="grid grid-cols-3 gap-3 border-t border-border-dark/60 pt-3 text-center">
              <div>
                <span className="text-[9px] text-gray-500 block">TÉCNICO</span>
                <strong className="text-white font-bold block mt-0.5">{selectedOrder.assignedTech}</strong>
              </div>
              <div>
                <span className="text-[9px] text-gray-500 block">PRESUPUESTO</span>
                <strong className="text-white font-bold block mt-0.5">${selectedOrder.totalBudget.toFixed(2)}</strong>
              </div>
              <div>
                <span className="text-[9px] text-gray-500 block">RESTA</span>
                <strong className="text-red-400 font-bold block mt-0.5">${(selectedOrder.totalBudget - selectedOrder.advancePayment).toFixed(2)}</strong>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default OrdenesServicio;

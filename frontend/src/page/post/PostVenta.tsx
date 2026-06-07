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

interface Ticket {
  id: number;
  ticketId: string;
  clientName: string;
  issue: string;
  priority: 'high' | 'medium' | 'low';
  status: 'open' | 'resolved' | 'closed';
  date: string;
  description: string;
}

function PostVenta() {
  const { showAlert } = useAlert();
  const { showLoading, hideLoading } = useLoading();

  const [tickets, setTickets] = useState<Ticket[]>([
    { id: 1, ticketId: 'TKT-2911', clientName: 'John Doe', issue: 'El VPS no responde ping', priority: 'high', status: 'open', date: '2026-06-05', description: 'El servidor VPS contratado se encuentra inaccesible desde las 08:00 AM hora local. Se ha intentado reiniciar por panel web sin éxito.' },
    { id: 2, ticketId: 'TKT-2912', clientName: 'Jane Smith', issue: 'Error al exportar reporte PDF', priority: 'medium', status: 'resolved', date: '2026-06-04', description: 'Al intentar hacer clic en Exportar PDF en la pantalla de Finanzas, arroja un error 500 interno. El resto de vistas funciona bien.' },
    { id: 3, ticketId: 'TKT-2913', clientName: 'Carlos Ruiz', issue: 'Consultoría Especializada TI', priority: 'low', status: 'open', date: '2026-06-03', description: 'Solicitud para coordinar la segunda reunión de seguimiento de la consultoría contratada.' },
    { id: 4, ticketId: 'TKT-2914', clientName: 'Ana García', issue: 'Configuración DNS erronea', priority: 'high', status: 'open', date: '2026-06-02', description: 'Los servidores DNS no propagan correctamente. El dominio principal de la empresa se encuentra fuera de línea.' },
    { id: 5, ticketId: 'TKT-2915', clientName: 'Laura Pérez', issue: 'Duda con factura de mayo', priority: 'low', status: 'closed', date: '2026-05-28', description: 'Consulta sobre un cobro extra de $15.00 en la última factura.' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const [clientInput, setClientInput] = useState('');
  const [issueInput, setIssueInput] = useState('');
  const [descInput, setDescInput] = useState('');
  const [priorityInput, setPriorityInput] = useState('medium');

  const handleOpenAdd = () => {
    setClientInput('');
    setIssueInput('');
    setDescInput('');
    setPriorityInput('medium');
    setIsAddOpen(true);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientInput || !issueInput || !descInput) {
      showAlert({ title: 'Error', description: 'Por favor complete todos los campos', variant: 'danger' });
      return;
    }

    setIsAddOpen(false);
    showLoading({ title: 'Abriendo ticket', subtitle: 'Creando reporte de soporte...' });

    setTimeout(() => {
      const newTicket: Ticket = {
        id: tickets.length ? Math.max(...tickets.map((t) => t.id)) + 1 : 1,
        ticketId: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
        clientName: clientInput,
        issue: issueInput,
        priority: priorityInput as any,
        status: 'open',
        date: new Date().toISOString().split('T')[0],
        description: descInput,
      };
      setTickets((prev) => [newTicket, ...prev]);
      hideLoading();
      showAlert({ title: 'Ticket abierto', description: `Se registró el ticket ${newTicket.ticketId} con éxito.`, variant: 'success' });
    }, 1200);
  };

  const handleOpenDetail = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsDetailOpen(true);
  };

  const handleResolveTicket = () => {
    if (!selectedTicket) return;
    setIsDetailOpen(false);
    showLoading({ title: 'Resolviendo ticket', subtitle: 'Cerrando ciclo de soporte...' });

    setTimeout(() => {
      setTickets((prev) =>
        prev.map((t) =>
          t.id === selectedTicket.id ? { ...t, status: 'resolved' } : t
        )
      );
      hideLoading();
      showAlert({ title: 'Ticket resuelto', description: `El ticket ${selectedTicket.ticketId} ha sido marcado como resuelto.`, variant: 'success' });
    }, 1200);
  };

  const handleCloseTicket = () => {
    if (!selectedTicket) return;
    setIsDetailOpen(false);
    showLoading({ title: 'Cerrando ticket', subtitle: 'Archivando reporte...' });

    setTimeout(() => {
      setTickets((prev) =>
        prev.map((t) =>
          t.id === selectedTicket.id ? { ...t, status: 'closed' } : t
        )
      );
      hideLoading();
      showAlert({ title: 'Ticket cerrado', description: `El ticket ${selectedTicket.ticketId} ha sido cerrado.`, variant: 'info' });
    }, 1200);
  };

  const getPriorityBadge = (priority: 'high' | 'medium' | 'low') => {
    const styles = {
      high: 'border-red-900/30 bg-red-950/20 text-red-400',
      medium: 'border-amber-900/30 bg-amber-950/20 text-amber-400',
      low: 'border-gray-800 bg-gray-900 text-gray-400',
    };
    const labels = {
      high: 'Alta',
      medium: 'Media',
      low: 'Baja',
    };
    return (
      <span className={`inline-block border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full ${styles[priority]}`}>
        {labels[priority]}
      </span>
    );
  };

  const getStatusBadge = (status: 'open' | 'resolved' | 'closed') => {
    const styles = {
      open: 'border-blue-900/30 bg-blue-950/20 text-blue-400',
      resolved: 'border-emerald-900/30 bg-emerald-950/20 text-emerald-400',
      closed: 'border-gray-800 bg-gray-900 text-gray-500',
    };
    const labels = {
      open: 'Abierto',
      resolved: 'Resuelto',
      closed: 'Cerrado',
    };
    return (
      <span className={`inline-block border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const matchesSearch =
        t.ticketId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.issue.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tickets, searchQuery, statusFilter, priorityFilter]);

  const tableRows = filteredTickets.map((t) => ({
    ticketId: <span className="font-semibold text-purple-400">{t.ticketId}</span>,
    client: <span className="font-semibold text-white">{t.clientName}</span>,
    issue: <span className="text-gray-300">{t.issue}</span>,
    priority: getPriorityBadge(t.priority),
    status: getStatusBadge(t.status),
    acciones: (
      <div className="flex items-center gap-1.5 justify-start">
        <Buttons
          variant="secondary"
          size="sm"
          onClick={() => handleOpenDetail(t)}
          title={`View details for ${t.ticketId}`}
        >
          Detalles
        </Buttons>
      </div>
    ),
  }));

  const filtersNode = (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between w-full">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Buscar por ID, cliente o asunto..."
        />

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mr-1.5">Estado:</span>
          {[
            { key: 'all', label: 'Todos' },
            { key: 'open', label: 'Abiertos' },
            { key: 'resolved', label: 'Resueltos' },
            { key: 'closed', label: 'Cerrados' },
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

      <div className="flex flex-wrap items-center gap-1.5 border-t border-border-dark/30 pt-3">
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mr-1.5">Prioridad:</span>
        {[
          { key: 'all', label: 'Todos' },
          { key: 'high', label: 'Alta' },
          { key: 'medium', label: 'Media' },
          { key: 'low', label: 'Baja' },
        ].map((btn) => (
          <button
            key={btn.key}
            type="button"
            onClick={() => setPriorityFilter(btn.key)}
            className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded border transition cursor-pointer ${
              priorityFilter === btn.key
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
        <h1 className="text-xl font-bold tracking-tight text-white uppercase">Soporte Post-Venta</h1>
        <p className="mt-1 text-xs text-gray-400">Atención a clientes, consultas técnicas, reclamos y estados de soporte.</p>
      </div>

      <Table
        title="Buzón de Incidencias & Consultas"
        button={
          <Buttons variant="primary" size="sm" onClick={handleOpenAdd}>
            Abrir Ticket
          </Buttons>
        }
        filters={filtersNode}
        data={tableRows}
        columns={['ticketId', 'client', 'issue', 'priority', 'status', 'acciones']}
      />

      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Abrir Nuevo Ticket de Soporte"
        onSubmit={handleAddSubmit}
        primaryButtonText="Registrar Ticket"
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
            label="Asunto / Problema"
            value={issueInput}
            onChange={setIssueInput}
            placeholder="Ej. El VPS no responde ping"
            required
          />
          <Selects
            label="Prioridad"
            value={priorityInput}
            onChange={setPriorityInput}
            options={['high', 'medium', 'low']}
            placeholder="Seleccione prioridad"
          />
          <TextArea
            label="Detalle del Problema"
            value={descInput}
            onChange={setDescInput}
            placeholder="Describa el problema detalladamente..."
            required
          />
        </div>
      </Modal>

      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title={`Detalle de Ticket ${selectedTicket?.ticketId}`}
        showActions={selectedTicket?.status === 'open'}
        actions={[
          { label: 'Cerrar Ticket', onClick: handleCloseTicket, variant: 'secondary' },
          { label: 'Marcar Resuelto', onClick: handleResolveTicket, variant: 'primary' },
        ]}
      >
        <div className="space-y-4 text-xs">
          <div className="flex flex-wrap items-center gap-4 border-b border-border-dark pb-3">
            <div>
              <span className="text-gray-500 font-bold uppercase tracking-wider block">Cliente</span>
              <span className="text-white font-semibold text-sm mt-0.5 block">{selectedTicket?.clientName}</span>
            </div>
            <div>
              <span className="text-gray-500 font-bold uppercase tracking-wider block">Fecha Reporte</span>
              <span className="text-gray-300 font-semibold text-sm mt-0.5 block">{selectedTicket?.date}</span>
            </div>
            <div>
              <span className="text-gray-500 font-bold uppercase tracking-wider block">Prioridad</span>
              <div className="mt-0.5">{selectedTicket && getPriorityBadge(selectedTicket.priority)}</div>
            </div>
            <div>
              <span className="text-gray-500 font-bold uppercase tracking-wider block">Estado</span>
              <div className="mt-0.5">{selectedTicket && getStatusBadge(selectedTicket.status)}</div>
            </div>
          </div>
          <div>
            <span className="text-gray-500 font-bold uppercase tracking-wider block mb-1">Problema Reportado</span>
            <span className="text-white font-semibold text-sm">{selectedTicket?.issue}</span>
          </div>
          <div>
            <span className="text-gray-500 font-bold uppercase tracking-wider block mb-1">Descripción Detallada</span>
            <p className="text-gray-300 leading-relaxed bg-bg-panel border border-border-dark p-3 rounded">{selectedTicket?.description}</p>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default PostVenta;

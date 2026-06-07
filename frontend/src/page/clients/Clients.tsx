import { useState, useMemo } from 'react';
import Table from '../../components/Table';
import Buttons from '../../components/ui/Buttons';
import Inputs from '../../components/ui/Inputs';
import Selects from '../../components/ui/Selects';
import SearchInput from '../../components/ui/SearchInput';
import { Modal } from '../../components/Modal';
import { useAlert } from '../../hooks/useAlert';
import { useLoading } from '../../hooks/useLoading';

interface Client {
  id: number;
  name: string;
  email: string;
  status: string;
}

function Clients() {
  const { showAlert } = useAlert();
  const { showLoading, hideLoading } = useLoading();

  const [clients, setClients] = useState<Client[]>([
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'inactive' },
    { id: 3, name: 'Carlos Ruiz', email: 'carlos@example.com', status: 'active' },
    { id: 4, name: 'Ana García', email: 'ana@example.com', status: 'pending' },
    { id: 5, name: 'Laura Pérez', email: 'laura@example.com', status: 'active' },
    { id: 6, name: 'Miguel Torres', email: 'miguel@example.com', status: 'inactive' },
    { id: 7, name: 'Valeria Flores', email: 'valeria@example.com', status: 'active' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [statusInput, setStatusInput] = useState('active');

  const handleOpenAdd = () => {
    setNameInput('');
    setEmailInput('');
    setStatusInput('active');
    setIsAddOpen(true);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput || !emailInput) {
      showAlert({ title: 'Error', description: 'Por favor complete todos los campos', variant: 'danger' });
      return;
    }
    setIsAddOpen(false);
    showLoading({ title: 'Agregando cliente', subtitle: 'Guardando registro...' });

    setTimeout(() => {
      const newClient: Client = {
        id: clients.length ? Math.max(...clients.map((c) => c.id)) + 1 : 1,
        name: nameInput,
        email: emailInput,
        status: statusInput,
      };
      setClients((prev) => [newClient, ...prev]);
      hideLoading();
      showAlert({ title: 'Cliente agregado', description: `El cliente ${nameInput} se agregó correctamente.`, variant: 'success' });
    }, 1200);
  };

  const handleOpenEdit = (client: Client) => {
    setSelectedClient(client);
    setNameInput(client.name);
    setEmailInput(client.email);
    setStatusInput(client.status);
    setIsEditOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) return;
    if (!nameInput || !emailInput) {
      showAlert({ title: 'Error', description: 'Por favor complete todos los campos', variant: 'danger' });
      return;
    }
    setIsEditOpen(false);
    showLoading({ title: 'Actualizando cliente', subtitle: 'Guardando cambios...' });

    setTimeout(() => {
      setClients((prev) =>
        prev.map((c) =>
          c.id === selectedClient.id
            ? { ...c, name: nameInput, email: emailInput, status: statusInput }
            : c
        )
      );
      hideLoading();
      showAlert({ title: 'Cliente actualizado', description: `El cliente ${nameInput} se editó con éxito.`, variant: 'info' });
    }, 1200);
  };

  const handleOpenDelete = (client: Client) => {
    setSelectedClient(client);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedClient) return;
    setIsDeleteOpen(false);
    showLoading({ title: 'Eliminando cliente', subtitle: 'Removiendo registro de la base de datos...' });

    setTimeout(() => {
      setClients((prev) => prev.filter((c) => c.id !== selectedClient.id));
      hideLoading();
      showAlert({ title: 'Cliente eliminado', description: 'El registro fue removido del sistema.', variant: 'warning' });
    }, 1200);
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: 'border-emerald-900/30 bg-emerald-950/20 text-emerald-400',
      inactive: 'border-gray-800 bg-gray-900 text-gray-400',
      pending: 'border-amber-900/30 bg-amber-950/20 text-amber-400',
    };
    return (
      <span className={`inline-block border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full ${styles[status] ?? styles.inactive}`}>
        {status === 'active' ? 'Activo' : status === 'inactive' ? 'Inactivo' : 'Pendiente'}
      </span>
    );
  };

  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const matchesSearch =
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || client.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [clients, searchQuery, statusFilter]);

  const tableRows = filteredClients.map((client) => ({
    id: <span className="font-semibold text-purple-400">#{client.id}</span>,
    name: <span className="font-semibold text-white">{client.name}</span>,
    email: <span className="text-gray-400">{client.email}</span>,
    status: getStatusBadge(client.status),
    acciones: (
      <div className="flex items-center gap-1.5 justify-start">
        <Buttons
          variant="secondary"
          size="sm"
          onClick={() => handleOpenEdit(client)}
          title={`Edit client ${client.name}`}
        >
          Editar
        </Buttons>
        <Buttons
          variant="danger"
          size="sm"
          onClick={() => handleOpenDelete(client)}
          title={`Delete client ${client.name}`}
        >
          Eliminar
        </Buttons>
      </div>
    ),
  }));

  const filtersNode = (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between w-full">
      <SearchInput
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Buscar clientes por nombre o correo..."
      />

      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mr-1.5">Estado:</span>
        {[
          { key: 'all', label: 'Todos' },
          { key: 'active', label: 'Activo' },
          { key: 'inactive', label: 'Inactivo' },
          { key: 'pending', label: 'Pendiente' },
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
        <h1 className="text-xl font-bold tracking-tight text-white uppercase">Clientes</h1>
        <p className="mt-1 text-xs text-gray-400">Manejo de registros, creación y edición de cuentas de clientes.</p>
      </div>

      <Table
        title="Base de Datos de Clientes"
        button={
          <Buttons variant="primary" size="sm" onClick={handleOpenAdd}>
            Agregar Cliente
          </Buttons>
        }
        filters={filtersNode}
        data={tableRows}
        columns={['id', 'name', 'email', 'status', 'acciones']}
      />

      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Agregar Nuevo Cliente"
        onSubmit={handleAddSubmit}
        primaryButtonText="Registrar"
      >
        <div className="space-y-4">
          <Inputs
            label="Nombre Completo"
            value={nameInput}
            onChange={setNameInput}
            placeholder="Ej. Juan Pérez"
            required
          />
          <Inputs
            label="Correo Electrónico"
            type="email"
            value={emailInput}
            onChange={setEmailInput}
            placeholder="Ej. juan@example.com"
            required
          />
          <Selects
            label="Estado Inicial"
            value={statusInput}
            onChange={setStatusInput}
            options={['active', 'inactive', 'pending']}
            placeholder="Seleccione el estado"
          />
        </div>
      </Modal>

      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Editar Datos de Cliente"
        onSubmit={handleEditSubmit}
        primaryButtonText="Guardar Cambios"
      >
        <div className="space-y-4">
          <Inputs
            label="Nombre Completo"
            value={nameInput}
            onChange={setNameInput}
            placeholder="Ej. Juan Pérez"
            required
          />
          <Inputs
            label="Correo Electrónico"
            type="email"
            value={emailInput}
            onChange={setEmailInput}
            placeholder="Ej. juan@example.com"
            required
          />
          <Selects
            label="Estado"
            value={statusInput}
            onChange={setStatusInput}
            options={['active', 'inactive', 'pending']}
            placeholder="Seleccione el estado"
          />
        </div>
      </Modal>

      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Eliminar Cliente"
        variant="danger"
        showActions={true}
        actions={[
          { label: 'Cancelar', onClick: () => setIsDeleteOpen(false), variant: 'secondary' },
          { label: 'Eliminar Registro', onClick: handleDeleteConfirm, variant: 'danger' },
        ]}
      >
        <p className="text-sm">
          ¿Está seguro que desea eliminar a <strong className="text-white">{selectedClient?.name}</strong>? Esta acción no se puede deshacer y se borrará permanentemente de la base de datos.
        </p>
      </Modal>
    </div>
  );
}

export default Clients;

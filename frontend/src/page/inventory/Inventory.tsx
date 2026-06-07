import { useState, useMemo } from 'react';
import Table from '../../components/Table';
import Buttons from '../../components/ui/Buttons';
import Inputs from '../../components/ui/Inputs';
import Selects from '../../components/ui/Selects';
import SearchInput from '../../components/ui/SearchInput';
import { Modal } from '../../components/Modal';
import { useAlert } from '../../hooks/useAlert';
import { useLoading } from '../../hooks/useLoading';

interface InventoryItem {
  id: number;
  sku: string;
  name: string;
  stock: number;
  price: number;
  status: 'instock' | 'lowstock' | 'outofstock';
}

function Inventory() {
  const { showAlert } = useAlert();
  const { showLoading, hideLoading } = useLoading();

  const [items, setItems] = useState<InventoryItem[]>([
    { id: 1, sku: 'SKU-8921', name: 'Licencia SaaS Corporativa', stock: 120, price: 49.0, status: 'instock' },
    { id: 2, sku: 'SKU-4821', name: 'Servidor VPS Linux Pro', stock: 15, price: 199.0, status: 'instock' },
    { id: 3, sku: 'SKU-1082', name: 'Consultoría Especializada TI', stock: 2, price: 1200.0, status: 'lowstock' },
    { id: 4, sku: 'SKU-9923', name: 'Soporte Cloud 24/7 Anual', stock: 8, price: 599.0, status: 'lowstock' },
    { id: 5, sku: 'SKU-3120', name: 'Firewall Hardware Enterprise', stock: 0, price: 2499.0, status: 'outofstock' },
    { id: 6, sku: 'SKU-5401', name: 'Dominio y Hosting Dedicado', stock: 45, price: 89.0, status: 'instock' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const [skuInput, setSkuInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [stockInput, setStockInput] = useState('');
  const [priceInput, setPriceInput] = useState('');
  const [statusInput, setStatusInput] = useState('instock');

  const handleOpenAdd = () => {
    setSkuInput(`SKU-${Math.floor(1000 + Math.random() * 9000)}`);
    setNameInput('');
    setStockInput('');
    setPriceInput('');
    setStatusInput('instock');
    setIsAddOpen(true);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const stockVal = parseInt(stockInput);
    const priceVal = parseFloat(priceInput);

    if (!nameInput || isNaN(stockVal) || isNaN(priceVal)) {
      showAlert({ title: 'Error', description: 'Por favor complete todos los campos válidamente', variant: 'danger' });
      return;
    }

    setIsAddOpen(false);
    showLoading({ title: 'Agregando artículo', subtitle: 'Guardando en inventario...' });

    setTimeout(() => {
      const newItem: InventoryItem = {
        id: items.length ? Math.max(...items.map((i) => i.id)) + 1 : 1,
        sku: skuInput,
        name: nameInput,
        stock: stockVal,
        price: priceVal,
        status: statusInput as any,
      };
      setItems((prev) => [newItem, ...prev]);
      hideLoading();
      showAlert({ title: 'Artículo registrado', description: `Se registró ${nameInput} correctamente.`, variant: 'success' });
    }, 1200);
  };

  const handleOpenEdit = (item: InventoryItem) => {
    setSelectedItem(item);
    setSkuInput(item.sku);
    setNameInput(item.name);
    setStockInput(item.stock.toString());
    setPriceInput(item.price.toString());
    setStatusInput(item.status);
    setIsEditOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    const stockVal = parseInt(stockInput);
    const priceVal = parseFloat(priceInput);

    if (!nameInput || isNaN(stockVal) || isNaN(priceVal)) {
      showAlert({ title: 'Error', description: 'Por favor complete todos los campos válidamente', variant: 'danger' });
      return;
    }

    setIsEditOpen(false);
    showLoading({ title: 'Actualizando artículo', subtitle: 'Guardando cambios...' });

    setTimeout(() => {
      setItems((prev) =>
        prev.map((i) =>
          i.id === selectedItem.id
            ? { ...i, name: nameInput, stock: stockVal, price: priceVal, status: statusInput as any }
            : i
        )
      );
      hideLoading();
      showAlert({ title: 'Inventario actualizado', description: `Los cambios para ${nameInput} fueron guardados.`, variant: 'info' });
    }, 1200);
  };

  const handleOpenDelete = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedItem) return;
    setIsDeleteOpen(false);
    showLoading({ title: 'Eliminando artículo', subtitle: 'Borrando registro del inventario...' });

    setTimeout(() => {
      setItems((prev) => prev.filter((i) => i.id !== selectedItem.id));
      hideLoading();
      showAlert({ title: 'Artículo removido', description: 'Se eliminó el producto del inventario.', variant: 'warning' });
    }, 1200);
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      instock: 'border-emerald-900/30 bg-emerald-950/20 text-emerald-400',
      lowstock: 'border-amber-900/30 bg-amber-950/20 text-amber-400',
      outofstock: 'border-red-900/30 bg-red-950/20 text-red-400',
    };
    const labels: Record<string, string> = {
      instock: 'En Stock',
      lowstock: 'Stock Bajo',
      outofstock: 'Agotado',
    };
    return (
      <span className={`inline-block border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full ${styles[status] ?? styles.outofstock}`}>
        {labels[status] ?? 'Agotado'}
      </span>
    );
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [items, searchQuery, statusFilter]);

  const tableRows = filteredItems.map((item) => ({
    sku: <span className="font-semibold text-purple-400">{item.sku}</span>,
    name: <span className="font-semibold text-white">{item.name}</span>,
    stock: <span className="font-bold">{item.stock}</span>,
    price: <span className="text-gray-300 font-semibold">${item.price.toFixed(2)}</span>,
    status: getStatusBadge(item.status),
    acciones: (
      <div className="flex items-center gap-1.5 justify-start">
        <Buttons
          variant="secondary"
          size="sm"
          onClick={() => handleOpenEdit(item)}
          title={`Edit item ${item.name}`}
        >
          Editar
        </Buttons>
        <Buttons
          variant="danger"
          size="sm"
          onClick={() => handleOpenDelete(item)}
          title={`Delete item ${item.name}`}
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
        placeholder="Buscar por SKU o descripción..."
      />

      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mr-1.5">Stock:</span>
        {[
          { key: 'all', label: 'Todos' },
          { key: 'instock', label: 'En Stock' },
          { key: 'lowstock', label: 'Stock Bajo' },
          { key: 'outofstock', label: 'Agotado' },
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
        <h1 className="text-xl font-bold tracking-tight text-white uppercase">Inventario y Proyectos</h1>
        <p className="mt-1 text-xs text-gray-400">Control de existencias, productos SaaS, hardware corporativo y servicios.</p>
      </div>

      <Table
        title="Control de Productos & Servicios"
        button={
          <Buttons variant="primary" size="sm" onClick={handleOpenAdd}>
            Agregar Artículo
          </Buttons>
        }
        filters={filtersNode}
        data={tableRows}
        columns={['sku', 'name', 'stock', 'price', 'status', 'acciones']}
      />

      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Agregar Nuevo Artículo"
        onSubmit={handleAddSubmit}
        primaryButtonText="Registrar Artículo"
      >
        <div className="space-y-4">
          <Inputs
            label="SKU"
            value={skuInput}
            onChange={setSkuInput}
            readOnly
            disabled
          />
          <Inputs
            label="Nombre del Producto / Servicio"
            value={nameInput}
            onChange={setNameInput}
            placeholder="Ej. Servidor VPS Linux Pro"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Inputs
              label="Stock / Unidades"
              type="number"
              value={stockInput}
              onChange={setStockInput}
              placeholder="Ej. 10"
              required
            />
            <Inputs
              label="Precio Unitario ($)"
              type="number"
              step="0.01"
              value={priceInput}
              onChange={setPriceInput}
              placeholder="Ej. 199.00"
              required
            />
          </div>
          <Selects
            label="Estado Inicial"
            value={statusInput}
            onChange={setStatusInput}
            options={['instock', 'lowstock', 'outofstock']}
            placeholder="Seleccione el estado de stock"
          />
        </div>
      </Modal>

      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Editar Artículo de Inventario"
        onSubmit={handleEditSubmit}
        primaryButtonText="Guardar Cambios"
      >
        <div className="space-y-4">
          <Inputs
            label="SKU"
            value={skuInput}
            onChange={setSkuInput}
            readOnly
            disabled
          />
          <Inputs
            label="Nombre del Producto / Servicio"
            value={nameInput}
            onChange={setNameInput}
            placeholder="Ej. Servidor VPS Linux Pro"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Inputs
              label="Stock / Unidades"
              type="number"
              value={stockInput}
              onChange={setStockInput}
              placeholder="Ej. 10"
              required
            />
            <Inputs
              label="Precio Unitario ($)"
              type="number"
              step="0.01"
              value={priceInput}
              onChange={setPriceInput}
              placeholder="Ej. 199.00"
              required
            />
          </div>
          <Selects
            label="Estado de Stock"
            value={statusInput}
            onChange={setStatusInput}
            options={['instock', 'lowstock', 'outofstock']}
            placeholder="Seleccione el estado de stock"
          />
        </div>
      </Modal>

      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Eliminar Artículo de Inventario"
        variant="danger"
        showActions={true}
        actions={[
          { label: 'Cancelar', onClick: () => setIsDeleteOpen(false), variant: 'secondary' },
          { label: 'Eliminar Registro', onClick: handleDeleteConfirm, variant: 'danger' },
        ]}
      >
        <p className="text-sm">
          ¿Está seguro que desea eliminar <strong className="text-white">{selectedItem?.name}</strong>? Se borrará permanentemente de los registros de existencias.
        </p>
      </Modal>
    </div>
  );
}

export default Inventory;

import { useState, useMemo } from 'react';
import Table from '../../components/Table';
import Buttons from '../../components/ui/Buttons';
import Inputs from '../../components/ui/Inputs';
import SearchInput from '../../components/ui/SearchInput';
import { Modal } from '../../components/Modal';
import { useAlert } from '../../hooks/useAlert';
import { useLoading } from '../../hooks/useLoading';
import loginIllustration from '../../assets/login_illustration.png';

interface InventoryItem {
  id: number;
  sku: string;
  name: string;
  stock: number;
  price: number;
  status: 'instock' | 'lowstock' | 'outofstock';
  minStock?: number;
  expiryDate?: string;
  category?: string;
  costPrice: number;
  wholesalePrice: number;
  wholesaleMinQty: number;
  marginPercent: number;
  offerPrice: number;
  rebatePrice: number;
  isPublic?: boolean;
  isIvaPublic?: boolean;
  paypalPrice?: number;
  binancePrice?: number;
  zinliPrice?: number;
}

function Inventory() {
  const { showAlert } = useAlert();
  const { showLoading, hideLoading } = useLoading();

  const [items, setItems] = useState<InventoryItem[]>([
    { id: 1, sku: 'SKU-8921', name: 'Licencia SaaS Corporativa', stock: 120, price: 49.0, status: 'instock', minStock: 10, category: 'sistemas', costPrice: 37.69, wholesalePrice: 42.0, wholesaleMinQty: 5, marginPercent: 30, offerPrice: 45.0, rebatePrice: 40.0 },
    { id: 2, sku: 'SKU-4821', name: 'Servidor VPS Linux Pro', stock: 15, price: 199.0, status: 'instock', minStock: 2, category: 'servicios', costPrice: 153.07, wholesalePrice: 180.0, wholesaleMinQty: 3, marginPercent: 30, offerPrice: 189.0, rebatePrice: 175.0 },
    { id: 3, sku: 'SKU-1082', name: 'Consultoría Especializada TI', stock: 2, price: 1200.0, status: 'lowstock', minStock: 5, category: 'servicios', costPrice: 923.07, wholesalePrice: 1100.0, wholesaleMinQty: 2, marginPercent: 30, offerPrice: 1150.0, rebatePrice: 1000.0 },
    { id: 4, sku: 'SKU-9923', name: 'Soporte Cloud 24/7 Anual', stock: 8, price: 599.0, status: 'lowstock', minStock: 10, category: 'servicios', costPrice: 460.76, wholesalePrice: 550.0, wholesaleMinQty: 4, marginPercent: 30, offerPrice: 570.0, rebatePrice: 520.0 },
    { id: 5, sku: 'SKU-3120', name: 'Firewall Hardware Enterprise', stock: 0, price: 2499.0, status: 'outofstock', minStock: 1, category: 'sistemas', costPrice: 1922.3, wholesalePrice: 2200.0, wholesaleMinQty: 2, marginPercent: 30, offerPrice: 2399.0, rebatePrice: 2150.0 },
    { id: 6, sku: 'SKU-7721', name: 'Jamón Cocido Ahumado 1Kg', stock: 12, price: 8.50, status: 'instock', minStock: 5, expiryDate: '2026-06-12', category: 'alimentos', costPrice: 6.53, wholesalePrice: 7.80, wholesaleMinQty: 10, marginPercent: 30, offerPrice: 8.0, rebatePrice: 7.50 },
    { id: 7, sku: 'SKU-8812', name: 'Harina de Maíz Precocida', stock: 4, price: 1.60, status: 'lowstock', minStock: 25, expiryDate: '2026-09-30', category: 'viveres', costPrice: 1.23, wholesalePrice: 1.45, wholesaleMinQty: 20, marginPercent: 30, offerPrice: 1.50, rebatePrice: 1.35 },
    { id: 8, sku: 'SKU-6603', name: 'Queso Blanco Palmita 1Kg', stock: 1, price: 6.80, status: 'lowstock', minStock: 10, expiryDate: '2026-06-10', category: 'alimentos', costPrice: 5.23, wholesalePrice: 6.10, wholesaleMinQty: 10, marginPercent: 30, offerPrice: 6.50, rebatePrice: 6.0 },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isImagesOpen, setIsImagesOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const [skuInput, setSkuInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [stockInput, setStockInput] = useState('');
  const [priceInput, setPriceInput] = useState('');
  const [minStockInput, setMinStockInput] = useState('');
  const [expiryInput, setExpiryInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('viveres');

  const [costInput, setCostInput] = useState('');
  const [marginInput, setMarginInput] = useState('30');
  const [wholesalePriceInput, setWholesalePriceInput] = useState('');
  const [wholesaleQtyInput, setWholesaleQtyInput] = useState('');
  const [offerPriceInput, setOfferPriceInput] = useState('');
  const [rebatePriceInput, setRebatePriceInput] = useState('');
  const [isPublicInput, setIsPublicInput] = useState(true);
  const [isIvaPublicInput, setIsIvaPublicInput] = useState(true);
  const [paypalPriceInput, setPaypalPriceInput] = useState('');
  const [binancePriceInput, setBinancePriceInput] = useState('');
  const [zinliPriceInput, setZinliPriceInput] = useState('');

  const [productImages, setProductImages] = useState<Record<number, string[]>>({
    1: [loginIllustration],
  });

  const [productDocs, setProductDocs] = useState<Record<number, string[]>>({
    1: ['Especificaciones_SaaS.pdf', 'Manual_Licencia.pdf'],
  });

  const alerts = useMemo(() => {
    const criticalList: { name: string; type: 'stock' | 'expiry'; msg: string }[] = [];
    
    items.forEach((item) => {
      if (item.stock === 0) {
        criticalList.push({ name: item.name, type: 'stock', msg: 'Producto totalmente agotado en inventario.' });
      } else if (item.minStock && item.stock <= item.minStock) {
        criticalList.push({ name: item.name, type: 'stock', msg: `Bajo stock: Quedan ${item.stock} unidades (Mínimo: ${item.minStock}).` });
      }

      if (item.expiryDate) {
        const exp = new Date(item.expiryDate);
        const today = new Date('2026-06-07');
        const diffTime = exp.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 0) {
          criticalList.push({ name: item.name, type: 'expiry', msg: 'Lote expirado. Retirar de la venta inmediatamente.' });
        } else if (diffDays <= 7) {
          criticalList.push({ name: item.name, type: 'expiry', msg: `Vence pronto: Expirará en ${diffDays} días (Fecha: ${item.expiryDate}).` });
        }
      }
    });

    return criticalList;
  }, [items]);

  const handleOpenAdd = () => {
    setSkuInput(`SKU-${Math.floor(1000 + Math.random() * 9000)}`);
    setNameInput('');
    setStockInput('');
    setPriceInput('');
    setMinStockInput('5');
    setExpiryInput('');
    setCategoryInput('viveres');
    setCostInput('');
    setMarginInput('30');
    setWholesalePriceInput('');
    setWholesaleQtyInput('5');
    setOfferPriceInput('');
    setRebatePriceInput('');
    setIsPublicInput(true);
    setIsIvaPublicInput(true);
    setPaypalPriceInput('');
    setBinancePriceInput('');
    setZinliPriceInput('');
    setIsAddOpen(true);
  };

  const handleCostOrMarginChange = (costValStr: string, marginValStr: string) => {
    const cost = parseFloat(costValStr);
    const margin = parseFloat(marginValStr);
    if (!isNaN(cost) && !isNaN(margin)) {
      const calculated = cost * (1 + margin / 100);
      setPriceInput(calculated.toFixed(2));
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const stockVal = parseInt(stockInput);
    const priceVal = parseFloat(priceInput);
    const minStockVal = parseInt(minStockInput) || 0;
    const costVal = parseFloat(costInput) || 0;
    const marginVal = parseFloat(marginInput) || 30;
    const wholesaleVal = parseFloat(wholesalePriceInput) || 0;
    const wholesaleQtyVal = parseInt(wholesaleQtyInput) || 0;
    const offerVal = parseFloat(offerPriceInput) || 0;
    const rebateVal = parseFloat(rebatePriceInput) || 0;

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
        status: stockVal === 0 ? 'outofstock' : stockVal <= minStockVal ? 'lowstock' : 'instock',
        minStock: minStockVal,
        expiryDate: expiryInput || undefined,
        category: categoryInput,
        costPrice: costVal,
        marginPercent: marginVal,
        wholesalePrice: wholesaleVal,
        wholesaleMinQty: wholesaleQtyVal,
        offerPrice: offerVal,
        rebatePrice: rebateVal,
        isPublic: isPublicInput,
        isIvaPublic: isIvaPublicInput,
        paypalPrice: parseFloat(paypalPriceInput) || undefined,
        binancePrice: parseFloat(binancePriceInput) || undefined,
        zinliPrice: parseFloat(zinliPriceInput) || undefined,
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
    setMinStockInput(item.minStock?.toString() || '0');
    setExpiryInput(item.expiryDate || '');
    setCategoryInput(item.category || 'viveres');
    setCostInput(item.costPrice.toString());
    setMarginInput(item.marginPercent.toString());
    setWholesalePriceInput(item.wholesalePrice.toString());
    setWholesaleQtyInput(item.wholesaleMinQty.toString());
    setOfferPriceInput(item.offerPrice.toString());
    setRebatePriceInput(item.rebatePrice.toString());
    setIsPublicInput(item.isPublic ?? true);
    setIsIvaPublicInput(item.isIvaPublic ?? true);
    setPaypalPriceInput(item.paypalPrice?.toString() || '');
    setBinancePriceInput(item.binancePrice?.toString() || '');
    setZinliPriceInput(item.zinliPrice?.toString() || '');
    setIsEditOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    const stockVal = parseInt(stockInput);
    const priceVal = parseFloat(priceInput);
    const minStockVal = parseInt(minStockInput) || 0;
    const costVal = parseFloat(costInput) || 0;
    const marginVal = parseFloat(marginInput) || 30;
    const wholesaleVal = parseFloat(wholesalePriceInput) || 0;
    const wholesaleQtyVal = parseInt(wholesaleQtyInput) || 0;
    const offerVal = parseFloat(offerPriceInput) || 0;
    const rebateVal = parseFloat(rebatePriceInput) || 0;

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
            ? {
                ...i,
                name: nameInput,
                stock: stockVal,
                price: priceVal,
                status: stockVal === 0 ? 'outofstock' : stockVal <= minStockVal ? 'lowstock' : 'instock',
                minStock: minStockVal,
                expiryDate: expiryInput || undefined,
                category: categoryInput,
                costPrice: costVal,
                marginPercent: marginVal,
                wholesalePrice: wholesaleVal,
                wholesaleMinQty: wholesaleQtyVal,
                offerPrice: offerVal,
                rebatePrice: rebateVal,
                isPublic: isPublicInput,
                isIvaPublic: isIvaPublicInput,
                paypalPrice: parseFloat(paypalPriceInput) || undefined,
                binancePrice: parseFloat(binancePriceInput) || undefined,
                zinliPrice: parseFloat(zinliPriceInput) || undefined,
              }
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

  const handleUploadImage = (itemId: number) => {
    showLoading({ title: 'Subiendo imagen', subtitle: 'Comprimiendo y guardando en servidor de medios...' });
    setTimeout(() => {
      hideLoading();
      setProductImages((prev) => {
        const current = prev[itemId] || [];
        return { ...prev, [itemId]: [...current, loginIllustration] };
      });
      showAlert({ title: 'Imagen Cargada', description: 'La imagen fue añadida al producto exitosamente.', variant: 'success' });
    }, 1000);
  };

  const handleRemoveImage = (itemId: number, index: number) => {
    setProductImages((prev) => {
      const current = [...(prev[itemId] || [])];
      current.splice(index, 1);
      return { ...prev, [itemId]: current };
    });
    showAlert({ title: 'Imagen Removida', description: 'La imagen fue retirada del catálogo.', variant: 'info' });
  };

  const handleUploadDoc = (itemId: number) => {
    const docName = `Especificaciones_${Math.floor(100 + Math.random() * 900)}.pdf`;
    showLoading({ title: 'Subiendo documento', subtitle: 'Indexando archivo adjunto...' });
    setTimeout(() => {
      hideLoading();
      setProductDocs((prev) => {
        const current = prev[itemId] || [];
        return { ...prev, [itemId]: [...current, docName] };
      });
      showAlert({ title: 'Documento Adjuntado', description: `Se guardó el archivo "${docName}" correctamente.`, variant: 'success' });
    }, 1000);
  };

  const handleRemoveDoc = (itemId: number, docIndex: number) => {
    setProductDocs((prev) => {
      const current = [...(prev[itemId] || [])];
      current.splice(docIndex, 1);
      return { ...prev, [itemId]: current };
    });
    showAlert({ title: 'Archivo Removido', description: 'El documento fue eliminado.', variant: 'info' });
  };

  const tableRows = filteredItems.map((item) => ({
    sku: <span className="font-semibold text-purple-400">{item.sku}</span>,
    name: (
      <div>
        <span className="font-semibold text-white block">{item.name}</span>
        {item.expiryDate && (
          <span className="text-[10px] text-gray-500 block">Vence: {item.expiryDate}</span>
        )}
      </div>
    ),
    stock: (
      <div>
        <span className="font-bold">{item.stock}</span>
        {item.minStock !== undefined && (
          <span className="text-[10px] text-gray-500 block">Mín: {item.minStock}</span>
        )}
      </div>
    ),
    price: (
      <div>
        <span className="text-white font-semibold block">${item.price.toFixed(2)}</span>
        <span className="text-[9px] text-gray-500 block">Mayor: ${item.wholesalePrice.toFixed(2)} ({item.wholesaleMinQty}+)</span>
      </div>
    ),
    status: getStatusBadge(item.status),
    acciones: (
      <div className="flex items-center gap-1 justify-start">
        <button
          type="button"
          onClick={() => {
            setSelectedItem(item);
            setIsDetailOpen(true);
          }}
          className="p-1 rounded border border-border-dark bg-bg-card text-gray-400 hover:text-white hover:border-purple-500/50 transition cursor-pointer"
          title="Ver Ficha Completa (ID)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>

        <button
          type="button"
          onClick={() => {
            setSelectedItem(item);
            setIsImagesOpen(true);
          }}
          className="p-1 rounded border border-border-dark bg-bg-card text-gray-400 hover:text-white hover:border-purple-500/50 transition cursor-pointer"
          title="Cargar Imágenes del Producto"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>

        <button
          type="button"
          onClick={() => {
            setSelectedItem(item);
            setIsDocsOpen(true);
          }}
          className="p-1 rounded border border-border-dark bg-bg-card text-gray-400 hover:text-white hover:border-purple-500/50 transition cursor-pointer"
          title="Cargar y Descargar Documentos PDF"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </button>

        <button
          type="button"
          onClick={() => handleOpenEdit(item)}
          className="p-1 rounded border border-border-dark bg-bg-card text-gray-400 hover:text-white hover:border-purple-500/50 transition cursor-pointer"
          title="Editar Producto"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>

        <button
          type="button"
          onClick={() => handleOpenDelete(item)}
          className="p-1 rounded border border-border-dark bg-bg-card text-red-500 hover:text-red-400 hover:border-red-500/50 transition cursor-pointer"
          title="Eliminar Producto"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
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
        <h1 className="text-xl font-bold tracking-tight text-white uppercase">Inventario y Alertas</h1>
        <p className="mt-1 text-xs text-gray-400">Control de existencias, umbral de mínimos de stock y precios al mayor u oferta.</p>
      </div>

      {alerts.length > 0 && (
        <section className="border border-red-950 bg-red-950/10 p-4 rounded-lg space-y-3 shadow-md">
          <div className="flex items-center gap-2 text-red-400 font-bold uppercase text-[10px] tracking-wider">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>Alertas Críticas de Inventario ({alerts.length})</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[140px] overflow-y-auto pr-1 custom-scrollbar">
            {alerts.map((al, idx) => (
              <div key={idx} className="flex gap-2 items-start bg-black/20 p-2.5 rounded border border-border-dark/30 text-[11px] text-gray-300">
                <span className={`px-1 rounded text-[8px] font-black uppercase shrink-0 mt-0.5 ${al.type === 'expiry' ? 'bg-red-950/80 text-red-400 border border-red-900/30' : 'bg-amber-950/80 text-amber-400 border border-amber-900/30'}`}>
                  {al.type === 'expiry' ? 'Vence' : 'Stock'}
                </span>
                <div>
                  <strong className="text-white block font-semibold">{al.name}</strong>
                  <span className="text-[10px] text-gray-400">{al.msg}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

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
            placeholder="Ej. Jamón Ahumado o Servidor VPS"
            required
          />
          <div className="grid grid-cols-3 gap-3">
            <Inputs
              label="Stock Inicial"
              type="number"
              value={stockInput}
              onChange={setStockInput}
              placeholder="Ej. 10"
              required
            />
            <Inputs
              label="Mínimo de Alerta"
              type="number"
              value={minStockInput}
              onChange={setMinStockInput}
              placeholder="Ej. 5"
              required
            />
            <Inputs
              label="Vencimiento (Opcional)"
              type="date"
              value={expiryInput}
              onChange={setExpiryInput}
            />
          </div>

          <div className="border-t border-border-dark/65 pt-3">
            <h4 className="text-[10px] text-purple-400 font-bold uppercase tracking-wider mb-3">Precios y Márgenes de Ganancia</h4>
            <div className="grid grid-cols-3 gap-3">
              <Inputs
                label="Precio Costo ($)"
                type="number"
                step="0.01"
                value={costInput}
                onChange={(v) => {
                  setCostInput(v);
                  handleCostOrMarginChange(v, marginInput);
                }}
                placeholder="Ej. 10.00"
                required
              />
              <Inputs
                label="Margen de Ganancia (%)"
                type="number"
                value={marginInput}
                onChange={(v) => {
                  setMarginInput(v);
                  handleCostOrMarginChange(costInput, v);
                }}
                placeholder="Ej. 30"
                required
              />
              <Inputs
                label="Precio Unitario Venta ($)"
                type="number"
                step="0.01"
                value={priceInput}
                onChange={setPriceInput}
                placeholder="Ej. 13.00"
                required
              />
            </div>

            <div className="grid grid-cols-4 gap-2.5 mt-3">
              <Inputs
                label="Precio al Mayor ($)"
                type="number"
                step="0.01"
                value={wholesalePriceInput}
                onChange={setWholesalePriceInput}
                placeholder="Ej. 11.50"
              />
              <Inputs
                label="Mín. Mayoreo Cantidad"
                type="number"
                value={wholesaleQtyInput}
                onChange={setWholesaleQtyInput}
                placeholder="Ej. 5"
              />
              <Inputs
                label="Precio Oferta ($)"
                type="number"
                step="0.01"
                value={offerPriceInput}
                onChange={setOfferPriceInput}
                placeholder="Ej. 12.00"
              />
              <Inputs
                label="Precio Rebaja ($)"
                type="number"
                step="0.01"
                value={rebatePriceInput}
                onChange={setRebatePriceInput}
                placeholder="Ej. 11.00"
              />
            </div>

            <div className="border-t border-border-dark/65 pt-3">
              <h4 className="text-[10px] text-purple-400 font-bold uppercase tracking-wider mb-2">Visibilidad en E-Commerce Público</h4>
              <div className="flex gap-6 items-center text-xs text-gray-300">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isPublicInput}
                    onChange={(e) => setIsPublicInput(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-700 bg-bg-panel text-purple-650 focus:ring-purple-500 cursor-pointer"
                  />
                  <span>Público en E-Commerce</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isIvaPublicInput}
                    onChange={(e) => setIsIvaPublicInput(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-700 bg-bg-panel text-purple-650 focus:ring-purple-500 cursor-pointer"
                  />
                  <span>Mostrar IVA al Público</span>
                </label>
              </div>
            </div>

            <div className="border-t border-border-dark/65 pt-3">
              <h4 className="text-[10px] text-purple-400 font-bold uppercase tracking-wider mb-3">Precios en Plataformas Externas ($)</h4>
              <div className="grid grid-cols-3 gap-3">
                <Inputs
                  label="Precio PayPal ($)"
                  type="number"
                  step="0.01"
                  value={paypalPriceInput}
                  onChange={setPaypalPriceInput}
                  placeholder="Ej. 14.50"
                />
                <Inputs
                  label="Precio Binance Pay ($)"
                  type="number"
                  step="0.01"
                  value={binancePriceInput}
                  onChange={setBinancePriceInput}
                  placeholder="Ej. 13.00"
                />
                <Inputs
                  label="Precio Zinli ($)"
                  type="number"
                  step="0.01"
                  value={zinliPriceInput}
                  onChange={setZinliPriceInput}
                  placeholder="Ej. 13.00"
                />
              </div>
            </div>
          </div>
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
          <div className="grid grid-cols-3 gap-3">
            <Inputs
              label="Stock / Unidades"
              type="number"
              value={stockInput}
              onChange={setStockInput}
              placeholder="Ej. 10"
              required
            />
            <Inputs
              label="Mínimo de Alerta"
              type="number"
              value={minStockInput}
              onChange={setMinStockInput}
              placeholder="Ej. 5"
              required
            />
            <Inputs
              label="Vencimiento (Opcional)"
              type="date"
              value={expiryInput}
              onChange={setExpiryInput}
            />
          </div>

          <div className="border-t border-border-dark/65 pt-3">
            <h4 className="text-[10px] text-purple-400 font-bold uppercase tracking-wider mb-3">Precios y Márgenes de Ganancia</h4>
            <div className="grid grid-cols-3 gap-3">
              <Inputs
                label="Precio Costo ($)"
                type="number"
                step="0.01"
                value={costInput}
                onChange={(v) => {
                  setCostInput(v);
                  handleCostOrMarginChange(v, marginInput);
                }}
                placeholder="Ej. 10.00"
                required
              />
              <Inputs
                label="Margen de Ganancia (%)"
                type="number"
                value={marginInput}
                onChange={(v) => {
                  setMarginInput(v);
                  handleCostOrMarginChange(costInput, v);
                }}
                placeholder="Ej. 30"
                required
              />
              <Inputs
                label="Precio Unitario Venta ($)"
                type="number"
                step="0.01"
                value={priceInput}
                onChange={setPriceInput}
                placeholder="Ej. 13.00"
                required
              />
            </div>

            <div className="grid grid-cols-4 gap-2.5 mt-3">
              <Inputs
                label="Precio al Mayor ($)"
                type="number"
                step="0.01"
                value={wholesalePriceInput}
                onChange={setWholesalePriceInput}
                placeholder="Ej. 11.50"
              />
              <Inputs
                label="Mín. Mayoreo Cantidad"
                type="number"
                value={wholesaleQtyInput}
                onChange={setWholesaleQtyInput}
                placeholder="Ej. 5"
              />
              <Inputs
                label="Precio Oferta ($)"
                type="number"
                step="0.01"
                value={offerPriceInput}
                onChange={setOfferPriceInput}
                placeholder="Ej. 12.00"
              />
              <Inputs
                label="Precio Rebaja ($)"
                type="number"
                step="0.01"
                value={rebatePriceInput}
                onChange={setRebatePriceInput}
                placeholder="Ej. 11.00"
              />
            </div>

            <div className="border-t border-border-dark/65 pt-3">
              <h4 className="text-[10px] text-purple-400 font-bold uppercase tracking-wider mb-2">Visibilidad en E-Commerce Público</h4>
              <div className="flex gap-6 items-center text-xs text-gray-300">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isPublicInput}
                    onChange={(e) => setIsPublicInput(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-700 bg-bg-panel text-purple-650 focus:ring-purple-500 cursor-pointer"
                  />
                  <span>Público en E-Commerce</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isIvaPublicInput}
                    onChange={(e) => setIsIvaPublicInput(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-700 bg-bg-panel text-purple-650 focus:ring-purple-500 cursor-pointer"
                  />
                  <span>Mostrar IVA al Público</span>
                </label>
              </div>
            </div>

            <div className="border-t border-border-dark/65 pt-3">
              <h4 className="text-[10px] text-purple-400 font-bold uppercase tracking-wider mb-3">Precios en Plataformas Externas ($)</h4>
              <div className="grid grid-cols-3 gap-3">
                <Inputs
                  label="Precio PayPal ($)"
                  type="number"
                  step="0.01"
                  value={paypalPriceInput}
                  onChange={setPaypalPriceInput}
                  placeholder="Ej. 14.50"
                />
                <Inputs
                  label="Precio Binance Pay ($)"
                  type="number"
                  step="0.01"
                  value={binancePriceInput}
                  onChange={setBinancePriceInput}
                  placeholder="Ej. 13.00"
                />
                <Inputs
                  label="Precio Zinli ($)"
                  type="number"
                  step="0.01"
                  value={zinliPriceInput}
                  onChange={setZinliPriceInput}
                  placeholder="Ej. 13.00"
                />
              </div>
            </div>
          </div>
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

      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title="Ficha Detallada de Inventario (ID)"
        showActions={true}
        actions={[{ label: 'Entendido', onClick: () => setIsDetailOpen(false), variant: 'secondary' }]}
      >
        {selectedItem && (
          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-start border-b border-border-dark pb-3">
              <div>
                <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider block">{selectedItem.sku}</span>
                <h4 className="text-sm font-bold text-white mt-0.5">{selectedItem.name}</h4>
              </div>
              {getStatusBadge(selectedItem.status)}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="border border-border-dark bg-bg-panel/40 p-2.5 rounded">
                <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Precio Unitario</span>
                <span className="text-white font-bold text-sm mt-1 block">${selectedItem.price.toFixed(2)}</span>
              </div>
              <div className="border border-border-dark bg-bg-panel/40 p-2.5 rounded">
                <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Costo / Margen</span>
                <span className="text-white font-bold text-xs mt-1 block">${selectedItem.costPrice.toFixed(2)} ({selectedItem.marginPercent}%)</span>
              </div>
              <div className="border border-border-dark bg-bg-panel/40 p-2.5 rounded">
                <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Stock / Alerta</span>
                <span className="text-white font-bold text-xs mt-1 block">{selectedItem.stock} / {selectedItem.minStock || 0} u.</span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 border-t border-border-dark/60 pt-3">
              <div className="bg-black/10 border border-border-dark/40 p-2 rounded text-center">
                <span className="text-[8px] text-gray-500 uppercase font-bold block">Mayor</span>
                <strong className="text-white font-bold block mt-0.5">${selectedItem.wholesalePrice.toFixed(2)}</strong>
              </div>
              <div className="bg-black/10 border border-border-dark/40 p-2 rounded text-center">
                <span className="text-[8px] text-gray-500 uppercase font-bold block">Mín. Qty</span>
                <strong className="text-white font-bold block mt-0.5">{selectedItem.wholesaleMinQty} u.</strong>
              </div>
              <div className="bg-black/10 border border-border-dark/40 p-2 rounded text-center">
                <span className="text-[8px] text-gray-500 uppercase font-bold block">Oferta</span>
                <strong className="text-amber-400 font-bold block mt-0.5">${selectedItem.offerPrice.toFixed(2)}</strong>
              </div>
              <div className="bg-black/10 border border-border-dark/40 p-2 rounded text-center">
                <span className="text-[8px] text-gray-500 uppercase font-bold block">Rebaja</span>
                <strong className="text-red-400 font-bold block mt-0.5">${selectedItem.rebatePrice.toFixed(2)}</strong>
              </div>
            </div>

            <div className="space-y-1.5 border-t border-border-dark/60 pt-3">
              <div className="flex justify-between"><span className="text-gray-500 font-medium">Categoría:</span><span className="text-gray-300 uppercase font-bold">{selectedItem.category || 'viveres'}</span></div>
              {selectedItem.expiryDate && (
                <div className="flex justify-between"><span className="text-gray-500 font-medium">Fecha Vencimiento:</span><span className="text-red-400 font-semibold">{selectedItem.expiryDate}</span></div>
              )}
              <div className="flex justify-between"><span className="text-gray-500 font-medium">Público en E-Commerce:</span><span className={selectedItem.isPublic !== false ? 'text-emerald-400 font-semibold' : 'text-gray-500 font-semibold'}>{selectedItem.isPublic !== false ? 'SÍ' : 'NO'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500 font-medium">Mostrar IVA Público:</span><span className={selectedItem.isIvaPublic !== false ? 'text-emerald-400 font-semibold' : 'text-gray-500 font-semibold'}>{selectedItem.isIvaPublic !== false ? 'SÍ' : 'NO'}</span></div>
            </div>

            <div className="grid grid-cols-3 gap-2 border-t border-border-dark/60 pt-3 text-center">
              <div className="bg-black/10 border border-border-dark/40 p-2 rounded text-center">
                <span className="text-[8px] text-gray-500 uppercase font-bold block">PayPal</span>
                <strong className="text-white font-bold block mt-0.5">${selectedItem.paypalPrice ? selectedItem.paypalPrice.toFixed(2) : 'N/A'}</strong>
              </div>
              <div className="bg-black/10 border border-border-dark/40 p-2 rounded text-center">
                <span className="text-[8px] text-gray-500 uppercase font-bold block">Binance Pay</span>
                <strong className="text-white font-bold block mt-0.5">${selectedItem.binancePrice ? selectedItem.binancePrice.toFixed(2) : 'N/A'}</strong>
              </div>
              <div className="bg-black/10 border border-border-dark/40 p-2 rounded text-center">
                <span className="text-[8px] text-gray-500 uppercase font-bold block">Zinli</span>
                <strong className="text-white font-bold block mt-0.5">${selectedItem.zinliPrice ? selectedItem.zinliPrice.toFixed(2) : 'N/A'}</strong>
              </div>
            </div>

            <div className="border-t border-border-dark/60 pt-3 space-y-3">
              <h5 className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">Imágenes del Producto</h5>
              {productImages[selectedItem.id]?.length ? (
                <div className="grid grid-cols-4 gap-2">
                  {productImages[selectedItem.id].map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded border border-border-dark bg-bg-panel overflow-hidden">
                      <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-550 italic text-[10px]">No se han cargado imágenes para este artículo.</p>
              )}
            </div>

            <div className="border-t border-border-dark/60 pt-3 space-y-2">
              <h5 className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">Documentos y Ficha Técnica PDF</h5>
              {productDocs[selectedItem.id]?.length ? (
                <div className="space-y-1.5">
                  {productDocs[selectedItem.id].map((doc, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-bg-panel/50 border border-border-dark p-2 rounded">
                      <span className="text-[10px] text-gray-300 font-semibold truncate max-w-[200px]">{doc}</span>
                      <button
                        type="button"
                        onClick={() => showAlert({ title: 'Descarga Iniciada', description: `Descargando archivo adjunto: ${doc}`, variant: 'success' })}
                        className="text-[9px] font-black uppercase text-purple-400 hover:text-purple-300 cursor-pointer"
                      >
                        Descargar
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-550 italic text-[10px]">Sin documentación adjunta.</p>
              )}
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isImagesOpen}
        onClose={() => setIsImagesOpen(false)}
        title="Administración de Imágenes"
        showActions={true}
        actions={[{ label: 'Terminar', onClick: () => setIsImagesOpen(false), variant: 'primary' }]}
      >
        {selectedItem && (
          <div className="space-y-4 text-xs">
            <p className="text-gray-400">Suba o elimine las imágenes del catálogo para <strong className="text-white">{selectedItem.name}</strong>.</p>
            
            <div className="border-2 border-dashed border-border-dark bg-bg-panel/20 p-6 rounded-lg text-center cursor-pointer hover:border-purple-500/40 transition" onClick={() => handleUploadImage(selectedItem.id)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-xs text-gray-300 font-bold uppercase block">Haga Clic para Cargar Imagen Mockup</span>
              <span className="text-[10px] text-gray-500 block mt-1">Soporta PNG, JPG y WebP (Máx 2MB)</span>
            </div>

            <div className="space-y-2">
              <h4 className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">Imágenes Cargadas ({productImages[selectedItem.id]?.length || 0})</h4>
              {productImages[selectedItem.id]?.length ? (
                <div className="grid grid-cols-4 gap-2">
                  {productImages[selectedItem.id].map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded border border-border-dark bg-bg-panel overflow-hidden group">
                      <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(selectedItem.id, idx)}
                        className="absolute inset-0 bg-red-950/80 text-red-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer font-bold text-[9px] uppercase"
                      >
                        Eliminar
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-550 italic text-[10px]">No hay imágenes cargadas en el servidor de medios.</p>
              )}
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isDocsOpen}
        onClose={() => setIsDocsOpen(false)}
        title="Administración de Documentos PDF"
        showActions={true}
        actions={[{ label: 'Terminar', onClick: () => setIsDocsOpen(false), variant: 'primary' }]}
      >
        {selectedItem && (
          <div className="space-y-4 text-xs">
            <p className="text-gray-400">Adjunte manuales de instalación, términos de servicio o especificaciones en PDF para <strong className="text-white">{selectedItem.name}</strong>.</p>
            
            <div className="border-2 border-dashed border-border-dark bg-bg-panel/20 p-6 rounded-lg text-center cursor-pointer hover:border-purple-500/40 transition" onClick={() => handleUploadDoc(selectedItem.id)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-xs text-gray-300 font-bold uppercase block">Haga Clic para Adjuntar PDF</span>
              <span className="text-[10px] text-gray-500 block mt-1">Archivos PDF de hasta 10MB</span>
            </div>

            <div className="space-y-2">
              <h4 className="text-[10px] text-purple-400 font-bold uppercase tracking-wider font-semibold">Documentos Adjuntos ({productDocs[selectedItem.id]?.length || 0})</h4>
              {productDocs[selectedItem.id]?.length ? (
                <div className="space-y-1.5">
                  {productDocs[selectedItem.id].map((doc, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-bg-panel border border-border-dark p-2.5 rounded">
                      <span className="text-[10px] text-gray-350 font-bold truncate max-w-[220px]">{doc}</span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => showAlert({ title: 'Descarga Iniciada', description: `Descargando archivo adjunto: ${doc}`, variant: 'success' })}
                          className="text-[9px] font-black uppercase text-purple-400 hover:text-purple-300 cursor-pointer"
                        >
                          Descargar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveDoc(selectedItem.id, idx)}
                          className="text-[9px] font-black uppercase text-red-500 hover:text-red-400 cursor-pointer"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-550 italic text-[10px]">No se han adjuntado especificaciones técnicas.</p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Inventory;

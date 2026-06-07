import { useState, useMemo, useEffect } from 'react';
import Buttons from '../../components/ui/Buttons';
import SearchInput from '../../components/ui/SearchInput';
import Selects from '../../components/ui/Selects';
import Paginations from '../../components/Paginations';
import Inputs from '../../components/ui/Inputs';
import { Modal } from '../../components/Modal';
import { useAlert } from '../../hooks/useAlert';
import { useLoading } from '../../hooks/useLoading';
import loginIllustration from '../../assets/login_illustration.png';

interface Product {
  id: number;
  name: string;
  price: number;
  category: 'viveres' | 'alimentos' | 'servicios' | 'sistemas';
  stock: number;
  image?: string;
  costPrice: number;
  wholesalePrice: number;
  wholesaleMinQty: number;
  marginPercent: number;
  offerPrice: number;
  rebatePrice: number;
}

interface CartItem {
  product: Product;
  quantity: number;
  selectedPriceType: 'unit' | 'wholesale' | 'offer' | 'rebate';
  appliedPrice: number;
}

function POS() {
  const { showAlert } = useAlert();
  const { showLoading, hideLoading } = useLoading();

  const products: Product[] = [
    { id: 1, name: 'Arroz Premium Grano Entero Seleccionado Extra (1kg)', price: 1.80, category: 'viveres', stock: 150, costPrice: 1.38, wholesalePrice: 1.50, wholesaleMinQty: 10, marginPercent: 30, offerPrice: 1.70, rebatePrice: 1.60 },
    { id: 2, name: 'Aceite de Girasol Refinado Doble Filtrado (1L)', price: 3.50, category: 'viveres', stock: 80, costPrice: 2.69, wholesalePrice: 3.10, wholesaleMinQty: 6, marginPercent: 30, offerPrice: 3.30, rebatePrice: 3.20 },
    { id: 3, name: 'Café Molido Gourmet con Notas de Chocolate y Caramelo (500g)', price: 4.20, category: 'viveres', stock: 60, costPrice: 3.23, wholesalePrice: 3.80, wholesaleMinQty: 5, marginPercent: 30, offerPrice: 4.00, rebatePrice: 3.90 },
    { id: 4, name: 'Combo Hamburguesa Especial Doble Carne con Papas y Bebida Mediana', price: 7.50, category: 'alimentos', stock: 40, costPrice: 5.76, wholesalePrice: 6.80, wholesaleMinQty: 5, marginPercent: 30, offerPrice: 7.20, rebatePrice: 7.00 },
    { id: 5, name: 'Pizza Pepperoni Familiar con Borde Relleno de Queso Mozzarella', price: 12.00, category: 'alimentos', stock: 25, costPrice: 9.23, wholesalePrice: 10.50, wholesaleMinQty: 3, marginPercent: 30, offerPrice: 11.50, rebatePrice: 11.00 },
    { id: 6, name: 'Soporte Técnico de Equipos Especializado Multimarca (Hora)', price: 35.00, category: 'servicios', stock: 99, costPrice: 26.92, wholesalePrice: 30.00, wholesaleMinQty: 5, marginPercent: 30, offerPrice: 33.00, rebatePrice: 32.00 },
    { id: 7, name: 'Instalación de Redes, Servidor Local, Rack de Comunicaciones y Cableado Estructurado Pro', price: 150.00, category: 'servicios', stock: 99, costPrice: 115.38, wholesalePrice: 135.00, wholesaleMinQty: 2, marginPercent: 30, offerPrice: 145.00, rebatePrice: 140.00 },
    { id: 8, name: 'Licencia Software ERP Premium Empresa Multi-Sucursales y Reportes de Auditoría', price: 500.00, category: 'sistemas', stock: 99, image: loginIllustration, costPrice: 384.61, wholesalePrice: 450.00, wholesaleMinQty: 2, marginPercent: 30, offerPrice: 480.00, rebatePrice: 460.00 },
    { id: 9, name: 'Licencia App Punto de Venta Lite Comercio Local Autogestionable', price: 120.00, category: 'sistemas', stock: 99, costPrice: 92.30, wholesalePrice: 105.00, wholesaleMinQty: 3, marginPercent: 30, offerPrice: 115.00, rebatePrice: 110.00 },
    { id: 10, name: 'Harina de Maíz Precocida Fina Extra Blanca (1kg)', price: 1.40, category: 'viveres', stock: 200, costPrice: 1.07, wholesalePrice: 1.25, wholesaleMinQty: 20, marginPercent: 30, offerPrice: 1.35, rebatePrice: 1.30 },
    { id: 11, name: 'Pasta Larga Italiana Al Huevo Tradicional (500g)', price: 1.10, category: 'viveres', stock: 180, costPrice: 0.84, wholesalePrice: 0.95, wholesaleMinQty: 12, marginPercent: 30, offerPrice: 1.05, rebatePrice: 1.00 },
    { id: 12, name: 'Refresco Cola Familiar Sin Azúcar Edición Especial (2L)', price: 2.50, category: 'alimentos', stock: 90, costPrice: 1.92, wholesalePrice: 2.20, wholesaleMinQty: 6, marginPercent: 30, offerPrice: 2.40, rebatePrice: 2.30 },
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [client, setClient] = useState('John Doe');
  const [clientsList, setClientsList] = useState<string[]>(['John Doe', 'Jane Smith', 'Carlos Ruiz', 'Ana García', 'Público General']);
  const [isQuickClientOpen, setIsQuickClientOpen] = useState(false);
  const [quickClientName, setQuickClientName] = useState('');
  const [quickClientEmail, setQuickClientEmail] = useState('');
  const [quickClientPhone, setQuickClientPhone] = useState('');
  const [quickClientDoc, setQuickClientDoc] = useState('');

  const [tasaMode, setTasaMode] = useState<'oficial' | 'manual'>('oficial');
  const [manualRateInput, setManualRateInput] = useState('545.00');
  const officialRate = 530.00;

  const currentRate = useMemo(() => {
    if (tasaMode === 'manual') {
      const parsed = parseFloat(manualRateInput);
      return isNaN(parsed) ? officialRate : parsed;
    }
    return officialRate;
  }, [tasaMode, manualRateInput]);

  const [productPriceTypes, setProductPriceTypes] = useState<Record<number, 'unit' | 'wholesale' | 'offer' | 'rebate'>>({});

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [imageViewerProduct, setImageViewerProduct] = useState<Product | null>(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const totalItems = filteredProducts.length;
  const numberOfPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const getAppliedPrice = (product: Product, type: 'unit' | 'wholesale' | 'offer' | 'rebate') => {
    switch (type) {
      case 'wholesale':
        return product.wholesalePrice;
      case 'offer':
        return product.offerPrice;
      case 'rebate':
        return product.rebatePrice;
      case 'unit':
      default:
        return product.price;
    }
  };

  const addToCart = (product: Product) => {
    const selectedPriceType = productPriceTypes[product.id] || 'unit';
    const appliedPrice = getAppliedPrice(product, selectedPriceType);

    setCart((prev) => {
      const exists = prev.find(
        (item) => item.product.id === product.id && item.selectedPriceType === selectedPriceType
      );
      if (exists) {
        return prev.map((item) =>
          item.product.id === product.id && item.selectedPriceType === selectedPriceType
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1, selectedPriceType, appliedPrice }];
    });
  };

  const updateQuantity = (productId: number, priceType: string, amount: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId && item.selectedPriceType === priceType) {
            const newQty = item.quantity + amount;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId: number, priceType: string) => {
    setCart((prev) => prev.filter((item) => !(item.product.id === productId && item.selectedPriceType === priceType)));
  };

  const clearCart = () => setCart([]);

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.appliedPrice * item.quantity, 0);
  }, [cart]);

  const tax = subtotal * 0.16;
  const total = subtotal + tax;

  const handleCheckout = () => {
    if (cart.length === 0) {
      showAlert({ title: 'Carrito vacío', description: 'Por favor agregue productos al carrito antes de cobrar.', variant: 'warning' });
      return;
    }

    showLoading({ title: 'Procesando Venta POS', subtitle: 'Registrando artículos y generando recibo...' });

    setTimeout(() => {
      hideLoading();
      showAlert({
        title: 'Venta completada',
        description: `Venta registrada con éxito a ${client}. Total: $${total.toFixed(2)}.`,
        variant: 'success',
      });
      clearCart();
    }, 1500);
  };

  const handleQuickClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickClientName.trim()) {
      showAlert({ title: 'Error', description: 'Por favor ingrese el nombre del cliente.', variant: 'warning' });
      return;
    }
    showLoading({ title: 'Registrando Cliente', subtitle: 'Agregando datos a la base de clientes...' });
    setTimeout(() => {
      hideLoading();
      const newName = quickClientName.trim();
      setClientsList((prev) => [newName, ...prev]);
      setClient(newName);
      setIsQuickClientOpen(false);
      setQuickClientName('');
      setQuickClientEmail('');
      setQuickClientPhone('');
      setQuickClientDoc('');
      showAlert({ title: 'Cliente Registrado', description: `Se registró y seleccionó a ${newName} exitosamente.`, variant: 'success' });
    }, 1000);
  };

  const getMockDescription = (product: Product) => {
    switch (product.category) {
      case 'viveres':
        return 'Alimento de la cesta básica de consumo familiar, almacenado a temperatura ambiente.';
      case 'alimentos':
        return 'Comida preparada lista para consumir elaborada con ingredientes seleccionados.';
      case 'servicios':
        return 'Servicio técnico calificado de redes, configuración o infraestructura de hardware.';
      case 'sistemas':
        return 'Licenciamiento de software comercial y soluciones digitales escalables.';
      default:
        return 'Ficha descriptiva general del producto o servicio.';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white uppercase">Venta Directa (POS)</h1>
          <p className="mt-1 text-xs text-gray-400">Terminal de punto de venta rápido para víveres, alimentos, servicios y sistemas.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 bg-bg-card border border-border-dark p-3 rounded-lg shadow-md">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Tasa Comercial:</span>
            <button
              type="button"
              onClick={() => setTasaMode('oficial')}
              className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-wider rounded border transition cursor-pointer ${
                tasaMode === 'oficial'
                  ? 'border-purple-600 bg-purple-950/20 text-purple-400'
                  : 'border-border-dark bg-bg-card text-gray-400 hover:text-white'
              }`}
            >
              Oficial del Día
            </button>
            <button
              type="button"
              onClick={() => setTasaMode('manual')}
              className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-wider rounded border transition cursor-pointer ${
                tasaMode === 'manual'
                  ? 'border-purple-600 bg-purple-950/20 text-purple-400'
                  : 'border-border-dark bg-bg-card text-gray-400 hover:text-white'
              }`}
            >
              Manual / Especial
            </button>
          </div>

          {tasaMode === 'manual' ? (
            <div className="w-24">
              <Inputs
                label=""
                type="number"
                step="0.01"
                value={manualRateInput}
                onChange={setManualRateInput}
                placeholder="0.00"
                className="text-xs h-7 py-0 px-2"
              />
            </div>
          ) : (
            <span className="text-xs font-bold text-white bg-purple-950/25 border border-purple-500/25 px-2 py-0.5 rounded">
              {officialRate.toFixed(2)} Bs
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <section className="lg:col-span-2 space-y-4 rounded-lg border border-border-dark bg-bg-card p-4 sm:p-6 shadow-md flex flex-col justify-between min-h-[590px]">
          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border-dark/60 pb-4">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Buscar producto por nombre..."
                className="max-w-xs"
              />
              <div className="flex flex-wrap gap-1">
                {[
                  { key: 'all', label: 'Todos' },
                  { key: 'viveres', label: 'Víveres' },
                  { key: 'alimentos', label: 'Alimentos' },
                  { key: 'servicios', label: 'Servicios' },
                  { key: 'sistemas', label: 'Sistemas' },
                ].map((cat) => (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded border transition cursor-pointer ${
                      selectedCategory === cat.key
                        ? 'border-purple-600 bg-purple-950/20 text-purple-400'
                        : 'border-border-dark bg-bg-card text-gray-400 hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 pr-1">
              {paginatedProducts.length === 0 ? (
                <div className="col-span-full py-12 text-center text-xs text-gray-500">
                  No se encontraron productos coincidentes
                </div>
              ) : (
                paginatedProducts.map((p) => {
                  const activeType = productPriceTypes[p.id] || 'unit';
                  const activePrice = getAppliedPrice(p, activeType);

                  return (
                    <div
                      key={p.id}
                      onClick={() => addToCart(p)}
                      className="group flex flex-col justify-between border border-border-dark bg-bg-panel/40 p-4.5 rounded-lg cursor-pointer hover:border-purple-500/40 hover:-translate-y-0.5 transition-all duration-150 relative"
                    >
                      <div className="absolute top-3 right-3 flex gap-1 z-10">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setImageViewerProduct(p);
                          }}
                          className="p-1 rounded border border-border-dark bg-bg-card text-gray-500 hover:text-white hover:border-purple-500/50 transition cursor-pointer"
                          title="Visualizar Imagen"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDetailProduct(p);
                          }}
                          className="p-1 rounded border border-border-dark bg-bg-card text-gray-500 hover:text-white hover:border-purple-500/50 transition cursor-pointer"
                          title="Ver Detalles"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                      </div>

                      <div className="pr-16">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-purple-400">
                          {p.category}
                        </span>
                        <h3 className="mt-1 text-xs font-semibold text-white group-hover:text-purple-300 transition duration-150 line-clamp-2 h-8 overflow-hidden">
                          {p.name}
                        </h3>
                      </div>

                      <div className="mt-3.5 space-y-2 border-t border-border-dark/30 pt-2.5">
                        <span className="text-[8px] text-gray-500 uppercase font-black tracking-wider block">Seleccionar Tarifa de Venta:</span>
                        <div className="grid grid-cols-2 gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setProductPriceTypes((prev) => ({ ...prev, [p.id]: 'unit' }));
                            }}
                            className={`px-1.5 py-1 text-[9px] rounded font-bold uppercase transition flex flex-col items-center justify-center border ${
                              activeType === 'unit'
                                ? 'bg-purple-950/30 text-purple-400 border-purple-600/50'
                                : 'bg-black/10 text-gray-400 border-border-dark hover:border-gray-500'
                            }`}
                          >
                            <span>Unitario</span>
                            <span className="text-[10px] font-black">${p.price.toFixed(2)}</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setProductPriceTypes((prev) => ({ ...prev, [p.id]: 'wholesale' }));
                            }}
                            className={`px-1.5 py-1 text-[9px] rounded font-bold uppercase transition flex flex-col items-center justify-center border ${
                              activeType === 'wholesale'
                                ? 'bg-purple-950/30 text-purple-400 border-purple-600/50'
                                : 'bg-black/10 text-gray-400 border-border-dark hover:border-gray-500'
                            }`}
                          >
                            <span>Mayor ({p.wholesaleMinQty}+)</span>
                            <span className="text-[10px] font-black">${p.wholesalePrice.toFixed(2)}</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setProductPriceTypes((prev) => ({ ...prev, [p.id]: 'offer' }));
                            }}
                            className={`px-1.5 py-1 text-[9px] rounded font-bold uppercase transition flex flex-col items-center justify-center border ${
                              activeType === 'offer'
                                ? 'bg-purple-950/30 text-purple-400 border-purple-600/50'
                                : 'bg-black/10 text-gray-400 border-border-dark hover:border-gray-500'
                            }`}
                          >
                            <span>Oferta</span>
                            <span className="text-[10px] font-black">${p.offerPrice.toFixed(2)}</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setProductPriceTypes((prev) => ({ ...prev, [p.id]: 'rebate' }));
                            }}
                            className={`px-1.5 py-1 text-[9px] rounded font-bold uppercase transition flex flex-col items-center justify-center border ${
                              activeType === 'rebate'
                                ? 'bg-purple-950/30 text-purple-400 border-purple-600/50'
                                : 'bg-black/10 text-gray-400 border-border-dark hover:border-gray-500'
                            }`}
                          >
                            <span>Rebaja</span>
                            <span className="text-[10px] font-black">${p.rebatePrice.toFixed(2)}</span>
                          </button>
                        </div>
                      </div>

                      <div className="mt-3.5 flex items-center justify-between border-t border-border-dark/30 pt-2 text-[10px]">
                        <span className="font-extrabold text-white text-xs">${activePrice.toFixed(2)}</span>
                        <span className="text-gray-500">Stock: {p.stock}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="border-t border-border-dark/60 pt-4 flex items-center justify-center">
            <Paginations
              numberOfPages={numberOfPages}
              currentPage={currentPage}
              onChangePage={setCurrentPage}
            />
          </div>
        </section>

        <section className="rounded-lg border border-border-dark bg-bg-card p-4 sm:p-6 shadow-md flex flex-col h-[590px]">
          <div className="flex items-center justify-between border-b border-border-dark/60 pb-3 mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white">Carrito de Compras</h2>
            {cart.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="text-[10px] text-red-400 hover:underline cursor-pointer"
              >
                Vaciar
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-xs">El carrito está vacío</p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedPriceType}`}
                  className="flex flex-col border border-border-dark bg-bg-panel/20 p-2.5 rounded-md text-xs gap-1.5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-white truncate">{item.product.name}</p>
                      <p className="text-[9px] text-purple-400 font-bold uppercase tracking-wide">
                        Tarifa: {item.selectedPriceType === 'unit' ? 'Unitario' : item.selectedPriceType === 'wholesale' ? 'Al Mayor' : item.selectedPriceType === 'offer' ? 'Oferta' : 'Rebaja'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.product.id, item.selectedPriceType)}
                      className="p-1 text-gray-500 hover:text-red-400 cursor-pointer"
                      aria-label="Remove item"
                    >
                      ×
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, item.selectedPriceType, -1)}
                        className="inline-flex h-6 w-6 items-center justify-center rounded border border-border-dark bg-bg-panel text-xs text-gray-400 hover:text-white cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-bold text-white">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, item.selectedPriceType, 1)}
                        className="inline-flex h-6 w-6 items-center justify-center rounded border border-border-dark bg-bg-panel text-xs text-gray-400 hover:text-white cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-white">
                        ${(item.appliedPrice * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-border-dark/60 pt-4 mt-4 space-y-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-455">Cliente Seleccionado</label>
                <button
                  type="button"
                  onClick={() => setIsQuickClientOpen(true)}
                  className="text-[9px] text-purple-400 hover:text-purple-300 font-bold uppercase tracking-wider transition flex items-center gap-0.5 cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                  Registrar Cliente
                </button>
              </div>
              <Selects
                label=""
                value={client}
                onChange={setClient}
                options={clientsList}
                placeholder="Seleccionar cliente"
              />
            </div>

            <div className="space-y-1.5 text-xs border-t border-border-dark/30 pt-3">
              <div className="flex items-center justify-between text-gray-400">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-gray-400">
                <span>Impuesto (16%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-base font-bold text-white pt-1">
                <span>Total USD</span>
                <span className="text-purple-400">${total.toFixed(2)}</span>
              </div>

              {tasaMode === 'manual' && (
                <div className="flex items-center justify-between text-xs font-semibold text-emerald-400 pt-1 border-t border-border-dark/20">
                  <span>Equivalente en Bs (Tasa Manual)</span>
                  <span>{(total * currentRate).toLocaleString(undefined, { minimumFractionDigits: 2 })} Bs</span>
                </div>
              )}
            </div>

            <Buttons
              variant="primary"
              className="w-full justify-center"
              onClick={handleCheckout}
            >
              Registrar Venta Directa
            </Buttons>
          </div>
        </section>
      </div>

      <Modal
        isOpen={detailProduct !== null}
        onClose={() => setDetailProduct(null)}
        title="Ficha Detallada del Producto"
        showActions={true}
        actions={[{ label: 'Cerrar', onClick: () => setDetailProduct(null), variant: 'secondary' }]}
      >
        {detailProduct && (
          <div className="space-y-3.5 text-xs">
            <div className="flex justify-between items-start border-b border-border-dark pb-3">
              <div>
                <h4 className="text-sm font-bold text-white">{detailProduct.name}</h4>
                <p className="text-[9px] font-bold text-purple-400 uppercase tracking-wider mt-0.5">{detailProduct.category}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-white">${detailProduct.price.toFixed(2)}</span>
                <p className="text-[10px] text-gray-500 mt-0.5">Precio de Venta</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="border border-border-dark bg-bg-panel/40 p-2.5 rounded">
                <span className="text-[10px] text-gray-500 block uppercase font-bold tracking-wider">SKU / Código</span>
                <span className="text-white font-semibold mt-1 block">SKU-00{detailProduct.id}</span>
              </div>
              <div className="border border-border-dark bg-bg-panel/40 p-2.5 rounded">
                <span className="text-[10px] text-gray-500 block uppercase font-bold tracking-wider">Existencia</span>
                <span className={`font-semibold mt-1 block ${detailProduct.stock < 10 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {detailProduct.stock} unidades
                </span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 border-t border-border-dark/60 pt-3">
              <div className="bg-black/10 border border-border-dark/40 p-2 rounded text-center">
                <span className="text-[8px] text-gray-500 uppercase font-bold block">Al Mayor</span>
                <strong className="text-white font-bold block mt-0.5">${detailProduct.wholesalePrice.toFixed(2)}</strong>
              </div>
              <div className="bg-black/10 border border-border-dark/40 p-2 rounded text-center">
                <span className="text-[8px] text-gray-500 uppercase font-bold block">Mín. Qty</span>
                <strong className="text-white font-bold block mt-0.5">{detailProduct.wholesaleMinQty} u.</strong>
              </div>
              <div className="bg-black/10 border border-border-dark/40 p-2 rounded text-center">
                <span className="text-[8px] text-gray-500 uppercase font-bold block">En Oferta</span>
                <strong className="text-amber-400 font-bold block mt-0.5">${detailProduct.offerPrice.toFixed(2)}</strong>
              </div>
              <div className="bg-black/10 border border-border-dark/40 p-2 rounded text-center">
                <span className="text-[8px] text-gray-500 uppercase font-bold block">Con Rebaja</span>
                <strong className="text-red-400 font-bold block mt-0.5">${detailProduct.rebatePrice.toFixed(2)}</strong>
              </div>
            </div>

            <div>
              <span className="text-[10px] text-gray-500 block uppercase font-bold tracking-wider mb-1">Descripción Informativa</span>
              <p className="text-gray-300 leading-relaxed bg-bg-panel/20 border border-border-dark p-3 rounded-md">
                {getMockDescription(detailProduct)}
              </p>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={imageViewerProduct !== null}
        onClose={() => setImageViewerProduct(null)}
        title="Visualizador de Imagen del Producto"
        showActions={true}
        actions={[{ label: 'Cerrar', onClick: () => setImageViewerProduct(null), variant: 'secondary' }]}
      >
        {imageViewerProduct && (
          <div className="space-y-4 text-xs text-center">
            <h4 className="text-sm font-bold text-white">{imageViewerProduct.name}</h4>
            <div className="rounded-lg border border-border-dark bg-[#0e0e16] p-3 shadow-xl max-h-[350px] flex items-center justify-center overflow-hidden">
              <img
                src={imageViewerProduct.image || loginIllustration}
                alt={imageViewerProduct.name}
                className="rounded max-h-[320px] object-contain"
              />
            </div>
            <p className="text-[10px] text-gray-550 uppercase font-semibold">Resolución Estándar de Catálogo</p>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isQuickClientOpen}
        onClose={() => setIsQuickClientOpen(false)}
        title="Registro de Cliente Express"
        onSubmit={handleQuickClientSubmit}
        primaryButtonText="Registrar y Seleccionar"
      >
        <div className="space-y-4">
          <p className="text-xs text-gray-400">Complete los datos para dar de alta al cliente de manera rápida y continuar con la venta directa.</p>
          <Inputs
            label="Nombre Completo o Razón Social"
            value={quickClientName}
            onChange={setQuickClientName}
            placeholder="Ej. Juan Pérez"
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Inputs
              label="Cédula / RIF"
              value={quickClientDoc}
              onChange={setQuickClientDoc}
              placeholder="Ej. V-12345678"
            />
            <Inputs
              label="Teléfono"
              value={quickClientPhone}
              onChange={setQuickClientPhone}
              placeholder="Ej. 0414-1234567"
            />
          </div>
          <Inputs
            label="Correo Electrónico (Opcional)"
            type="email"
            value={quickClientEmail}
            onChange={setQuickClientEmail}
            placeholder="juan@ejemplo.com"
          />
        </div>
      </Modal>
    </div>
  );
}

export default POS;

import { useState, useMemo, useEffect } from 'react';
import Buttons from '../../components/ui/Buttons';
import SearchInput from '../../components/ui/SearchInput';
import Selects from '../../components/ui/Selects';
import Paginations from '../../components/Paginations';
import { Modal } from '../../components/Modal';
import { useAlert } from '../../hooks/useAlert';
import { useLoading } from '../../hooks/useLoading';

interface Product {
  id: number;
  name: string;
  price: number;
  category: 'viveres' | 'alimentos' | 'servicios' | 'sistemas';
  stock: number;
}

interface CartItem {
  product: Product;
  quantity: number;
}

function POS() {
  const { showAlert } = useAlert();
  const { showLoading, hideLoading } = useLoading();

  const products: Product[] = [
    { id: 1, name: 'Arroz Premium (1kg)', price: 1.80, category: 'viveres', stock: 150 },
    { id: 2, name: 'Aceite de Girasol (1L)', price: 3.50, category: 'viveres', stock: 80 },
    { id: 3, name: 'Café Molido Gourmet (500g)', price: 4.20, category: 'viveres', stock: 60 },
    { id: 4, name: 'Combo Hamburguesa + Bebida', price: 7.50, category: 'alimentos', stock: 40 },
    { id: 5, name: 'Pizza Pepperoni Familiar', price: 12.00, category: 'alimentos', stock: 25 },
    { id: 6, name: 'Soporte Técnico de Equipos (Hora)', price: 35.00, category: 'servicios', stock: 99 },
    { id: 7, name: 'Instalación de Redes / Servidor', price: 150.00, category: 'servicios', stock: 99 },
    { id: 8, name: 'Licencia Software ERP Premium', price: 500.00, category: 'sistemas', stock: 99 },
    { id: 9, name: 'Licencia App Punto de Venta Lite', price: 120.00, category: 'sistemas', stock: 99 },
    { id: 10, name: 'Harina de Maíz Precocida (1kg)', price: 1.40, category: 'viveres', stock: 200 },
    { id: 11, name: 'Pasta Larga Italiana (500g)', price: 1.10, category: 'viveres', stock: 180 },
    { id: 12, name: 'Refresco Cola Familiar (2L)', price: 2.50, category: 'alimentos', stock: 90 },
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [client, setClient] = useState('John Doe');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [detailProduct, setDetailProduct] = useState<Product | null>(null);

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

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.product.id === product.id);
      if (exists) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: number, amount: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + amount;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => setCart([]);

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
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
      <div>
        <h1 className="text-xl font-bold tracking-tight text-white uppercase">Venta Directa (POS)</h1>
        <p className="mt-1 text-xs text-gray-400">Terminal de punto de venta rápido para víveres, alimentos, servicios y sistemas.</p>
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
                paginatedProducts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => addToCart(p)}
                    className="group flex flex-col justify-between border border-border-dark bg-bg-panel/40 p-4.5 rounded-lg cursor-pointer hover:border-purple-500/40 hover:-translate-y-0.5 transition-all duration-150 relative"
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDetailProduct(p);
                      }}
                      className="absolute top-3 right-3 p-1 rounded border border-border-dark bg-bg-card text-gray-500 hover:text-white hover:border-purple-500/50 transition cursor-pointer z-10"
                      title="Ver Detalles"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>

                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-purple-400">
                        {p.category}
                      </span>
                      <h3 className="mt-1 text-xs font-semibold text-white group-hover:text-purple-300 transition duration-150 pr-6 truncate">
                        {p.name}
                      </h3>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm font-bold text-white">${p.price.toFixed(2)}</span>
                      <span className="text-[10px] text-gray-500">Stock: {p.stock}</span>
                    </div>
                  </div>
                ))
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
                  key={item.product.id}
                  className="flex items-center justify-between gap-3 border border-border-dark bg-bg-panel/20 p-2.5 rounded-md text-xs"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-white truncate">{item.product.name}</p>
                    <p className="text-[10px] text-gray-400">${item.product.price.toFixed(2)} c/u</p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product.id, -1)}
                      className="inline-flex h-6 w-6 items-center justify-center rounded border border-border-dark bg-bg-panel text-xs text-gray-400 hover:text-white cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-bold text-white">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product.id, 1)}
                      className="inline-flex h-6 w-6 items-center justify-center rounded border border-border-dark bg-bg-panel text-xs text-gray-400 hover:text-white cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right min-w-[50px]">
                    <span className="font-bold text-white">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-1 text-gray-500 hover:text-red-400 cursor-pointer"
                    aria-label="Remove item"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-border-dark/60 pt-4 mt-4 space-y-4">
            <Selects
              label="Cliente Seleccionado"
              value={client}
              onChange={setClient}
              options={['John Doe', 'Jane Smith', 'Carlos Ruiz', 'Ana García', 'Público General']}
              placeholder="Seleccionar cliente"
            />

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
                <span>Total</span>
                <span className="text-purple-400">${total.toFixed(2)}</span>
              </div>
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

            <div>
              <span className="text-[10px] text-gray-500 block uppercase font-bold tracking-wider mb-1">Descripción Informativa</span>
              <p className="text-gray-300 leading-relaxed bg-bg-panel/20 border border-border-dark p-3 rounded-md">
                {getMockDescription(detailProduct)}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default POS;

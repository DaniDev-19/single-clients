import { useState, useMemo } from 'react';
import Buttons from '../../components/ui/Buttons';
import Inputs from '../../components/ui/Inputs';
import Selects from '../../components/ui/Selects';
import TextArea from '../../components/ui/TextArea';
import { Modal } from '../../components/Modal';
import { useAlert } from '../../hooks/useAlert';
import { useLoading } from '../../hooks/useLoading';
import loginIllustration from '../../assets/login_illustration.png';

interface ProductItem {
  id: number;
  name: string;
  price: number;
}

interface ComboItem {
  productId: number;
  productName: string;
  quantity: number;
  regularPrice: number;
}

interface PromoCombo {
  id: number;
  title: string;
  description: string;
  promoPrice: number;
  items: ComboItem[];
  imageUrl?: string;
  status: 'activo' | 'inactivo' | 'programado';
  validUntil: string;
  isPublic?: boolean;
  paypalPrice?: number;
  binancePrice?: number;
  zinliPrice?: number;
}

function Promociones() {
  const { showAlert } = useAlert();
  const { showLoading, hideLoading } = useLoading();

  const mockProducts: ProductItem[] = [
    { id: 1, name: 'Arroz Premium (1kg)', price: 1.80 },
    { id: 2, name: 'Aceite de Girasol (1L)', price: 3.50 },
    { id: 3, name: 'Café Molido Gourmet (500g)', price: 4.20 },
    { id: 4, name: 'Combo Hamburguesa Especial', price: 7.50 },
    { id: 5, name: 'Pizza Pepperoni Familiar', price: 12.00 },
    { id: 10, name: 'Harina de Maíz Precocida (1kg)', price: 1.40 },
    { id: 11, name: 'Pasta Larga Italiana (500g)', price: 1.10 },
  ];

  const [promos, setPromos] = useState<PromoCombo[]>([
    {
      id: 1,
      title: 'Combo Familiar de Pasta y Arroz',
      description: 'Llévate todo lo necesario para la semana. Ahorra más comprando en combo familiar.',
      promoPrice: 8.50,
      imageUrl: loginIllustration,
      status: 'activo',
      validUntil: '2026-06-30',
      isPublic: true,
      paypalPrice: 9.50,
      binancePrice: 8.50,
      zinliPrice: 8.50,
      items: [
        { productId: 1, productName: 'Arroz Premium (1kg)', quantity: 3, regularPrice: 1.80 },
        { productId: 11, productName: 'Pasta Larga Italiana (500g)', quantity: 3, regularPrice: 1.10 },
      ],
    },
    {
      id: 2,
      title: 'Desayuno Clásico Criollo',
      description: 'El combo tradicional con café selecto y harina premium de alta calidad.',
      promoPrice: 6.00,
      status: 'activo',
      validUntil: '2026-06-25',
      isPublic: true,
      paypalPrice: 7.00,
      binancePrice: 6.00,
      zinliPrice: 6.00,
      items: [
        { productId: 3, productName: 'Café Molido Gourmet (500g)', quantity: 1, regularPrice: 4.20 },
        { productId: 10, productName: 'Harina de Maíz Precocida (1kg)', quantity: 2, regularPrice: 1.40 },
      ],
    },
  ]);

  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');

  const [titleInput, setTitleInput] = useState('');
  const [descInput, setDescInput] = useState('');
  const [promoPriceInput, setPromoPriceInput] = useState('');
  const [validUntilInput, setValidUntilInput] = useState('2026-06-30');
  const [statusInput, setStatusInput] = useState<'activo' | 'inactivo' | 'programado'>('activo');
  const [imageInput, setImageInput] = useState<string>('');
  const [isPublicInput, setIsPublicInput] = useState(true);
  const [paypalPriceInput, setPaypalPriceInput] = useState('');
  const [binancePriceInput, setBinancePriceInput] = useState('');
  const [zinliPriceInput, setZinliPriceInput] = useState('');

  const [comboItems, setComboItems] = useState<ComboItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>('1');
  const [itemQtyInput, setItemQtyInput] = useState('1');

  const [detailPromo, setDetailPromo] = useState<PromoCombo | null>(null);
  const [imageViewerPromo, setImageViewerPromo] = useState<PromoCombo | null>(null);

  const productDropdownOptions = useMemo(() => {
    return mockProducts.map((p) => p.name);
  }, [mockProducts]);

  const handleAddItemToCombo = () => {
    const qty = parseInt(itemQtyInput);
    if (isNaN(qty) || qty <= 0) return;

    const prodName = productDropdownOptions[parseInt(selectedProductId) || 0] || productDropdownOptions[0];
    const prod = mockProducts.find((p) => p.name === prodName);
    if (!prod) return;

    const exists = comboItems.find((item) => item.productId === prod.id);
    if (exists) {
      setComboItems((prev) =>
        prev.map((item) =>
          item.productId === prod.id ? { ...item, quantity: item.quantity + qty } : item
        )
      );
    } else {
      setComboItems((prev) => [
        ...prev,
        {
          productId: prod.id,
          productName: prod.name,
          quantity: qty,
          regularPrice: prod.price,
        },
      ]);
    }
    setItemQtyInput('1');
  };

  const handleRemoveItemFromCombo = (productId: number) => {
    setComboItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const regularSum = useMemo(() => {
    return comboItems.reduce((sum, item) => sum + item.regularPrice * item.quantity, 0);
  }, [comboItems]);

  const discountStats = useMemo(() => {
    const promoVal = parseFloat(promoPriceInput) || 0;
    if (regularSum <= 0 || promoVal <= 0) return { discountVal: 0, discountPercent: 0 };
    const diff = regularSum - promoVal;
    const pct = (diff / regularSum) * 100;
    return {
      discountVal: Math.max(0, diff),
      discountPercent: Math.max(0, Math.round(pct)),
    };
  }, [regularSum, promoPriceInput]);

  const handleCreatePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const promoPrice = parseFloat(promoPriceInput);
    if (!titleInput.trim() || isNaN(promoPrice) || comboItems.length === 0) {
      showAlert({ title: 'Error', description: 'Por favor ingrese el título, el precio especial y añada al menos 1 producto.', variant: 'warning' });
      return;
    }

    showLoading({ title: 'Creando Promoción / Combo', subtitle: 'Registrando artículo especial en el catálogo...' });

    setTimeout(() => {
      const newPromo: PromoCombo = {
        id: promos.length ? Math.max(...promos.map((p) => p.id)) + 1 : 1,
        title: titleInput.trim(),
        description: descInput.trim() || 'Sin descripción adicional.',
        promoPrice,
        items: comboItems,
        imageUrl: imageInput || undefined,
        status: statusInput,
        validUntil: validUntilInput,
        isPublic: isPublicInput,
        paypalPrice: parseFloat(paypalPriceInput) || undefined,
        binancePrice: parseFloat(binancePriceInput) || undefined,
        zinliPrice: parseFloat(zinliPriceInput) || undefined,
      };

      setPromos((prev) => [newPromo, ...prev]);
      hideLoading();
      setActiveTab('list');
      showAlert({ title: 'Promo Creada', description: `Se registró con éxito el combo "${newPromo.title}".`, variant: 'success' });

      setTitleInput('');
      setDescInput('');
      setPromoPriceInput('');
      setComboItems([]);
      setImageInput('');
      setIsPublicInput(true);
      setPaypalPriceInput('');
      setBinancePriceInput('');
      setZinliPriceInput('');
    }, 1200);
  };

  const handleTogglePromoStatus = (promoId: number) => {
    setPromos((prev) =>
      prev.map((p) => {
        if (p.id === promoId) {
          const nextStatus = p.status === 'activo' ? 'inactivo' : 'activo';
          showAlert({ title: 'Estado Modificado', description: `La promoción está ahora ${nextStatus.toUpperCase()}.`, variant: 'info' });
          return { ...p, status: nextStatus };
        }
        return p;
      })
    );
  };

  const handleUploadPromoImage = (promoId: number) => {
    showLoading({ title: 'Subiendo flyer', subtitle: 'Procesando imagen promocional en la nube...' });
    setTimeout(() => {
      hideLoading();
      setPromos((prev) =>
        prev.map((p) => (p.id === promoId ? { ...p, imageUrl: loginIllustration } : p))
      );
      showAlert({ title: 'Flyer Enlazado', description: 'Se guardó la imagen publicitaria con éxito.', variant: 'success' });
    }, 1000);
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      activo: 'border-emerald-900/35 bg-emerald-950/25 text-emerald-400',
      inactivo: 'border-red-900/35 bg-red-950/25 text-red-400',
      programado: 'border-purple-900/35 bg-purple-950/25 text-purple-400',
    };
    return (
      <span className={`inline-block border px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded ${styles[status] ?? styles.inactivo}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white uppercase">Ofertas, Combos & Promociones</h1>
          <p className="mt-1 text-xs text-gray-400">Diseño y administración de combos especiales y packs promocionales del catálogo.</p>
        </div>

        <div className="flex border border-border-dark bg-bg-card p-1 rounded gap-1 self-start sm:self-auto shadow-md">
          <button
            onClick={() => setActiveTab('list')}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded transition cursor-pointer ${
              activeTab === 'list' ? 'bg-purple-600 text-white shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            Packs & Combos Activos
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded transition cursor-pointer ${
              activeTab === 'create' ? 'bg-purple-600 text-white shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            Diseñar Nuevo Combo
          </button>
        </div>
      </div>

      {activeTab === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {promos.map((p) => {
            const sumRegular = p.items.reduce((s, it) => s + it.regularPrice * it.quantity, 0);
            const savings = sumRegular - p.promoPrice;
            const savingsPct = Math.round((savings / sumRegular) * 100);

            return (
              <div
                key={p.id}
                className="border border-border-dark bg-bg-card rounded-lg overflow-hidden flex flex-col justify-between shadow-lg"
              >
                <div className="relative h-44 bg-[#0a0a0f] border-b border-border-dark flex items-center justify-center overflow-hidden group">
                  <img
                    src={p.imageUrl || loginIllustration}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    {getStatusBadge(p.status)}
                    <span className="text-[9px] font-bold text-white bg-black/75 px-2 py-0.5 rounded border border-border-dark">
                      Ahorro: {savingsPct}%
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 flex gap-1">
                    <button
                      type="button"
                      onClick={() => setImageViewerPromo(p)}
                      className="p-1 rounded border border-border-dark bg-black/75 text-gray-400 hover:text-white cursor-pointer"
                      title="Ver Flyer Completo"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDetailPromo(p)}
                      className="p-1 rounded border border-border-dark bg-black/75 text-gray-400 hover:text-white cursor-pointer"
                      title="Detalles y Artículos"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-white font-bold text-xs uppercase tracking-wide line-clamp-1">{p.title}</h3>
                    <p className="text-[10px] text-gray-550 line-clamp-2 leading-relaxed">{p.description}</p>
                  </div>

                  <div className="bg-bg-panel/40 border border-border-dark/60 p-2.5 rounded space-y-1.5 text-[10px]">
                    <div className="flex justify-between items-center text-gray-400">
                      <span>Precio Regular Separado:</span>
                      <span className="line-through text-red-400/80 font-semibold">${sumRegular.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-border-dark/30 pt-1.5 text-xs">
                      <span className="text-white font-bold">Precio Especial Combo:</span>
                      <strong className="text-purple-400 text-sm font-black">${p.promoPrice.toFixed(2)}</strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-border-dark/40 pt-3 text-[10px]">
                    <span className="text-gray-500">Expira: <strong className="text-gray-400 font-mono">{p.validUntil}</strong></span>
                    <div className="flex items-center gap-1.5">
                      {!p.imageUrl && (
                        <button
                          type="button"
                          onClick={() => handleUploadPromoImage(p.id)}
                          className="px-2 py-1 bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white rounded transition text-[9px] uppercase font-bold cursor-pointer"
                        >
                          Cargar Flyer
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleTogglePromoStatus(p.id)}
                        className={`px-2 py-1 rounded transition text-[9px] uppercase font-bold cursor-pointer ${
                          p.status === 'activo'
                            ? 'bg-red-950/20 text-red-400 hover:bg-red-900/35 border border-red-900/30'
                            : 'bg-emerald-950/20 text-emerald-400 hover:bg-emerald-900/35 border border-emerald-900/30'
                        }`}
                      >
                        {p.status === 'activo' ? 'Desactivar' : 'Activar'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'create' && (
        <form onSubmit={handleCreatePromoSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <section className="lg:col-span-7 rounded-lg border border-border-dark bg-bg-card p-4 sm:p-6 shadow-md space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white border-b border-border-dark/60 pb-3">Detalles de la Oferta / Combo</h2>
            
            <Inputs label="Título de la Promoción" value={titleInput} onChange={setTitleInput} placeholder="Ej. Combo Desayuno Escolar 2026" required />
            <TextArea label="Descripción Comercial" value={descInput} onChange={setDescInput} placeholder="Explique de qué trata la promoción y qué incluye para motivar la compra..." />
            
            <div className="grid grid-cols-2 gap-4">
              <Inputs label="Vencimiento de Promoción" type="date" value={validUntilInput} onChange={setValidUntilInput} required />
              <Selects label="Estado Inicial" value={statusInput} onChange={(v: any) => setStatusInput(v)} options={['activo', 'inactivo', 'programado']} />
            </div>

            <Inputs label="Enlace de Imagen Promocional (Opcional)" value={imageInput} onChange={setImageInput} placeholder="https://ejemplo.com/flyer.png" />

            <div className="border-t border-border-dark/65 pt-3">
              <h4 className="text-[10px] text-purple-400 font-bold uppercase tracking-wider mb-2">Visibilidad en E-Commerce</h4>
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-gray-300">
                <input
                  type="checkbox"
                  checked={isPublicInput}
                  onChange={(e) => setIsPublicInput(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-700 bg-bg-panel text-purple-650 focus:ring-purple-500 cursor-pointer"
                />
                <span>Habilitar publicación en el portal e-commerce público</span>
              </label>
            </div>
          </section>

          <section className="lg:col-span-5 rounded-lg border border-border-dark bg-bg-card p-4 sm:p-6 shadow-md space-y-6">
            <div className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-white border-b border-border-dark/60 pb-3">Construcción de Paquete Comercial</h2>
              
              <div className="grid grid-cols-12 gap-2 items-end bg-bg-panel/40 border border-border-dark p-3 rounded">
                <div className="col-span-8">
                  <Selects
                    label="Seleccionar Producto"
                    value={selectedProductId}
                    onChange={setSelectedProductId}
                    options={productDropdownOptions}
                  />
                </div>
                <div className="col-span-2">
                  <Inputs
                    label="Cant."
                    type="number"
                    value={itemQtyInput}
                    onChange={setItemQtyInput}
                    placeholder="1"
                  />
                </div>
                <div className="col-span-2">
                  <button
                    type="button"
                    onClick={handleAddItemToCombo}
                    className="w-full h-8.5 pb-1 rounded bg-purple-600 hover:bg-purple-500 text-white font-bold text-lg flex items-center justify-center transition cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1 custom-scrollbar">
                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Productos Incluidos ({comboItems.length})</span>
                {comboItems.length === 0 ? (
                  <p className="text-[10px] text-gray-550 italic text-center py-4">Añada artículos arriba para armar el combo.</p>
                ) : (
                  comboItems.map((item) => (
                    <div key={item.productId} className="flex justify-between items-center bg-bg-panel/60 border border-border-dark/50 p-2 rounded text-xs">
                      <div>
                        <span className="font-semibold text-white">{item.productName}</span>
                        <span className="text-[9px] text-gray-500 block">Cant: {item.quantity} • Unit: ${item.regularPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <strong className="text-gray-300 font-bold">${(item.regularPrice * item.quantity).toFixed(2)}</strong>
                        <button
                          type="button"
                          onClick={() => handleRemoveItemFromCombo(item.productId)}
                          className="text-red-400 hover:text-red-300 font-bold text-sm px-1 cursor-pointer"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="border-t border-border-dark/60 pt-4 space-y-3.5">
              <div className="flex justify-between text-xs text-gray-400">
                <span>Total Precio Regular Sumado:</span>
                <span className="font-semibold">${regularSum.toFixed(2)}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Inputs
                  label="Precio Combo Estándar ($)"
                  type="number"
                  step="0.01"
                  value={promoPriceInput}
                  onChange={setPromoPriceInput}
                  placeholder="Ej. 15.00"
                  required
                />
                <Inputs
                  label="Precio PayPal ($)"
                  type="number"
                  step="0.01"
                  value={paypalPriceInput}
                  onChange={setPaypalPriceInput}
                  placeholder="Ej. 16.50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Inputs
                  label="Precio Binance Pay ($)"
                  type="number"
                  step="0.01"
                  value={binancePriceInput}
                  onChange={setBinancePriceInput}
                  placeholder="Ej. 15.00"
                />
                <Inputs
                  label="Precio Zinli ($)"
                  type="number"
                  step="0.01"
                  value={zinliPriceInput}
                  onChange={setZinliPriceInput}
                  placeholder="Ej. 15.00"
                />
              </div>

              {discountStats.discountVal > 0 && (
                <div className="bg-emerald-950/20 border border-emerald-900/30 p-2.5 rounded-md text-[10px] flex justify-between items-center text-emerald-400">
                  <span>Ahorro para el Cliente:</span>
                  <span className="font-bold">-{discountStats.discountPercent}% (Ahorras ${discountStats.discountVal.toFixed(2)})</span>
                </div>
              )}

              <Buttons type="submit" variant="primary" className="w-full justify-center">
                Guardar Combo Comercial
              </Buttons>
            </div>
          </section>
        </form>
      )}

      <Modal
        isOpen={detailPromo !== null}
        onClose={() => setDetailPromo(null)}
        title="Artículos Incluidos en la Oferta"
        showActions={true}
        actions={[{ label: 'Cerrar', onClick: () => setDetailPromo(null), variant: 'secondary' }]}
      >
        {detailPromo && (
          <div className="space-y-4 text-xs">
            <div className="border-b border-border-dark pb-3">
              <h4 className="text-sm font-bold text-white uppercase">{detailPromo.title}</h4>
              <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">{detailPromo.description}</p>
            </div>

            <div className="space-y-2">
              <span className="text-[9px] text-gray-500 uppercase font-black tracking-wider block">Listado de Artículos</span>
              <div className="space-y-1.5">
                {detailPromo.items.map((item) => (
                  <div key={item.productId} className="flex justify-between items-center bg-bg-panel border border-border-dark p-2.5 rounded">
                    <div>
                      <span className="font-bold text-white block">{item.productName}</span>
                      <span className="text-[9px] text-gray-500 mt-0.5">Precio Regular: ${item.regularPrice.toFixed(2)}</span>
                    </div>
                    <span className="text-purple-400 font-extrabold">{item.quantity} unidades</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-border-dark/60 pt-3 text-center">
              <div>
                <span className="text-[9px] text-gray-550 block">PRECIO REGULAR</span>
                <span className="text-red-400/80 font-bold block mt-0.5 line-through">
                  ${detailPromo.items.reduce((s, it) => s + it.regularPrice * it.quantity, 0).toFixed(2)}
                </span>
              </div>
              <div>
                <span className="text-[9px] text-gray-550 block">PRECIO PROMO</span>
                <span className="text-emerald-400 font-extrabold block mt-0.5">${detailPromo.promoPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-1.5 border-t border-border-dark/60 pt-3">
              <div className="flex justify-between"><span className="text-gray-500 font-medium">Publicado en E-Commerce:</span><span className={detailPromo.isPublic !== false ? 'text-emerald-400 font-semibold' : 'text-gray-500 font-semibold'}>{detailPromo.isPublic !== false ? 'SÍ' : 'NO'}</span></div>
            </div>

            <div className="grid grid-cols-3 gap-2 border-t border-border-dark/60 pt-3 text-center">
              <div className="bg-black/10 border border-border-dark/40 p-2 rounded text-center">
                <span className="text-[8px] text-gray-500 uppercase font-bold block">PayPal</span>
                <strong className="text-white font-bold block mt-0.5">${detailPromo.paypalPrice ? detailPromo.paypalPrice.toFixed(2) : 'N/A'}</strong>
              </div>
              <div className="bg-black/10 border border-border-dark/40 p-2 rounded text-center">
                <span className="text-[8px] text-gray-500 uppercase font-bold block">Binance Pay</span>
                <strong className="text-white font-bold block mt-0.5">${detailPromo.binancePrice ? detailPromo.binancePrice.toFixed(2) : 'N/A'}</strong>
              </div>
              <div className="bg-black/10 border border-border-dark/40 p-2 rounded text-center">
                <span className="text-[8px] text-gray-500 uppercase font-bold block">Zinli</span>
                <strong className="text-white font-bold block mt-0.5">${detailPromo.zinliPrice ? detailPromo.zinliPrice.toFixed(2) : 'N/A'}</strong>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={imageViewerPromo !== null}
        onClose={() => setImageViewerPromo(null)}
        title="Flyer Publicitario de Oferta / Combo"
        showActions={true}
        actions={[{ label: 'Cerrar', onClick: () => setImageViewerPromo(null), variant: 'secondary' }]}
      >
        {imageViewerPromo && (
          <div className="space-y-4 text-center text-xs">
            <h4 className="text-sm font-bold text-white">{imageViewerPromo.title}</h4>
            <div className="rounded-lg border border-border-dark bg-[#0e0e16] p-3 shadow-xl max-h-[350px] flex items-center justify-center overflow-hidden">
              <img
                src={imageViewerPromo.imageUrl || loginIllustration}
                alt={imageViewerPromo.title}
                className="rounded max-h-[320px] object-contain"
              />
            </div>
            <p className="text-[10px] text-gray-550 uppercase font-semibold">Resolución Publicitaria de Oferta</p>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Promociones;

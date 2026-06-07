import { useState, useMemo } from 'react';
import Buttons from '../../components/ui/Buttons';
import Inputs from '../../components/ui/Inputs';
import Selects from '../../components/ui/Selects';
import { useAlert } from '../../hooks/useAlert';
import { useLoading } from '../../hooks/useLoading';

interface InvoiceLine {
  id: number;
  description: string;
  quantity: number;
  price: number;
}

function Facturador() {
  const { showAlert } = useAlert();
  const { showLoading, hideLoading } = useLoading();

  const [companyName, setCompanyName] = useState('Mi Empresa S.A.');
  const [companyRif, setCompanyRif] = useState('J-12345678-9');
  const [companyPhone, setCompanyPhone] = useState('+58 212-5555555');
  const [companyAddress, setCompanyAddress] = useState('Calle Principal Nro 45, Caracas');

  const [clientName, setClientName] = useState('John Doe');
  const [clientRif, setClientRif] = useState('V-9876543-2');
  const [clientPhone, setClientPhone] = useState('+58 414-9999999');
  const [clientAddress, setClientAddress] = useState('Av. Principal, Edificio A, Apto 4');

  const [invoiceId, setInvoiceId] = useState('FAC-1002');
  const [issueDate, setIssueDate] = useState('2026-06-07');
  const [dueDate, setDueDate] = useState('2026-06-22');
  const [terms, setTerms] = useState('Efectivo Divisa ($)');
  const [rateMode, setRateMode] = useState<'manual' | 'daily'>('manual');
  const [exchangeRate, setExchangeRate] = useState(530.00);
  const [formatStyle, setFormatStyle] = useState<'classic' | 'minimalist' | 'ticket'>('classic');
  const [customFooter, setCustomFooter] = useState('Garantía de 30 días en piezas y soporte técnico.');

  const [lines, setLines] = useState<InvoiceLine[]>([
    { id: 1, description: 'Servidor VPS Linux Pro (Configuración Anual)', quantity: 1, price: 199.0 },
    { id: 2, description: 'Soporte Técnico Especializado en Redes', quantity: 4, price: 35.0 },
  ]);

  const addLine = () => {
    setLines((prev) => [
      ...prev,
      {
        id: prev.length ? Math.max(...prev.map((l) => l.id)) + 1 : 1,
        description: '',
        quantity: 1,
        price: 0,
      },
    ]);
  };

  const removeLine = (id: number) => {
    setLines((prev) => prev.filter((l) => l.id !== id));
  };

  const updateLine = (id: number, field: keyof InvoiceLine, value: any) => {
    setLines((prev) =>
      prev.map((l) => (l.id === id ? { ...l, [field]: value } : l))
    );
  };

  const subtotalUsd = useMemo(() => {
    return lines.reduce((sum, line) => sum + line.price * line.quantity, 0);
  }, [lines]);

  const taxUsd = subtotalUsd * 0.16;
  const totalUsd = subtotalUsd + taxUsd;

  const subtotalBs = subtotalUsd * exchangeRate;
  const taxBs = taxUsd * exchangeRate;
  const totalBs = totalUsd * exchangeRate;

  const handleEmitInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (lines.length === 0 || lines.some((l) => !l.description.trim())) {
      showAlert({ title: 'Error de validación', description: 'Por favor agregue al menos una línea y complete su descripción.', variant: 'danger' });
      return;
    }

    showLoading({ title: 'Generando PDF', subtitle: 'Compilando diseño y abriendo ventana de impresión...' });

    setTimeout(() => {
      hideLoading();

      const invoiceData = {
        companyName,
        companyRif,
        companyPhone,
        companyAddress,
        clientName,
        clientRif,
        clientPhone,
        clientAddress,
        invoiceId,
        issueDate,
        dueDate,
        terms,
        rateMode,
        exchangeRate: rateMode === 'daily' ? 0 : exchangeRate,
        formatStyle,
        customFooter,
        lines,
        subtotalUsd,
        taxUsd,
        totalUsd,
        subtotalBs,
        taxBs,
        totalBs,
      };

      localStorage.setItem('invoice_print_data', JSON.stringify(invoiceData));
      window.open('/client/reports/invoice', '_blank');

      showAlert({
        title: 'Factura Emitida',
        description: `Factura ${invoiceId} exportada correctamente a PDF en formato ${formatStyle.toUpperCase()}.`,
        variant: 'success',
      });
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-white uppercase">Facturador Profesional</h1>
        <p className="mt-1 text-xs text-gray-400">Generación y exportación de facturas comerciales con doble divisa (USD / Bs) y formatos a elegir.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <section className="lg:col-span-7 rounded-lg border border-border-dark bg-bg-card p-4 sm:p-6 shadow-md space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-white border-b border-border-dark/60 pb-3">Formulario de Facturación Manual</h2>
          <form onSubmit={handleEmitInvoice} className="space-y-6">
            
            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block border-b border-border-dark/30 pb-1">Datos de la Empresa Emisora</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Inputs
                  label="Nombre / Razón Social"
                  value={companyName}
                  onChange={setCompanyName}
                  required
                />
                <Inputs
                  label="RIF / Identificación Fiscal"
                  value={companyRif}
                  onChange={setCompanyRif}
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Inputs
                  label="Teléfono"
                  value={companyPhone}
                  onChange={setCompanyPhone}
                />
                <Inputs
                  label="Dirección Comercial"
                  value={companyAddress}
                  onChange={setCompanyAddress}
                />
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block border-b border-border-dark/30 pb-1">Datos del Cliente Receptor</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Inputs
                  label="Nombre / Razón Social Cliente"
                  value={clientName}
                  onChange={setClientName}
                  required
                />
                <Inputs
                  label="RIF / Cédula Cliente"
                  value={clientRif}
                  onChange={setClientRif}
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Inputs
                  label="Teléfono Cliente"
                  value={clientPhone}
                  onChange={setClientPhone}
                />
                <Inputs
                  label="Dirección Cliente"
                  value={clientAddress}
                  onChange={setClientAddress}
                />
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block border-b border-border-dark/30 pb-1">Detalles de Factura y Tasa</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Inputs
                  label="Número de Factura"
                  value={invoiceId}
                  onChange={setInvoiceId}
                  required
                />
                <Selects
                  label="Modo de Tasa"
                  value={rateMode}
                  onChange={(val) => setRateMode(val as any)}
                  options={['manual', 'daily']}
                  placeholder="Seleccione modo de tasa"
                />
                <Selects
                  label="Condiciones / Pago"
                  value={terms}
                  onChange={setTerms}
                  options={['Efectivo Divisa ($)', 'Efectivo Bs.', 'Pago Móvil', 'Transferencia', 'Cashea', 'Tarjeta Débito/Crédito']}
                  placeholder="Método de pago"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  {rateMode === 'manual' ? (
                    <Inputs
                      label="Tasa de Cambio (Bs / $)"
                      type="number"
                      step="0.01"
                      value={exchangeRate.toString()}
                      onChange={(val) => {
                        const rate = parseFloat(val);
                        setExchangeRate(isNaN(rate) ? 1 : rate);
                      }}
                      required
                    />
                  ) : (
                    <div className="flex flex-col justify-end h-full pb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">Tasa Aplicada</span>
                      <span className="text-xs text-purple-400 font-bold uppercase">Tasa del día (BCV)</span>
                    </div>
                  )}
                </div>
                <div className="sm:col-span-1">
                  <Inputs
                    label="Fecha Emisión"
                    type="date"
                    value={issueDate}
                    onChange={setIssueDate}
                    required
                  />
                </div>
                <div className="sm:col-span-1">
                  <Inputs
                    label="Fecha Vencimiento"
                    type="date"
                    value={dueDate}
                    onChange={setDueDate}
                    required
                  />
                </div>
              </div>
              <Inputs
                label="Nota del Pie de Página / Garantía (Opcional)"
                value={customFooter}
                onChange={setCustomFooter}
                placeholder="Ej. Garantía de 30 días. Cambios bajo factura original."
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-border-dark/30 pb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">Líneas de Detalle (USD)</span>
                <button
                  type="button"
                  onClick={addLine}
                  className="text-[10px] text-purple-400 hover:text-purple-300 font-bold uppercase cursor-pointer"
                >
                  + Agregar Fila
                </button>
              </div>

              <div className="space-y-3 max-h-[180px] overflow-y-auto pr-1 custom-scrollbar">
                {lines.length === 0 ? (
                  <p className="text-xs text-center text-gray-500 py-4">No hay líneas en la factura.</p>
                ) : (
                  lines.map((line) => (
                    <div key={line.id} className="flex gap-2 items-end border-b border-border-dark/20 pb-3 sm:pb-0 sm:border-none">
                      <div className="flex-1">
                        <Inputs
                          label="Descripción"
                          value={line.description}
                          onChange={(val) => updateLine(line.id, 'description', val)}
                          placeholder="Artículo o servicio"
                          required
                        />
                      </div>
                      <div className="w-14">
                        <Inputs
                          label="Cant."
                          type="number"
                          value={line.quantity.toString()}
                          onChange={(val) => {
                            const num = parseInt(val);
                            updateLine(line.id, 'quantity', isNaN(num) ? 0 : num);
                          }}
                          required
                        />
                      </div>
                      <div className="w-20">
                        <Inputs
                          label="Precio ($)"
                          type="number"
                          step="0.01"
                          value={line.price.toString()}
                          onChange={(val) => {
                            const num = parseFloat(val);
                            updateLine(line.id, 'price', isNaN(num) ? 0 : num);
                          }}
                          required
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeLine(line.id)}
                        className="px-2 py-1.5 border border-red-900/30 rounded bg-red-950/20 text-xs font-semibold text-red-400 hover:bg-red-900/20 transition cursor-pointer"
                        title="Delete line"
                      >
                        ×
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="space-y-3 border-t border-border-dark/60 pt-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Seleccionar Formato de Diseño</span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: 'classic', label: 'Elegante / Classic' },
                  { key: 'minimalist', label: 'Minimalista' },
                  { key: 'ticket', label: 'Ticket / Recibo' },
                ].map((fmt) => (
                  <button
                    key={fmt.key}
                    type="button"
                    onClick={() => setFormatStyle(fmt.key as any)}
                    className={`px-3 py-2 text-[10px] font-bold uppercase tracking-wider rounded border transition cursor-pointer text-center ${
                      formatStyle === fmt.key
                        ? 'border-purple-600 bg-purple-950/20 text-purple-400'
                        : 'border-border-dark bg-bg-panel/40 text-gray-400 hover:text-white hover:border-gray-700'
                    }`}
                  >
                    {fmt.label}
                  </button>
                ))}
              </div>
            </div>

            <Buttons type="submit" variant="primary" className="w-full justify-center">
              Generar Factura PDF
            </Buttons>
          </form>
        </section>

        <section className="lg:col-span-5 rounded-lg border border-border-dark bg-bg-card p-4 sm:p-6 shadow-md flex flex-col">
          <h2 className="text-xs font-bold uppercase tracking-wider text-white border-b border-border-dark/60 pb-3 mb-4">Borrador en Tiempo Real</h2>
          
          <div className="border border-border-dark bg-white text-black p-4 rounded-md shadow-inner h-[520px] overflow-y-auto custom-scrollbar flex flex-col justify-between text-xs">
            {formatStyle === 'classic' && (
              <div className="font-serif text-[10px] space-y-4">
                <div className="flex justify-between items-start border-b border-gray-100 pb-3">
                  <div>
                    <h3 className="font-sans font-bold text-xs tracking-wide uppercase text-purple-700">{companyName}</h3>
                    <p className="text-[8px] text-gray-500 font-sans">{companyRif}</p>
                    <p className="text-[8px] text-gray-500 font-sans">{companyPhone}</p>
                  </div>
                  <div className="text-right">
                    <h4 className="font-sans font-bold text-[10px] tracking-tight text-gray-800">FACTURA</h4>
                    <p className="text-purple-600 font-bold font-sans mt-0.5">{invoiceId}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-[9px] border-b border-gray-100 pb-3 font-sans">
                  <div>
                    <span className="text-gray-400 font-bold block">FACTURADO A:</span>
                    <span className="text-gray-800 font-bold block mt-1">{clientName}</span>
                    <span className="text-gray-500 block">{clientRif}</span>
                    <span className="text-gray-500 block">{clientAddress}</span>
                  </div>
                  <div className="text-right space-y-0.5">
                    <div className="flex justify-between sm:justify-end gap-2"><span className="text-gray-400">Emisión:</span><span className="text-gray-800">{issueDate}</span></div>
                    <div className="flex justify-between sm:justify-end gap-2"><span className="text-gray-400">Vence:</span><span className="text-gray-800">{dueDate}</span></div>
                    <div className="flex justify-between sm:justify-end gap-2"><span className="text-gray-400">Método:</span><span className="text-purple-700 font-bold">{terms}</span></div>
                    {rateMode === 'manual' && (
                      <div className="flex justify-between sm:justify-end gap-2"><span className="text-gray-400">Tasa:</span><span className="text-purple-700 font-bold">{exchangeRate.toFixed(2)} Bs</span></div>
                    )}
                  </div>
                </div>
                <table className="w-full text-left font-sans text-[8px]">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-400 font-bold uppercase">
                      <th className="pb-1.5">Descripción</th>
                      <th className="pb-1.5 text-right w-10">Cant.</th>
                      <th className="pb-1.5 text-right w-16">Precio ($)</th>
                      <th className="pb-1.5 text-right w-20">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {lines.map((line) => (
                      <tr key={line.id}>
                        <td className="py-2 pr-2 leading-tight">{line.description || 'Nueva línea de factura'}</td>
                        <td className="py-2 text-right">{line.quantity}</td>
                        <td className="py-2 text-right">${line.price.toFixed(2)}</td>
                        <td className="py-2 text-right">
                          <div className="font-bold text-gray-800">${(line.price * line.quantity).toFixed(2)}</div>
                          {rateMode === 'manual' && (
                            <div className="text-[7px] text-gray-500">{(line.price * line.quantity * exchangeRate).toFixed(2)} Bs</div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="border-t border-gray-200 pt-4 flex flex-col items-end space-y-1 font-sans">
                  <div className="flex justify-between w-full max-w-[180px] text-gray-500">
                    <span>Subtotal:</span>
                    <div className="text-right">
                      <span className="block">${subtotalUsd.toFixed(2)}</span>
                      {rateMode === 'manual' && <span className="block text-[7px]">{subtotalBs.toFixed(2)} Bs</span>}
                    </div>
                  </div>
                  <div className="flex justify-between w-full max-w-[180px] text-gray-500">
                    <span>IVA (16%):</span>
                    <div className="text-right">
                      <span className="block">${taxUsd.toFixed(2)}</span>
                      {rateMode === 'manual' && <span className="block text-[7px]">{taxBs.toFixed(2)} Bs</span>}
                    </div>
                  </div>
                  <div className="flex justify-between w-full max-w-[180px] text-gray-800 font-bold text-[10px] pt-1.5 border-t border-gray-100">
                    <span>Total Factura:</span>
                    <div className="text-right">
                      <span className="block text-purple-700">${totalUsd.toFixed(2)}</span>
                      {rateMode === 'manual' && <span className="block text-[8px] text-purple-600">{totalBs.toFixed(2)} Bs</span>}
                    </div>
                  </div>
                </div>
                {rateMode === 'daily' && (
                  <div className="bg-purple-50 border border-purple-200 p-2 rounded text-[8px] text-purple-700 text-center font-sans">
                    <strong>Tasa del día:</strong> El total en Bolívares será pagadero a la tasa oficial oficial del día de pago.
                  </div>
                )}
                {customFooter && (
                  <div className="border-t border-gray-100 pt-3 text-[7px] text-center text-gray-500 italic flex items-center justify-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{customFooter}</span>
                  </div>
                )}
              </div>
            )}

            {formatStyle === 'minimalist' && (
              <div className="font-sans text-[9px] space-y-5 text-gray-800">
                <div className="border-l-2 border-black pl-3 py-1">
                  <h3 className="text-xs font-black tracking-tight uppercase text-black">{companyName}</h3>
                  <p className="text-[8px] text-gray-500">{companyRif} | {companyPhone}</p>
                  <p className="text-[8px] text-gray-500">{companyAddress}</p>
                </div>
                <div className="flex justify-between gap-6 border-b border-gray-200 pb-3">
                  <div>
                    <span className="font-bold text-gray-400 block text-[7px] uppercase tracking-wider">CLIENTE</span>
                    <span className="font-bold text-black text-xs mt-0.5 block">{clientName}</span>
                    <span className="text-gray-500 block text-[8px]">{clientRif}</span>
                    <span className="text-gray-500 block text-[8px]">{clientAddress}</span>
                  </div>
                  <div className="text-right text-[8px] space-y-0.5">
                    <div><span className="text-gray-400 font-bold">FACTURA:</span> <span className="font-bold text-black">{invoiceId}</span></div>
                    <div><span className="text-gray-400">EMISIÓN:</span> {issueDate}</div>
                    <div><span className="text-gray-400">MÉTODO:</span> {terms}</div>
                    {rateMode === 'manual' && <div><span className="text-gray-400 font-bold">TASA:</span> {exchangeRate.toFixed(2)} Bs</div>}
                  </div>
                </div>
                <table className="w-full text-left text-[8px]">
                  <thead>
                    <tr className="border-b border-black text-black font-bold uppercase">
                      <th className="pb-1">ARTÍCULO</th>
                      <th className="pb-1 text-right w-10">CANT</th>
                      <th className="pb-1 text-right w-16">USD ($)</th>
                      <th className="pb-1 text-right w-20">TOTAL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {lines.map((line) => (
                      <tr key={line.id}>
                        <td className="py-2 pr-2">{line.description || 'Línea de factura'}</td>
                        <td className="py-2 text-right">{line.quantity}</td>
                        <td className="py-2 text-right">${line.price.toFixed(2)}</td>
                        <td className="py-2 text-right font-medium">
                          <span className="block text-black">${(line.price * line.quantity).toFixed(2)}</span>
                          {rateMode === 'manual' && (
                            <span className="block text-[7px] text-gray-400">{(line.price * line.quantity * exchangeRate).toFixed(2)} Bs</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex flex-col items-end space-y-1 pt-3">
                  <div className="flex justify-between w-full max-w-[160px]">
                    <span className="text-gray-400">SUBTOTAL</span>
                    <span className="text-black">
                      ${subtotalUsd.toFixed(2)} {rateMode === 'manual' && `/ ${subtotalBs.toFixed(0)} Bs`}
                    </span>
                  </div>
                  <div className="flex justify-between w-full max-w-[160px]">
                    <span className="text-gray-400">IVA (16%)</span>
                    <span className="text-black">
                      ${taxUsd.toFixed(2)} {rateMode === 'manual' && `/ ${taxBs.toFixed(0)} Bs`}
                    </span>
                  </div>
                  <div className="flex justify-between w-full max-w-[160px] font-bold border-t border-black pt-2 text-black text-[10px]">
                    <span>TOTAL</span>
                    <span className="text-black">
                      ${totalUsd.toFixed(2)} {rateMode === 'manual' && `/ ${totalBs.toFixed(0)} Bs`}
                    </span>
                  </div>
                </div>
                {rateMode === 'daily' && (
                  <div className="border border-black p-2 text-[7.5px] text-black text-center font-sans tracking-wide">
                    * FACTURA PAGADERA EN BOLÍVARES A LA TASA OFICIAL DEL DÍA DE PAGO.
                  </div>
                )}
                {customFooter && (
                  <div className="border-t border-gray-200 pt-3 text-[7px] text-gray-500 font-medium">
                    * {customFooter}
                  </div>
                )}
              </div>
            )}

            {formatStyle === 'ticket' && (
              <div className="font-mono text-[8px] text-black space-y-3 mx-auto w-full max-w-[280px]">
                <div className="text-center space-y-0.5 border-b border-dashed border-gray-400 pb-3">
                  <h3 className="font-bold text-[10px] uppercase">{companyName}</h3>
                  <p>{companyRif}</p>
                  <p>TLF: {companyPhone}</p>
                  <p>{companyAddress}</p>
                </div>
                <div className="space-y-0.5 text-left border-b border-dashed border-gray-400 pb-2">
                  <p>TICKET: {invoiceId}</p>
                  <p>FECHA: {issueDate}</p>
                  <p>CLIENTE: {clientName}</p>
                  <p>RIF/CI: {clientRif}</p>
                  <p>MÉTODO: {terms}</p>
                </div>
                <div className="border-b border-dashed border-gray-400 pb-2">
                  <div className="flex justify-between font-bold mb-1.5">
                    <span>DESCRIPCION</span>
                    <span>TOTAL</span>
                  </div>
                  {lines.map((line) => (
                    <div key={line.id} className="space-y-0.5 py-1">
                      <div className="flex justify-between">
                        <span className="uppercase">{line.description || 'ITEM'}</span>
                        <span>${(line.price * line.quantity).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-[7px] text-gray-500">
                        <span>{line.quantity} x ${line.price.toFixed(2)}</span>
                        {rateMode === 'manual' && <span>{(line.price * line.quantity * exchangeRate).toFixed(0)} Bs</span>}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col items-end space-y-0.5">
                  <div className="flex justify-between w-full">
                    <span>SUBTOTAL:</span>
                    <span>${subtotalUsd.toFixed(2)} {rateMode === 'manual' && `/ ${subtotalBs.toFixed(0)} Bs`}</span>
                  </div>
                  <div className="flex justify-between w-full">
                    <span>IVA (16%):</span>
                    <span>${taxUsd.toFixed(2)} {rateMode === 'manual' && `/ ${taxBs.toFixed(0)} Bs`}</span>
                  </div>
                  <div className="flex justify-between w-full font-bold text-[9px] border-t border-dashed border-gray-400 pt-1.5">
                    <span>TOTAL:</span>
                    <span>${totalUsd.toFixed(2)} {rateMode === 'manual' && `/ ${totalBs.toFixed(0)} Bs`}</span>
                  </div>
                </div>
                {rateMode === 'daily' ? (
                  <div className="text-center text-[7px] border border-dashed border-black p-1 text-black font-sans uppercase">
                    PAGOS EN Bs SE CALCULARÁN A LA TASA OFICIAL DEL DÍA
                  </div>
                ) : (
                  <div className="text-center border-t border-dashed border-gray-400 pt-3 text-[7px]">
                    <p>TASA DE CAMBIO: {exchangeRate.toFixed(2)} Bs / USD</p>
                  </div>
                )}
                {customFooter && (
                  <div className="text-center py-1 text-[7px] text-gray-600 border-t border-dashed border-gray-300">
                    {customFooter}
                  </div>
                )}
                <div className="text-center text-[7px] pt-1">
                  <p>GRACIAS POR SU COMPRA</p>
                </div>
              </div>
            )}

            <div className="text-center text-[8px] text-gray-400 font-sans border-t border-gray-100 pt-4">
              Borrador en tiempo real - Sujeto a cambios
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Facturador;

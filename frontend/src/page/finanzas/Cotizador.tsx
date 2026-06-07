import { useState, useMemo } from 'react';
import Buttons from '../../components/ui/Buttons';
import Inputs from '../../components/ui/Inputs';
import Selects from '../../components/ui/Selects';
import { useAlert } from '../../hooks/useAlert';
import { useLoading } from '../../hooks/useLoading';

interface QuoteLine {
  id: number;
  type: 'standard' | 'milestone' | 'recurring';
  title: string;
  description: string;
  quantity: number;
  price: number;
  duration?: string;
  period?: string;
}

function Cotizador() {
  const { showAlert } = useAlert();
  const { showLoading, hideLoading } = useLoading();

  const [companyName, setCompanyName] = useState('Mi Empresa S.A.');
  const [companyRif, setCompanyRif] = useState('J-12345678-9');
  const [companyPhone, setCompanyPhone] = useState('+58 212-5555555');
  const [companyAddress, setCompanyAddress] = useState('Calle Principal Nro 45, Caracas');

  const [clientName, setClientName] = useState('Cliente Ejemplo');
  const [clientRif, setClientRif] = useState('V-9876543-2');
  const [clientPhone, setClientPhone] = useState('+58 414-0000000');
  const [clientAddress, setClientAddress] = useState('Av. Francisco de Miranda, Chacao');

  const [quoteId, setQuoteId] = useState('COT-2001');
  const [issueDate, setIssueDate] = useState('2026-06-07');
  const [validDays, setValidDays] = useState('15');
  const [rateMode, setRateMode] = useState<'manual' | 'daily'>('manual');
  const [exchangeRate, setExchangeRate] = useState(530.00);
  const [formatStyle, setFormatStyle] = useState<'classic' | 'minimalist' | 'ticket'>('classic');
  const [warrantyText, setWarrantyText] = useState('Garantía de 90 días en desarrollo de código y soporte de bugs.');

  const [lines, setLines] = useState<QuoteLine[]>([
    {
      id: 1,
      type: 'milestone',
      title: 'Etapa 1: Diseño UI/UX y Estructura Frontend',
      description: 'Maquetación responsiva con Tailwind CSS v4, animaciones premium y paneles dinámicos.',
      quantity: 1,
      price: 350.00,
      duration: '10 días hábiles',
    },
    {
      id: 2,
      type: 'milestone',
      title: 'Etapa 2: Motor Backend e Integraciones',
      description: 'Desarrollo de API Rest, sincronización de base de datos Postgres y lógica financiera.',
      quantity: 1,
      price: 450.00,
      duration: '15 días hábiles',
    },
    {
      id: 3,
      type: 'recurring',
      title: 'Soporte y Hosting Servidor VPS',
      description: 'Mantenimiento mensual, copias de seguridad de base de datos y parches de seguridad.',
      quantity: 1,
      price: 45.00,
      period: 'Mensual',
    },
    {
      id: 4,
      type: 'standard',
      title: 'Licencia Servidor Local Unix',
      description: 'Pago único por instalación física del servidor base.',
      quantity: 1,
      price: 150.00,
    },
  ]);

  const addLine = (type: 'standard' | 'milestone' | 'recurring') => {
    setLines((prev) => [
      ...prev,
      {
        id: prev.length ? Math.max(...prev.map((l) => l.id)) + 1 : 1,
        type,
        title: '',
        description: '',
        quantity: 1,
        price: 0,
        duration: type === 'milestone' ? '7 días' : undefined,
        period: type === 'recurring' ? 'Mensual' : undefined,
      },
    ]);
  };

  const removeLine = (id: number) => {
    setLines((prev) => prev.filter((l) => l.id !== id));
  };

  const updateLine = (id: number, field: keyof QuoteLine, value: any) => {
    setLines((prev) =>
      prev.map((l) => (l.id === id ? { ...l, [field]: value } : l))
    );
  };

  const totals = useMemo(() => {
    let oneTimeUsd = 0;
    let recurringUsd = 0;

    lines.forEach((line) => {
      const lineCost = line.price * line.quantity;
      if (line.type === 'recurring') {
        recurringUsd += lineCost;
      } else {
        oneTimeUsd += lineCost;
      }
    });

    const subtotalUsd = oneTimeUsd + recurringUsd;
    const taxUsd = subtotalUsd * 0.16;
    const totalUsd = subtotalUsd + taxUsd;

    return {
      oneTimeUsd,
      recurringUsd,
      subtotalUsd,
      taxUsd,
      totalUsd,
      totalBs: totalUsd * exchangeRate,
    };
  }, [lines, exchangeRate]);

  const handleEmitQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (lines.length === 0 || lines.some((l) => !l.title.trim())) {
      showAlert({ title: 'Campos incompletos', description: 'Por favor complete todos los títulos y descripciones de las cotizaciones.', variant: 'danger' });
      return;
    }

    showLoading({ title: 'Generando Cotización', subtitle: 'Preparando diseño responsivo de cotización...' });

    setTimeout(() => {
      hideLoading();

      const quoteData = {
        companyName,
        companyRif,
        companyPhone,
        companyAddress,
        clientName,
        clientRif,
        clientPhone,
        clientAddress,
        quoteId,
        issueDate,
        validDays,
        rateMode,
        exchangeRate: rateMode === 'daily' ? 0 : exchangeRate,
        formatStyle,
        warrantyText,
        lines,
        ...totals,
      };

      localStorage.setItem('quote_print_data', JSON.stringify(quoteData));
      window.open('/client/reports/quote', '_blank');

      showAlert({
        title: 'Cotización Generada',
        description: `Cotización ${quoteId} lista para descargar en PDF en formato ${formatStyle.toUpperCase()}.`,
        variant: 'success',
      });
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white uppercase">Cotizador Comercial Híbrido</h1>
          <p className="mt-1 text-xs text-gray-400">Creación de presupuestos y cotizaciones formales para software, hitos de proyectos y cobros recurrentes.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <section className="lg:col-span-7 rounded-lg border border-border-dark bg-bg-card p-4 sm:p-6 shadow-md space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-white border-b border-border-dark/60 pb-3">Detalles de la Propuesta Comercial</h2>
          
          <form onSubmit={handleEmitQuote} className="space-y-6">
            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block border-b border-border-dark/30 pb-1">Datos de tu Empresa</span>
              <div className="grid grid-cols-2 gap-3">
                <Inputs label="Nombre / Razón Social" value={companyName} onChange={setCompanyName} required />
                <Inputs label="RIF" value={companyRif} onChange={setCompanyRif} required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Inputs label="Teléfono" value={companyPhone} onChange={setCompanyPhone} />
                <Inputs label="Ubicación" value={companyAddress} onChange={setCompanyAddress} />
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block border-b border-border-dark/30 pb-1">Datos del Solicitante / Cliente</span>
              <div className="grid grid-cols-2 gap-3">
                <Inputs label="Nombre del Cliente" value={clientName} onChange={setClientName} required />
                <Inputs label="RIF / Cédula" value={clientRif} onChange={setClientRif} required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Inputs label="Teléfono Cliente" value={clientPhone} onChange={setClientPhone} />
                <Inputs label="Dirección Cliente" value={clientAddress} onChange={setClientAddress} />
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block border-b border-border-dark/30 pb-1">Validez y Condiciones</span>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <Inputs label="Número Propuesta" value={quoteId} onChange={setQuoteId} required />
                </div>
                <div>
                  <Inputs label="Fecha Emisión" type="date" value={issueDate} onChange={setIssueDate} required />
                </div>
                <div>
                  <Selects
                    label="Modo de Tasa"
                    value={rateMode}
                    onChange={(v) => setRateMode(v as any)}
                    options={['manual', 'daily']}
                    placeholder="Tasa"
                  />
                </div>
                <div>
                  {rateMode === 'manual' ? (
                    <Inputs label="Tasa (Bs/$)" type="number" value={exchangeRate.toString()} onChange={(v) => setExchangeRate(parseFloat(v) || 1)} required />
                  ) : (
                    <div className="flex flex-col justify-end h-full pb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">Tasa Aplicada</span>
                      <span className="text-xs text-purple-400 font-bold uppercase">Tasa del día (BCV)</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-2">
                  <Inputs label="Validez (Días)" type="number" value={validDays} onChange={setValidDays} required />
                </div>
                <div className="col-span-2">
                  <Inputs label="Nota de Garantía o Soporte Adicional" value={warrantyText} onChange={setWarrantyText} />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border-dark/30 pb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">Conceptos y Servicios</span>
                <div className="flex gap-2">
                  <button type="button" onClick={() => addLine('standard')} className="text-[9px] text-gray-300 hover:text-white bg-bg-panel px-2 py-0.5 rounded border border-border-dark cursor-pointer font-bold uppercase">+ Estándar</button>
                  <button type="button" onClick={() => addLine('milestone')} className="text-[9px] text-purple-400 hover:text-purple-300 bg-bg-panel px-2 py-0.5 rounded border border-border-dark cursor-pointer font-bold uppercase">+ Hito/Etapa</button>
                  <button type="button" onClick={() => addLine('recurring')} className="text-[9px] text-emerald-400 hover:text-emerald-300 bg-bg-panel px-2 py-0.5 rounded border border-border-dark cursor-pointer font-bold uppercase">+ Recurrente</button>
                </div>
              </div>

              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                {lines.map((line) => (
                  <div key={line.id} className="p-3 border border-border-dark/40 rounded-lg bg-bg-panel/20 space-y-3 relative">
                    <div className="absolute top-2 right-2">
                      <button type="button" onClick={() => removeLine(line.id)} className="text-red-400 hover:text-red-300 font-bold text-xs cursor-pointer">
                        Eliminar ×
                      </button>
                    </div>

                    <div className="flex gap-3 items-center">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                        line.type === 'milestone' ? 'bg-purple-950/40 text-purple-400 border border-purple-900/30' :
                        line.type === 'recurring' ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30' :
                        'bg-gray-800 text-gray-400 border border-gray-700/30'
                      }`}>
                        {line.type === 'milestone' ? 'Hito / Etapa' : line.type === 'recurring' ? 'Recurrencia' : 'Estándar'}
                      </span>
                    </div>

                    <div className="grid grid-cols-12 gap-3">
                      <div className="col-span-12 sm:col-span-6">
                        <Inputs label="Nombre Concepto" value={line.title} onChange={(v) => updateLine(line.id, 'title', v)} required />
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <Inputs label="Precio ($)" type="number" step="0.01" value={line.price.toString()} onChange={(v) => updateLine(line.id, 'price', parseFloat(v) || 0)} required />
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <Inputs label="Cantidad" type="number" value={line.quantity.toString()} onChange={(v) => updateLine(line.id, 'quantity', parseInt(v) || 1)} required />
                      </div>
                    </div>

                    <Inputs label="Descripción / Especificaciones detalladas" value={line.description} onChange={(v) => updateLine(line.id, 'description', v)} />

                    {line.type === 'milestone' && (
                      <Inputs label="Tiempo estimado de entrega" value={line.duration || ''} onChange={(v) => updateLine(line.id, 'duration', v)} placeholder="Ej. 10 días hábiles" />
                    )}

                    {line.type === 'recurring' && (
                      <Selects label="Ciclo de Facturación" value={line.period || 'Mensual'} onChange={(v) => updateLine(line.id, 'period', v)} options={['Mensual', 'Anual', 'Semanal']} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 border-t border-border-dark/60 pt-4">
              {['classic', 'minimalist', 'ticket'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setFormatStyle(st as any)}
                  className={`px-3 py-2 text-[10px] font-bold uppercase tracking-wider rounded border transition cursor-pointer text-center ${
                    formatStyle === st
                      ? 'border-purple-600 bg-purple-950/20 text-purple-400'
                      : 'border-border-dark bg-bg-panel/40 text-gray-400 hover:text-white hover:border-gray-700'
                  }`}
                >
                  Estilo {st}
                </button>
              ))}
            </div>

            <Buttons type="submit" variant="primary" className="w-full justify-center">
              Generar Cotización PDF
            </Buttons>
          </form>
        </section>

        <section className="lg:col-span-5 rounded-lg border border-border-dark bg-bg-card p-4 sm:p-6 shadow-md flex flex-col">
          <h2 className="text-xs font-bold uppercase tracking-wider text-white border-b border-border-dark/60 pb-3 mb-4">Previsualización Propuesta</h2>
          
          <div className="border border-border-dark bg-white text-black p-4 rounded-md shadow-inner h-[580px] overflow-y-auto custom-scrollbar flex flex-col justify-between text-xs">
            {formatStyle === 'classic' && (
              <div className="font-serif text-[9px] space-y-4">
                <div className="flex justify-between items-start border-b border-gray-100 pb-3">
                  <div>
                    <h3 className="font-sans font-bold text-xs tracking-wide uppercase text-purple-700">{companyName}</h3>
                    <p className="text-[7px] text-gray-500 font-sans">{companyRif} | {companyPhone}</p>
                  </div>
                  <div className="text-right">
                    <h4 className="font-sans font-bold text-[9px] tracking-tight text-gray-800">PRESUPUESTO</h4>
                    <p className="text-purple-600 font-bold font-sans mt-0.5">{quoteId}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-[8px] border-b border-gray-100 pb-3 font-sans">
                  <div>
                    <span className="text-gray-400 font-bold block">COTIZADO A:</span>
                    <span className="text-gray-800 font-bold block mt-0.5">{clientName}</span>
                    <span className="text-gray-500 block">{clientRif}</span>
                    <span className="text-gray-500 block">{clientAddress}</span>
                  </div>
                  <div className="text-right space-y-0.5 font-sans">
                    <div><span className="text-gray-400">Fecha:</span> <span className="text-gray-800">{issueDate}</span></div>
                    <div><span className="text-gray-400">Validez:</span> <span className="text-gray-800">{validDays} días</span></div>
                    {rateMode === 'manual' && (
                      <div><span className="text-gray-400">Tasa:</span> <span className="text-purple-700 font-bold">{exchangeRate.toFixed(2)} Bs</span></div>
                    )}
                  </div>
                </div>

                <div className="space-y-3 font-sans">
                  <span className="text-[8px] font-bold text-purple-700 block uppercase tracking-wider">Conceptos de la Propuesta</span>
                  <div className="space-y-2.5">
                    {lines.map((line) => (
                      <div key={line.id} className="border-b border-gray-100 pb-2 flex justify-between gap-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-gray-800">{line.title || 'Concepto Comercial'}</span>
                            {line.type === 'milestone' && (
                              <span className="text-[7px] bg-purple-100 text-purple-700 px-1 rounded font-bold">Entrega: {line.duration}</span>
                            )}
                            {line.type === 'recurring' && (
                              <span className="text-[7px] bg-emerald-100 text-emerald-700 px-1 rounded font-bold">Pago: {line.period}</span>
                            )}
                          </div>
                          <p className="text-[7px] text-gray-500 leading-tight">{line.description}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-bold text-gray-800 block">${(line.price * line.quantity).toFixed(2)}</span>
                          {rateMode === 'manual' && (
                            <span className="text-[6px] text-gray-500 block">{(line.price * line.quantity * exchangeRate).toFixed(0)} Bs</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-3 flex flex-col items-end space-y-0.5 font-sans">
                  <div className="flex justify-between w-full max-w-[160px] text-gray-500 text-[8px]">
                    <span>Subtotal:</span>
                    <span>${totals.subtotalUsd.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between w-full max-w-[160px] text-gray-500 text-[8px]">
                    <span>IVA (16%):</span>
                    <span>${totals.taxUsd.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between w-full max-w-[160px] font-bold text-[9px] pt-1 border-t border-gray-100 text-gray-850">
                    <span>Total Presupuesto:</span>
                    <div className="text-right">
                      <span className="block text-purple-700">${totals.totalUsd.toFixed(2)}</span>
                      {rateMode === 'manual' && <span className="block text-[7px] text-purple-600">{totals.totalBs.toFixed(0)} Bs</span>}
                    </div>
                  </div>
                </div>

                {rateMode === 'daily' && (
                  <div className="bg-purple-50 border border-purple-200 p-2 rounded text-[7.5px] text-purple-700 text-center font-sans">
                    <strong>Tasa del día:</strong> Presupuesto en USD. Los pagos en Bolívares se calculan a la tasa de cambio oficial del día de pago.
                  </div>
                )}

                {warrantyText && (
                  <div className="border-t border-gray-100 pt-2 text-[7px] text-gray-500 italic text-center">
                    * {warrantyText}
                  </div>
                )}
              </div>
            )}

            {formatStyle === 'minimalist' && (
              <div className="font-sans text-[8px] space-y-4 text-gray-800">
                <div className="border-l-2 border-black pl-2 py-0.5">
                  <h3 className="text-xs font-black tracking-tight uppercase text-black">{companyName}</h3>
                  <p className="text-[7px] text-gray-500">{companyRif} | {companyPhone}</p>
                </div>

                <div className="flex justify-between gap-4 border-b border-gray-200 pb-2">
                  <div>
                    <span className="font-bold text-gray-400 block text-[6px]">PRESUPUESTO PARA</span>
                    <span className="font-bold text-black text-xs block">{clientName}</span>
                    <span className="text-gray-500 block">{clientRif}</span>
                  </div>
                  <div className="text-right space-y-0.5">
                    <div><span className="text-gray-400">PROPUESTA:</span> <span className="font-bold text-black">{quoteId}</span></div>
                    <div><span className="text-gray-400">DÍAS VALIDEZ:</span> {validDays}</div>
                    {rateMode === 'manual' && <div><span className="text-gray-400">TASA Bs:</span> {exchangeRate.toFixed(2)}</div>}
                  </div>
                </div>

                <div className="space-y-2">
                  {lines.map((line) => (
                    <div key={line.id} className="flex justify-between py-1 border-b border-gray-100">
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-black uppercase text-[8px]">{line.title || 'CONCEPTO'}</span>
                          <span className="text-[6px] text-gray-400 italic">({line.type.toUpperCase()})</span>
                        </div>
                        <p className="text-[7px] text-gray-500">{line.description}</p>
                        {line.duration && <p className="text-[6px] text-purple-600 font-bold">Plazo: {line.duration}</p>}
                        {line.period && <p className="text-[6px] text-emerald-600 font-bold">Frecuencia: {line.period}</p>}
                      </div>
                      <div className="text-right font-medium text-black">
                        <span>${(line.price * line.quantity).toFixed(2)}</span>
                        {rateMode === 'manual' && (
                          <span className="block text-[6px] text-gray-400">{(line.price * line.quantity * exchangeRate).toFixed(0)} Bs</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col items-end space-y-0.5 pt-2">
                  <div className="flex justify-between w-full max-w-[150px]">
                    <span className="text-gray-400">SUBTOTAL</span>
                    <span>${totals.subtotalUsd.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between w-full max-w-[150px]">
                    <span className="text-gray-400">IVA (16%)</span>
                    <span>${totals.taxUsd.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between w-full max-w-[150px] font-bold border-t border-black pt-1.5 text-black">
                    <span>TOTAL ESTIMADO</span>
                    <span>
                      ${totals.totalUsd.toFixed(2)} {rateMode === 'manual' && `/ ${totals.totalBs.toFixed(0)} Bs`}
                    </span>
                  </div>
                </div>
                {rateMode === 'daily' && (
                  <div className="border border-black p-1.5 text-[7px] text-black text-center font-sans tracking-wide">
                    * MONTOS EN USD. PAGOS EN Bs SE CONVERTIRÁN A LA TASA OFICIAL VIGENTE DE PAGO.
                  </div>
                )}
              </div>
            )}

            {formatStyle === 'ticket' && (
              <div className="font-mono text-[7px] text-black space-y-3 mx-auto w-full max-w-[280px]">
                <div className="text-center space-y-0.5 border-b border-dashed border-gray-400 pb-2">
                  <h3 className="font-bold text-[9px] uppercase">{companyName}</h3>
                  <p>RIF: {companyRif}</p>
                  <p>TLF: {companyPhone}</p>
                </div>
                <div className="space-y-0.5 text-left border-b border-dashed border-gray-400 pb-2">
                  <p>PROPUESTA: {quoteId}</p>
                  <p>VALIDEZ: {validDays} DÍAS</p>
                  <p>CLIENTE: {clientName}</p>
                  {rateMode === 'manual' && <p>TASA: {exchangeRate.toFixed(2)} Bs</p>}
                </div>

                <div className="space-y-2 border-b border-dashed border-gray-400 pb-2">
                  {lines.map((line) => (
                    <div key={line.id} className="space-y-0.5">
                      <div className="flex justify-between font-bold">
                        <span className="uppercase">{line.title || 'CONCEPTO'}</span>
                        <span>${(line.price * line.quantity).toFixed(2)}</span>
                      </div>
                      <p className="text-[7px] text-gray-500 leading-tight">{line.description}</p>
                      {line.duration && <p className="text-[6px] text-purple-700">PLAZO: {line.duration}</p>}
                      {line.period && <p className="text-[6px] text-emerald-700">CICLO: {line.period}</p>}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col items-end space-y-0.5">
                  <div className="flex justify-between w-full">
                    <span>TOTAL UNICO:</span>
                    <span>${totals.totalUsd.toFixed(2)}</span>
                  </div>
                  {rateMode === 'manual' && (
                    <div className="flex justify-between w-full">
                      <span>EQUIV. BS:</span>
                      <span>{totals.totalBs.toFixed(0)} Bs</span>
                    </div>
                  )}
                </div>
                {rateMode === 'daily' && (
                  <div className="text-center text-[7px] border border-dashed border-black p-1 text-black font-sans uppercase">
                    PAGOS A LA TASA OFICIAL DEL DÍA
                  </div>
                )}
                <div className="text-center pt-2 text-[6px]">
                  <p>ESTIMACIÓN DE COSTOS - SUJETO A CAMBIOS</p>
                </div>
              </div>
            )}

            <div className="text-center text-[7px] text-gray-400 font-sans border-t border-gray-100 pt-3">
              Cotizador en tiempo real
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Cotizador;

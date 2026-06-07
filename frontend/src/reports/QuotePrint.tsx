import { useEffect, useState } from 'react';

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

interface QuoteData {
  companyName: string;
  companyRif: string;
  companyPhone: string;
  companyAddress: string;
  clientName: string;
  clientRif: string;
  clientPhone: string;
  clientAddress: string;
  quoteId: string;
  issueDate: string;
  validDays: string;
  rateMode?: 'manual' | 'daily';
  exchangeRate: number;
  formatStyle: 'classic' | 'minimalist' | 'ticket';
  warrantyText: string;
  lines: QuoteLine[];
  oneTimeUsd: number;
  recurringUsd: number;
  subtotalUsd: number;
  taxUsd: number;
  totalUsd: number;
  totalBs: number;
}

function QuotePrint() {
  const [data, setData] = useState<QuoteData | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem('quote_print_data');
    if (raw) {
      try {
        setData(JSON.parse(raw));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  useEffect(() => {
    if (data) {
      const timer = setTimeout(() => {
        window.print();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [data]);

  if (!data) {
    return (
      <div className="p-8 text-center text-sm text-gray-500 font-sans">
        No se encontraron datos de cotización para imprimir.
      </div>
    );
  }

  const isManual = data.rateMode === 'manual' || (!data.rateMode && data.exchangeRate > 0);

  return (
    <div className="bg-white text-black min-h-screen relative font-sans p-4 sm:p-8">
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background-color: #fff;
            color: #000;
          }
        }
      `}</style>

      <div className="no-print flex justify-between gap-4 mb-8 bg-gray-100 p-4 rounded-md max-w-4xl mx-auto">
        <span className="text-xs text-gray-700 font-semibold self-center">
          Vista de Impresión Oficial - Cotización: {data.quoteId} ({data.formatStyle.toUpperCase()})
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 bg-purple-600 text-white rounded text-xs font-bold hover:bg-purple-700 cursor-pointer"
          >
            Imprimir Propuesta
          </button>
          <button
            onClick={() => window.close()}
            className="px-3 py-1.5 bg-gray-300 text-gray-800 rounded text-xs font-bold hover:bg-gray-400 cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto bg-white p-2">
        {data.formatStyle === 'classic' && (
          <div className="font-serif text-xs space-y-6">
            <div className="flex justify-between items-start border-b border-gray-200 pb-6">
              <div>
                <h1 className="font-sans text-xl font-black tracking-wide uppercase text-purple-700">{data.companyName}</h1>
                <p className="text-[10px] text-gray-500 font-sans mt-1">RIF: {data.companyRif}</p>
                <p className="text-[10px] text-gray-500 font-sans">TLF: {data.companyPhone}</p>
                <p className="text-[10px] text-gray-500 font-sans">{data.companyAddress}</p>
              </div>
              <div className="text-right">
                <h2 className="font-sans font-bold text-base tracking-tight text-gray-855">PROPUESTA COMERCIAL</h2>
                <p className="text-purple-600 font-bold text-lg mt-1">{data.quoteId}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 text-xs border border-gray-200 p-4 rounded-md font-sans bg-gray-50/40">
              <div>
                <span className="text-gray-400 font-bold block uppercase tracking-wider text-[9px]">Preparado Para</span>
                <span className="text-gray-850 font-bold mt-1 block text-sm">{data.clientName}</span>
                <span className="text-gray-500 mt-1 block">RIF/CI: {data.clientRif}</span>
                {data.clientPhone && <span className="text-gray-500 block">TLF: {data.clientPhone}</span>}
                {data.clientAddress && <span className="text-gray-500 block">{data.clientAddress}</span>}
              </div>
              <div className="text-right flex flex-col justify-between space-y-1">
                <div className="flex justify-between"><span className="text-gray-400">Fecha Propuesta:</span><span className="text-gray-800 font-semibold">{data.issueDate}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Días de Validez:</span><span className="text-gray-800 font-semibold">{data.validDays} días</span></div>
                {isManual ? (
                  <div className="flex justify-between border-t border-gray-200 pt-2"><span className="text-gray-400 font-bold">Tasa Oficial (Bs):</span><span className="text-purple-600 font-black">{data.exchangeRate.toFixed(2)} Bs</span></div>
                ) : (
                  <div className="flex justify-between border-t border-gray-200 pt-2"><span className="text-gray-400 font-bold">Tasa Oficial:</span><span className="text-purple-600 font-bold text-[9px]">TASA OFICIAL DEL DÍA</span></div>
                )}
              </div>
            </div>

            <div className="space-y-4 font-sans">
              <span className="text-[10px] font-bold text-purple-700 block uppercase tracking-wider border-b-2 border-gray-200 pb-2">Conceptos Detallados</span>
              <div className="divide-y divide-gray-200">
                {data.lines.map((line) => (
                  <div key={line.id} className="py-3 flex justify-between gap-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 text-xs">{line.title}</span>
                        {line.type === 'milestone' && (
                          <span className="text-[8px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Hito / Plazo: {line.duration}</span>
                        )}
                        {line.type === 'recurring' && (
                          <span className="text-[8px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Recurrente: {line.period}</span>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-500 leading-relaxed max-w-2xl">{line.description}</p>
                    </div>
                    <div className="text-right shrink-0 self-start">
                      <span className="font-bold text-gray-850 text-xs block">${(line.price * line.quantity).toFixed(2)}</span>
                      {isManual && (
                        <span className="text-[9px] text-gray-400 block">{(line.price * line.quantity * data.exchangeRate).toLocaleString()} Bs</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-end space-y-2 pt-6 border-t border-gray-200 font-sans">
              <div className="flex justify-between w-full max-w-[280px] text-gray-500">
                <span>Subtotal:</span>
                <span>${data.subtotalUsd.toFixed(2)}</span>
              </div>
              <div className="flex justify-between w-full max-w-[280px] text-gray-500">
                <span>Impuesto IVA (16%):</span>
                <span>${data.taxUsd.toFixed(2)}</span>
              </div>
              <div className="flex justify-between w-full max-w-[280px] text-gray-850 font-bold text-sm pt-2 border-t-2 border-gray-300">
                <span>Total Estimado:</span>
                <div className="text-right font-sans">
                  <span className="block text-purple-700 text-base font-black">${data.totalUsd.toFixed(2)}</span>
                  {isManual && <span className="block text-xs text-purple-600">{(data.totalUsd * data.exchangeRate).toFixed(2)} Bs</span>}
                </div>
              </div>
            </div>

            {!isManual && (
              <div className="bg-gray-100 border border-gray-200 p-3 rounded-md text-[10px] text-gray-700 text-center font-sans">
                <strong>Nota sobre cambio de divisa (Bs.):</strong> Propuesta presupuestada en USD ($). De requerir el pago en Bolívares (Bs.), se liquidará utilizando la tasa de cambio oficial oficial del Banco Central de Venezuela (BCV) correspondiente al día efectivo del pago.
              </div>
            )}

            {data.warrantyText && (
              <div className="border border-gray-200 bg-gray-50/50 rounded-md p-3.5 mt-8 text-[10px] text-gray-600 flex items-center gap-2 font-sans italic">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{data.warrantyText}</span>
              </div>
            )}
          </div>
        )}

        {data.formatStyle === 'minimalist' && (
          <div className="font-sans text-xs space-y-8 text-gray-955">
            <div className="border-l-4 border-black pl-4 py-1">
              <h1 className="text-xl font-black tracking-tight uppercase text-black">{data.companyName}</h1>
              <p className="text-[10px] text-gray-500 mt-1">RIF: {data.companyRif} | TLF: {data.companyPhone}</p>
              <p className="text-[10px] text-gray-500">{data.companyAddress}</p>
            </div>

            <div className="flex justify-between items-start border-b border-gray-200 pb-6">
              <div>
                <span className="text-gray-400 font-bold block text-[9px] uppercase tracking-wider">PRESUPUESTO PARA</span>
                <span className="text-black font-bold text-base mt-1 block">{data.clientName}</span>
                <span className="text-gray-600 block mt-1">RIF/CI: {data.clientRif}</span>
              </div>
              <div className="text-right space-y-1">
                <div><span className="text-gray-400 font-bold">PROPUESTA NRO:</span> <span className="font-bold text-black">{data.quoteId}</span></div>
                <div><span className="text-gray-400">EMISIÓN:</span> {data.issueDate}</div>
                <div><span className="text-gray-400">VALIDEZ:</span> {data.validDays} días</div>
                {isManual ? (
                  <div><span className="text-gray-400 font-bold">TASA CAMBIO:</span> <span className="font-bold text-black">{data.exchangeRate.toFixed(2)} Bs</span></div>
                ) : (
                  <div><span className="text-gray-400 font-bold">TASA:</span> <span className="font-bold text-black uppercase">TASA OFICIAL DEL DÍA</span></div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {data.lines.map((line) => (
                <div key={line.id} className="flex justify-between py-3 border-b border-gray-200">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-black uppercase text-xs">{line.title}</span>
                      <span className="text-[8px] text-gray-400 italic">({line.type.toUpperCase()})</span>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1">{line.description}</p>
                    {line.duration && <p className="text-[8px] text-purple-600 font-bold mt-1">PLAZO DE ENTREGA: {line.duration}</p>}
                    {line.period && <p className="text-[8px] text-emerald-600 font-bold mt-1">RECURRENCIA DE COBRO: {line.period}</p>}
                  </div>
                  <div className="text-right font-medium text-black">
                    <span className="text-xs font-bold">${(line.price * line.quantity).toFixed(2)}</span>
                    {isManual && (
                      <span className="block text-[9px] text-gray-400">{(line.price * line.quantity * data.exchangeRate).toLocaleString()} Bs</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col items-end space-y-1.5 pt-4">
              <div className="flex justify-between w-full max-w-[240px]">
                <span className="text-gray-400">SUBTOTAL</span>
                <span className="text-black font-medium">${data.subtotalUsd.toFixed(2)}</span>
              </div>
              <div className="flex justify-between w-full max-w-[240px]">
                <span className="text-gray-400">IVA (16%)</span>
                <span className="text-black font-medium">${data.taxUsd.toFixed(2)}</span>
              </div>
              <div className="flex justify-between w-full max-w-[240px] font-bold border-t-2 border-black pt-3 text-black text-sm">
                <span>TOTAL PROPUESTA</span>
                <span>
                  ${data.totalUsd.toFixed(2)} {isManual && `/ ${(data.totalUsd * data.exchangeRate).toFixed(0)} Bs`}
                </span>
              </div>
            </div>

            {!isManual && (
              <div className="border border-black p-3 text-[9px] text-black text-center font-sans tracking-wider">
                * PROPUESTA EXPRESADA EN USD. PAGOS LIQUIDADOS EN MONEDA NACIONAL UTILIZARÁN LA TASA OFICIAL VIGENTE DE PAGO.
              </div>
            )}

            {data.warrantyText && (
              <div className="border-t border-black pt-4 mt-8 text-[10px] text-gray-800 italic">
                * {data.warrantyText}
              </div>
            )}
          </div>
        )}

        {data.formatStyle === 'ticket' && (
          <div className="font-mono text-[9px] text-black space-y-4 mx-auto w-[290px] border border-gray-200 p-3 rounded font-sans">
            <div className="text-center space-y-1 border-b border-dashed border-gray-400 pb-3">
              <h1 className="font-bold text-xs uppercase tracking-wide">{data.companyName}</h1>
              <p>RIF: {data.companyRif}</p>
            </div>
            <div className="space-y-0.5 border-b border-dashed border-gray-400 pb-2">
              <p>PRESUPUESTO: {data.quoteId}</p>
              <p>CLIENTE: {data.clientName}</p>
              <p>VALIDEZ: {data.validDays} DÍAS</p>
            </div>
            <div className="border-b border-dashed border-gray-400 pb-2 space-y-3">
              {data.lines.map((line) => (
                <div key={line.id} className="space-y-0.5">
                  <div className="flex justify-between">
                    <span className="uppercase font-bold">{line.title}</span>
                    <span>${(line.price * line.quantity).toFixed(2)}</span>
                  </div>
                  <p className="text-[8px] text-gray-500 leading-tight">{line.description}</p>
                  {line.duration && <p className="text-[8px] text-purple-700">PLAZO: {line.duration}</p>}
                  {line.period && <p className="text-[8px] text-emerald-700">CICLO: {line.period}</p>}
                </div>
              ))}
            </div>
            <div className="flex flex-col items-end space-y-1">
              <div className="flex justify-between w-full">
                <span>TOTAL:</span>
                <span>${data.totalUsd.toFixed(2)}</span>
              </div>
              {isManual && (
                <div className="flex justify-between w-full">
                  <span>TASA:</span>
                  <span>{data.exchangeRate} Bs</span>
                </div>
              )}
              {isManual && (
                <div className="flex justify-between w-full font-bold text-[10px] border-t border-dashed border-gray-400 pt-2">
                  <span>PROPUESTA BS:</span>
                  <span>{data.totalBs.toFixed(0)} Bs</span>
                </div>
              )}
            </div>
            {!isManual && (
              <div className="text-center text-[7.5px] border border-dashed border-black p-1 text-black font-sans uppercase">
                PAGOS EN Bs SE CALCULARÁN A LA TASA OFICIAL DEL DÍA DE PAGO.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default QuotePrint;

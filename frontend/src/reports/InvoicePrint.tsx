import { useEffect, useState } from 'react';

interface InvoiceLine {
  id: number;
  description: string;
  quantity: number;
  price: number;
}

interface InvoiceData {
  companyName: string;
  companyRif: string;
  companyPhone: string;
  companyAddress: string;
  clientName: string;
  clientRif: string;
  clientPhone: string;
  clientAddress: string;
  invoiceId: string;
  issueDate: string;
  dueDate: string;
  terms: string;
  exchangeRate: number;
  formatStyle: 'classic' | 'minimalist' | 'ticket';
  customFooter?: string;
  lines: InvoiceLine[];
  subtotalUsd: number;
  taxUsd: number;
  totalUsd: number;
  subtotalBs: number;
  taxBs: number;
  totalBs: number;
}

function InvoicePrint() {
  const [data, setData] = useState<InvoiceData | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem('invoice_print_data');
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
        No se encontraron datos de facturación para imprimir.
      </div>
    );
  }

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
          Vista de Impresión Oficial - Formato: {data.formatStyle.toUpperCase()}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 bg-purple-600 text-white rounded text-xs font-bold hover:bg-purple-700 cursor-pointer"
          >
            Imprimir Factura
          </button>
          <button
            onClick={() => window.close()}
            className="px-3 py-1.5 bg-gray-300 text-gray-800 rounded text-xs font-bold hover:bg-gray-400 cursor-pointer"
          >
            Cerrar Ventana
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
                <h2 className="font-sans font-bold text-base tracking-tight text-gray-800">FACTURA DE VENTA</h2>
                <p className="text-purple-600 font-bold text-lg mt-1">{data.invoiceId}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 text-xs border border-gray-200 p-4 rounded-md font-sans bg-gray-50/40">
              <div>
                <span className="text-gray-400 font-bold block uppercase tracking-wider text-[9px]">Cliente Facturado</span>
                <span className="text-gray-800 font-bold mt-1.5 block text-sm">{data.clientName}</span>
                <span className="text-gray-500 mt-1 block">RIF/CI: {data.clientRif}</span>
                {data.clientPhone && <span className="text-gray-500 block">TLF: {data.clientPhone}</span>}
                {data.clientAddress && <span className="text-gray-500 block">{data.clientAddress}</span>}
              </div>
              <div className="text-right flex flex-col justify-between space-y-1">
                <div className="flex justify-between"><span className="text-gray-400">Fecha de Emisión:</span><span className="text-gray-800 font-semibold">{data.issueDate}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Fecha de Vencimiento:</span><span className="text-gray-800 font-semibold">{data.dueDate}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Método de Pago:</span><span className="text-gray-800 font-semibold">{data.terms}</span></div>
                <div className="flex justify-between border-t border-gray-200 pt-2"><span className="text-gray-400 font-bold">Tasa Oficial (Bs):</span><span className="text-purple-600 font-black">{data.exchangeRate.toFixed(2)} Bs</span></div>
              </div>
            </div>

            <table className="w-full text-left font-sans text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-300 text-gray-500 uppercase tracking-wider text-[9px] font-bold">
                  <th className="pb-3">Descripción de Artículos</th>
                  <th className="pb-3 text-right w-16">Cant.</th>
                  <th className="pb-3 text-right w-24">Precio ($)</th>
                  <th className="pb-3 text-right w-32">Total ($ / Bs)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-gray-700">
                {data.lines.map((line) => (
                  <tr key={line.id}>
                    <td className="py-3 pr-4 leading-tight">{line.description}</td>
                    <td className="py-3 text-right">{line.quantity}</td>
                    <td className="py-3 text-right">${line.price.toFixed(2)}</td>
                    <td className="py-3 text-right font-bold text-gray-800">
                      <div>${(line.price * line.quantity).toFixed(2)}</div>
                      <div className="text-[9px] text-gray-400 font-normal">{(line.price * line.quantity * data.exchangeRate).toFixed(2)} Bs</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex flex-col items-end space-y-2 pt-6 border-t border-gray-200 font-sans">
              <div className="flex justify-between w-full max-w-[280px] text-gray-500">
                <span>Subtotal:</span>
                <div className="text-right">
                  <span className="block">${data.subtotalUsd.toFixed(2)}</span>
                  <span className="block text-[10px]">{data.subtotalBs.toFixed(2)} Bs</span>
                </div>
              </div>
              <div className="flex justify-between w-full max-w-[280px] text-gray-500">
                <span>Impuesto IVA (16%):</span>
                <div className="text-right">
                  <span className="block">${data.taxUsd.toFixed(2)}</span>
                  <span className="block text-[10px]">{data.taxBs.toFixed(2)} Bs</span>
                </div>
              </div>
              <div className="flex justify-between w-full max-w-[280px] text-gray-800 font-bold text-sm pt-2 border-t-2 border-gray-300">
                <span>Total Factura:</span>
                <div className="text-right">
                  <span className="block text-purple-700">${data.totalUsd.toFixed(2)}</span>
                  <span className="block text-xs text-purple-600">{data.totalBs.toFixed(2)} Bs</span>
                </div>
              </div>
            </div>

            {data.customFooter && (
              <div className="border border-gray-200 bg-gray-50/50 rounded-md p-3.5 mt-8 text-[10px] text-gray-600 flex items-center gap-2 font-sans italic">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{data.customFooter}</span>
              </div>
            )}

            <div className="border-t border-gray-100 pt-12 text-center text-[9px] text-gray-400 font-sans">
              <p>Gracias por su compra. Esta factura constituye un comprobante formal de pago.</p>
              <p className="mt-1">Aplica según condiciones comerciales generales de la empresa.</p>
            </div>
          </div>
        )}

        {data.formatStyle === 'minimalist' && (
          <div className="font-sans text-xs space-y-8 text-gray-950">
            <div className="border-l-4 border-black pl-4 py-1">
              <h1 className="text-xl font-black tracking-tight uppercase text-black">{data.companyName}</h1>
              <p className="text-[10px] text-gray-500 mt-1">RIF: {data.companyRif} | TLF: {data.companyPhone}</p>
              <p className="text-[10px] text-gray-500">{data.companyAddress}</p>
            </div>

            <div className="flex justify-between items-start border-b border-gray-200 pb-6">
              <div>
                <span className="text-gray-400 font-bold block text-[9px] uppercase tracking-wider">DATOS CLIENTE</span>
                <span className="text-black font-bold text-base mt-1 block">{data.clientName}</span>
                <span className="text-gray-600 block mt-1">RIF/CI: {data.clientRif}</span>
                {data.clientPhone && <span className="text-gray-600 block">TLF: {data.clientPhone}</span>}
                {data.clientAddress && <span className="text-gray-600 block">{data.clientAddress}</span>}
              </div>
              <div className="text-right space-y-1">
                <div><span className="text-gray-400 font-bold">FACTURA NRO:</span> <span className="font-bold text-black">{data.invoiceId}</span></div>
                <div><span className="text-gray-400">EMISIÓN:</span> {data.issueDate}</div>
                <div><span className="text-gray-400">VENCE:</span> {data.dueDate}</div>
                <div><span className="text-gray-400 font-bold">MÉTODO:</span> <span className="font-bold text-black">{data.terms}</span></div>
                <div><span className="text-gray-400 font-bold">TASA CAMBIO:</span> <span className="font-bold text-black">{data.exchangeRate.toFixed(2)} Bs</span></div>
              </div>
            </div>

            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-black text-black font-bold uppercase tracking-wider text-[9px] pb-2">
                  <th className="pb-2">ARTÍCULO / CONCEPTO</th>
                  <th className="pb-2 text-right w-16">CANT</th>
                  <th className="pb-2 text-right w-24">USD ($)</th>
                  <th className="pb-2 text-right w-32">TOTAL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-gray-800">
                {data.lines.map((line) => (
                  <tr key={line.id}>
                    <td className="py-3 pr-4">{line.description}</td>
                    <td className="py-3 text-right">{line.quantity}</td>
                    <td className="py-3 text-right">${line.price.toFixed(2)}</td>
                    <td className="py-3 text-right font-medium">
                      <span className="block text-black">${(line.price * line.quantity).toFixed(2)}</span>
                      <span className="block text-[9px] text-gray-400">{(line.price * line.quantity * data.exchangeRate).toFixed(2)} Bs</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex flex-col items-end space-y-1.5 pt-4">
              <div className="flex justify-between w-full max-w-[240px]">
                <span className="text-gray-400">SUBTOTAL</span>
                <span className="text-black font-medium">${data.subtotalUsd.toFixed(2)} / {data.subtotalBs.toFixed(0)} Bs</span>
              </div>
              <div className="flex justify-between w-full max-w-[240px]">
                <span className="text-gray-400">IVA (16%)</span>
                <span className="text-black font-medium">${data.taxUsd.toFixed(2)} / {data.taxBs.toFixed(0)} Bs</span>
              </div>
              <div className="flex justify-between w-full max-w-[240px] font-bold border-t-2 border-black pt-3 text-black text-sm">
                <span>TOTAL GENERAL</span>
                <span>${data.totalUsd.toFixed(2)} / {data.totalBs.toFixed(0)} Bs</span>
              </div>
            </div>

            {data.customFooter && (
              <div className="border-t border-black pt-4 mt-8 text-[10px] text-gray-800 italic">
                * {data.customFooter}
              </div>
            )}
          </div>
        )}

        {data.formatStyle === 'ticket' && (
          <div className="font-mono text-[9px] text-black space-y-4 mx-auto w-[290px] border border-gray-200 p-3 rounded">
            <div className="text-center space-y-1 border-b border-dashed border-gray-400 pb-3">
              <h1 className="font-bold text-xs uppercase tracking-wide">{data.companyName}</h1>
              <p>RIF: {data.companyRif}</p>
              <p>TLF: {data.companyPhone}</p>
              <p>{data.companyAddress}</p>
            </div>

            <div className="space-y-0.5 border-b border-dashed border-gray-400 pb-2">
              <p>FACTURA: {data.invoiceId}</p>
              <p>FECHA: {data.issueDate}</p>
              <p>CLIENTE: {data.clientName}</p>
              <p>RIF/CI: {data.clientRif}</p>
              <p>MÉTODO DE PAGO: {data.terms}</p>
              {data.clientAddress && <p className="truncate">DIR: {data.clientAddress}</p>}
            </div>

            <div className="border-b border-dashed border-gray-400 pb-2 space-y-2">
              <div className="flex justify-between font-bold">
                <span>CONCEPTO</span>
                <span>TOTAL</span>
              </div>
              {data.lines.map((line) => (
                <div key={line.id} className="space-y-0.5">
                  <div className="flex justify-between">
                    <span className="uppercase">{line.description}</span>
                    <span>${(line.price * line.quantity).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[8px] text-gray-500">
                    <span>{line.quantity} x ${line.price.toFixed(2)}</span>
                    <span>{(line.price * line.quantity * data.exchangeRate).toFixed(0)} Bs</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col items-end space-y-1">
              <div className="flex justify-between w-full">
                <span>SUBTOTAL:</span>
                <span>${data.subtotalUsd.toFixed(2)} / {data.subtotalBs.toFixed(0)} Bs</span>
              </div>
              <div className="flex justify-between w-full">
                <span>IVA (16%):</span>
                <span>${data.taxUsd.toFixed(2)} / {data.taxBs.toFixed(0)} Bs</span>
              </div>
              <div className="flex justify-between w-full font-bold text-[10px] border-t border-dashed border-gray-400 pt-2">
                <span>TOTAL:</span>
                <span>${data.totalUsd.toFixed(2)} / {data.totalBs.toFixed(0)} Bs</span>
              </div>
            </div>

            {data.customFooter && (
              <div className="text-center py-2 text-[8px] text-black border-t border-dashed border-gray-400 my-2">
                {data.customFooter}
              </div>
            )}

            <div className="text-center border-t border-dashed border-gray-400 pt-3 text-[8px] space-y-1">
              <p>TASA CAMBIO: {data.exchangeRate.toFixed(2)} Bs / USD</p>
              <p>COMPROBANTE SIN VALOR FISCAL</p>
              <p className="font-bold mt-1">GRACIAS POR SU PREFERENCIA</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default InvoicePrint;

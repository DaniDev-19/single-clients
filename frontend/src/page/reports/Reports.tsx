import { useState } from 'react';
import Cards from '../../components/Cards';
import Buttons from '../../components/ui/Buttons';
import Table from '../../components/Table';
import { useAlert } from '../../hooks/useAlert';
import { useLoading } from '../../hooks/useLoading';

function Reports() {
  const { showAlert } = useAlert();
  const { showLoading, hideLoading } = useLoading();
  const [timeframe, setTimeframe] = useState('month');

  const handleExport = (format: string) => {
    showLoading({ title: 'Exportando Reporte', subtitle: `Compilando datos y generando archivo ${format.toUpperCase()}...` });
    setTimeout(() => {
      hideLoading();
      showAlert({
        title: 'Reporte Exportado',
        description: `El informe se descargó correctamente en formato ${format.toUpperCase()}.`,
        variant: 'success',
      });
    }, 1200);
  };

  const logs = [
    { date: '2026-06-07 10:15', event: 'Factura FAC-1002 emitida con éxito', user: 'DaniDev', type: 'Finanzas' },
    { date: '2026-06-07 09:40', event: 'Apertura de caja inicial registrada', user: 'Cajero Turno A', type: 'Caja' },
    { date: '2026-06-06 18:00', event: 'Cierre de caja registrado ($1110.00)', user: 'DaniDev', type: 'Caja' },
    { date: '2026-06-06 14:32', event: 'Pedido PED-8913 marcado como Enviado', user: 'Supervisor Logística', type: 'Inventario' },
    { date: '2026-06-05 11:20', event: 'Cliente Carlos Ruiz agregado', user: 'DaniDev', type: 'Clientes' },
  ];

  const tableRows = logs.map((log) => ({
    date: <span className="text-gray-400 font-semibold">{log.date}</span>,
    event: <span className="text-white font-semibold">{log.event}</span>,
    user: <span className="text-purple-400 font-medium">{log.user}</span>,
    type: (
      <span className="inline-block border border-border-dark bg-bg-panel px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded">
        {log.type}
      </span>
    ),
  }));

  const chartData = [
    { category: 'Víveres', value: 8500, percent: '85%' },
    { category: 'Alimentos', value: 6200, percent: '62%' },
    { category: 'Servicios', value: 12000, percent: '100%' },
    { category: 'Sistemas', value: 9400, percent: '94%' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white uppercase">Informes & Reportes</h1>
          <p className="mt-1 text-xs text-gray-400">Auditoría contable general, logs de transacciones de usuarios y analíticas del sistema.</p>
        </div>

        <div className="flex items-center gap-1.5">
          {[
            { key: 'today', label: 'Hoy' },
            { key: 'week', label: 'Semana' },
            { key: 'month', label: 'Mes' },
          ].map((btn) => (
            <button
              key={btn.key}
              type="button"
              onClick={() => setTimeframe(btn.key)}
              className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded border transition cursor-pointer ${
                timeframe === btn.key
                  ? 'border-purple-600 bg-purple-950/20 text-purple-400'
                  : 'border-border-dark bg-bg-card text-gray-400 hover:text-white'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Cards title="Ingresos Totales Brutos" value="$36,100.00" variant="soft" />
        <Cards title="Clientes Registrados" value="127" variant="default" />
        <Cards title="Pedidos Completados" value="94" variant="default" />
        <Cards title="Tasa de Cierre Soporte" value="98.2%" variant="accent" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 rounded-lg border border-border-dark bg-bg-card p-4 sm:p-6 shadow-md flex flex-col justify-between">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-white border-b border-border-dark/60 pb-3 mb-6">Ingresos Generados por Categoría</h2>
            <div className="flex items-end justify-around h-48 pt-6 border-b border-border-dark/40 pb-2">
              {chartData.map((bar) => (
                <div key={bar.category} className="flex flex-col items-center group w-1/5">
                  <div className="text-[10px] font-bold text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-150 mb-1">
                    ${bar.value.toLocaleString()}
                  </div>
                  <div
                    style={{ height: bar.percent }}
                    className="w-full max-w-[40px] rounded-t bg-purple-600/20 border border-purple-500/30 group-hover:bg-purple-600 group-hover:border-purple-500 transition-all duration-300"
                  />
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-3">
                    {bar.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-between items-center text-[10px] text-gray-500 mt-4">
            <span>Rango Analizado: {timeframe === 'today' ? 'Últimas 24 Horas' : timeframe === 'week' ? 'Últimos 7 Días' : 'Últimos 30 Días'}</span>
            <span>Unidad expresada en USD ($)</span>
          </div>
        </section>

        <section className="rounded-lg border border-border-dark bg-bg-card p-4 sm:p-6 shadow-md flex flex-col justify-between">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-white border-b border-border-dark/60 pb-3 mb-4">Exportación de Auditorías</h2>
            <p className="text-xs text-gray-400 leading-relaxed mb-6">Genere informes financieros y de inventario detallados para contabilidad interna o declaraciones fiscales de su negocio.</p>
            <div className="space-y-3">
              <Buttons variant="primary" className="w-full justify-center" onClick={() => handleExport('pdf')}>
                Exportar Reporte PDF
              </Buttons>
              <Buttons variant="secondary" className="w-full justify-center" onClick={() => handleExport('csv')}>
                Exportar Libro de Excel (CSV)
              </Buttons>
            </div>
          </div>
          <div className="border-t border-border-dark/30 pt-4 mt-6 text-center text-[10px] text-gray-500 italic">
            El archivo incluirá datos y arqueos fiscales de este periodo.
          </div>
        </section>
      </div>

      <Table
        title="Historial de Auditoría Interna (Logs)"
        button={
          <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Monitoreo Activo</span>
        }
        data={tableRows}
        columns={['date', 'event', 'user', 'type']}
      />
    </div>
  );
}

export default Reports;

import Cards from '../../components/Cards';

function Home() {
  const kpis = [
    { title: 'Ventas Totales', value: '$42,500.00', change: '+12.4%', variant: 'accent' as const, badge: 'Mensual' },
    { title: 'Clientes Activos', value: '154', change: '+8.2%', variant: 'success' as const, badge: 'Activo' },
    { title: 'Tickets Pendientes', value: '8', change: '-15.0%', variant: 'warning' as const, badge: 'Urgente' },
    { title: 'Inventario de SKUs', value: '1,240', change: 'Estable', variant: 'soft' as const, badge: 'Stock OK' },
  ];

  const chartData = [
    { month: 'Ene', value: 45 },
    { month: 'Feb', value: 60 },
    { month: 'Mar', value: 80 },
    { month: 'Abr', value: 55 },
    { month: 'May', value: 95 },
    { month: 'Jun', value: 110 },
  ];

  const activities = [
    { time: 'Hace 5 min', text: 'Cliente John Doe registrado', type: 'user' },
    { time: 'Hace 20 min', text: 'Venta #1094 de $1,200.00 aprobada', type: 'sale' },
    { time: 'Hace 1 hora', text: 'Ticket de soporte #382 marcado como resuelto', type: 'support' },
    { time: 'Hace 3 horas', text: 'Inventario de SKU-9281 actualizado (+50 unidades)', type: 'inventory' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-white uppercase">Dashboard</h1>
        <p className="mt-1 text-xs text-gray-400">Resumen y métricas de rendimiento general del sistema.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Cards
            key={kpi.title}
            title={kpi.title}
            value={kpi.value}
            secondaryValue={kpi.change}
            badge={kpi.badge}
            variant={kpi.variant}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 rounded-lg border border-border-dark bg-bg-card p-4 sm:p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold tracking-wide uppercase text-white mb-4">Ventas por Mes</h2>
          </div>
          <div className="flex items-end justify-between h-48 pt-6 px-2 sm:px-6">
            {chartData.map((item) => (
              <div key={item.month} className="flex flex-col items-center gap-2 flex-1">
                <div className="w-full max-w-[24px] sm:max-w-[40px] bg-bg-panel border border-border-dark rounded-t-md relative h-36 flex items-end justify-center">
                  <div
                    style={{ height: `${(item.value / 120) * 100}%` }}
                    className="w-full bg-gradient-to-t from-purple-700 to-purple-500 rounded-t-sm shadow-lg shadow-purple-600/10"
                  />
                  <span className="absolute -top-6 text-[10px] font-bold text-purple-400">
                    ${item.value * 100}
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-gray-400 uppercase">{item.month}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-border-dark bg-bg-card p-4 sm:p-6 flex flex-col">
          <h2 className="text-sm font-bold tracking-wide uppercase text-white mb-4">Actividad Reciente</h2>
          <div className="flex-1 flex flex-col justify-between gap-4">
            {activities.map((act, index) => (
              <div key={index} className="flex items-start gap-3 text-xs">
                <div className="mt-1 h-2 w-2 rounded-full bg-purple-500 shadow-sm shadow-purple-500/50" />
                <div className="flex-1 space-y-0.5">
                  <p className="text-gray-200">{act.text}</p>
                  <span className="text-[10px] text-gray-500">{act.time}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;

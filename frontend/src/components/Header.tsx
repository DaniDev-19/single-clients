import { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Modal } from './Modal';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

function Header({ onToggleSidebar }: HeaderProps) {
  const location = useLocation();
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const getPageTitle = (pathname: string) => {
    switch (pathname) {
      case '/':
        return 'Dashboard de Rendimiento';
      case '/clientes':
        return 'Gestión de Clientes';
      case '/proyectos':
        return 'Inventario y Catálogo';
      case '/pedidos':
        return 'Pedidos de Stock';
      case '/pos':
        return 'Terminal de Ventas (POS)';
      case '/cierre-caja':
        return 'Arqueo & Cierre de Caja';
      case '/ventas':
        return 'Historial de Transacciones';
      case '/facturas':
        return 'Facturador Profesional';
      case '/finanzas':
        return 'Libro de Finanzas';
      case '/post-venta':
        return 'Centro de Soporte Post-Venta';
      case '/reportes':
        return 'Reportes Avanzados';
      case '/configuracion':
        return 'Configuración del Sistema';
      default:
        return 'Panel de Control';
    }
  };

  const currentTitle = useMemo(() => getPageTitle(location.pathname), [location.pathname]);

  const notifications = [
    { id: 1, text: 'Stock bajo detectado en Consultoría TI', time: 'Hace 5m' },
    { id: 2, text: 'Nuevo ticket de soporte TKT-2914 abierto', time: 'Hace 1h' },
    { id: 3, text: 'Cierre de caja turno matutino pendiente', time: 'Hace 2h' },
  ];

  return (
    <header className="bg-bg-card border-b border-border-dark px-4 md:px-8 py-3.5 flex items-center justify-between shadow-sm relative z-30">
      <div className="flex items-center gap-3">
        <button
          aria-label="Abrir menú"
          className="md:hidden p-2 rounded hover:bg-bg-panel text-gray-400 hover:text-white cursor-pointer"
          onClick={onToggleSidebar}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-xs md:text-sm font-bold text-white tracking-wide uppercase">
          {currentTitle}
        </h1>
      </div>

      <div className="hidden lg:flex items-center gap-3 bg-black/40 border border-border-dark px-3 py-1 rounded-md text-xs">
        <div className="flex items-center gap-1.5 border-r border-border-dark/60 pr-3">
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Tasa Oficial:</span>
          <span className="text-white font-bold">530.00 Bs</span>
        </div>
        <div className="flex items-center gap-1.5 border-r border-border-dark/60 pr-3">
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Ayer:</span>
          <span className="text-gray-400 font-semibold">510.00 Bs</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-emerald-400 font-bold flex items-center gap-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7 7 7M12 3v18" />
            </svg>
            +20.00 Bs (+3.92%)
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 border border-border-dark bg-black/30 px-2.5 py-1 rounded-full">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider hidden sm:inline">En Línea</span>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-1.5 rounded-full border border-border-dark hover:border-purple-500/40 text-gray-400 hover:text-white hover:bg-bg-panel transition cursor-pointer relative"
            title="Notificaciones"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-0 right-0 block h-1.5 w-1.5 rounded-full bg-purple-500 ring-2 ring-bg-card" />
          </button>

          {isNotifOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsNotifOpen(false)} />
              <div className="absolute right-0 mt-2 w-64 rounded-md border border-border-dark bg-bg-card p-2 shadow-lg z-50 text-xs">
                <div className="border-b border-border-dark/60 pb-2 mb-2 px-2 flex items-center justify-between">
                  <span className="font-bold text-white uppercase tracking-wider text-[9px]">Notificaciones</span>
                  <span className="text-[9px] text-purple-400 font-semibold">Recientes</span>
                </div>
                <div className="space-y-1">
                  {notifications.map((notif) => (
                    <div key={notif.id} className="p-2 rounded hover:bg-bg-panel/40 transition">
                      <p className="text-gray-200 leading-tight">{notif.text}</p>
                      <span className="text-[9px] text-gray-500 block mt-1">{notif.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsHelpOpen(true)}
          className="p-1.5 rounded-full border border-border-dark hover:border-purple-500/40 text-gray-400 hover:text-white hover:bg-bg-panel transition cursor-pointer"
          title="Manual de Usuario"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>

      <Modal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        title="Guía Rápida de Módulos"
        showActions={true}
        actions={[{ label: 'Entendido', onClick: () => setIsHelpOpen(false), variant: 'primary' }]}
      >
        <div className="space-y-3.5 text-xs text-gray-300">
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-[10px] mb-1">1. Terminal POS (Ventas Rápidas)</h4>
            <p className="leading-relaxed">Diseñado para facturar víveres, alimentos o servicios instantáneamente. Selecciona los productos del catálogo paginado, ajusta las cantidades en el carrito de compras, asocia un cliente y presiona Cobrar.</p>
          </div>
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-[10px] mb-1">2. Arqueo y Cierre de Caja</h4>
            <p className="leading-relaxed">Permite conciliar el efectivo físico con los registros contables del turno. Ingresa la cantidad real contada para ver si tu balance es correcto, reporta diferencias y registra observaciones del cierre.</p>
          </div>
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-[10px] mb-1">3. Facturador Profesional</h4>
            <p className="leading-relaxed">Formulario para crear y exportar comprobantes fiscales en PDF, XML o enviarlos por correo electrónico. Edita los campos en tiempo real y previsualiza el borrador listo para impresión.</p>
          </div>
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-[10px] mb-1">4. Soporte Post-Venta</h4>
            <p className="leading-relaxed">Cola de tickets técnicos y reclamos de clientes. Filtra por estado de resolución o nivel de prioridad para agilizar la gestión de incidencias corporativas.</p>
          </div>
        </div>
      </Modal>
    </header>
  );
}

export default Header;
import { NavLink, Link, useNavigate } from 'react-router-dom';

interface SideBarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

function SideBar({ isOpen = false, onClose }: SideBarProps) {
  const navigate = useNavigate();
  const appTitle = import.meta.env.VITE_APP_TITLE || 'zymtaxis solutions';
  const appSlogan = import.meta.env.VITE_APP_SLOGAN || 'aprende creando y crea aprendiendo';
  const userName = import.meta.env.VITE_APP_USER_NAME || 'DaniDev';
  const userRole = import.meta.env.VITE_APP_USER_ROLE || 'Administrador';

  const userInitials = userName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const sections = [
    {
      title: 'Panel & Ajustes',
      links: [
        { name: 'Dashboard', to: '/' },
        { name: 'Ajustes del Sistema', to: '/configuracion' },
        { name: 'Roles y Permisos', to: '/roles-permisos' },
      ],
    },
    {
      title: 'Ventas & Facturación',
      links: [
        { name: 'Venta Directa (POS)', to: '/pos' },
        { name: 'Cierre de Caja', to: '/cierre-caja' },
        { name: 'Historial de Ventas', to: '/ventas' },
        { name: 'Pedidos Web E-Commerce', to: '/pedidos-ecommerce' },
        { name: 'Facturador Manual', to: '/facturas' },
        { name: 'Cotizador Comercial', to: '/cotizador' },
      ],
    },
    {
      title: 'Finanzas & Nómina',
      links: [
        { name: 'Balance General', to: '/finanzas' },
        { name: 'Control de Egresos', to: '/egresos' },
        { name: 'Nómina y Empleados', to: '/nomina' },
        { name: 'Métodos de Pago', to: '/metodos-pago' },
        { name: 'Créditos / Fiados', to: '/creditos' },
        { name: 'Reportes Financieros', to: '/reportes' },
      ],
    },
    {
      title: 'Inventario & Sorteos',
      links: [
        { name: 'Inventario / Alertas', to: '/proyectos' },
        { name: 'Clientes', to: '/clientes' },
        { name: 'Pedidos de Stock', to: '/pedidos' },
        { name: 'Ofertas y Combos', to: '/promociones' },
        { name: 'Dinámica de Rifas', to: '/rifas' },
      ],
    },
    {
      title: 'Soporte & Utilidades',
      links: [
        { name: 'Órdenes de Servicio', to: '/ordenes-servicio' },
        { name: 'Tickets Post-Venta', to: '/post-venta' },
        { name: 'Notas y Credenciales', to: '/notas-credenciales' },
        { name: 'Ayuda & Manuales', to: '/ayuda' },
      ],
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between font-sans">
      <div className="flex flex-col min-h-0 flex-1">
        <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border-dark bg-black/20">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-purple-600/10 border border-purple-500/20 text-purple-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-xs font-black tracking-widest text-white uppercase truncate">
            {appTitle}
          </span>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 custom-scrollbar space-y-4">
          {sections.map((sec) => (
            <div key={sec.title} className="space-y-1">
              <span className="text-[9px] font-bold uppercase tracking-wider text-gray-500 px-3 block">
                {sec.title}
              </span>
              <ul className="flex flex-col gap-0.5">
                {sec.links.map((link) => (
                  <li key={link.name}>
                    <NavLink
                      to={link.to}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `block rounded px-3 py-2 text-xs font-semibold tracking-wide uppercase transition duration-150 ${
                          isActive
                            ? 'bg-purple-950/20 text-purple-400 border-l-2 border-purple-600 pl-2.5'
                            : 'text-gray-400 hover:bg-bg-panel hover:text-white'
                        }`
                      }
                      end={link.to === '/'}
                    >
                      {link.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="border-t border-border-dark bg-black/20 p-4 space-y-4">
        <div className="flex items-center justify-between gap-3 rounded border border-border-dark bg-bg-panel/40 p-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-600 text-xs font-bold text-white uppercase">
              {userInitials}
            </div>
            <div className="min-w-0">
              <span className="block text-xs font-bold text-white truncate">{userName}</span>
              <span className="block text-[10px] text-gray-500 truncate">{userRole}</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Link
              to="/configuracion"
              className="p-1 rounded text-gray-500 hover:bg-bg-panel hover:text-white transition cursor-pointer"
              title="Configuración de Perfil"
              aria-label="Perfil"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </Link>
            <button
              type="button"
              onClick={() => {
                if (onClose) onClose();
                navigate('/login');
              }}
              className="p-1 rounded text-gray-500 hover:bg-bg-panel hover:text-red-400 transition cursor-pointer"
              title="Cerrar Sesión"
              aria-label="Cerrar Sesión"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>

        <p className="text-[10px] text-center text-gray-500 italic px-2">
          &ldquo;{appSlogan}&rdquo;
        </p>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden md:flex flex-col bg-bg-card border-r border-border-dark w-64 min-h-screen sticky top-0 h-screen overflow-hidden">
        {sidebarContent}
      </aside>

      <div
        className={`md:hidden fixed inset-0 z-40 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        aria-hidden={!isOpen}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />
        <aside className="relative w-64 h-full bg-bg-card border-r border-border-dark overflow-hidden">
          {sidebarContent}
        </aside>
      </div>
    </>
  );
}

export default SideBar;
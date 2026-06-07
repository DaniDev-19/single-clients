import { useState, useEffect, useRef } from 'react';
import loginIllustration from '../../assets/login_illustration.png';

interface HelpModule {
  id: string;
  title: string;
  description: string;
  details: string[];
  image?: string;
  icon: React.ReactNode;
}

function Ayuda() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('dashboard');

  const modules: HelpModule[] = [
    {
      id: 'dashboard',
      title: 'Dashboard y Analítica',
      description: 'Panel de control principal con indicadores financieros en tiempo real y alertas críticas.',
      details: [
        'Visualización de ingresos, egresos y neto del día.',
        'Mapeo de ventas recientes y estado de la caja registradora.',
        'Indicadores visuales de productos con stock bajo.',
        'Accesos directos a las operaciones frecuentes.'
      ],
      image: loginIllustration,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
        </svg>
      )
    },
    {
      id: 'pos',
      title: 'Terminal de Ventas (POS)',
      description: 'Módulo diseñado para la facturación inmediata de víveres, alimentos y servicios.',
      details: [
        'Catálogo de productos con paginación integrada.',
        'Selección dinámica de tarifas de precios (Unitario, Mayorista, Oferta y Rebaja).',
        'Registro de Cliente Express directo sin cambiar de pestaña.',
        'Cálculo de impuestos y equivalencia en Bolívares según tasa cambiaria.'
      ],
      image: loginIllustration,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 'caja',
      title: 'Control de Caja y Turnos',
      description: 'Monitoreo de movimientos de dinero e inicio/cierre de turnos de cajeros.',
      details: [
        'Apertura de caja con saldo inicial base.',
        'Registro de entradas y salidas de efectivo justificadas.',
        'Arqueo de caja rápido al final del turno para auditoría.',
        'Control histórico de discrepancias y reportes detallados.'
      ],
      image: loginIllustration,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      id: 'inventario',
      title: 'Inventario / Alertas',
      description: 'Gestión centralizada del catálogo maestro de productos y variaciones.',
      details: [
        'Configuración de precios base, mayorista y margen de ganancia.',
        'Filtros por categorías y estado de existencias en tiempo real.',
        'Alertas automáticas de stock mínimo crítico.',
        'Asociación de imágenes descriptivas de productos.'
      ],
      image: loginIllustration,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      )
    },
    {
      id: 'nomina',
      title: 'Nómina y Empleados',
      description: 'Estructuración administrativa del capital humano de la empresa.',
      details: [
        'Ficha detallada de empleados con estatus laboral activo o vacaciones.',
        'Historial de pagos estructurado (quincenal, mensual, diario).',
        'Configuración de bonos de temporada e incentivos adicionales.',
        'Generación de comprobantes de pago listos para compartir.'
      ],
      image: loginIllustration,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      id: 'promociones',
      title: 'Ofertas y Combos',
      description: 'Creación de ofertas comerciales y combos de múltiples productos.',
      details: [
        'Definición de combos a precios especiales con descuento global.',
        'Subida de imágenes promocionales publicitarias.',
        'Asociación de productos específicos del inventario maestro.',
        'Fechas de vigencia de las campañas publicitarias.'
      ],
      image: loginIllustration,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5a2 2 0 10-2 2h2zm0 10h.01M12 14h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 'rifas',
      title: 'Dinámica de Rifas',
      description: 'Herramienta de sorteos digitales para incentivar ventas y fidelizar clientes.',
      details: [
        'Matriz completa de boletos con registro de propietario.',
        'Tómbola interactiva animada con efectos de sonido visual.',
        'Generación automática de acta oficial de ganadores en PDF y PNG.',
        'Contador regresivo en tiempo real sincronizado con el sorteo.'
      ],
      image: loginIllustration,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
      )
    },
    {
      id: 'metodos',
      title: 'Métodos de Pago',
      description: 'Gestión de canales y datos de facturación para cobros rápidos.',
      details: [
        'Configuración de Pago Móvil e información bancaria nacional.',
        'Registro de cuentas de divisas internacionales.',
        'Integración con datos del portal público de e-commerce.',
        'Visualizador de captures y validación rápida de pagos.'
      ],
      image: loginIllustration,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      )
    }
  ];

  useEffect(() => {
    const scrollContainer = containerRef.current?.closest('.overflow-y-auto');
    if (!scrollContainer) return;

    const handleScroll = () => {
      const scrollTop = scrollContainer.scrollTop;
      const scrollHeight = scrollContainer.scrollHeight;
      const clientHeight = scrollContainer.clientHeight;
      const total = scrollHeight - clientHeight;
      if (total > 0) {
        setScrollProgress((scrollTop / total) * 100);
      }

      for (const mod of modules) {
        const el = document.getElementById(mod.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top >= 0 && rect.top <= 200) {
            setActiveSection(mod.id);
          }
        }
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToModule = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
    }
  };

  return (
    <div ref={containerRef} className="space-y-6 relative">
      <div className="sticky top-0 z-30 bg-bg-main/90 backdrop-blur-md pt-2 pb-4 border-b border-border-dark flex flex-col gap-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white uppercase">Centro de Ayuda y Manuales</h1>
            <p className="mt-1 text-xs text-gray-400">Guía interactiva detallada de cada módulo y flujos del sistema administrativo.</p>
          </div>
        </div>

        <div className="w-full bg-border-dark h-1 rounded-full overflow-hidden mt-3">
          <div
            className="bg-purple-600 h-full transition-all duration-100 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <aside className="w-full lg:w-64 bg-bg-card border border-border-dark p-4 rounded-lg sticky top-28 lg:block z-20">
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-3 px-1">Módulos del Sistema</h2>
          <nav className="space-y-1">
            {modules.map((mod) => (
              <button
                key={mod.id}
                type="button"
                onClick={() => scrollToModule(mod.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded text-left transition cursor-pointer ${
                  activeSection === mod.id
                    ? 'bg-purple-950/20 text-purple-400 border-l-2 border-purple-600 pl-2'
                    : 'text-gray-400 hover:bg-bg-panel hover:text-white'
                }`}
              >
                {mod.icon}
                <span className="truncate">{mod.title}</span>
              </button>
            ))}
          </nav>
        </aside>

        <section className="flex-1 space-y-8">
          {modules.map((mod) => (
            <div
              key={mod.id}
              id={mod.id}
              className="border border-border-dark bg-bg-card/50 p-6 rounded-lg shadow-md space-y-4 hover:border-purple-500/20 transition duration-150"
            >
              <div className="flex items-center gap-3 border-b border-border-dark/60 pb-3">
                <div className="p-2 rounded bg-purple-600/10 border border-purple-500/20 text-purple-400">
                  {mod.icon}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase">{mod.title}</h3>
                  <p className="text-[10px] text-gray-400 mt-0.5">{mod.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="space-y-3">
                  <h4 className="text-[9px] font-extrabold uppercase tracking-wider text-purple-400">Funcionalidades Clave:</h4>
                  <ul className="space-y-2">
                    {mod.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-gray-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-lg border border-border-dark bg-black/40 p-2 shadow-xl hover:scale-[1.01] transition duration-200">
                  <img
                    src={mod.image}
                    alt={`Preview ${mod.title}`}
                    className="rounded object-cover max-h-[160px] w-full opacity-80"
                  />
                  <div className="text-center pt-2 text-[9px] uppercase tracking-wider text-gray-500 font-bold">
                    Vista Previa del Módulo
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

export default Ayuda;

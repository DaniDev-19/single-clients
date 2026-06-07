import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import AlertasProvider from './providers/AlertasProvider';
import LoadingProvider from './providers/LoadingProvider';

import Home from './page/home/Home';
import Clients from './page/clients/Clients';
import Inventory from './page/inventory/Inventory';
import Pedidos from './page/inventory/Pedidos';
import POS from './page/sales/POS';
import CierreCaja from './page/sales/CierreCaja';
import Sales from './page/sales/Sales';
import Facturador from './page/finanzas/Facturador';
import Finanzas from './page/finanzas/Finanzas';
import PostVenta from './page/post/PostVenta';
import Reports from './page/reports/Reports';
import Profile from './page/profile/Profile';
import InvoicePrint from './reports/InvoicePrint';
import Login from './page/auth/Login';
import Creditos from './page/finanzas/Creditos';
import Cotizador from './page/finanzas/Cotizador';
import QuotePrint from './reports/QuotePrint';
import Egresos from './page/finanzas/Egresos';
import OrdenesServicio from './page/post/OrdenesServicio';
import NotasCredenciales from './page/profile/NotasCredenciales';
import RolesPermisos from './page/profile/RolesPermisos';
import Nomina from './page/finanzas/Nomina';
import Promociones from './page/inventory/Promociones';
import Rifas from './page/finanzas/Rifas';
import MetodosPago from './page/finanzas/MetodosPago';
import PedidosEcommerce from './page/sales/PedidosEcommerce';
import Ayuda from './page/soporte/Ayuda';

function App() {
  return (
    <LoadingProvider>
      <AlertasProvider>
        <Router basename="/client">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/reports/invoice" element={<InvoicePrint />} />
            <Route path="/reports/quote" element={<QuotePrint />} />
            <Route path="*" element={
              <Layout>
                <Routes>
                  <Route index element={<Home />} />
                  <Route path="/clientes" element={<Clients />} />
                  <Route path="/proyectos" element={<Inventory />} />
                  <Route path="/pedidos" element={<Pedidos />} />
                  <Route path="/promociones" element={<Promociones />} />
                  <Route path="/pos" element={<POS />} />
                  <Route path="/cierre-caja" element={<CierreCaja />} />
                  <Route path="/ventas" element={<Sales />} />
                  <Route path="/pedidos-ecommerce" element={<PedidosEcommerce />} />
                  <Route path="/facturas" element={<Facturador />} />
                  <Route path="/cotizador" element={<Cotizador />} />
                  <Route path="/creditos" element={<Creditos />} />
                  <Route path="/egresos" element={<Egresos />} />
                  <Route path="/finanzas" element={<Finanzas />} />
                  <Route path="/nomina" element={<Nomina />} />
                  <Route path="/rifas" element={<Rifas />} />
                  <Route path="/metodos-pago" element={<MetodosPago />} />
                  <Route path="/post-venta" element={<PostVenta />} />
                  <Route path="/ordenes-servicio" element={<OrdenesServicio />} />
                  <Route path="/reportes" element={<Reports />} />
                  <Route path="/notas-credenciales" element={<NotasCredenciales />} />
                  <Route path="/roles-permisos" element={<RolesPermisos />} />
                  <Route path="/configuracion" element={<Profile />} />
                  <Route path="/ayuda" element={<Ayuda />} />
                  <Route path="*" element={<div className="p-6 text-center"><h1 className="text-xl font-bold text-red-500">404 Not Found</h1></div>} />
                </Routes>
              </Layout>
            } />
          </Routes>
        </Router>
      </AlertasProvider>
    </LoadingProvider>
  );
}

export default App;
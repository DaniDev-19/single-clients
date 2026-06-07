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

function App() {
  return (
    <LoadingProvider>
      <AlertasProvider>
        <Router basename="/client">
          <Routes>
            <Route path="/reports/invoice" element={<InvoicePrint />} />
            <Route path="*" element={
              <Layout>
                <Routes>
                  <Route index element={<Home />} />
                  <Route path="/clientes" element={<Clients />} />
                  <Route path="/proyectos" element={<Inventory />} />
                  <Route path="/pedidos" element={<Pedidos />} />
                  <Route path="/pos" element={<POS />} />
                  <Route path="/cierre-caja" element={<CierreCaja />} />
                  <Route path="/ventas" element={<Sales />} />
                  <Route path="/facturas" element={<Facturador />} />
                  <Route path="/finanzas" element={<Finanzas />} />
                  <Route path="/post-venta" element={<PostVenta />} />
                  <Route path="/reportes" element={<Reports />} />
                  <Route path="/configuracion" element={<Profile />} />
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
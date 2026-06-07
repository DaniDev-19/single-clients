import Header from '../Header';
import SideBar from '../SideBar';
import type { ReactNode } from 'react';
import { useState } from 'react';

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <main className="bg-bg-main min-h-screen text-white flex overflow-hidden">
      <SideBar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-bg-main">
        <Header onToggleSidebar={() => setSidebarOpen((s) => !s)} />
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto w-full pb-8">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Layout;
import React from 'react';
import { FileText } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="site-header sticky top-0 z-50 bg-blue-600 text-white">
      <div className="header-content max-w-7xl mx-auto flex items-start justify-between p-2">
        <div className="flex items-start space-x-3">
          <FileText className="h-8 w-8 header-icon -mt-1" />
          <div className="hidden md:block">
            <h1 className="text-lg font-bold leading-tight">Portal de Decretos, Resoluciones y Ordenanzas</h1>
            <p className="text-xs text-white/90 leading-tight">Sistema de Gestión Normativa</p>
          </div>
          <div className="md:hidden">
            <h1 className="text-lg font-bold">PDRO</h1>
          </div>
        </div>

        {/* static header for public portal */}
      </div>
    </header>
  );
};

export default Header;

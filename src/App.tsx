import React, { useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { Toaster } from 'sonner';
import { Routes, Route } from 'react-router-dom';
import { loadConfig } from './lib/configLoader';

// pages
import PublicRegulationsList from './pages/PublicRegulationsList';
// administración removed in public build
// import AdminRegulationsList from './pages/admin/RegulationsList';
// import AdminRegulationNew from './pages/admin/RegulationNew';
// import AdminRegulationEditor from './pages/admin/RegulationEditor';

function App() {
  useEffect(() => {
    // Cargar configuración al inicio de la aplicación
    loadConfig().catch(error => {
      console.error('Error al cargar configuración inicial:', error);
    });
  }, []);

  return (
    <div className="App flex flex-col min-h-screen">
      <Toaster position="bottom-right" />
      <Header />
      <main className="flex-1 p-4">
        <Routes>
          <Route path="/" element={<PublicRegulationsList />} />
          {/* admin routes stripped out for public portal */}
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;

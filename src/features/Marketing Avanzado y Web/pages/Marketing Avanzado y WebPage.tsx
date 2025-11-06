import { useState } from 'react';
import { Plus, FileText, Layout, BarChart3, ShoppingBag, Link2, Target, Calendar, Building2 } from 'lucide-react';
import LandingPageDashboardPage from './LandingPageDashboardPage';
import LandingPageEditorPage from './LandingPageEditorPage';
import CatalogoServiciosWebPage from './CatalogoServiciosWebPage';
import AdsIntegrationDashboardPage from './AdsIntegrationDashboardPage';
import TrackingConfigPage from './TrackingConfigPage';
import CalendarioEditorialPage from './CalendarioEditorialPage';
import AbmDashboardPage from './AbmDashboardPage';
import AbmEmpresaDetailPage from './AbmEmpresaDetailPage';

export default function MarketingAvanzadoYWebPage() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'editor' | 'catalogo-servicios' | 'ads-integration' | 'tracking-config' | 'calendario-editorial' | 'abm-dashboard' | 'abm-empresa-detail'>('dashboard');
  const [landingPageId, setLandingPageId] = useState<string | null>(null);
  const [empresaSeleccionadaId, setEmpresaSeleccionadaId] = useState<string | null>(null);

  const handleNuevaLandingPage = () => {
    setLandingPageId(null);
    setCurrentView('editor');
  };

  const handleEditarLandingPage = (id: string) => {
    setLandingPageId(id);
    setCurrentView('editor');
  };

  const handleVolverAlDashboard = () => {
    setCurrentView('dashboard');
    setLandingPageId(null);
  };

  if (currentView === 'editor') {
    return (
      <LandingPageEditorPage
        landingPageId={landingPageId}
        onVolver={handleVolverAlDashboard}
        onGuardado={handleVolverAlDashboard}
      />
    );
  }

  if (currentView === 'catalogo-servicios') {
    return <CatalogoServiciosWebPage />;
  }

  if (currentView === 'ads-integration') {
    return <AdsIntegrationDashboardPage />;
  }

  if (currentView === 'tracking-config') {
    return <TrackingConfigPage />;
  }

  if (currentView === 'calendario-editorial') {
    return <CalendarioEditorialPage />;
  }

  if (currentView === 'abm-dashboard') {
    return (
      <AbmDashboardPage
        onVerEmpresa={(empresaId) => {
          setEmpresaSeleccionadaId(empresaId);
          setCurrentView('abm-empresa-detail');
        }}
      />
    );
  }

  if (currentView === 'abm-empresa-detail') {
    return (
      empresaSeleccionadaId && (
        <AbmEmpresaDetailPage
          empresaId={empresaSeleccionadaId}
          onVolver={() => {
            setCurrentView('abm-dashboard');
            setEmpresaSeleccionadaId(null);
          }}
        />
      )
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Marketing Avanzado y Web</h1>
          <p className="text-gray-600 mt-2">
            Gestiona tus landing pages de campaña y estrategias de marketing digital
          </p>
        </div>
        <button
          onClick={handleNuevaLandingPage}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Nueva Landing Page</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => setCurrentView('catalogo-servicios')}
          className="bg-white p-6 rounded-lg shadow border border-gray-200 hover:shadow-lg transition-shadow text-left"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-100 p-3 rounded-lg">
              <ShoppingBag className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Catálogo de Servicios</h3>
              <p className="text-sm text-gray-600">Gestiona servicios para la web</p>
            </div>
          </div>
        </button>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Landing Pages</h3>
              <p className="text-sm text-gray-600">Editor de páginas de campaña</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-3 rounded-lg">
              <Layout className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Plantillas</h3>
              <p className="text-sm text-gray-600">Plantillas predefinidas</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setCurrentView('ads-integration')}
          className="bg-white p-6 rounded-lg shadow border border-gray-200 hover:shadow-lg transition-shadow text-left"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Link2 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Integración con Ads</h3>
              <p className="text-sm text-gray-600">Google Ads y Meta Ads</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setCurrentView('tracking-config')}
          className="bg-white p-6 rounded-lg shadow border border-gray-200 hover:shadow-lg transition-shadow text-left"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-orange-100 p-3 rounded-lg">
              <Target className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Pixel/Conversiones</h3>
              <p className="text-sm text-gray-600">UTM Tracking y píxeles</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setCurrentView('calendario-editorial')}
          className="bg-white p-6 rounded-lg shadow border border-gray-200 hover:shadow-lg transition-shadow text-left"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-pink-100 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-pink-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Calendario Editorial</h3>
              <p className="text-sm text-gray-600">Redes sociales y contenido</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setCurrentView('abm-dashboard')}
          className="bg-white p-6 rounded-lg shadow border border-gray-200 hover:shadow-lg transition-shadow text-left"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-cyan-100 p-3 rounded-lg">
              <Building2 className="w-6 h-6 text-cyan-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">ABM para Empresas</h3>
              <p className="text-sm text-gray-600">Account-Based Marketing</p>
            </div>
          </div>
        </button>
      </div>

      <LandingPageDashboardPage
        onNuevaLandingPage={handleNuevaLandingPage}
        onEditarLandingPage={handleEditarLandingPage}
      />
    </div>
  );
}


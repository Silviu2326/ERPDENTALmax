import { useState } from 'react';
import { Plus, FileText, Layout, ShoppingBag, Link2, Target, Calendar, Building2, Sparkles } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <Sparkles size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Marketing Avanzado y Web
                </h1>
                <p className="text-gray-600">
                  Gestiona tus landing pages de campaña y estrategias de marketing digital
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Toolbar Superior */}
          <div className="flex items-center justify-end">
            <button
              onClick={handleNuevaLandingPage}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm ring-1 ring-blue-200"
            >
              <Plus size={20} />
              <span>Nueva Landing Page</span>
            </button>
          </div>

          {/* Grid de Módulos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <button
              onClick={() => setCurrentView('catalogo-servicios')}
              className="bg-white shadow-sm rounded-xl ring-1 ring-slate-200 h-full flex flex-col transition-all overflow-hidden hover:shadow-md hover:ring-2 hover:ring-blue-400 text-left p-4"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
                  <ShoppingBag size={20} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">Catálogo de Servicios</h3>
                  <p className="text-sm text-gray-600 mt-1">Gestiona servicios para la web</p>
                </div>
              </div>
            </button>

            <div className="bg-white shadow-sm rounded-xl ring-1 ring-slate-200 h-full flex flex-col p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
                  <FileText size={20} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">Landing Pages</h3>
                  <p className="text-sm text-gray-600 mt-1">Editor de páginas de campaña</p>
                </div>
              </div>
            </div>

            <div className="bg-white shadow-sm rounded-xl ring-1 ring-slate-200 h-full flex flex-col p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
                  <Layout size={20} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">Plantillas</h3>
                  <p className="text-sm text-gray-600 mt-1">Plantillas predefinidas</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setCurrentView('ads-integration')}
              className="bg-white shadow-sm rounded-xl ring-1 ring-slate-200 h-full flex flex-col transition-all overflow-hidden hover:shadow-md hover:ring-2 hover:ring-blue-400 text-left p-4"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
                  <Link2 size={20} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">Integración con Ads</h3>
                  <p className="text-sm text-gray-600 mt-1">Google Ads y Meta Ads</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setCurrentView('tracking-config')}
              className="bg-white shadow-sm rounded-xl ring-1 ring-slate-200 h-full flex flex-col transition-all overflow-hidden hover:shadow-md hover:ring-2 hover:ring-blue-400 text-left p-4"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
                  <Target size={20} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">Pixel/Conversiones</h3>
                  <p className="text-sm text-gray-600 mt-1">UTM Tracking y píxeles</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setCurrentView('calendario-editorial')}
              className="bg-white shadow-sm rounded-xl ring-1 ring-slate-200 h-full flex flex-col transition-all overflow-hidden hover:shadow-md hover:ring-2 hover:ring-blue-400 text-left p-4"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
                  <Calendar size={20} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">Calendario Editorial</h3>
                  <p className="text-sm text-gray-600 mt-1">Redes sociales y contenido</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setCurrentView('abm-dashboard')}
              className="bg-white shadow-sm rounded-xl ring-1 ring-slate-200 h-full flex flex-col transition-all overflow-hidden hover:shadow-md hover:ring-2 hover:ring-blue-400 text-left p-4"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
                  <Building2 size={20} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">ABM para Empresas</h3>
                  <p className="text-sm text-gray-600 mt-1">Account-Based Marketing</p>
                </div>
              </div>
            </button>
          </div>

          {/* Sección Landing Pages */}
          <div className="pt-6 border-t border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Landing Pages</h2>
            <LandingPageDashboardPage
              onNuevaLandingPage={handleNuevaLandingPage}
              onEditarLandingPage={handleEditarLandingPage}
              embedded={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}


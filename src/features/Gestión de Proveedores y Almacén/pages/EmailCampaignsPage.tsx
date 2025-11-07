import { useState, useEffect } from 'react';
import { Mail, Plus, Filter, RefreshCw, Search, X, AlertCircle } from 'lucide-react';
import {
  EmailCampaign,
  obtenerCampanas,
  eliminarCampana,
  CampaignListParams,
} from '../api/campaignsApi';
import CampaignsListTable from '../components/CampaignsListTable';
import CreateEditCampaignPage from './CreateEditCampaignPage';
import CampaignReportPage from './CampaignReportPage';

type ViewMode = 'list' | 'create' | 'edit' | 'report';

export default function EmailCampaignsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<EmailCampaign | null>(null);
  const [filters, setFilters] = useState<CampaignListParams>({
    page: 1,
    limit: 20,
    sortBy: 'createdAt',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  useEffect(() => {
    if (viewMode === 'list') {
      cargarCampanas();
    }
  }, [viewMode, filters]);

  const cargarCampanas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Datos falsos completos de campañas de email
      const datosFalsos: EmailCampaign[] = [
        {
          _id: '1',
          name: 'Promoción Limpieza Dental',
          subject: '¡Oferta Especial: Limpieza Dental con 30% de Descuento!',
          htmlContent: '<html>...</html>',
          status: 'sent',
          sentAt: '2024-03-15T10:00:00Z',
          scheduledAt: '2024-03-15T10:00:00Z',
          segmentCriteria: {
            lastVisitDate: {
              operator: 'before',
              value: '2024-01-01',
            },
          },
          stats: {
            totalRecipients: 1250,
            opens: 875,
            clicks: 342,
            bounces: 12,
            unsubscribes: 5,
          },
          createdAt: '2024-03-10T09:00:00Z',
          updatedAt: '2024-03-15T10:00:00Z',
        },
        {
          _id: '2',
          name: 'Recordatorio Revisión Anual',
          subject: 'Es hora de tu revisión dental anual',
          htmlContent: '<html>...</html>',
          status: 'scheduled',
          scheduledAt: '2024-03-20T09:00:00Z',
          segmentCriteria: {
            lastVisitDate: {
              operator: 'before',
              value: '2023-12-31',
            },
          },
          stats: {
            totalRecipients: 0,
            opens: 0,
            clicks: 0,
            bounces: 0,
            unsubscribes: 0,
          },
          createdAt: '2024-03-12T14:30:00Z',
          updatedAt: '2024-03-12T14:30:00Z',
        },
        {
          _id: '3',
          name: 'Nuevos Tratamientos de Estética',
          subject: 'Descubre nuestros nuevos tratamientos de estética dental',
          htmlContent: '<html>...</html>',
          status: 'sending',
          scheduledAt: '2024-03-18T08:00:00Z',
          segmentCriteria: {
            ageRange: {
              min: 25,
              max: 55,
            },
          },
          stats: {
            totalRecipients: 850,
            opens: 425,
            clicks: 178,
            bounces: 8,
            unsubscribes: 3,
          },
          createdAt: '2024-03-14T11:15:00Z',
          updatedAt: '2024-03-18T08:00:00Z',
        },
        {
          _id: '4',
          name: 'Oferta Ortodoncia Invisible',
          subject: 'Ortodoncia Invisible: Financiación sin intereses',
          htmlContent: '<html>...</html>',
          status: 'draft',
          segmentCriteria: {
            treatments: ['ortodoncia'],
          },
          stats: {
            totalRecipients: 0,
            opens: 0,
            clicks: 0,
            bounces: 0,
            unsubscribes: 0,
          },
          createdAt: '2024-03-16T16:45:00Z',
          updatedAt: '2024-03-16T16:45:00Z',
        },
        {
          _id: '5',
          name: 'Campaña Bienvenida Nuevos Pacientes',
          subject: 'Bienvenido a nuestra clínica dental',
          htmlContent: '<html>...</html>',
          status: 'sent',
          sentAt: '2024-03-10T12:00:00Z',
          scheduledAt: '2024-03-10T12:00:00Z',
          segmentCriteria: {},
          stats: {
            totalRecipients: 45,
            opens: 38,
            clicks: 22,
            bounces: 1,
            unsubscribes: 0,
          },
          createdAt: '2024-03-08T10:00:00Z',
          updatedAt: '2024-03-10T12:00:00Z',
        },
        {
          _id: '6',
          name: 'Recordatorio Cita Pendiente',
          subject: 'Recordatorio: Tienes una cita programada',
          htmlContent: '<html>...</html>',
          status: 'failed',
          scheduledAt: '2024-03-17T09:00:00Z',
          segmentCriteria: {},
          stats: {
            totalRecipients: 0,
            opens: 0,
            clicks: 0,
            bounces: 0,
            unsubscribes: 0,
          },
          createdAt: '2024-03-15T15:20:00Z',
          updatedAt: '2024-03-17T09:00:00Z',
        },
      ];
      
      // Aplicar filtros
      let campañasFiltradas = [...datosFalsos];
      
      if (filters.status) {
        campañasFiltradas = campañasFiltradas.filter(c => c.status === filters.status);
      }
      
      // Paginación
      const page = filters.page || 1;
      const limit = filters.limit || 20;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const campañasPaginadas = campañasFiltradas.slice(startIndex, endIndex);
      
      setCampaigns(campañasPaginadas);
    } catch (err) {
      setError('Error al cargar las campañas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCrearNueva = () => {
    setSelectedCampaign(null);
    setViewMode('create');
  };

  const handleEditar = (campaign: EmailCampaign) => {
    setSelectedCampaign(campaign);
    setViewMode('edit');
  };

  const handleEliminar = async (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta campaña?')) {
      try {
        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 500));
        // Simular eliminación
        console.log('Eliminando campaña:', id);
        cargarCampanas();
      } catch (err) {
        alert('Error al eliminar la campaña');
        console.error(err);
      }
    }
  };

  const handleVerReporte = (id: string) => {
    const campaign = campaigns.find((c) => c._id === id);
    if (campaign) {
      setSelectedCampaign(campaign);
      setViewMode('report');
    }
  };

  const handleVolver = () => {
    setViewMode('list');
    setSelectedCampaign(null);
  };

  const handleGuardado = () => {
    setViewMode('list');
    setSelectedCampaign(null);
    cargarCampanas();
  };

  if (viewMode === 'create' || viewMode === 'edit') {
    return (
      <CreateEditCampaignPage
        campaign={viewMode === 'edit' ? selectedCampaign : undefined}
        onVolver={handleVolver}
        onGuardado={handleGuardado}
      />
    );
  }

  if (viewMode === 'report' && selectedCampaign) {
    return (
      <CampaignReportPage
        campaignId={selectedCampaign._id!}
        onVolver={handleVolver}
      />
    );
  }

  const activeFiltersCount = filters.status ? 1 : 0;

  const handleClearFilters = () => {
    setFilters({ ...filters, status: undefined, page: 1 });
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <Mail size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Campañas de Email
                </h1>
                <p className="text-gray-600">
                  Gestiona y analiza tus campañas de marketing por email
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
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={cargarCampanas}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-white text-slate-900 shadow-sm ring-1 ring-slate-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
              Actualizar
            </button>
            <button
              onClick={handleCrearNueva}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white shadow-sm hover:bg-blue-700 hover:shadow-md"
            >
              <Plus size={20} />
              Nueva Campaña
            </button>
          </div>

          {/* Sistema de Filtros */}
          <div className="bg-white shadow-sm rounded-lg p-0 overflow-hidden">
            <div className="px-4 py-3 space-y-4">
              {/* Barra de búsqueda */}
              <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
                <div className="flex gap-4">
                  {/* Input de búsqueda */}
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      placeholder="Buscar campañas..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5 text-sm"
                    />
                  </div>
                  
                  {/* Botón de filtros */}
                  <button
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                      showAdvancedFilters || activeFiltersCount > 0
                        ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                        : 'bg-transparent text-slate-600 hover:bg-white/70'
                    }`}
                  >
                    <Filter size={18} />
                    Filtros
                    {activeFiltersCount > 0 && (
                      <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-blue-600 rounded-full">
                        {activeFiltersCount}
                      </span>
                    )}
                  </button>
                  
                  {/* Botón limpiar (si hay filtros activos) */}
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={handleClearFilters}
                      className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all text-slate-600 hover:bg-white/70"
                    >
                      <X size={18} />
                      Limpiar
                    </button>
                  )}
                </div>
              </div>

              {/* Panel de Filtros Avanzados */}
              {showAdvancedFilters && (
                <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Filtro de Estado */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        <Filter size={16} className="inline mr-1" />
                        Estado
                      </label>
                      <select
                        value={filters.status || ''}
                        onChange={(e) =>
                          setFilters({ ...filters, status: e.target.value || undefined, page: 1 })
                        }
                        className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 text-sm"
                      >
                        <option value="">Todos los estados</option>
                        <option value="draft">Borrador</option>
                        <option value="scheduled">Programada</option>
                        <option value="sending">Enviando</option>
                        <option value="sent">Enviada</option>
                        <option value="failed">Fallida</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Resumen de resultados */}
              <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
                <span>{campaigns.length} {campaigns.length === 1 ? 'campaña encontrada' : 'campañas encontradas'}</span>
                {activeFiltersCount > 0 && (
                  <span>{activeFiltersCount} {activeFiltersCount === 1 ? 'filtro aplicado' : 'filtros aplicados'}</span>
                )}
              </div>
            </div>
          </div>

          {/* Tabla de campañas */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            {error ? (
              <div className="p-8 text-center bg-white">
                <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                  onClick={cargarCampanas}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white shadow-sm hover:bg-blue-700 hover:shadow-md"
                >
                  Reintentar
                </button>
              </div>
            ) : (
              <CampaignsListTable
                campaigns={campaigns}
                loading={loading}
                onEdit={handleEditar}
                onDelete={handleEliminar}
                onViewReport={handleVerReporte}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}



import { useState, useEffect } from 'react';
import { Mail, Plus, Filter, RefreshCw } from 'lucide-react';
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Campañas de Email</h2>
            <p className="text-gray-600 text-sm mt-1">
              Gestiona y analiza tus campañas de marketing
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={cargarCampanas}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4" />
            Actualizar
          </button>
          <button
            onClick={handleCrearNueva}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Nueva Campaña
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Filtros:</span>
          </div>
          <select
            value={filters.status || ''}
            onChange={(e) =>
              setFilters({ ...filters, status: e.target.value || undefined, page: 1 })
            }
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

      {/* Tabla de campañas */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {error ? (
          <div className="p-6 text-center text-red-600">
            <p>{error}</p>
            <button
              onClick={cargarCampanas}
              className="mt-4 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
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
  );
}



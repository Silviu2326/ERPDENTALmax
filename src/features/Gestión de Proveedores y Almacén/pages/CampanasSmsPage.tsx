import { useState, useEffect } from 'react';
import { MessageSquare, Plus, Filter, RefreshCw } from 'lucide-react';
import {
  SmsCampaign,
  obtenerCampanasSms,
  eliminarCampanaSms,
  actualizarCampanaSms,
  crearCampanaSms,
  obtenerEstadisticasCampana,
  CampaignListParams,
  CampaignStats,
  TargetSegment,
} from '../api/campanasSmsApi';
import TablaCampanasSms from '../components/TablaCampanasSms';
import FormularioNuevaCampanaSms from '../components/FormularioNuevaCampanaSms';
import ModalEstadisticasCampana from '../components/ModalEstadisticasCampana';

type ViewMode = 'list' | 'create' | 'edit';

export default function CampanasSmsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [campañas, setCampañas] = useState<SmsCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCampana, setSelectedCampana] = useState<SmsCampaign | null>(null);
  const [filters, setFilters] = useState<CampaignListParams>({
    page: 1,
    limit: 20,
  });
  const [filtroEstado, setFiltroEstado] = useState<
    'draft' | 'scheduled' | 'sending' | 'sent' | 'failed' | undefined
  >(undefined);
  const [mostrarEstadisticas, setMostrarEstadisticas] = useState(false);
  const [estadisticas, setEstadisticas] = useState<CampaignStats | null>(null);
  const [cargandoEstadisticas, setCargandoEstadisticas] = useState(false);

  useEffect(() => {
    if (viewMode === 'list') {
      cargarCampañas();
    }
  }, [viewMode, filters, filtroEstado]);

  const cargarCampañas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Datos falsos completos de campañas SMS
      const datosFalsos: SmsCampaign[] = [
        {
          _id: '1',
          name: 'Recordatorio Cita Mañana',
          message: 'Recordatorio: Tienes una cita mañana a las 10:00. Confirma tu asistencia respondiendo CONFIRMAR.',
          status: 'sent',
          targetSegment: {
            lastVisitBefore: new Date(Date.now() + 86400000).toISOString(),
            marketingConsent: true,
          },
          scheduledAt: '2024-03-17T08:00:00Z',
          sentAt: '2024-03-17T08:00:00Z',
          createdAt: '2024-03-16T14:30:00Z',
          updatedAt: '2024-03-17T08:00:00Z',
        },
        {
          _id: '2',
          name: 'Promoción Limpieza Dental',
          message: '¡Oferta especial! Limpieza dental con 30% descuento. Válido hasta fin de mes. Reserva tu cita: www.clinicadental.com',
          status: 'scheduled',
          targetSegment: {
            marketingConsent: true,
          },
          scheduledAt: '2024-03-20T09:00:00Z',
          createdAt: '2024-03-15T10:00:00Z',
          updatedAt: '2024-03-15T10:00:00Z',
        },
        {
          _id: '3',
          name: 'Recordatorio Revisión Anual',
          message: 'Hace más de 6 meses que no nos visitas. Agenda tu revisión anual y mantén tu sonrisa saludable.',
          status: 'sending',
          targetSegment: {
            lastVisitBefore: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
            marketingConsent: true,
          },
          scheduledAt: '2024-03-18T10:00:00Z',
          createdAt: '2024-03-14T11:15:00Z',
          updatedAt: '2024-03-18T10:00:00Z',
        },
        {
          _id: '4',
          name: 'Bienvenida Nuevos Pacientes',
          message: '¡Bienvenido a nuestra clínica! Estamos encantados de tenerte. Si tienes alguna pregunta, no dudes en contactarnos.',
          status: 'sent',
          targetSegment: {
            marketingConsent: true,
          },
          scheduledAt: '2024-03-12T12:00:00Z',
          sentAt: '2024-03-12T12:00:00Z',
          createdAt: '2024-03-11T09:00:00Z',
          updatedAt: '2024-03-12T12:00:00Z',
        },
        {
          _id: '5',
          name: 'Oferta Ortodoncia',
          message: 'Ortodoncia invisible con financiación sin intereses. Primera consulta gratuita. Llámanos al 912345678',
          status: 'draft',
          targetSegment: {
            pendingTreatments: ['ortodoncia'],
            marketingConsent: true,
          },
          createdAt: '2024-03-16T16:45:00Z',
          updatedAt: '2024-03-16T16:45:00Z',
        },
        {
          _id: '6',
          name: 'Recordatorio Pago Pendiente',
          message: 'Recordatorio: Tienes un saldo pendiente de 150€. Puedes pagar online o en la clínica. Gracias.',
          status: 'failed',
          targetSegment: {
            marketingConsent: true,
          },
          scheduledAt: '2024-03-17T09:00:00Z',
          createdAt: '2024-03-15T15:20:00Z',
          updatedAt: '2024-03-17T09:00:00Z',
        },
      ];
      
      // Aplicar filtros
      let campañasFiltradas = [...datosFalsos];
      
      if (filtroEstado) {
        campañasFiltradas = campañasFiltradas.filter(c => c.status === filtroEstado);
      }
      
      // Paginación
      const page = filters.page || 1;
      const limit = filters.limit || 20;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const campañasPaginadas = campañasFiltradas.slice(startIndex, endIndex);
      
      setCampañas(campañasPaginadas);
    } catch (err) {
      setError('Error al cargar las campañas de SMS');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCrearNueva = () => {
    setSelectedCampana(null);
    setViewMode('create');
  };

  const handleEditar = (campana: SmsCampaign) => {
    setSelectedCampana(campana);
    setViewMode('edit');
  };

  const handleEliminar = async (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta campaña? Solo se pueden eliminar campañas en estado borrador.')) {
      try {
        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 500));
        // Simular eliminación
        console.log('Eliminando campaña SMS:', id);
        cargarCampañas();
      } catch (err: any) {
        alert(err.message || 'Error al eliminar la campaña');
        console.error(err);
      }
    }
  };

  const handleGuardar = async (data: {
    name: string;
    message: string;
    targetSegment: TargetSegment;
    scheduledAt?: string;
  }) => {
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (selectedCampana?._id) {
        // Simular actualización
        console.log('Actualizando campaña SMS:', selectedCampana._id, data);
      } else {
        // Simular creación
        console.log('Creando nueva campaña SMS:', data);
      }
      setViewMode('list');
      setSelectedCampana(null);
      cargarCampañas();
    } catch (err: any) {
      throw new Error(err.message || 'Error al guardar la campaña');
    }
  };

  const handleVerEstadisticas = async (id: string) => {
    setCargandoEstadisticas(true);
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Datos falsos de estadísticas
      const statsFalsos: CampaignStats = {
        total: 1250,
        sent: 1250,
        delivered: 1235,
        failed: 15,
        deliveryRate: 98.8,
        failureRate: 1.2,
      };
      
      setEstadisticas(statsFalsos);
      const campana = campañas.find((c) => c._id === id);
      if (campana) {
        setSelectedCampana(campana);
      }
      setMostrarEstadisticas(true);
    } catch (err) {
      alert('Error al cargar las estadísticas');
      console.error(err);
    } finally {
      setCargandoEstadisticas(false);
    }
  };

  const handleVolver = () => {
    setViewMode('list');
    setSelectedCampana(null);
  };

  if (viewMode === 'create' || viewMode === 'edit') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        {/* Header */}
        <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
            <div className="py-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <MessageSquare size={24} className="text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    {viewMode === 'edit' ? 'Editar Campaña SMS' : 'Nueva Campaña SMS'}
                  </h1>
                  <p className="text-gray-600">
                    {viewMode === 'edit'
                      ? 'Modifica los detalles de tu campaña'
                      : 'Crea una nueva campaña de mensajería SMS para tus pacientes'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenedor Principal */}
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="bg-white shadow-sm rounded-xl p-6">
            <FormularioNuevaCampanaSms
              campana={selectedCampana || undefined}
              onGuardar={handleGuardar}
              onCancelar={handleVolver}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <MessageSquare size={24} className="text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Campañas de SMS
                  </h1>
                  <p className="text-gray-600">
                    Gestiona y analiza tus campañas de mensajería SMS masivas
                  </p>
                </div>
              </div>
              <button
                onClick={handleCrearNueva}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                <Plus size={20} className="mr-2" />
                Nueva Campaña
              </button>
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
              onClick={cargarCampañas}
              className="flex items-center px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-all"
            >
              <RefreshCw size={20} className="mr-2" />
              Actualizar
            </button>
          </div>

          {/* Filtros */}
          <div className="bg-white shadow-sm rounded-xl mb-6">
            <div className="p-4">
              <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
                <div className="flex gap-4">
                  <div className="flex items-center gap-2 flex-1">
                    <Filter size={18} className="text-slate-600" />
                    <span className="text-sm font-medium text-slate-700">Filtrar por estado:</span>
                    <select
                      value={filtroEstado || ''}
                      onChange={(e) =>
                        setFiltroEstado(
                          e.target.value ? (e.target.value as any) : undefined
                        )
                      }
                      className="flex-1 rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 text-sm"
                    >
                      <option value="">Todos</option>
                      <option value="draft">Borrador</option>
                      <option value="scheduled">Programada</option>
                      <option value="sending">Enviando</option>
                      <option value="sent">Enviada</option>
                      <option value="failed">Fallida</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <span className="text-red-800 text-sm">{error}</span>
              </div>
            </div>
          )}

          {/* Tabla de campañas */}
          <TablaCampanasSms
            campañas={campañas}
            loading={loading}
            onEditar={handleEditar}
            onEliminar={handleEliminar}
            onVerEstadisticas={handleVerEstadisticas}
          />
        </div>
      </div>

      {/* Modal de estadísticas */}
      {mostrarEstadisticas && estadisticas && selectedCampana && (
        <ModalEstadisticasCampana
          campanaNombre={selectedCampana.name}
          estadisticas={estadisticas}
          onCerrar={() => {
            setMostrarEstadisticas(false);
            setEstadisticas(null);
            setSelectedCampana(null);
          }}
        />
      )}
    </div>
  );
}



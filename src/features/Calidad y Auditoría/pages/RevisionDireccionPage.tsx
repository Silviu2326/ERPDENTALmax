import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, RefreshCw, Target, DollarSign, Users, Calendar, TrendingUp } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import {
  obtenerKPIs,
  obtenerTendenciasFinancieras,
  obtenerRendimientoProfesionales,
  obtenerPlanesAccion,
  crearPlanAccion,
  actualizarPlanAccion,
  KPIsResponse,
  PuntoTendenciaFinanciera,
  RendimientoProfesional,
  PlanDeAccion,
  FiltrosKPIs,
  FiltrosTendencias,
} from '../api/revisionDireccionApi';
import KPICard from '../components/KPICard';
import DashboardFiltros from '../components/DashboardFiltros';
import GraficoTendenciasFinancieras from '../components/GraficoTendenciasFinancieras';
import GraficoRendimientoClinico from '../components/GraficoRendimientoClinico';
import TablaPlanesDeAccion from '../components/TablaPlanesDeAccion';
import ModalCrearPlanDeAccion from '../components/ModalCrearPlanDeAccion';

interface RevisionDireccionPageProps {
  onVolver?: () => void;
}

export default function RevisionDireccionPage({ onVolver }: RevisionDireccionPageProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [mostrarModalPlan, setMostrarModalPlan] = useState(false);

  // Inicializar fechas con último trimestre
  const [fechaInicio, setFechaInicio] = useState<Date>(() => {
    const fecha = new Date();
    fecha.setMonth(fecha.getMonth() - 3);
    fecha.setHours(0, 0, 0, 0);
    return fecha;
  });

  const [fechaFin, setFechaFin] = useState<Date>(() => {
    const fecha = new Date();
    fecha.setHours(23, 59, 59, 999);
    return fecha;
  });

  const [sedeId, setSedeId] = useState<string | undefined>(undefined);
  const [agrupacion, setAgrupacion] = useState<'day' | 'week' | 'month'>('month');

  // Estados de datos
  const [kpis, setKpis] = useState<KPIsResponse | null>(null);
  const [tendencias, setTendencias] = useState<PuntoTendenciaFinanciera[]>([]);
  const [rendimientoProfesionales, setRendimientoProfesionales] = useState<
    RendimientoProfesional[]
  >([]);
  const [planesAccion, setPlanesAccion] = useState<PlanDeAccion[]>([]);

  // Datos mock para sedes y usuarios (en producción vendrían de APIs)
  const sedes = [
    { _id: '1', nombre: 'Sede Central' },
    { _id: '2', nombre: 'Sede Norte' },
  ];

  const usuarios = [
    { _id: '1', name: 'María García' },
    { _id: '2', name: 'Juan Pérez' },
    { _id: '3', name: 'Ana López' },
  ];

  useEffect(() => {
    cargarDatos();
  }, [fechaInicio, fechaFin, sedeId, agrupacion]);

  const cargarDatos = async () => {
    try {
      setLoading(true);

      const filtrosKPIs: FiltrosKPIs = {
        startDate: fechaInicio.toISOString(),
        endDate: fechaFin.toISOString(),
        clinicId: sedeId,
      };

      const filtrosTendencias: FiltrosTendencias = {
        startDate: fechaInicio.toISOString(),
        endDate: fechaFin.toISOString(),
        clinicId: sedeId,
        groupBy: agrupacion,
      };

      // Cargar datos en paralelo
      const [kpisData, tendenciasData, rendimientoData, planesData] = await Promise.all([
        obtenerKPIs(filtrosKPIs).catch(() => {
          // Datos mock en caso de error
          return {
            totalRevenue: 125000,
            newPatients: 45,
            appointmentOccupancy: 87.5,
            averageSatisfactionScore: 4.2,
          };
        }),
        obtenerTendenciasFinancieras(filtrosTendencias).catch(() => []),
        obtenerRendimientoProfesionales(filtrosKPIs).catch(() => []),
        obtenerPlanesAccion({ clinicId: sedeId }).catch(() => []),
      ]);

      setKpis(kpisData);
      setTendencias(tendenciasData);
      setRendimientoProfesionales(rendimientoData);
      setPlanesAccion(planesData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await cargarDatos();
    setRefreshing(false);
  };

  const handleCrearPlan = async (plan: Omit<PlanDeAccion, '_id' | 'createdAt'>) => {
    try {
      const nuevoPlan = await crearPlanAccion(plan);
      setPlanesAccion([...planesAccion, nuevoPlan]);
      setMostrarModalPlan(false);
    } catch (error) {
      console.error('Error al crear plan:', error);
      throw error;
    }
  };

  const handleActualizarPlan = async (
    planId: string,
    actualizacion: { status?: PlanDeAccion['status'] }
  ) => {
    try {
      const planActualizado = await actualizarPlanAccion(planId, actualizacion);
      setPlanesAccion(
        planesAccion.map((plan) => (plan._id === planId ? planActualizado : plan))
      );
    } catch (error) {
      console.error('Error al actualizar plan:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              {onVolver && (
                <button
                  onClick={onVolver}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
              )}
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                  <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  Revisión por la Dirección
                </h1>
                <p className="text-gray-600 text-lg">
                  Dashboard analítico de alto nivel para la toma de decisiones estratégicas
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing || loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              >
                <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                <span>Actualizar</span>
              </button>
              <button
                onClick={() => setMostrarModalPlan(true)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
              >
                <Plus className="w-5 h-5" />
                <span>Nuevo Plan de Acción</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <DashboardFiltros
          fechaInicio={fechaInicio}
          fechaFin={fechaFin}
          onFechaInicioChange={setFechaInicio}
          onFechaFinChange={setFechaFin}
          sedeId={sedeId}
          onSedeChange={setSedeId}
          sedes={sedes}
          agrupacion={agrupacion}
          onAgrupacionChange={setAgrupacion}
        />

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Cargando datos del dashboard...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* KPIs */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Indicadores Clave (KPIs)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard
                  title="Ingresos Totales"
                  value={kpis?.totalRevenue || 0}
                  unit="€"
                  icon={<DollarSign className="w-5 h-5" />}
                  color="green"
                />
                <KPICard
                  title="Pacientes Nuevos"
                  value={kpis?.newPatients || 0}
                  icon={<Users className="w-5 h-5" />}
                  color="blue"
                />
                <KPICard
                  title="Ocupación de Citas"
                  value={kpis?.appointmentOccupancy || 0}
                  unit="%"
                  icon={<Calendar className="w-5 h-5" />}
                  color="purple"
                />
                <KPICard
                  title="Satisfacción Promedio"
                  value={kpis?.averageSatisfactionScore || 0}
                  unit="/5"
                  icon={<TrendingUp className="w-5 h-5" />}
                  color="yellow"
                />
              </div>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GraficoTendenciasFinancieras datos={tendencias} loading={loading} />
              <GraficoRendimientoClinico
                datos={rendimientoProfesionales}
                loading={loading}
              />
            </div>

            {/* Planes de Acción */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Planes de Acción</h2>
              <TablaPlanesDeAccion
                planes={planesAccion}
                loading={loading}
                onActualizarPlan={handleActualizarPlan}
              />
            </div>
          </div>
        )}
      </div>

      {/* Modal Crear Plan de Acción */}
      <ModalCrearPlanDeAccion
        isOpen={mostrarModalPlan}
        onClose={() => setMostrarModalPlan(false)}
        onCreate={handleCrearPlan}
        usuarios={usuarios}
        clinicId={sedeId || 'default-clinic-id'}
      />
    </div>
  );
}



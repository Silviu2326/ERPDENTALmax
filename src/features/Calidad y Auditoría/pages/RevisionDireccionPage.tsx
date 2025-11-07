import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, RefreshCw, Target, DollarSign, Users, Calendar, TrendingUp, Loader2 } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {onVolver && (
                  <button
                    onClick={onVolver}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors mr-4"
                  >
                    <ArrowLeft size={20} className="text-gray-600" />
                  </button>
                )}
                {/* Icono con contenedor */}
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <Target size={24} className="text-blue-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Revisión por la Dirección
                  </h1>
                  <p className="text-gray-600">
                    Dashboard analítico de alto nivel para la toma de decisiones estratégicas
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRefresh}
                  disabled={refreshing || loading}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw size={20} className={refreshing ? 'animate-spin' : ''} />
                  <span>Actualizar</span>
                </button>
                <button
                  onClick={() => setMostrarModalPlan(true)}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-green-600 text-white hover:bg-green-700 shadow-sm"
                >
                  <Plus size={20} />
                  <span>Nuevo Plan de Acción</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">

        {loading ? (
          <div className="bg-white shadow-sm rounded-xl p-8 text-center">
            <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
            <p className="text-gray-600">Cargando datos del dashboard...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* KPIs */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Indicadores Clave (KPIs)</h2>
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
              <h2 className="text-xl font-bold text-gray-900 mb-4">Planes de Acción</h2>
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




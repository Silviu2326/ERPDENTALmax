import { useState, useEffect } from 'react';
import { RefreshCw, DollarSign, Users, Calendar, TrendingUp, CalendarCheck, BarChart3, PieChart } from 'lucide-react';
import { getDashboardSummary, DashboardSummary, DashboardFilters } from '../api/dashboardAPI';
import KPIWidget from '../components/KPIWidget';
import DateRangePicker from '../components/DateRangePicker';
import ClinicSelector from '../components/ClinicSelector';
import RevenueChart from '../components/RevenueChart';
import AppointmentStatusPieChart from '../components/AppointmentStatusPieChart';
import TopTreatmentsList from '../components/TopTreatmentsList';
// Componentes de Indicadores de Citas
import IndicadorCard from '../components/IndicadorCard';
import GraficoTasaOcupacion from '../components/GraficoTasaOcupacion';
import GraficoOrigenCitas from '../components/GraficoOrigenCitas';
import FiltrosIndicadoresPanel from '../components/FiltrosIndicadoresPanel';
import TablaDetalleInasistencias from '../components/TablaDetalleInasistencias';
import {
  obtenerResumenCitas,
  obtenerCitasPorOrigen,
  obtenerCitasPorTipo,
  obtenerEvolucionOcupacion,
  FiltrosIndicadores,
  IndicadoresResumen,
  CitasPorOrigen,
  EvolucionOcupacion,
} from '../api/indicadoresApi';
import IndicadoresFacturacionPage from './IndicadoresFacturacionPage';
import RentabilidadAnalisisPage from './RentabilidadAnalisisPage';

type TabType = 'dashboard' | 'indicadores-facturacion' | 'indicadores-citas' | 'rentabilidad-analisis';

export default function CuadroDeMandosEInformesPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [datos, setDatos] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Inicializar fechas con últimos 30 días
  const [fechaInicio, setFechaInicio] = useState<Date>(() => {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() - 30);
    fecha.setHours(0, 0, 0, 0);
    return fecha;
  });

  const [fechaFin, setFechaFin] = useState<Date>(() => {
    const fecha = new Date();
    fecha.setHours(23, 59, 59, 999);
    return fecha;
  });

  const [clinicaSeleccionada, setClinicaSeleccionada] = useState<string | null>(null);

  // Datos mock de clínicas (en producción vendrían de una API)
  const clinicas = [
    { _id: '1', nombre: 'Clínica Central' },
    { _id: '2', nombre: 'Clínica Norte' },
    { _id: '3', nombre: 'Clínica Sur' },
  ];

  // Estados para Indicadores de Citas
  const [indicadoresCitas, setIndicadoresCitas] = useState<IndicadoresResumen | null>(null);
  const [citasPorOrigen, setCitasPorOrigen] = useState<CitasPorOrigen[]>([]);
  const [citasPorTipo, setCitasPorTipo] = useState<Array<{ tipo: string; cantidad: number }>>([]);
  const [evolucionOcupacion, setEvolucionOcupacion] = useState<EvolucionOcupacion[]>([]);
  const [loadingIndicadores, setLoadingIndicadores] = useState(true);
  const [filtrosIndicadores, setFiltrosIndicadores] = useState<FiltrosIndicadores>(() => {
    const fechaInicio = new Date();
    fechaInicio.setDate(fechaInicio.getDate() - 30);
    fechaInicio.setHours(0, 0, 0, 0);
    const fechaFin = new Date();
    fechaFin.setHours(23, 59, 59, 999);

    return {
      fechaInicio: fechaInicio.toISOString(),
      fechaFin: fechaFin.toISOString(),
      intervalo: 'diario',
    };
  });

  // Datos mock de sedes y profesionales
  const sedes = [
    { _id: '1', nombre: 'Sede Central' },
    { _id: '2', nombre: 'Sede Norte' },
    { _id: '3', nombre: 'Sede Sur' },
  ];

  const profesionales = [
    { _id: '1', nombre: 'Juan', apellidos: 'Pérez' },
    { _id: '2', nombre: 'María', apellidos: 'García' },
    { _id: '3', nombre: 'Carlos', apellidos: 'López' },
  ];

  const cargarDatos = async () => {
    try {
      setError(null);
      const filtros: DashboardFilters = {
        startDate: fechaInicio.toISOString(),
        endDate: fechaFin.toISOString(),
        clinicId: clinicaSeleccionada || undefined,
      };

      // En producción, esto llamaría a la API real
      // const datosAPI = await getDashboardSummary(filtros);
      // setDatos(datosAPI);

      // Datos mock para desarrollo
      const datosMock: DashboardSummary = {
        kpis: {
          totalRevenue: 125450.75,
          newPatients: 42,
          completedAppointments: 287,
          showRate: 87.5,
        },
        chartsData: {
          revenueTimeline: [
            { fecha: '2024-01-01', ingresos: 12500 },
            { fecha: '2024-01-08', ingresos: 14200 },
            { fecha: '2024-01-15', ingresos: 13800 },
            { fecha: '2024-01-22', ingresos: 15600 },
            { fecha: '2024-01-29', ingresos: 16350 },
          ],
          appointmentStatus: [
            { estado: 'completada', cantidad: 287, porcentaje: 75.5 },
            { estado: 'cancelada', cantidad: 45, porcentaje: 11.8 },
            { estado: 'no-asistio', cantidad: 28, porcentaje: 7.4 },
            { estado: 'programada', cantidad: 20, porcentaje: 5.3 },
          ],
        },
        lists: {
          topPerformingTreatments: [
            { _id: '1', nombre: 'Limpieza dental', cantidad: 85, ingresos: 4250 },
            { _id: '2', nombre: 'Implante dental', cantidad: 12, ingresos: 18000 },
            { _id: '3', nombre: 'Ortodoncia', cantidad: 8, ingresos: 12000 },
            { _id: '4', nombre: 'Endodoncia', cantidad: 15, ingresos: 6750 },
            { _id: '5', nombre: 'Revisión general', cantidad: 120, ingresos: 3600 },
          ],
          topProfessionals: [
            {
              _id: '1',
              nombre: 'Juan',
              apellidos: 'Pérez',
              citasCompletadas: 98,
              ingresos: 45200,
            },
            {
              _id: '2',
              nombre: 'María',
              apellidos: 'García',
              citasCompletadas: 87,
              ingresos: 38900,
            },
            {
              _id: '3',
              nombre: 'Carlos',
              apellidos: 'López',
              citasCompletadas: 102,
              ingresos: 41350,
            },
          ],
        },
      };

      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 500));
      setDatos(datosMock);
    } catch (err) {
      console.error('Error al cargar datos del dashboard:', err);
      setError('Error al cargar los datos del dashboard. Por favor, inténtelo de nuevo.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Cargar indicadores de citas
  const cargarIndicadoresCitas = async () => {
    setLoadingIndicadores(true);
    try {
      const [resumen, origen, tipo, evolucion] = await Promise.all([
        obtenerResumenCitas(filtrosIndicadores),
        obtenerCitasPorOrigen(filtrosIndicadores),
        obtenerCitasPorTipo(filtrosIndicadores),
        obtenerEvolucionOcupacion(filtrosIndicadores),
      ]);

      setIndicadoresCitas(resumen);
      setCitasPorOrigen(origen);
      setCitasPorTipo(tipo);
      setEvolucionOcupacion(evolucion);
    } catch (err) {
      console.error('Error al cargar indicadores de citas:', err);
    } finally {
      setLoadingIndicadores(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    cargarDatos();
  }, [fechaInicio, fechaFin, clinicaSeleccionada]);

  useEffect(() => {
    cargarIndicadoresCitas();
  }, [filtrosIndicadores]);

  const handleRefresh = () => {
    setRefreshing(true);
    cargarDatos();
  };

  const handleCambioFechas = (inicio: Date, fin: Date) => {
    setFechaInicio(inicio);
    setFechaFin(fin);
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Cargando datos del dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-800 font-semibold">{error}</p>
          <button
            onClick={handleRefresh}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!datos) {
    return null;
  }

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Dashboard General', icon: BarChart3 },
    { id: 'indicadores-facturacion' as TabType, label: 'Indicadores de Facturación', icon: DollarSign },
    { id: 'indicadores-citas' as TabType, label: 'Indicadores de Citas', icon: CalendarCheck },
    { id: 'rentabilidad-analisis' as TabType, label: 'Rentabilidad y Análisis', icon: PieChart },
  ];

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Cuadro de Mandos e Informes
            </h1>
            <p className="text-gray-600">
              Visión panorámica del estado del negocio en tiempo real
            </p>
          </div>
          {activeTab === 'dashboard' && (
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Actualizar</span>
            </button>
          )}
        </div>

        {/* Navegación por pestañas */}
        <div className="bg-white rounded-xl shadow-md border-2 border-blue-100 mb-6">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-6 py-4 font-medium text-sm transition-colors
                    border-b-2 whitespace-nowrap
                    ${
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600 bg-blue-50'
                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filtros (solo para dashboard) */}
        {activeTab === 'dashboard' && (
          <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-xl shadow-md border-2 border-blue-100">
            <DateRangePicker
              fechaInicio={fechaInicio}
              fechaFin={fechaFin}
              onCambio={handleCambioFechas}
            />
            <ClinicSelector
              clinicas={clinicas}
              clinicaSeleccionada={clinicaSeleccionada}
              onCambio={setClinicaSeleccionada}
            />
          </div>
        )}
      </div>

      {/* Contenido según la pestaña activa */}
      {activeTab === 'indicadores-facturacion' && (
        <IndicadoresFacturacionPage />
      )}

      {activeTab === 'rentabilidad-analisis' && (
        <RentabilidadAnalisisPage />
      )}

      {activeTab === 'indicadores-citas' && (
        <>
          {/* Filtros para Indicadores de Citas */}
          <FiltrosIndicadoresPanel
            filtros={filtrosIndicadores}
            onFiltrosChange={setFiltrosIndicadores}
            sedes={sedes}
            profesionales={profesionales}
          />

          {/* Tarjetas de KPIs de Citas */}
          {indicadoresCitas && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <IndicadorCard
                titulo="Total de Citas"
                valor={indicadoresCitas.totalCitas}
                formato="numero"
                icono={<Calendar className="w-6 h-6 text-white" />}
                color="blue"
              />
              <IndicadorCard
                titulo="Tasa de Ocupación"
                valor={indicadoresCitas.tasaOcupacion}
                formato="porcentaje"
                icono={<TrendingUp className="w-6 h-6 text-white" />}
                color="green"
              />
              <IndicadorCard
                titulo="Tasa de No-Show"
                valor={indicadoresCitas.tasaNoShow}
                formato="porcentaje"
                icono={<CalendarCheck className="w-6 h-6 text-white" />}
                color="orange"
              />
              <IndicadorCard
                titulo="Tasa de Confirmadas"
                valor={indicadoresCitas.tasaConfirmadas}
                formato="porcentaje"
                icono={<CalendarCheck className="w-6 h-6 text-white" />}
                color="purple"
              />
            </div>
          )}

          {/* Gráficos de Indicadores de Citas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <GraficoTasaOcupacion
              datos={evolucionOcupacion}
              loading={loadingIndicadores}
            />
            <GraficoOrigenCitas datos={citasPorOrigen} loading={loadingIndicadores} />
          </div>

          {/* Tabla de Detalle de Inasistencias */}
          <div className="mb-8">
            <TablaDetalleInasistencias
              inasistencias={[]} // En producción, esto vendría de una API
              loading={loadingIndicadores}
            />
          </div>
        </>
      )}

      {activeTab === 'dashboard' && (
        <>
          {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPIWidget
          titulo="Ingresos Totales"
          valor={datos.kpis.totalRevenue}
          formato="moneda"
          tendencia="up"
          cambioPorcentual={12.5}
          icono={<DollarSign className="w-6 h-6 text-white" />}
          color="green"
        />
        <KPIWidget
          titulo="Pacientes Nuevos"
          valor={datos.kpis.newPatients}
          formato="numero"
          tendencia="up"
          cambioPorcentual={8.3}
          icono={<Users className="w-6 h-6 text-white" />}
          color="blue"
        />
        <KPIWidget
          titulo="Citas Completadas"
          valor={datos.kpis.completedAppointments}
          formato="numero"
          tendencia="up"
          cambioPorcentual={5.2}
          icono={<Calendar className="w-6 h-6 text-white" />}
          color="purple"
        />
        <KPIWidget
          titulo="Tasa de Asistencia"
          valor={datos.kpis.showRate}
          formato="porcentaje"
          tendencia="up"
          cambioPorcentual={2.1}
          icono={<TrendingUp className="w-6 h-6 text-white" />}
          color="orange"
        />
      </div>

      {/* Gráficos y Listas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <RevenueChart datos={datos.chartsData.revenueTimeline} />
        <AppointmentStatusPieChart datos={datos.chartsData.appointmentStatus} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopTreatmentsList tratamientos={datos.lists.topPerformingTreatments} />
        
        {/* Top Professionals */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-blue-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-2 rounded-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Top Profesionales</h3>
              <p className="text-sm text-gray-500">Mejor rendimiento del período</p>
            </div>
          </div>

          <div className="space-y-4">
            {datos.lists.topProfessionals.map((profesional, index) => (
              <div
                key={profesional._id}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">
                      {profesional.nombre} {profesional.apellidos}
                    </h4>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-600">
                        {profesional.citasCompletadas} citas
                      </span>
                      <span className="text-sm font-medium text-green-600">
                        {new Intl.NumberFormat('es-ES', {
                          style: 'currency',
                          currency: 'EUR',
                        }).format(profesional.ingresos)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      )}
    </div>
  );
}


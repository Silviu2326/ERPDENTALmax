import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Target, AlertCircle, RefreshCw, Calendar, FileCheck, ClipboardList, History, ArrowRight, ShieldAlert, CheckCircle2, BarChart, FileText } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import GestionTemplatesAuditoriaPage from './GestionTemplatesAuditoriaPage';
import EjecucionAuditoriaClinicaPage from './EjecucionAuditoriaClinicaPage';
import GestionIncidenciasPage from './GestionIncidenciasPage';
import GestionCapasPage from './GestionCapasPage';
import RevisionDireccionPage from './RevisionDireccionPage';
import InformesAcreditacionPage from './InformesAcreditacionPage';

type ViewMode = 'dashboard' | 'gestion-templates' | 'ejecucion-auditoria' | 'gestion-incidencias' | 'gestion-capas' | 'revision-direccion' | 'informes-acreditacion';

export default function CalidadYAuditoriaPage() {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const isAdmin = user?.role === 'director' || user?.role === 'admin';
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    cargarDatos();
  }, [fechaInicio, fechaFin]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      // TODO: Implementar llamadas a la API
      // const indicadores = await obtenerIndicadores({ fechaInicio, fechaFin });
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulación
    } catch (error) {
      console.error('Error al cargar indicadores:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await cargarDatos();
    setRefreshing(false);
  };

  // Si estamos en una vista específica, mostrar esa página
  if (viewMode === 'gestion-templates') {
    return (
      <GestionTemplatesAuditoriaPage
        onVolver={() => setViewMode('dashboard')}
      />
    );
  }

  if (viewMode === 'ejecucion-auditoria') {
    return (
      <EjecucionAuditoriaClinicaPage
        onVolver={() => setViewMode('dashboard')}
      />
    );
  }

  if (viewMode === 'gestion-incidencias') {
    return (
      <GestionIncidenciasPage
        onVolver={() => setViewMode('dashboard')}
      />
    );
  }

  if (viewMode === 'gestion-capas') {
    return (
      <GestionCapasPage
        onVolver={() => setViewMode('dashboard')}
      />
    );
  }

  if (viewMode === 'revision-direccion') {
    return (
      <RevisionDireccionPage
        onVolver={() => setViewMode('dashboard')}
      />
    );
  }

  if (viewMode === 'informes-acreditacion') {
    return (
      <InformesAcreditacionPage
        onVolver={() => setViewMode('dashboard')}
      />
    );
  }

  // Vista dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                Calidad y Auditoría
              </h1>
              <p className="text-gray-600 text-lg">
                Dashboard de indicadores clave de rendimiento (KPIs) y gestión de auditorías clínicas
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Actualizar</span>
            </button>
          </div>
        </div>

        {/* Accesos Rápidos - No Conformidades e Incidencias */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Conformidades e Incidencias</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <button
              onClick={() => setViewMode('gestion-incidencias')}
              className="bg-white rounded-xl shadow-md p-6 border-2 border-gray-200 hover:border-red-500 hover:shadow-lg transition-all text-left group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="bg-red-100 p-3 rounded-lg">
                  <ShieldAlert className="w-6 h-6 text-red-600" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-red-600 transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Gestión de Incidencias
              </h3>
              <p className="text-gray-600 text-sm">
                Registra y gestiona no conformidades, incidencias clínicas, quejas de pacientes e incidentes de seguridad
              </p>
            </button>

            <button
              onClick={() => setViewMode('gestion-capas')}
              className="bg-white rounded-xl shadow-md p-6 border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all text-left group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <CheckCircle2 className="w-6 h-6 text-blue-600" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Gestión de CAPAs
              </h3>
              <p className="text-gray-600 text-sm">
                Acciones Correctivas y Preventivas: gestiona el ciclo completo desde la detección hasta la verificación de efectividad
              </p>
            </button>
          </div>
        </div>

        {/* Accesos Rápidos - Auditoría Clínica */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Auditoría Clínica</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isAdmin && (
              <button
                onClick={() => setViewMode('gestion-templates')}
                className="bg-white rounded-xl shadow-md p-6 border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all text-left group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <FileCheck className="w-6 h-6 text-blue-600" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Gestión de Plantillas
                </h3>
                <p className="text-gray-600 text-sm">
                  Crea y gestiona plantillas de checklists para estandarizar procedimientos clínicos
                </p>
              </button>
            )}

            <button
              onClick={() => setViewMode('ejecucion-auditoria')}
              className="bg-white rounded-xl shadow-md p-6 border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all text-left group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <ClipboardList className="w-6 h-6 text-green-600" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Ejecutar Auditoría
              </h3>
              <p className="text-gray-600 text-sm">
                Inicia una nueva auditoría clínica seleccionando una plantilla
              </p>
            </button>

            <div className="bg-white rounded-xl shadow-md p-6 border-2 border-gray-200 opacity-60">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <History className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Historial de Auditorías
              </h3>
              <p className="text-gray-600 text-sm">
                Consulta el historial de auditorías completadas (disponible desde el perfil del paciente)
              </p>
            </div>
          </div>
        </div>

        {/* Accesos Rápidos - Informes de Acreditación/Normativas */}
        {(isAdmin || user?.role === 'it' || user?.role === 'seguridad') && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Informes de Acreditación/Normativas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <button
                onClick={() => setViewMode('informes-acreditacion')}
                className="bg-white rounded-xl shadow-md p-6 border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all text-left group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Informes de Acreditación
                </h3>
                <p className="text-gray-600 text-sm">
                  Genera informes de acreditación, certificaciones (ISO 9001) y cumplimiento de normativas sanitarias (GDPR, LOPD, esterilización)
                </p>
              </button>
            </div>
          </div>
        )}

        {/* Accesos Rápidos - Revisión por la Dirección */}
        {(isAdmin || user?.role === 'propietario' || user?.role === 'gerente') && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Revisión por la Dirección</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <button
                onClick={() => setViewMode('revision-direccion')}
                className="bg-white rounded-xl shadow-md p-6 border-2 border-gray-200 hover:border-indigo-500 hover:shadow-lg transition-all text-left group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-indigo-100 p-3 rounded-lg">
                    <BarChart className="w-6 h-6 text-indigo-600" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Dashboard de Revisión
                </h3>
                <p className="text-gray-600 text-sm">
                  Panel analítico de alto nivel con KPIs, tendencias financieras, rendimiento de profesionales y gestión de planes de acción
                </p>
              </button>
            </div>
          </div>
        )}

        {/* Indicadores de Calidad */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Indicadores de Calidad</h2>
          
          {/* Filtros de Fecha */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-200">
            <div className="flex items-center gap-4">
              <Calendar className="w-5 h-5 text-gray-500" />
              <div className="flex items-center gap-4 flex-1">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha Inicio
                  </label>
                  <input
                    type="date"
                    value={fechaInicio.toISOString().split('T')[0]}
                    onChange={(e) => setFechaInicio(new Date(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha Fin
                  </label>
                  <input
                    type="date"
                    value={fechaFin.toISOString().split('T')[0]}
                    onChange={(e) => setFechaFin(new Date(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Contenido Principal */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Cargando indicadores...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Grid de Indicadores */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Indicador 1: Tasa de Ocupación */}
                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-600">Tasa de Ocupación</h3>
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-gray-900">--</span>
                    <span className="text-sm text-gray-500">%</span>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <span className="text-gray-500">Meta: 90%</span>
                  </div>
                </div>

                {/* Indicador 2: Ingreso Promedio por Paciente */}
                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-600">Ingreso Promedio/Paciente</h3>
                    <Target className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-gray-900">--</span>
                    <span className="text-sm text-gray-500">€</span>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <span className="text-gray-500">Meta: -- €</span>
                  </div>
                </div>

                {/* Indicador 3: Tasa de Cancelación */}
                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-600">Tasa de Cancelación</h3>
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-gray-900">--</span>
                    <span className="text-sm text-gray-500">%</span>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <span className="text-gray-500">Meta: &lt; 10%</span>
                  </div>
                </div>

                {/* Indicador 4: Aceptación Planes de Tratamiento */}
                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-600">Aceptación Planes</h3>
                    <Target className="w-5 h-5 text-purple-500" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-gray-900">--</span>
                    <span className="text-sm text-gray-500">%</span>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <span className="text-gray-500">Meta: 70%</span>
                  </div>
                </div>
              </div>

              {/* Mensaje de Estado */}
              <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
                <div className="text-center">
                  <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Plan de Calidad - Indicadores
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Este módulo mostrará los indicadores clave de rendimiento (KPIs) calculados
                    a partir de los datos de citas, tratamientos, facturación y satisfacción del paciente.
                  </p>
                  <p className="text-sm text-gray-500">
                    Las funcionalidades completas se implementarán según las especificaciones del documento.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


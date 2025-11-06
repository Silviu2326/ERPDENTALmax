import { useState, useEffect } from 'react';
import { FileBarChart, RefreshCw, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import {
  TraceabilityReportFilters,
  TraceabilityEvent,
  obtenerInformeTrazabilidad,
} from '../api/traceabilityApi';
import TraceabilityReportFilter from '../components/TraceabilityReportFilter';
import TraceabilityResultsTable from '../components/TraceabilityResultsTable';
import TraceabilityTimelineView from '../components/TraceabilityTimelineView';
import ExportReportButton from '../components/ExportReportButton';

export default function InformesDeTrazabilidadPage() {
  const { user } = useAuth();
  const [eventos, setEventos] = useState<TraceabilityEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [kitSeleccionado, setKitSeleccionado] = useState<{ kitId: string; kitCode?: string } | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
  });

  // Inicializar filtros con rango de fechas por defecto (último mes)
  const [filtros, setFiltros] = useState<TraceabilityReportFilters>(() => {
    const fechaInicio = new Date();
    fechaInicio.setMonth(fechaInicio.getMonth() - 1);
    fechaInicio.setHours(0, 0, 0, 0);
    const fechaFin = new Date();
    fechaFin.setHours(23, 59, 59, 999);

    return {
      startDate: fechaInicio.toISOString().split('T')[0],
      endDate: fechaFin.toISOString().split('T')[0],
      clinicId: user?.sedeId,
      page: 1,
      limit: 20,
    };
  });

  const cargarInforme = async () => {
    try {
      setLoading(true);
      setError(null);

      // Asegurar que clinicId esté presente si el usuario es multisede
      const filtrosConClinic = {
        ...filtros,
        clinicId: filtros.clinicId || user?.sedeId,
      };

      const respuesta = await obtenerInformeTrazabilidad(filtrosConClinic);
      setEventos(respuesta.data);
      setPagination({
        page: respuesta.page,
        pages: respuesta.pages,
        total: respuesta.total,
      });
    } catch (err: any) {
      console.error('Error al cargar informe:', err);
      setError(err.message || 'Error al cargar el informe de trazabilidad. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleBuscar = () => {
    setFiltros((prev) => ({ ...prev, page: 1 }));
    cargarInforme();
  };

  const handlePageChange = (nuevaPagina: number) => {
    setFiltros((prev) => ({ ...prev, page: nuevaPagina }));
  };

  useEffect(() => {
    // Cargar automáticamente al cambiar la página
    if (filtros.page !== undefined) {
      cargarInforme();
    }
  }, [filtros.page]);

  const handleVerTimeline = (kitId: string) => {
    const evento = eventos.find((e) => e.kitId === kitId);
    setKitSeleccionado({
      kitId,
      kitCode: evento?.kitCode,
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <FileBarChart className="w-8 h-8 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Informes de Trazabilidad</h2>
              </div>
              <p className="text-gray-600">
                Rastrea el ciclo de vida completo del instrumental dental desde su esterilización hasta su uso
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={cargarInforme}
                disabled={loading}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                <span>Actualizar</span>
              </button>
              <ExportReportButton filtros={filtros} disabled={loading || eventos.length === 0} />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">{error}</p>
              <button
                onClick={() => setError(null)}
                className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}

        {/* Filtros */}
        <TraceabilityReportFilter
          filtros={filtros}
          onFiltrosChange={setFiltros}
          onBuscar={handleBuscar}
          loading={loading}
        />

        {/* Tabla de Resultados */}
        <TraceabilityResultsTable
          eventos={eventos}
          loading={loading}
          onVerTimeline={handleVerTimeline}
          pagination={
            pagination.pages > 1
              ? {
                  page: pagination.page,
                  pages: pagination.pages,
                  total: pagination.total,
                  onPageChange: handlePageChange,
                }
              : undefined
          }
        />

        {/* Modal de Timeline */}
        {kitSeleccionado && (
          <TraceabilityTimelineView
            kitId={kitSeleccionado.kitId}
            kitCode={kitSeleccionado.kitCode}
            onCerrar={() => setKitSeleccionado(null)}
          />
        )}
      </div>
    </div>
  );
}



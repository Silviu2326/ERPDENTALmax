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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* Icono con contenedor */}
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <FileBarChart size={24} className="text-blue-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Informes de Trazabilidad
                  </h1>
                  <p className="text-gray-600">
                    Rastrea el ciclo de vida completo del instrumental dental desde su esterilización hasta su uso
                  </p>
                </div>
              </div>
              {/* Toolbar */}
              <div className="flex items-center gap-3">
                <button
                  onClick={cargarInforme}
                  disabled={loading}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                  <span>Actualizar</span>
                </button>
                <ExportReportButton filtros={filtros} disabled={loading || eventos.length === 0} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
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
        </div>
      </div>

      {/* Modal de Timeline */}
      {kitSeleccionado && (
        <TraceabilityTimelineView
          kitId={kitSeleccionado.kitId}
          kitCode={kitSeleccionado.kitCode}
          onCerrar={() => setKitSeleccionado(null)}
        />
      )}
    </div>
  );
}




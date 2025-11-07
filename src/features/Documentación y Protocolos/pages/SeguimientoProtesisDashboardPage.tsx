import { useState, useEffect } from 'react';
import { Plus, RefreshCw, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  obtenerProtesis,
  Protesis,
  FiltrosProtesis,
  PaginacionProtesis,
} from '../api/protesisApi';
import TablaSeguimientoProtesis from '../components/TablaSeguimientoProtesis';
import FiltrosProtesisPanel from '../components/FiltrosProtesisPanel';

interface SeguimientoProtesisDashboardPageProps {
  onNuevaOrden: () => void;
  onVerDetalle: (protesisId: string) => void;
  onEditar?: (protesisId: string) => void;
}

export default function SeguimientoProtesisDashboardPage({
  onNuevaOrden,
  onVerDetalle,
  onEditar,
}: SeguimientoProtesisDashboardPageProps) {
  const [protesis, setProtesis] = useState<Protesis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<FiltrosProtesis>({});
  const [paginacion, setPaginacion] = useState<PaginacionProtesis>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  const cargarProtesis = async () => {
    setLoading(true);
    setError(null);
    try {
      const respuesta = await obtenerProtesis(filtros, paginacion.page, paginacion.limit);
      setProtesis(respuesta.protesis);
      setPaginacion(respuesta.paginacion);
    } catch (err) {
      console.error('Error al cargar prótesis:', err);
      setError('Error al cargar las órdenes de prótesis. Por favor, inténtalo de nuevo.');
      // Datos mock para desarrollo
      setProtesis([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarProtesis();
  }, [filtros, paginacion.page]);

  const handleLimpiarFiltros = () => {
    setFiltros({});
    setPaginacion((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (nuevaPage: number) => {
    setPaginacion((prev) => ({ ...prev, page: nuevaPage }));
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
                <FileText size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Seguimiento de Prótesis
                </h1>
                <p className="text-gray-600">
                  Gestión y monitorización del ciclo de vida completo de las prótesis dentales
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
            <div className="flex items-center gap-2">
              <button
                onClick={cargarProtesis}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-slate-100 text-slate-700 hover:bg-slate-200"
              >
                <RefreshCw size={20} className="mr-2" />
                Actualizar
              </button>
              <button
                onClick={onNuevaOrden}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
              >
                <Plus size={20} className="mr-2" />
                Nueva Orden
              </button>
            </div>
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Filtros */}
          <FiltrosProtesisPanel
            filtros={filtros}
            onFiltrosChange={setFiltros}
            onLimpiarFiltros={handleLimpiarFiltros}
          />

          {/* Tabla de Prótesis */}
          <TablaSeguimientoProtesis
            protesis={protesis}
            onVerDetalle={onVerDetalle}
            onEditar={onEditar}
            loading={loading}
          />

          {/* Paginación */}
          {paginacion.totalPages > 1 && (
            <div className="bg-white shadow-sm rounded-lg p-4">
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => handlePageChange(paginacion.page - 1)}
                  disabled={paginacion.page === 1}
                  className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="px-4 py-2 text-sm text-gray-700">
                  Página {paginacion.page} de {paginacion.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(paginacion.page + 1)}
                  disabled={paginacion.page >= paginacion.totalPages}
                  className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



